# LiSN × KGS Global Commercial Fire — Messaging, Positioning & Demo Inputs

**Stage 1 · Messaging, Positioning & Demo Strategist · v1 · 28 Sep 2026 · YaaraLabs / LiSN — internal working input for Ranjith, not client material (sections 8 and 9 are client-ready copy)**

**Inputs:** `KGS_Stage0_Merged_Dossier_v1.md` (0.1, B, C.1, E, F, G, H, I, synthesis) · `UC_Q_quality_safety_cyber.md` (UC-Q-1…20; UC-Q-20 added in red-team review) · `UC_C_channel_commercial_carveout.md` (UC-C-1…21) · `Personas_Stakeholders_Risks.md` (P1–P15, R1–R30, §6 matrix) · `LiSN_current_PDF_text.txt`.

**Reading rules for this file**
- Wave-1 use cases are under independent review. Every use case cited here is re-stated conservatively; worked-example figures stay `[illustrative]`.
- Every invented number carries `[illustrative]`. Demo data is a **synthetic scenario**: nothing here is a finding about any KGS product, firmware, batch, partner or system.
- Source grades: `[4-src]`…`[single]` convergence from the dossier; `[src-unresolved]` = GPT-only, URL lost; `[aggregator]` = profile-grade; `[fact — supplied]` = from Kartik's profile.
- Panel shorthand: **ARCH** AI architect · **SVC** former VP Service & Tech Support · **PE** carve-out operating partner · **COMP** fire-code / product-compliance / product-cyber adviser. Disagreements are stated, not averaged.

---

## 1. Recommended use-case spine

### 1.1 Scoring (1–5; H.2 total shown as the convergence anchor)

| UC | What it is | H.2 need & score | Convergence | Kartik-fit | Feasibility in H.4 pilot ingest | Demo-ability | Role |
|---|---|---|---|---|---|---|---|
| **UC-Q-1** | Firmware-release fault cohort early warning | MH-1 · 28 | 5 (rank 1 in all four engines) | 5 ("quality and reliability", M0.1-5; Six Sigma) | 3 (firmware denominator for disconnected sites is the hard part) | 5 (per-version rate against a release marker shows the join at a glance) | **Hero** |
| **UC-Q-2** | Early-life failure in a serial/date-code window under a green aggregate | MH-1 / MH-13 · 28 | 5 (D.2 aggregate-rate blindness `[4-src]`) | 5 (special cause vs control limit — his Black Belt language) | 3 (needs serial on RMAs; MES optional at first) | 5 (heat strip beside a green p-chart) | **Supporting 1** (pillar 1) |
| **UC-C-1** | Strategic Partner drift radar | MH-4 · 24 | 5 | 5 (regained ~$100m key accounts, M0.1-11; visits dealers, M0.1-7) | 4 (orders + LMS + cases) | 5 (friction vs sell-in timeline) | **Supporting 2** (pillar 2) |
| **UC-C-3** | Carve-out separation friction radar | MH-5 · 23 | 5 | 4 (carve-out management team; year-2 timing) | 3 (needs cutover calendar and extracts that may sit under TSA — R1) | 5 (cutover line with a control region) | **Supporting 3** (pillar 3) |
| UC-Q-7 + UC-Q-8 | Safety-language watch + cyber-signal fusion (CRA Art. 14) | MH-2 · 26 / MH-3 · 24 | 5 | 4 (de-risking, not headline) | 2 (all-channel; Legal and PSIRT must agree to receive) | 4 (governed tile: counts, clock state, owner — contents restricted) | **Governed capability**, shown as one tile |
| UC-C-6 | Backorder consequence vs promise-date slippage | MH-8 · 21 | 5 | 4 ("94% vs revised, 71% vs original" is Six Sigma-grade) | 4 | 4 | Demo tile under pillar 2; not in the brief |
| UC-Q-17 | RMA/case evidence-completeness radar | enabler | 3 | 3 | 5 | 3 | Demo tile — makes the "data not ready" answer honest |

**Components folded into the hero, not separate tiles:** UC-Q-14 (new-phrasing chip), UC-Q-15 (workaround chip — "rolled back to prior version"), UC-Q-10 (product-leaning vs practice-leaning attribution strip).

### 1.2 Why this spine
- **Convergence:** it is the dossier's merge recommendation (H.2): MH-1 hero, MH-4 and MH-5 supporting, MH-2/MH-3 as a governed watch, MH-7 held for v2 `[4-src basis]`.
- **Kartik-fit:** one pillar per hat he wears — quality P&L (UC-Q-1/2), channel (UC-C-1), carve-out team (UC-C-3).
- **Feasibility:** every spine item runs on the H.4 ingest list (tech-support cases/calls/email, RMA, product/firmware/serial master, orders, partner/site master). Nothing needs telemetry, MES, PLM or Mandarin in Discovery.
- **Demo-ability:** each has a single visual that shows why the join matters (lineage river, heat strip, dual-axis timeline, cutover line).

### 1.3 Held for v2 (and why)

| UC | Why held |
|---|---|
| UC-C-9 EST3→EST4 migration intent; UC-C-10 UL 268 7th replacement demand | Growth story (dossier Demo 2); needs site-level install base; best as the "grow the installed base" follow-up once v1 earns attention |
| UC-Q-5 voice-vs-telemetry; UC-C-17 ConnectedSafety+ adoption | Telemetry is "add later" in H.4; entity matching CS+ ↔ CRM unproven; connected-owner territorial risk. **Use the message now** ("the human layer beside ConnectedSafety+"), build the tile in v2 |
| UC-Q-12 / UC-C-19 China and MEA verticals | Kartik's own verticals (M0.1-1 `[4-src]`) but needs Mandarin corpus, in-country deployment, PIPL advice. Ideal v2 "his screen" tile |
| UC-Q-3 NFF loop; UC-C-12 cost-to-serve ledger; UC-C-4 TSA-exit gate | Strong CFO / PE / board stories, weak first-screen visual |
| UC-Q-6 nuisance cohorts; UC-Q-11 listed-configuration drift; UC-C-7 substitution feasibility; UC-C-14 spec/AHJ friction | Need compatibility matrix, settings or opportunity data; slower revenue link |
| UC-Q-9 advisory reach | Needs PSIRT's advisory register; pair with UC-Q-8 once PSIRT is engaged |
| UC-Q-4 ECO/PCN impact | T3: needs PLM/MES access during separation |
| UC-C-20 India grey market; UC-C-15 pricing friction | Competition-law sensitivity; Legal review first |
| UC-Q-18 residential | Not Kartik's P&L; keep out of the pitch |
| UC-Q-19 public forum corroboration | Corroboration only (K-8); off v1 to avoid any "external signal" reading |
| UC-Q-20 monitoring-centre interoperability / test-notice watch (added in red-team review) | Long-tail; small counts; its test-notice part needs ITM partner work orders (T3) |

### 1.4 Panel disagreements on the spine (not averaged)
- **PE:** would lead with cash — UC-C-3 (DSO), UC-C-6 (backlog), UC-Q-3 (NFF credits). Accepted partly: UC-C-3 is on the spine and UC-C-6 is a tile; hero stays quality because it is the only #1 in all four engines.
- **COMP:** wants UC-Q-7/8 live across all channels from Discovery day one. Accepted: governed watch runs from day one, but is shown as a capability, not the headline (G panel consensus).
- **SVC:** the native buyer is VP Service & Tech Support, not Engineering; the hero routes away from them. Mitigation: hero card shows tech-support cost-to-serve as its secondary P&L line, and the VP Service persona line leads with "Tier 3 relief".
- **ARCH:** if fewer than half of trouble cases carry firmware, UC-Q-1 degrades to UC-Q-14 (new phrasing, unsized). The demo must not over-claim; the evidence-readiness tile says so openly.

---

## 2. Positioning

### 2.1 Category name
**Installed-base early warning** — descriptor: *"the early-warning layer that joins what installers, partners and distributors say to firmware, batch, RMA and order data."*
Rejected: "CX analytics" (contact-centre flavour), "VoC platform" (surveys), "conversation analytics" (agent QA), "AI copilot" (implies autonomous action).

### 2.2 Positioning statement
**For** the President of Global Commercial Fire and the executives who own quality, service, channel and separation,
**who** today learn about field, partner and carve-out problems when they reach warranty cost, a lost bid or the month-end review,
**LiSN is** an installed-base early-warning layer
**that** reads every tech-support, order, RMA and partner interaction in the channels in scope, measures each platform, firmware, batch, partner and region against its own baseline, and routes the few signals that matter — with the evidence — to the executive who owns the decision.
**Unlike** CRM reports, VoC surveys or a general-purpose LLM, LiSN joins weak human signals to your firmware, serial, RMA and order records, runs read-only in your own cloud, and never acts without human approval.

### 2.3 One-line promise (pick one)
1. **"Hear it at the third call, not the monthly review."** (recommended — anchors G's "count of three", C.1)
2. "The fifth installer, heard the same day — with the firmware, batch and partners attached."
3. "Special-cause detection for every installer conversation."

### 2.4 Why now

| Trigger | Fact | Grade | How to say it |
|---|---|---|---|
| Year-2 PE carve-out | KGS formed 2 Dec 2024 (Lone Star, $3.0bn EV); standalone systems being built; "a correlation once obtainable through inherited tooling may temporarily require five manual extracts" | M0.3-1 `[4-src]`; E.2 `[4-src]` | "While systems of record are separated, a read-only overlay keeps the signal continuous." Never "your data is fragmented" |
| EST3→EST4 migration wave and UL 268 7th replacement cycle | EST3 new orders halted 31 Dec 2023; EST3→EST4 migration course Aug 2026; June 2026 EST4 classes full; UL 268 7th effective 30 Jun 2024 | A.2 `[3-src]`; 0.5 `[single C]`; MD-11 `[single C]`; G `[3-src]` | "Migration and new-edition replacements bring new firmware, new devices and new questions at the same time — exactly when a release-level signal matters" |
| EU CRA Art. 14 | Reporting live 11 Sep 2026: early warning ≤24h, notification ≤72h, covers products already on market | G `[4-src]`, verified against the European Commission | "Awareness can start in a support call, not only in the PSIRT inbox. LiSN timestamps and routes; PSIRT decides." |

Optional fourth (use only if asked about competitors): JCI OpenBlue added an agentic assistant in Aug 2026 `[single G]` `[src-unresolved]` — re-source before saying it; boards will ask what KGS's answer is. Position LiSN as human-gated by design, which suits life safety.

### 2.5 What LiSN is NOT
- **Not a CRM or system of record** — it reads Salesforce, ERP and RMA data; it owns none of it and replaces nothing (E.2 design consequence `[3-src]`).
- **Not a VoC survey tool** — no surveys, no NPS/CSAT scorecard.
- **Not telemetry or remote monitoring** — ConnectedSafety+ stays the machine layer; LiSN is the human layer beside it (F3 `[4-src]`).
- **Not autonomous root cause** — correlated evidence and candidate causes; engineering decides (F4 `[3-src]`).
- **Not a reportability engine** — it routes to Quality, PSIRT and Legal; it never determines what is reportable.
- **Not agent QA or employee monitoring.**
- **Not a chatbot answering compatibility or listing questions** — "an incorrect confident answer is worse than none" (D.3 `[single G]`).
- **Not customer-facing** — it drafts; people approve and send.

---

## 3. Message house

**Umbrella:** *Hear the field at the third call, not the monthly review — every installer, partner and distributor interaction joined to firmware, batch, RMA and orders, routed to the owner, decided by people.*

| | Pillar 1 · Protect margin and reliability | Pillar 2 · Hold the channel | Pillar 3 · Run the separation cleanly | Pillar 4 · Evidence on demand, decisions by people |
|---|---|---|---|---|
| **Headline** | Special-cause detection for the installed base | See partner drift before the lost bid | Signal continuity while systems change | Governed early warning: timestamped, traceable, human-approved |
| **Supporting message** | Each platform, firmware release and date-code window is measured against its own baseline and installed-base denominator, so a cohort going wrong shows up while the aggregate is still green — and tech support stops being where field problems are averaged away | Friction, recontacts, backorder consequence and competitor language are measured against each partner's own baseline and joined to sell-in, backlog and certification, so the executive intervention happens while the account is still recoverable | After each entity, portal, ERP or EDI cutover, LiSN compares affected distributors with a not-yet-cut-over control region, so separation defects are found in days and routed to the CIO and CFO with the invoices and verbatims attached | Every signal links to its source interactions with original timestamps; safety and cyber language is watched across every channel from day one and routed to Quality, PSIRT and Legal — LiSN drafts, people decide |
| **Proof points (ID · grade)** | MH-1 ranked #1 by all four engines `[4-src]` · Kartik: "quality and reliability of our products are as critical as… new innovative capabilities" M0.1-5 `[single C, sourced]` · aggregate-rate blindness D.2 `[4-src]` · "the consequential signal may have a count of three" C.1 `[single G — panel line, not a KGS fact]` · no public peer case study of installer voice joined to firmware/batch F2 `[3-src]` | MH-4 `[4-src]` · Kartik regained ~$100m key accounts M0.1-11 `[fact — supplied]` · personal dealer visits M0.1-7 `[single C]` · ERP knows dates, not consequence MH-8 `[4-src]` | MH-5 `[4-src]` · "five manual extracts" E.2 `[4-src]` · no "carve-out" reason code exists MH-5 `[4-src]` · read-only overlay preserving continuity H.3 `[single G]` | CRA Art. 14 live 11 Sep 2026 `[4-src]` · CPSC §15 generally within 24h `[4-src]` · regulators ask when information was possessed, not coded (G) `[4-src]` · KGS PSIRT 48h acknowledgement 0.6 `[3-src]` · must-not-do list F4 `[3-src]` |
| **UC IDs** | UC-Q-1, Q-2 (+ Q-14, Q-15, Q-10, Q-17); v2: Q-3, Q-6 | UC-C-1, C-6 (+ C-2, C-13); v2: C-9 | UC-C-3 (+ C-5, C-8); v2: C-4 | UC-Q-7, Q-8 (+ Q-9, C-5) |
| **Persona served** | P1 President, P2 VP Engineering, P3 Quality, P4 VP Service (secondary) | P1, P5 Regional GM / VP Sales, P6 COO | P7 CIO / separation lead, P8 CFO, P6 COO, P15 Lone Star | P9 PSIRT / CLO, P14 CISO, P3 Quality |

**Foundation (under all pillars):** read-only overlay · your cloud, your approved models, data never leaves · complements Salesforce, ERP and ConnectedSafety+ · join tags and a P&L metric on every signal · aids resolution, never acts alone.

**v2 pillar held back:** *Grow the installed base* — EST3→EST4 migration intent, UL 268 7th replacement demand, ConnectedSafety+ adoption (UC-C-9, C-10, C-17, Q-5).

---

## 4. Kartik-specific kit

### 4.1 Opening lines (built on the dossier's merged sentence; none asserts a KGS weakness)
1. **Question form (safest, G-based):** "When the fifth installer in a different region describes the same fault, how soon does KGS know that all five share one firmware, batch or set of partners — the same day, or at the monthly review?"
2. **ConnectedSafety+ contrast (flatters his digital agenda, P-based):** "ConnectedSafety+ shows you what your panels are doing. LiSN is built to show you, the same day, when installers in different regions start describing the same fault — and whether those cases share one firmware, batch or set of partners."
3. **His own words (Six Sigma, C-based):** "You've said quality and reliability matter as much as new capability. LiSN applies the special-cause test to every tech-support, RMA and partner conversation — each product and partner against its own baseline — so the few real signals reach the owner early, with the evidence."

Recommended: **2** in the covering note, **1** as the first line of the brief.

### 4.2 30-second verbal version
"Your installers and partners describe field problems long before they show up in warranty cost or a lost account — in tech-support calls, RMA notes and distributor emails. LiSN reads all of those, measures each platform, firmware, batch and partner against its own baseline, joins the pattern to your RMA and order data, and sends the three or four signals that matter to the executive who owns them, with the calls attached. It runs read-only in your cloud and people approve every action. I'd like to prove it the hard way: you pick a past issue you already understand, we don't see it, and your team scores whether LiSN would have found it earlier."

### 4.3 The ask
1. **Name one owner** — VP Service & Tech Support or the Quality lead — and let evaluation sit with them, not with Kartik.
2. **Pick one portfolio and region** — recommended NA Edwards (H.4 `[2-src]`).
3. **A 90-day offline Discovery:** 12–24 months of that region's tech-support cases/calls/email, RMA and order extracts, plus product/firmware/serial and partner/site masters; deployed in a KGS tenant; zero production integration.
4. **Blind retrospective test:** KGS chooses a past period containing an issue it already understands and withholds it; LiSN runs blind; KGS evaluators score against criteria they write before any data is shared (time-to-recognition, false-positive rate, whether a signal would have changed a decision — H.4 `[single G]`).
5. **No commercial proposal** until the owner judges the readout worth one.

Small asks to Kartik himself (from I.4): who owns tech support for Commercial Fire; which systems hold cases, RMAs and orders and which are still on TSAs; whether cases capture model/firmware/serial.

### 4.4 Handling the relationship in the covering note
- **Disclose first, in writing, one line:** name the relationship and say you want the work judged on merit by the people who would own it.
- **Ask for a pointer, not a decision:** "If it's relevant, the most useful thing would be the name of whoever owns tech support or field quality — I'll take it from there through your normal vendor process."
- **Pre-empt the optics:** offer that Kartik sponsors but does not score, set criteria or approve spend (§4.3 protocol in the persona file).
- **Make forwarding easy:** the brief must stand alone — no reference to the relationship, no "as we discussed", no private figures he shared.
- **Keep family and project separate:** after the handoff, all working communication goes via the named owner.
- **Offer an easy exit:** "If the timing is wrong with the separation, say so and I'll come back later."
- Tone: warm, brief, professional. Two short paragraphs plus the attachment. (Draft the note itself once Ranjith confirms tone and whether it goes by email or WhatsApp.)

### 4.5 What not to say
- "Your data is fragmented" / "you can't see this today" / "your organisation is not built to hear it".
- Anything implying a current defect, recall or cyber exposure in any KGS product; no Kidde residential recalls in material that may be forwarded inside KGS.
- "Carrier" for the current business (say KGS); "Gloria" or suppression products until the perimeter is confirmed.
- "300K daily", "banking", "cards", "conduct", "disputes", "contact centre" as headline, "sentiment", "CSAT", "churn prediction", "customer journey".
- "Resolve", "root cause", "predicts failures", "decides what's reportable", "agentic", "compliance automation".
- Savings figures or ROI promises; KGS revenue figures he shared privately.
- LiSN customer names or references — HDFC Bank, Visa and Société Générale are AI Fluency references, not LiSN deployments; retail pilots are not referenceable. `[YaaraLabs context, not in dossier — Ranjith to confirm wording]`
- "SOC 2 doesn't apply" as a flat statement.
- Named KGS executives from aggregator-grade sources.

---

## 5. Persona variants

| Persona (file ID) | One-line message | Forwardable line Kartik could use |
|---|---|---|
| VP Service & Tech Support (P4) | "Every contact, not a sample — repeat-contact clusters traced to the upstream cause, and field problems sent to engineering with the evidence, so Tier 3 stops carrying them." | "Worth 20 minutes: a way to see repeat-contact clusters and emerging field issues across all our tech-support traffic, joined to RMA and orders. It's an offline test on our data and your team would set the criteria." |
| VP Engineering (P2) | "New fault phrasing across unrelated partners, joined to platform, firmware and RMA — cohorts, counter-evidence and candidate causes; you decide root cause." | "They say installer calls can show a firmware-release problem before the RMA trend moves. I'd like you to test that blind on a past issue we already understand." |
| Quality / Field Quality lead (P3) | "Serial and date-code concentration against each family's own baseline, with the calls before the RMA and a first-mention timestamp." | "This looks for special-cause clusters in RMA and call narratives while the aggregate return rate is still green — worth a look from your side." |
| Regional GM / VP Sales NA (P5) | "Partner drift flagged early — friction, backorder consequence and competitor language against each partner's own baseline, joined to sell-in and certification." | "Early warning on partners going quiet or unhappy, from their own calls and emails, before it shows up in orders. Curious whether it would have caught any of the accounts we had to win back." |
| COO / Supply chain (P6) | "Which backlog is about to cancel, and why — consequence language by SKU and partner before OTIF moves; OTD against the original promise, not only the revised one." | "They join order-desk language to promise-date changes. Might be useful on backlog risk." |
| CIO / separation lead (P7) | "A read-only overlay that asks for one-off extracts, deploys in our tenant, and shows the business effect of each cutover." | "No integration ask — offline extracts only, in our cloud. The carve-out angle is interesting: it shows what distributors experience after each cutover. Can you tell me if an extract is feasible?" |
| CFO / Global CFO CF (P8) | "Every signal carries its P&L line — warranty, cost-to-serve, DSO — and is measured by decisions changed, not claimed savings." | "Not asking for budget. If the blind test works, the value case would be built on our warranty, cost-to-serve and DSO lines." |
| PSIRT / CLO (P9) | "Safety and cyber language watched across every channel, timestamped and routed to you; LiSN makes no reportability determination and runs under your retention and privilege rules." | "Before this goes anywhere I want Legal and PSIRT comfortable with the design — it routes, it never decides." |
| CISO / InfoSec (P14) | "Runs inside our perimeter, our models, no egress, role-based access, full audit log." | "Small vendor, no SOC 2 — but it deploys inside our environment. Please review on that basis." |
| Product Management (P10) | "Gaps-and-needs language by platform and installer — what the field is asking for after each launch and migration." | "Uses your 'gaps and needs' lens on installer conversations." |
| Connected Services owner (P13) | "The human layer beside ConnectedSafety+ — what people say is wrong, next to what the panel did." | "This complements ConnectedSafety+, not competes — it covers what installers say about all panels, connected or not." |
| Lone Star operating partner (P15) | "Bounded, offline, in our cloud; measured by decisions changed and exposure touched; leaves a durable standalone data asset." | "Low-risk test; if it works it's a standalone data asset, not another dashboard." |

---

## 6. Objection handling

| # | Objection | Response |
|---|---|---|
| 1 | Why not Salesforce Service Cloud / Einstein / Data Cloud? | Keep it — it is a source. As deployed for service, Einstein works mainly on CRM fields and agent-chosen categories (F2 `[single C]`); LiSN adds per-entity baselines, joins to firmware, serial, RMA and orders, and evidence lineage. Do not claim Data Cloud cannot join external data — it can ingest other sources; the question is whether the baselines, denominators and evidence packet are built. If the Data Cloud programme already makes these joins, Discovery will show it and we will say so. |
| 2 | Medallia or Qualtrics? | Survey-led by design: as typically deployed they miss technical calls, dealer emails, RMA narratives and non-respondents, and are not built around seasonal entity baselines (F2 `[4-src]` — a category assessment, not a claim about every configuration). If you run surveys, LiSN sits alongside. |
| 3 | We can do this with our own LLM / the Hyderabad hub can build it | An LLM explains the text it is handed. The hard parts are entity matching, baselines, installed-base denominators, source independence, timestamps and evidence provenance (F4 `[single G]`; F2 `[4-src]`). You can build it; the question is time and focus during separation. The blind test gives you a benchmark either way. |
| 4 | JCI / Honeywell / Siemens have connected platforms | They, like ConnectedSafety+, interpret telemetry. No public evidence found of any peer analysing installer voice joined to firmware or batch (F3 `[4-src]`; F2 `[3-src]`). LiSN is the human layer; human-gated by design suits life safety. |
| 5 | ConnectedSafety+ already does this | ConnectedSafety+ shows what enrolled panels did. LiSN shows what installers and partners say about all panels — connected or not — joined to firmware and RMA (F1, F3). A later join can make ConnectedSafety+ smarter (voice-vs-telemetry, v2). |
| 6 | We're mid-separation; no bandwidth | The ask is one-off extracts and a KGS tenant — no production integration, nothing on the separation critical path. And a read-only overlay keeps the signal continuous while systems change (E.2, H.3). |
| 7 | Our data isn't ready / cases don't carry firmware | Possibly — that is the first thing Discovery measures: field fill-rate by channel, and what is recoverable from text. Where fields are sparse, cohorts drop to family level and the confidence marker says so (UC-Q-17; R2). |
| 8 | InfoSec: no SOC 2 or ISO 27001 | SOC 2 mainly attests to controls over a vendor-operated service; LiSN runs inside KGS's tenant under KGS controls, with no data egress. We recognise InfoSec may still want vendor-level assurance (secure development, remote-support access, model supply chain) and will answer on those points. We will complete your questionnaire and provide architecture and data-flow documentation `[confirm what else YaaraLabs can supply — pen-test, SBOM]`. If your policy requires SOC 2 regardless, we would rather know now. |
| 9 | A small Indian vendor for a US PE-owned company? | The test is bounded, offline, in your cloud and scored by KGS — the risk is capped by design. There is a walk-away if it doesn't beat existing reporting. KGS already runs firmware and quality engineering from Hyderabad (0.3 `[4-src]`). A US SI contracting route is available if Procurement prefers `[confirm before offering]`. |
| 10 | Our volumes are small — why a platform? | Small volumes are the point: in life safety the consequential signal may have a count of three (C.1). Detection comes from baselines and joins, not scale. LiSN is sized to your volume — cost-efficient at scale means right-sized. |
| 11 | Legal won't let an AI flag safety issues | LiSN does not decide anything. The information already sits in your systems; LiSN makes it findable and routes it to Quality and Legal under counsel's retention, privilege and review rules. No reportability language in the product; restricted access to flagged evidence (F4; P9). |
| 12 | Privacy and works councils in the EU | Start in NA English. EU only after a DPIA and any works-council consultation; pseudonymised identifiers; no agent-performance analytics; EU data in an EU tenant (§3.0 `[not in dossier — counsel to confirm]`). |
| 13 | Relationship / conflict of interest | Disclosed in writing up front. Kartik sponsors, does not evaluate; the owner writes the criteria before data; the test is blind; full InfoSec, Legal and Procurement process; no fast-tracking (§4.3). |
| 14 | Cost / ROI? | No commercial proposal until your owner judges the Discovery. We measure decisions changed, time-to-recognition and exposure touched — not claimed savings. For scale only, a panel estimate puts warranty and field cost at 1–2% of revenue `[estimate — C, not a savings claim]`; any value frame would be built on your own figures. (Do not state the $10–20m figure: it rests on the Commercial Fire revenue Kartik supplied privately — see 4.5.) |
| 15 | We'll drown in false alarms | Recall broad at ingestion, rank severe at the executive boundary (F2 consensus). Every signal shows confidence, source independence and counter-evidence; single-source commercial anomalies go to a watchlist; false-positive rate is a Discovery metric. |
| 16 | We already run RMA Paretos and a monthly quality review | A Pareto ranks volume; LiSN ranks change against each family's own baseline and brings in the calls before the RMA. Discovery compares against your existing reporting on time-to-recognition — if it isn't earlier, we stop. |
| 17 | Partners will feel watched / competition law | Only interactions partners send to KGS; no cross-partner disclosure; no resale-price analytics; Legal reviews the channel taxonomy (§3.0 `[not in dossier — counsel to confirm]`). |
| 18 | Agents will think they're being monitored | Not an agent-QA tool; agent identifiers pseudonymised; purpose limited to product, partner and process signals. |
| 19 | What if it misses the issue we hid? | Then the readout says so, as-is. That is the walk-away condition. |

---

## 7. Claims discipline

### 7.1 Retire from the current PDF

| Current claim (page) | Why | Replace with |
|---|---|---|
| "300K Daily Interactions, Scored and ranked in 30 min" (p6) | ~150× KGS Commercial Fire's likely daily volume (C.1; R16) | "Every interaction in the channels in scope, scored as it lands" |
| "Anomalies surfaced in under 30 minutes" (p5, p7) | Depends on source refresh; KGS Discovery is offline | "Surfaced within your data-refresh cycle — same day, not month-end" `[confirm engine latency before any number]` |
| Head of Contact Center / Head of Cards / Conduct & Compliance (p8); Head of Customer "predict churn" (p3) | Banking/retail personas | KGS personas (section 9, p3 and p8) |
| "Amazon Connect / IVR", "Pega servicing workflows" (p7) | Banking stack | Salesforce, SAP/Oracle/JDE ERP, ServiceNow, RMA/warranty system, LMS; ConnectedSafety+ later (0.6 `[3-src]`) |
| "conduct definitions" (p7); "Disputes" (p4); "Examiner-ready" (p6) | Banking vocabulary | "your product taxonomy"; "RMA narratives"; "audit-ready" |
| "Churn ↑ · Cost-to-serve ↑ · Trust ↓" (p2) | Retail/banking outcomes | "Warranty cost ↑ · Cost-to-serve ↑ · Partner share ↓" |
| "Your organization is not built to hear it" (p2); "The customer reality your organization has never seen this clearly" (p5) | Asserts a KGS weakness (brief rule 7); US spelling | Question form; "organisation" |
| "What's breaking in production now" (p3) | Reads as a manufacturing-defect claim at a manufacturer | "What changed in the field this week" |
| Any "resolve" | House rule | "aid resolution" |
| "Engineered to clear IT and compliance review on day one" (p7) | Over-claim without SOC 2 / ISO | "Designed for your IT, security and legal review" |
| "Years of baselines" (p6) | Discovery uses 12–24 months | "Baselines from your own history" |
| "App Store · Play Store · Trustpilot · Reddit · X" (p4) | Consumer channels; public corpus thin (K-8) | "Installer forums and app reviews — corroboration only" |
| "Quarterly model refresh" (p7) | Unverified operating commitment | Remove unless YaaraLabs confirms |
| "LisN" in header and p8 | House style | "LiSN" |

### 7.2 Claims we can make — with evidence

| Claim | Basis |
|---|---|
| Reads calls, cases, email, RMA narratives, portal tickets, field notes; unifies them into a signal map across product, service and time | LiSN capability (brief) |
| Each entity measured against its own seasonal baseline; one problem phrased many ways counted as one signal | LiSN capability |
| Every signal traceable to its source interactions; audit log; role-based access | LiSN capability |
| Consumes Salesforce, ERP, RMA and product data read-only; owns none | LiSN capability; E.2 design consequence `[3-src]` |
| Deploys in the client's cloud, on-prem or hybrid; client-approved models; data never leaves | LiSN capability |
| Never fires customer-facing action; drafts for human approval | LiSN capability |
| EU CRA Art. 14 reporting live since 11 Sep 2026 (24h / 72h) | G `[4-src]`, EC-verified |
| CPSC §15 reporting generally within 24h, without waiting for injury | G `[4-src]` |
| UL 268 7th effective 30 Jun 2024 | G `[3-src]` |
| EST3 new orders halted 31 Dec 2023 | 0.4 `[single C]` (A.2's `[3-src]` covers the migration wave, not the date) — re-check the Edwards source before printing |
| Kartik's public quotes ("gaps and needs"; "quality and reliability") | M0.1-5 `[single C, sourced]` |
| Peers' connected offers interpret telemetry; no public evidence of installer voice joined to firmware/batch | F3 `[4-src]`; F2 `[3-src]` — say "no public evidence found", never "nobody does" |

### 7.3 Claims we must not make
- KGS data is fragmented / KGS cannot make this join today (E framing rule `[3-src]`).
- Any current or past KGS Commercial Fire defect; any link between demo scenarios and real products.
- LiSN determines reportability, root cause, containment or recall scope.
- Savings or ROI figures (value arithmetic is sensitivity only — B).
- LiSN has fire, industrial or building-technology references; LiSN is live at any named client.
- SOC 2 / ISO 27001 held; "certifications don't apply" as a flat statement.
- 100% of all KGS interactions (only channels in scope); "real-time" unqualified.
- External-signal intelligence (weather, strikes, macro, supply-market events).
- Unverified facts: >1.5m buildings / 18 facilities `[src-unresolved]`; Hyderabad "independent digital organisation" ad `[src-unresolved]`; Gloria sale `[src-unresolved]`; GP01 UL 864 `[src-unresolved]`; UL 864 edition (K-7).
- Named KGS executives from aggregator-grade sources.

### 7.4 Vocabulary

| Use | Avoid |
|---|---|
| installers, Strategic Partners / ESDs, distributors, dealers, integrators | customers (as the only word), consumers |
| installed base, platform, firmware, release, date code, batch, serial range | SKU-only framing, "products" in the abstract |
| trouble conditions, loop mapping, commissioning, ITM, AHJ, listings | tickets, "issues" |
| RMA, NFF, warranty cost, field cost, cost-to-serve, backlog, OTIF, DSO | CSAT, NPS, churn, "customer journey" |
| cohort, own baseline, special cause, denominator, blast radius | sentiment, word cloud, trending topics |
| candidate causes, counter-evidence, confidence, source independence | root cause, "AI finds the defect", predicts failures |
| first credible mention, awareness timestamp, routed for human decision | auto-report, compliance automation, reportability |
| read-only overlay, signal continuity, your cloud | replace, integrate with everything, customer 360, platform consolidation |
| aids resolution, drafts, approved by | resolves, auto-acts, agentic |
| KGS, Global Commercial Fire | Carrier (except historically), banking analogies, "cards", "conduct" |
| cost-efficient at scale | cheap |

---

## 8. One-page brief — draft copy (≈380 words; ready to lay out)

**LiSN for Global Commercial Fire**
*Installed-base early warning from every installer, partner and order interaction — joined to firmware, batch, RMA and order data.*

**The question**
When the fifth installer in a different region describes the same fault, how soon does it reach the owner as one pattern — with the firmware, batch, partners and panels it touches? The first sign of a field, channel or separation problem is usually a sentence in a tech-support call, an RMA note or a distributor email. Aggregates can stay green while one release, date-code window or partner moves. The consequential signal may have a count of three.

**What LiSN does**
LiSN reads every interaction in the channels in scope — calls, cases, email, RMA narratives, portal tickets. It measures each platform, firmware, batch, partner and region against its own baseline, merges one problem phrased many ways into one signal, and routes the few that matter to the executive who owns the decision, with the evidence attached.

**Three example signals** `[illustrative]`
- *Quality:* panels on a new firmware release report "devices not found after upgrade" at 3.1× the rate of panels still on the prior version; 9 partners, 3 regions → VP Engineering · warranty cost.
- *Channel:* a strategic partner's friction runs at 3.1× its own baseline for six weeks while sell-in falls 22% → Regional GM · partner revenue.
- *Separation:* invoice and remit-to contacts rise 2.7× after an entity cutover; 14 distributors, £1.1m in dispute → CIO and CFO · DSO.

**How it works**
- Read-only overlay: consumes your Salesforce, ERP, RMA and product data; replaces nothing.
- Your cloud, your approved models; data never leaves.
- LiSN drafts; your owners approve every action. No root-cause or reportability determinations.
- Every signal shows severity, confidence, its P&L metric and source interactions.
- Complements ConnectedSafety+: telemetry shows what panels did; conversations show what people say is wrong.

**Proposed first step — a 90-day Discovery**
One portfolio and region (for example NA Edwards); 12–24 months of tech-support, RMA and order extracts; offline, no production integration. KGS withholds a past issue it already understands; LiSN runs blind; KGS evaluators score against criteria they set first. Commercial terms only if the owner judges it worthwhile.

**About**
LiSN is built by YaaraLabs, Chennai — AI practitioners who have run data and AI at enterprise scale. Commercial fire would be LiSN's first life-safety application, which is why we propose a blind test scored by KGS.

hello@yaaralabs.ai · www.yaaralabs.ai

*Layout note:* one A4/Letter page; title band, two columns (left: question + what LiSN does + how it works; right: three signal cards styled as mini cards with severity chip and P&L tag, then first step). "Illustrative" label on the signal cards. No logos of other clients. *Reviewer checks before sending:* confirm the contact address and the "run data and AI at enterprise scale" wording (YaaraLabs claims, not in the dossier); word count is ~399, so any addition needs a matching cut.

---

## 9. PDF re-cut — page-by-page copy

Header on every page: section label left · "LiSN · YAARALABS.AI" right · footer "Confidential n/9". British spelling throughout.

### p1 · WHAT WE PROVIDE
- **Headline:** Installed-base early warning for Commercial Fire.
- **Subhead:** What your installers, partners and distributors are already telling you — joined to firmware, batch, RMA and orders, and routed to the owner of the decision.
- **Three columns:**
  - COVERAGE — *Every interaction in scope, not a sample.* Calls, cases, email, RMA narratives and portal tickets, continuously.
  - CAPABILITY — *Each product and partner against its own baseline.* Platform, firmware, date code, partner and region — special cause, not volume.
  - FOCUS — *The few signals that matter, to the executive who owns them.* With the evidence attached and a human decision at every step.
- **Footer words:** Covered · Joined · Routed

### p2 · THE COST OF NOT LISTENING
- **Headline:** The first sign is usually a sentence, not a statistic.
- **Subhead:** A tech-support call, an RMA note, a distributor email. How quickly does it become one pattern, in front of the right owner?
- **Four columns:**
  - SEPARATE QUEUES — In most OEMs, tech support, order desk and RMA each see their part, by design.
  - CODED LATE — Reason codes typically summarise; they seldom carry firmware, batch or partner.
  - GREEN AGGREGATES — A date-code window or release can go wrong while the overall return rate stays within limits.
  - VOLUME ≠ CONSEQUENCE — The signal that matters may have a count of three.
- **THE COST:** Problems reach the P&L before they reach the owner. · Warranty and field cost ↑ · Cost-to-serve ↑ · Partner share ↓
- *(No recall references on this page — see 4.5.)*

### p3 · WHAT BECOMES POSSIBLE
- **Headline:** Imagine if every executive who matters saw the signal they own — this week, not at month-end.
- **Subhead:** The engine reads every interaction in scope, distils signal from noise, and shows each executive only what matters to their decision.
- **Lines:**
  - Imagine if your **VP Engineering** saw a firmware release drifting from the prior version at the third independent partner — with the panels, cases and RMAs attached.
  - Imagine if your **Quality lead** saw a date-code window going wrong while the aggregate return rate was still green.
  - Imagine if your **VP Service & Tech Support** saw which repeat contacts come from an upstream cause — and could send it to the owner with evidence.
  - Imagine if your **Regional GMs** saw a strategic partner drifting before it showed in orders.
  - Imagine if your **CIO** saw what distributors experienced after each cutover — while the programme dashboard said green.

### p4 · HOW WE SOLVE IT
- **Headline:** Installers heard — fixes routed.
- **SOURCES**
  - INTERNAL CHANNELS: Tech-support calls · Cases · Order-desk and order-change email · RMA narratives · Partner portal tickets · After-hours line · Field notes · Training enquiries
  - OPERATIONAL DATA (consumed, not owned): Product and firmware master · Serial and date code · RMA dispositions · Orders and promise dates · Partner and site master · Certifications
  - EXTERNAL (corroboration only): Installer forums · App reviews
- **THE ENGINE**
  - 01 LISTEN — Every channel in scope, unified continuously.
  - 02 JOIN & MAP — Living signal map: brand → platform → device family → firmware → region → partner, over time.
  - 03 SURFACE — Signals ranked by severity, population and consequence; routed to the executive who owns the decision.
- **THE OUTPUT:** Symptom · Cohort · Consequence → Qualified, Ranked, Routed. *The handful that matter — with the evidence — to the executive who owns the decision.*

### p5 · HOW IT BEGINS
- **Headline:** Discovery: your Commercial Fire signal benchmark. Always on: the engine.
- **Subhead:** Every engagement begins with a bounded, offline Discovery on one portfolio and region, scored by your team. The engine then deploys in your environment — your data never leaves.
- **Discovery — your signal benchmark**
  - One portfolio and region; 12–24 months of tech-support, RMA and order extracts
  - Offline; zero production integration
  - Blind test: you choose a past issue and withhold it; your evaluators score
  - Output: a finite, ranked signal map; an evidence-readiness report (which fields exist, which are recoverable); a routing table of owners
  - Commercial terms only after your owner judges the result
- **Always on, learning — the engine**
  - Every interaction in connected channels, continuously
  - Signals surfaced within your data-refresh cycle — same day, not month-end
  - Baselines that adapt to releases, seasons and the separation
  - Each signal routed to the executive who owns the decision
  - Deployed in your cloud — your data never leaves

### p6 · WHY NOT JUST AN LLM
- **Headline:** "Why not do this with our own LLM?" Fair question. Five things a prompt can't do.
- **Columns:**
  - JOINS — *The population, not just the text.* Links a sentence to the firmware, serial range, RMA and order it concerns — and to how many panels are on that version.
  - BASELINES — *Product and partner memory.* Each platform, release, date code and partner against its own history and seasonality. Knows if a rise is abnormal or just quarter-end.
  - LANGUAGE — *One fault, many phrasings.* "Won't map", "devices not found", "loop comes back half-empty" — counted as one signal across calls, email and RMA.
  - EVIDENCE — *Traceable and audit-ready.* Every signal links to its source interactions with original timestamps. Not a black box.
  - ECONOMICS — *Cost-efficient at scale.* Purpose-built pipelines, right-sized models, sized to your volumes. Your models, your environment.

### p7 · BUILT FOR THE ENTERPRISE
- **Headline:** Built to your standards — not retrofitted to them.
- **Subhead:** Designed for your IT, security and legal review.
- **Five blocks:**
  - Deployment — Your infrastructure: cloud, on-prem or hybrid. Read-only overlay. Your data never leaves.
  - Integrations — Salesforce · SAP / Oracle / JDE ERP · ServiceNow · RMA and warranty systems · LMS · file extracts for Discovery · ConnectedSafety+ when you choose.
  - Audit — Every signal traceable to its source. Full audit log, role-based access, restricted access for safety and cyber evidence.
  - Models — Tuned to your product taxonomy: platforms, device families, trouble conditions, listings. Your approved models.
  - Governance — Human approval on every action. LiSN makes no root-cause or reportability determinations; it routes evidence to the people who do.
- **Tagline:** Complementary to your stack. Governed by your policies. Auditable end to end.

### p8 · WHAT CHANGES
- **Headline:** What changes — beyond the capability.
- **Strip:** SIGNAL LATENCY ↓ · NOISE ↓ · COST-TO-SERVE ↓ · EVIDENCE ↑ · RELIABILITY ↑
- **Typical today vs With LiSN** — footnote on the page: "'Typical today' describes a common industry pattern, not an assessment of KGS."

| Persona | Typical today | With LiSN |
|---|---|---|
| VP Engineering & Quality | A release or date-code problem is recognised when the RMA trend or warranty line moves. | Recognised as a cohort at the third independent partner — with panels on version, cases, RMAs and counter-evidence attached. |
| VP Service & Tech Support | Trends found from sampled calls and agent-chosen codes; upstream causes stay in the queue. | Every contact read; repeat clusters traced to the upstream cause and routed to the owner with evidence. |
| Regional GM / VP Sales | Partner risk surfaces at the lost bid or the quarterly review. | Partner drift visible earlier — friction, backorder consequence and certification against the partner's own baseline. |
| CIO / Separation lead | Cutovers report technical status; the business effect arrives as escalations. | Each cutover's effect on distributors visible in days, against a control region, with the invoices and verbatims. |
| PSIRT / Legal | Awareness can begin in a support call nobody routes. | Safety and cyber language watched across channels, timestamped and routed — Legal and PSIRT decide. |
| President, Commercial Fire | Field, channel and separation problems arrive when they reach EBITDA. | A short weekly list of signals that crossed his threshold, each owned by a named executive, each traceable to the calls behind it. |

### p9 · CLOSE
- **LiSN to every installer. Distil the signal. Act on what matters.**
- hello@yaaralabs.ai · www.yaaralabs.ai

---

## 10. One-screen demo specification (v1)

### 10.1 Purpose, audience, story
- **Purpose:** earn Kartik's interest and his feedback for v2; show the join, the baseline, the rendered severity and the human gate on one screen.
- **Audience:** Kartik, live with Ranjith narrating (screen-share or in person). Screenshots may be forwarded, so the anonymised mode must exist.
- **The 60-second story:** *"Global Commercial Fire this week, on synthetic data sized to your volumes — about 1,800 interactions a working day, ~9k this week, ~234k across the 26-week baseline window. Five signals crossed a threshold this week. The top one: a firmware release drifting from the prior version, caught at week three while the RMA dashboard is green — routed to VP Engineering, waiting for their decision, every claim one click from the calls behind it."*

### 10.2 Screen title and context bar
- **Title:** "Global Commercial Fire — Signals this week"
- **Context bar (left → right):** Brand [All ▾] · Region [All ▾] · Period [26 weeks to 25 Sep 2026 ▾] · Role [President ▾] (v1.1) · Data as of **25 Sep 2026 18:00 UTC** `[illustrative]` · Anonymise names [toggle] · persistent badge **"SYNTHETIC SCENARIO — illustrative data, not KGS data"**.
- **Funnel strip (under the bar):** "233,900 interactions read (26 weeks; ~9,000 this week) · 1,640 candidate clusters · 212 suppressed (seasonal, planned tests, how-to after launch, credit holds) · **5 signals above threshold** · 2 governed watch items" `[illustrative]`. Hover on "suppressed" lists reasons with counts.
- **Footer (fixed):** "Synthetic scenario for illustration; no inference about any KGS product. LiSN aids resolution; every action is human-approved."

### 10.3 Layout (1920 × 1080, 12-column grid, 24px gutters)

| Region | Grid | Height | Content |
|---|---|---|---|
| A | cols 1–12 | 56px | Context bar |
| B | cols 1–12 | 36px | Funnel strip |
| C | cols 1–7 | ~600px | **Hero signal card** |
| D | cols 8–12 | ~290px | Tile 1 — Governed safety / cyber watch |
| E | cols 8–12 | ~290px | Tile 2 — Strategic Partner drift |
| F1–F4 | 3 cols each | ~250px | Tiles 3–6: Date-code window · Carve-out friction · Backorder consequence · Evidence readiness |
| G | cols 1–12 | 24px | Footer |
| Drawer | right, 520px overlay | full height | Evidence drawer (slides over D/E) |

Severity colours carry a text label always (never colour alone): S1 red, S2 amber, S3 slate, S4 grey. Unified scale for the demo: **S1** life-safety / regulatory · **S2** material impairment, revenue or cash · **S3** operational or performance · **S4** efficiency. A domain chip (Quality · Channel · Separation · Supply · Safety/Cyber) sits beside the class.

### 10.4 Hero signal card (UC-Q-1, with UC-Q-14, Q-15, Q-10 components)
All values `[illustrative]`; firmware numbers and serials are synthetic.

- **Rank chip:** #1 of 5 · "Why ranked here?" popover: severity × rate ratio × panels on version × source independence × est. field cost.
- **Headline:** "EST4 · firmware 4.1 (synthetic) — 'devices not found after upgrade' contacts 3.1× panels still on 4.0; 9 partners, 3 regions; 1,240 panels on version" `[illustrative]`. In anonymised mode: "Panel platform A · fw A.4.1".
- **Metric vs own baseline:** 6.2 contacts per 1,000 panel-weeks on 4.1 vs 2.0 on 4.0 over the same 3 weeks (event-time aligned to each panel's upgrade date); Poisson exact p<0.001 `[illustrative]`.
- **Visual — firmware lineage river:** weekly rate ribbons for 4.0 and 4.1 across 26 weeks; release marker 2 Sep; denominator shading (panels on each version); threshold crossing marked **16 Sep — third independent partner**; next scheduled monthly RMA review marked **7 Oct** `[illustrative]`. Aggregate EST4 RMA rate line in grey, flat — "green".
- **Severity strip (rendered):** **S2 · Quality** · Type **Cliff** (step at release) · Blast radius **1,240 panels · ~610 sites · 9 partners · 3 regions (US-SE, US-SW, Canada)**, plus "5,560 eligible panels not yet upgraded" · Incident flag **Off** — "no fire event, injury or dispatch mentioned" · Escalation rule: "any S1 phrase in this cohort routes to Quality immediately" `[illustrative]`.
- **Confidence marker:** **M 0.70** · K 15 cases with firmware in record · I 8 imputed from ship date and download logs · Source independence **0.78** (9 partners, 4 channels) `[illustrative]`.
- **Chips:** "New phrasing — first seen 4 Sep" (UC-Q-14) · "Workaround spreading: 'rolled back to 4.0' in 5 cases" (UC-Q-15) · Attribution strip: "Effect persists across certified and uncertified installers — product-leaning (indeterminate below N=15)" (UC-Q-10) `[illustrative]`.
- **Counter-evidence line:** "412 panels on 4.1 at 180 sites show no symptom; symptom concentrates in configurations with more than two signalling loops — a candidate, not a cause" `[illustrative]`.
- **Join tags:** Edwards · EST4 · fw 4.1 · US-SE / US-SW / CA · 9 ESDs · site type: commercial office, education · channels: calls, cases, email, RMA, after-hours · weeks 1–3 post-release.
- **P&L destination:** Warranty and field cost (secondary: tech-support cost-to-serve). **Exposure:** to date ≈ $12k; projected ≈ $0.15m if all eligible panels upgrade unchanged over 12 weeks `[illustrative]` (method in drawer: excess rate × eligible panels × truck-roll, NFF-return and contact costs). Caption: "Small because it is week three."
- **Routed to:** VP Engineering (owner) · cc VP Service & Tech Support · President sees it because S2 and blast radius exceed the agreed threshold.
- **Recommended action:** Engineering reproduction on the candidate configuration; decision on whether to pause the staged rollout and download of 4.1.
- **Human-gate state (prominent):** "**Draft investigation brief — awaiting VP Engineering approval**" · "Draft known-issue note for tech-support agents — not sent" · Approve button disabled in President view with tooltip "Approval sits with VP Engineering".
- **Evidence drawer (button "Evidence · 23"):**
  - Snippets `[illustrative]`:
    1. Call, ESD Florida, 9 Sep: "After we pushed 4.1 the loop comes back with half the devices missing. Rolled one panel back to 4.0 and it mapped fine."
    2. Case note, Texas, 11 Sep: "Devices not found after upgrade on loops 2 and 3; mapping stops around 60%. Power-cycled; no change."
    3. Email, Ontario, 15 Sep: "Third site this month with the same thing after the firmware update — is there a known issue?"
    4. RMA narrative, Georgia, 16 Sep: "Module returned as suspected failure following panel upgrade. Bench: no fault found."
    5. After-hours line, Florida, 18 Sep: "Acceptance test with the AHJ tomorrow and the loop won't map since the update."
  - Linked RMAs: RMA-S-2609-0142 (NFF), RMA-S-2609-0177 (NFF) `[illustrative]`.
  - Affected cohort: 1,240 panels on fw 4.1, serial range E4-S-2403xxxx to E4-S-2611xxxx (synthetic); exportable list (disabled in demo).
  - Method and audit: detector used, baseline window, K vs I split per case, who viewed and when.

### 10.5 Supporting tiles
All values `[illustrative]`. Each tile shows: title · UC chip · headline · one micro-visual · severity chip · confidence · owner · P&L tag.

| # | Title (UC) | What it shows | Illustrative values `[illustrative]` | Join tags | Confidence | Severity | Routed owner | On click |
|---|---|---|---|---|---|---|---|---|
| 1 | **Governed safety & cyber watch** (UC-Q-7, UC-Q-8) | Counts and clock state of open S1 watch items; contents restricted by role | "2 open watch items (restricted)". W-1 Safety · S1 watch · single source → awaiting corroboration · routed to Quality + CLO 23 Sep 10:02 · status: under Quality review. W-2 Cyber · S1 candidate · 4 unrelated EU sites · candidate awareness timestamp 25 Sep 09:14 UTC · not in PSIRT queue at detection → routed to PSIRT + CLO 09:21 · elapsed since first mention 8h 46m | brand · platform · firmware · country · channel · time | W-1 L–M 0.35 · W-2 L 0.30 | S1 | Quality + CLO; PSIRT + CLO | Opens a restricted panel: "Access limited to Quality, PSIRT and Legal roles. Routed to Quality/PSIRT — human decision. **LiSN does not determine reportability.**" Clock ring shows elapsed time with 24h / 72h reference ticks labelled "reference only — PSIRT determines whether awareness has begun" |
| 2 | **Strategic Partner drift** (UC-C-1) | Friction stream vs sell-in line for one partner, with evidence pins | "ESD-SE-07 (synthetic): friction 3.1× own baseline for 6 weeks; EST4 sell-in −22% vs same weeks last year (territory peers +4%); 2 of 5 certified technicians lapsed; a competitor named in 4 calls." Blast radius $6.4m trailing sell-in · $0.9m backlog. Cross-links: 2 of its cases sit in the hero cohort; 2 backorder cases excluded and linked to tile 5 | partner · territory · brand · platform · channel · certification · time | H on orders and certifications (K); M on "friction leads orders" (I) | S2 · Channel · slope | Regional GM NA (owner); VP Service | Expands to partner timeline + draft partner-recovery brief ("awaiting Regional GM approval — no outreach sent") |
| 3 | **Date-code window under a green aggregate** (UC-Q-2) | Serial/date-code heat strip beside the SKU-level p-chart | "Photo detector family D-2 (synthetic), date codes 2611–2614: early-life 'device not responding' 4.2× adjacent production weeks; SKU return rate 0.21% vs 0.30% control limit — green." Blast radius 4,800 units in window; 1,900 still in stock at 11 distributors (containable). Field-replacement exposure up to $0.35m if installed units are affected | brand · SKU family · date code · plant/line · component lot · ship-to distributor · region · time since ship | M 0.65 (K 22 serial-verified; I 9 date codes read from photos) | S2 · Quality · cliff on the serial axis | Director Product Quality; VP Engineering | Expands to heat strip + stock-by-distributor table + draft containment memo with pre-filled 8D D1–D3 ("awaiting Quality approval") |
| 4 | **Carve-out friction by cutover** (UC-C-3) | Topic bands before and after a cutover marker, affected region vs control | "UK-EU invoice and remit-to contacts 2.7× since entity cutover (1 Sep); control region 1.1×; portal-login contacts 3.4×; 14 distributors; £1.1m of invoices in dispute; DSO +6 days at top-10 accounts." | legal entity · system · process · country · distributor · topic · time | H on timing (K); M on cause (I) | S2 · Separation · cliff | CIO / separation PMO; CFO (DSO); Regional GM UK-EU | Expands to cutover timeline + draft separation defect ticket and distributor notice ("awaiting CIO / Regional GM approval") |
| 5 | **Backorder consequence** (UC-C-6) | Backlog-at-risk bars by SKU family with consequence-language overlay; toggle "vs revised promise / vs original promise" | "Notification family N-3 (synthetic): cancel/substitute language 3.2× baseline across 11 NA partners; 312 lines pushed ≥3 weeks; $2.3m backlog; 4 projects with inspections within 30 days. OTD 94% vs revised promise, 71% vs original." | SKU family · region · partner · order line · project · time | H on dates (K); M on cancellation risk (I) | S2 · Supply · slope | VP Supply Chain; VP Sales | Toggle flips the OTD figure; expand shows allocation priority list draft ("awaiting Supply Chain approval — no partner messages sent") |
| 6 | **Evidence readiness** (UC-Q-17) | What LiSN can join today and what Discovery would measure first | "Firmware recorded on 38% of EST4 trouble cases; recoverable from text for 61% of the rest; serial/date code on 44% of RMAs; end-site on 57% of RMAs." Label: "Discovery measures this first — on your data" | channel · partner · region · system · field | H 0.9 (K: blank-field counts; I: recoverable share) | S4 · enabler · slope · blast radius: cases/RMAs unusable for joins · incident n/a | Quality; VP Service; CIO | Field-by-channel matrix; explains how K vs I is set on every card |

### 10.6 Illustrative dataset spec (synthetic — every figure in this section is `[illustrative]`)
- **Window:** 26 weeks, 30 Mar – 25 Sep 2026; 130 working days; plus a 36-month text-only back-search corpus for the safety watch.
- **Interaction volume:** ~1,800 per working day (range 1,100–2,900 with quarter-end and commissioning peaks) → ~233,900 total. Weekend/after-hours ≈ 2%.
- **Channel mix:** tech-support calls (recorded, transcribed in tenant) 36% · cases/tickets 22% · email (tech support, order desk, order-change, AP/AR) 25% · RMA narratives 6% · partner portal / Kidde FX tickets 5% · after-hours line 2% · field notes 2% · training enquiries 1% · PSIRT mailbox and KESMobile app reviews <1%. No public-forum data in v1.
- **Brands (6):** Edwards, Kidde Commercial, Aritech, EMS, GST, AirSense. Excluded pending perimeter check: Gloria, Badger, Graviner/suppression.
- **Platforms (~12):** EST4, EST3/EST3X (legacy), Edge, iO, Evolve, VM/VS, 2X, FireCell, SmartCell, GST panel family (synthetic name), AirSense aspirating, ModuLaser.
- **Firmware:** 3–5 lineages per platform; 14 releases in window; EST4 lineage 4.0 → 4.1 (synthetic) released 2 Sep 2026.
- **Installed base in scope:** EST4 18,500 panels; 6,800 on the 4.0 lineage eligible for 4.1; 1,240 upgraded by 23 Sep (nearly all in week one via download, so exposure ≈ 1,240 panels × 3 weeks and the 6.2 per 1,000 panel-weeks rate holds).
- **Device/SKU families:** ~40; date codes as YYWW.
- **Regions:** NA (US-SE, US-NE, US-MW, US-SW, US-W, Canada), UK-EU (UK, DE, NL, FR, ES, IT, PL), MEA, India, China, APAC/AUS, LatAm — ~25 countries.
- **Partners:** ~3,500 active partner accounts (~420 NA ESDs / strategic partners; ~180 UK-EU distributors; remainder dealers, integrators); ~11,000 certified technicians in LMS.
- **Sites:** ~95,000 sites with site type (commercial office, education, healthcare, hospitality, industrial, data centre, retail).
- **RMAs:** ~9,100 in window (~350/week); NFF share ~18%.
- **Orders:** ~410k order lines; backlog ~$95m at any time; first-promise and revised-promise dates retained.
- **Cutover calendar:** NA portal 14 Jul · EDI mapping change 12 Aug · APAC order management 4 Aug · UK-EU entity 1 Sep.

**Seeded anomalies**

| ID | Tile | Where | Magnitude |
|---|---|---|---|
| A1 | Hero | EST4 fw 4.1, 9 NA partners, from 4 Sep | 23 contacts in 3 weeks; 6.2 vs 2.0 per 1,000 panel-weeks; 2 NFF RMAs; 5 "rolled back" workarounds |
| A2 | Tile 3 | Detector family D-2, date codes 2611–2614, one line, one component lot | 31 early-life contacts over 6 weeks, 22 in window, 14 sharing a lot; RR 4.2×; SKU rate 0.21% vs 0.30% limit |
| A3 | Tile 2 | ESD-SE-07, Florida, weeks 20–26 | 41 interactions vs baseline 13; recontact 38% vs 14%; sell-in −22%; 2 certifications lapse week 22 |
| A4 | Tile 4 | UK-EU, 14 distributors, from 1 Sep | Remit-to/entity contacts 2.7× (control 1.1×); portal login 3.4×; 212 invoices / £1.1m disputed |
| A5 | Tile 5 | Notification family N-3, 11 NA partners, weeks 21–26 | 312 lines pushed ≥3 weeks; consequence language 3.2×; $2.3m backlog |
| A6 | Tile 1 W-2 | 4 EU sites (DE, NL), one platform/firmware, 25 Sep | Restart plus configuration-change language; 3 coded "network/IT – customer side", 1 monitoring-station ticket |
| A7 | Tile 1 W-1 | One single-source S1 phrase, 6 Sep; back-search finds an earlier email coded "commissioning" 19 weeks ago | Presence-based; no rate |
| **Decoys (must be suppressed and shown in the funnel)** | — | Quarter-end order-status spike (late Jun); Edge how-to cluster after training release (adoption, not fault); planned-test / drill language; one partner's order dip coinciding with a credit hold (routed to AR) | 212 suppressed clusters in total |

### 10.7 Interactions and drill-downs
- **Filters** re-scope every tile; a tile with nothing above threshold in scope says "No signal above threshold in this scope" — never blank.
- **Hero:** hover the river for weekly values with denominators; click "Evidence · 23" for the drawer; click "Why ranked here?" for the ranking factors; expand "Counter-evidence".
- **Tiles:** click to promote into the hero area (the previous hero drops to a tile); "Back to this week" returns.
- **Governed watch:** click opens the restricted panel only (no contents in President role).
- **Approve / send buttons:** visible but disabled for the President role, with the owner named — shows the human gate.
- **Anonymise toggle:** swaps brands, platforms, partners and regions for neutral labels for any screenshot that may be forwarded.
- **Real-name rule (reviewer addition, mandatory):** real KGS platform or brand names (EST4, Edwards) may appear next to a hypothetical fault **only** in the live, narrated session, and only when (1) the "SYNTHETIC SCENARIO" badge and footer are visible, and (2) every firmware version, serial range, date code, SKU family and partner ID is synthetic and visibly marked "(synthetic)". Any export, PDF, screenshot or shareable link defaults to **anonymised mode** ("Panel platform A · fw A.4.1") with a diagonal "Synthetic scenario — not KGS data" watermark; the named mode cannot be exported. The governed safety/cyber tile never shows a platform name in either mode.
- **Role switch (v1.1, optional):** President / VP Engineering / PSIRT — demonstrates that each role sees only its signals and that watch contents open for PSIRT.

**Deliberately NOT on the screen:** sentiment scores, CSAT/NPS, word clouds, raw volume league tables; agent performance; external signals (weather, macro, public forums); any "send", "auto-fix" or "auto-report" action; reportability verdicts; root-cause statements; savings or ROI figures; real KGS data; competitor names; Gloria, suppression or residential products; named KGS individuals (roles only).

### 10.8 90-second talk track (Ranjith narrates; prompts for Kartik in italics)
| Time | Screen action | Ranjith says |
|---|---|---|
| 0–10s | Point at badge and funnel | "Synthetic data, sized to Commercial Fire — about 1,800 interactions a day. Of 234,000 this half-year, five signals crossed a threshold this week, and 212 look-alikes were suppressed." |
| 10–35s | Hero river; hover threshold crossing | "The top one: a firmware release drifting from the prior version — three times the rate per panel, nine unrelated partners, three regions. It crossed on 16 September, at the third independent partner. The monthly RMA review is 7 October, and the aggregate line is flat." |
| 35–45s | Severity strip, confidence, counter-evidence | "Severity S2, a cliff at the release, 1,240 panels exposed and 5,560 not yet upgraded. Medium confidence — 15 cases have firmware in the record, 8 are inferred, and it shows you where it doesn't fit." |
| 45–55s | Open drawer; read snippet 1 | "Every number opens to the calls behind it. Note the workaround — installers are already rolling back." |
| 55–62s | Point at gate | "It's routed to VP Engineering with a draft brief. Nothing happens until they approve." *Kartik: who in your team would own this card?* |
| 62–72s | Tiles 2 and 3 | "Same method elsewhere: a partner drifting against its own baseline while sell-in slips; a date-code window going wrong while the SKU return rate is still inside the control limit." |
| 72–80s | Tile 4, then tile 1 | "The carve-out: friction after an entity cutover against a control region. And safety and cyber: you see that two items exist and who has them — not the contents. LiSN doesn't decide reportability." |
| 80–90s | Tile 6 | "This is what Discovery measures first on your data. The ask: one region, 90 days, offline — you hide a past issue, your team scores us." *Kartik: which of these would you open first on a Monday?* |

### 10.9 v2 feedback questions for Kartik
1. Which tile would you open first on a Monday, and which would you delete?
2. What would have to be on this screen for it to be yours — and what threshold should reach you rather than stay with the owner?
3. Who should own the hero card at KGS — Engineering, Quality or Service?
4. What does your team call this problem: quality escapes, field issues, partner churn, cost-to-serve?
5. Is there a past issue whose timeline you know well enough to test us on blind?
6. Which systems hold tech-support cases, RMAs and orders — and which are still on TSAs?
7. Do cases capture model, firmware and serial? Roughly how often?
8. Which region or portfolio would you choose for Discovery?
9. For v2, which is most valuable: an EST3→EST4 migration view, a ConnectedSafety+ join, or a China vertical lens?
10. What would a six-month win look like to Lone Star?

### 10.10 Mapping: tile → UC → persona → pillar

| Tile | UC | Primary persona | Pillar |
|---|---|---|---|
| Hero — firmware cohort | UC-Q-1 (+ Q-14, Q-15, Q-10) | P2 VP Engineering; P1 President | 1 Protect margin and reliability |
| 1 Governed watch | UC-Q-7, UC-Q-8 | P9 PSIRT / CLO; P3 Quality | 4 Evidence on demand |
| 2 Partner drift | UC-C-1 | P5 Regional GM; P1 | 2 Hold the channel |
| 3 Date-code window | UC-Q-2 | P3 Quality | 1 Protect margin and reliability |
| 4 Carve-out friction | UC-C-3 | P7 CIO; P8 CFO | 3 Run the separation cleanly |
| 5 Backorder consequence | UC-C-6 | P6 COO; P5 | 2 Hold the channel |
| 6 Evidence readiness | UC-Q-17 | P4 VP Service; P3; P7 | Foundation (honesty on data) |

**Panel notes on the demo:** COMP prefers anonymised names by default; SVC says real platform names are what make it his screen. Resolution: real platform names with synthetic versions and serials in the live session; anonymised mode for anything forwarded. PE wants $ on every tile (done); ARCH warns the hero's $ is small — keep it small and say why ("week three"), rather than inflate.

---

## 11. Open items — validate before sending

**Facts to re-source or drop**
- `[src-unresolved]` (GPT-only): >1.5m commercial buildings; 18 facilities / 7 plants / 11 R&D centres; Hyderabad "independent digital organisation separate from the former owners" ad; Gloria sale to Anaf (Apr 2026); GST GP01 UL 864 (Jul 2026); CommerceHub/EDI; "KGS's own sale terms discuss lead times". None is used in sections 8–9; keep it that way until re-sourced.
- UL 864 edition (K-7) — do not quote.
- "The consequential signal may have a count of three" is a G panel line — use it as an idea, not attributed to a source.
- EST3 halt date: `[3-src]` in A.2, `[single C]` in 0.4 — re-check the Edwards source before printing the date anywhere.
- CEO (K-4 — Dan Thompson assumed).

**Perimeter checks**
- Gloria sale closed? (I.4 Q11) — keep out until confirmed.
- Suppression / special hazards (Graviner, LatAm) inside Commercial Fire? (K-10)
- Extinguishers (Badger) — Commercial or Residential?

**Names and owners to confirm**
- Head of Commercial Fire tech support / CX — not identified by any engine (ask Kartik).
- Quality / Field Quality lead; PSIRT lead; CISO; Connected Services owner — not named.
- All named executives are `[aggregator]` grade (Schatz, Tullio, Peabody, Tayoun, Booth, Sprenger, Veltri) — do not name them in client material.

**YaaraLabs claims to confirm internally**
- Engine latency ("under 30 minutes") and "quarterly model refresh" — true in a client-tenant deployment?
- What InfoSec evidence YaaraLabs can supply (architecture pack, pen-test, SBOM, remote-support access model).
- Contracting entity (YaaraLabs vs Yaara Data India Pvt Ltd) and whether a US SI channel-partner route can be offered (YaaraLabs context, not in dossier; no individual named here per the naming rule).
- Pilot fee position for Discovery (brief says commercials held — confirm it is free or at a standard rate offered to any prospect).

**KGS process questions (via the named owner)**
- Related-party vendor policy and disclosure route.
- Data access under Carrier TSAs for cases, RMAs and orders (R1).
- Call-recording notices and EU works-council requirements (R9).

**Demo build checks**
- Every figure on screen carries the synthetic badge; anonymise toggle works on every label.
- Severity, cliff/slope, blast radius, incident flag and confidence rendered on every card (not just colour) — the retail build failed exactly this (R29).
- No "resolve" string anywhere in UI copy; no "LisN".
