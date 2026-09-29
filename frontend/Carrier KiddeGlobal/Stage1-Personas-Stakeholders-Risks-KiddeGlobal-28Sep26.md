# LiSN × Kidde Global Solutions (Global Commercial Fire) — Personas, Stakeholders & Residual Risks

**Stage 1 · Persona & Stakeholder lens · v1 · 28 Sep 2026 · YaaraLabs / LiSN — internal working document, not client material**

**Inputs:** `KGS_Stage0_Merged_Dossier_v1.md` (IDs M0.x, MD-x, MH-x, K-x, C.2 row #); raw engine spot-checks — Opus (C), ChatGPT (G), Perplexity (P), Exa (X, read from Drive); `LiSN_current_PDF_text.txt`.

**Tag legend:** `[fact]` evidenced in dossier · `[inference]` panel interpretation · `[aggregator]` ZoomInfo/RocketReach/LinkedIn-profile grade — verify before naming anyone in client material · `[src-unresolved]` GPT-only fact, URL lost · `[proxy]` peer or pre-sale data, not KGS · `[illustrative]` invented demo figure · `[not in dossier — counsel to confirm]` panel view added in this lens (privacy, competition law), not researched by any engine · `[gap]` role or fact no engine found.

**Four-lens panel shorthand:** **ARCH** AI architect (B2B service data) · **SVC** former VP Customer Service & Tech Support, building-technology OEM · **PE** PE carve-out operating partner · **COMP** fire-code, product-compliance & product-cyber adviser. Disagreements are stated, not averaged.

**Rules applied throughout:** every LiSN signal example carries join tags + a named P&L destination metric + rendered severity + confidence; LiSN "aids resolution", never resolves; no external-signal claims; no autonomous root cause; "is the join made today?" is framed as a testable question, never as "your data is fragmented"; no current Commercial Fire defect implied — residential recalls only as `[proxy]`.

---

## 1. Ecosystem map

Relationship codes: **B** buyer · **U** user · **C** champion · **I** influencer · **G** gatekeeper · **X** potential blocker · **V** voice source (LiSN listens to their interactions) · **Be** beneficiary.

| # | Stakeholder | Role in the KGS Commercial Fire ecosystem | Relationship to LiSN | Power | Dossier IDs |
|---|---|---|---|---|---|
| **Internal KGS** | | | | | |
| 1 | President, Global Commercial Fire (Kartik Kumar) `[4-src]` | P&L owner (~$1bn+, M0.3-11); carve-out management team; China growth; connected-services theme | Sponsor · B (authority) · C — but related to the vendor (see §4) | Very high | M0.1-1…11, M0.3-11 |
| 2 | VP Engineering / Product Engineering (Paul Schatz `[aggregator]`; Frank Busse, Global Director Systems, May 2026 `[aggregator]`); Hyderabad R&D (firmware, software, quality engineering) `[4-src]` | Owns design, firmware, engineering change, root cause | Technical evaluator · U · C | High | M0.3 leadership, 0.3 footprint, MH-1, MH-13 |
| 3 | Quality / Field Quality lead `[gap — not named]` | DOA, field failure ppm, RMA disposition, containment | C · U (hero use case) | High | B (quality KPI), MH-1, MH-2, MH-13 |
| 4 | VP Customer Service & Technical Support, Commercial Fire `[4-src gap — not identified]` | Tech-support lines, after-hours line, order desk, RMA desk, Kidde FX portal | **Native buyer** · U · C | High | 0.3 ("Ask Kartik"), C.3, MH-6 |
| 5 | Regional GMs / VP Sales & Channel (Thomas Veltri, VP NA Sales & Sales Ops `[aggregator]`; Kurt Bailey, Director of Global Sales `[single C]`; Marcelo Zeppelini, MD LatAm `[aggregator]`; UK-EU, China/GST, India/MEA leads `[gap]`) | Channel share, dealer activation, spec wins, regional P&L | U · I · C for MH-4 | High | 0.4, A.4, MH-4, MH-15 |
| 6 | COO / Supply Chain & Order Management (James Booth, COO `[aggregator]`) | OTIF, backlog, allocation, order-exception rate, plant network | U · I | High | B, MH-8, MH-5 |
| 7 | CIO (Nick Tullio `[2-src aggregator/profile]`); separation PMO; Hyderabad digital hub ("independent digital organisation", `[src-unresolved]`); Devin C. Smith, digital strategy/finance/M&A `[single P profile]` | Standalone systems, TSA exit, Salesforce/ERP programme, data access | Technical evaluator · **G** · X (bandwidth) | Very high (for access) | 0.6, E.2, MH-5, MH-16 |
| 8 | CFO (Derek Peabody `[2-src aggregator]`); Global CFO Commercial Fire (Merched Tayoun `[aggregator]`); VP FP&A (Chris Comiskey `[profile]`); CAO (Barend van der Merwe `[profile]`) | EBITDA, cash, DSO, warranty accrual, vendor spend approval | Economic validator · G | Very high | B value arithmetic, MH-6, MH-8 |
| 9 | PSIRT / Product Security `[fact: 48h acknowledgement]` | Vulnerability intake, advisories, CRA Art. 14 clock | U · C (for MH-3) | Medium–high (statutory) | 0.6, C.2 #21/#22/#35, MH-3, MH-17 |
| 10 | CLO / Legal, Regulatory & Product Compliance (Mike Sprenger, CLO `[aggregator]`); privacy counsel `[gap]` | Reportability (CPSC §15, CRA), privacy, contracts | **G** · X · U (evidence chronology) | Very high (veto) | G, MH-2, MH-3 |
| 11 | CISO / InfoSec `[gap — not named]` | Vendor security review, deployment approval | **G** · X | High | Brief (no SOC 2/ISO) |
| 12 | Procurement / vendor onboarding `[gap]` | Supplier due diligence, MSA, related-party screening | G | Medium | §4 |
| 13 | Product Management (Jon Hughes, VP PM Edwards; Wally Ortiz, Global PM Director Kidde Commercial `[single C, trade press]`) | Roadmap, EOL, migration, compatibility tables | U · I | Medium–high | M0.3, MH-7, MH-9, MH-10 |
| 14 | Connected Services / digital product owner (ConnectedSafety+, KESMobile, GST cloud) `[gap — owner not named]` | Kartik's stated digital theme (M0.1-4) | I · C or X (territorial) | Medium–high | F3, MH-14 |
| 15 | Edwards Learning Center / Fire & Security Academy lead `[gap]` | Certification throughput; seats (June 2026 EST4 classes full, MD-11) | U | Medium | C.2 #17/#18, MH-11 |
| 16 | Strategic Accounts lead (Edwards) `[gap — team evidenced, lead not named]` | Multi-site owners, lifecycle modernisation, ITM | U · I | Medium–high | 0.4, C.2 #33, MH-7 |
| 17 | Frontline support agents, order-desk and RMA staff | Handle the interactions LiSN reads | **V** · U · Be (fewer repeat contacts) — also privacy subjects | Low individually; works councils in EU | C.2, §3 privacy |
| 18 | CHRO (Randy Michel `[aggregator]`) / EU employee representatives | Employee-monitoring consent, works-council consultation | G | Medium (EU) | §3 privacy `[not in dossier]` |
| 19 | CEO (Dan Thompson — `[3-src]`, K-4 unresolved) | Group priorities; capital allocation | I · escalation point | Very high | M0.3, K-4 |
| 20 | President Residential (Isis Wu `[aggregator]`) | Consumer adjacency; recall exposure | Future B (adjacency) | High (separate P&L) | 0.7, MH-12 |
| **Owners, board, capital** | | | | | |
| 21 | Lone Star Funds / KGS board / lenders (Chairman Daniel Ajamian `[aggregator]`) | EBITDA, cash, TSA exit, exit narrative | Decisive I · can veto spend indirectly | Controls capital | A.4 (P), B |
| **Channel and field** | | | | | |
| 22 | Edwards Strategic Partners / ESDs / dealers (NA) | Own building relationship; stock; commission; service | **V** · Be | High | A.4, C.2 #1–#12, #31, #34 |
| 23 | Distributors / integrators (UK-EU, MEA, APAC, India, China) | National distribution; project integration | **V** · Be | High (regional) | 0.4, C.2 #7–#9, #34 |
| 24 | Installer / programmer / commissioning & service technician (NICET-certified in NA) | Programme, commission, troubleshoot | **V** (richest private VoC) · Be | High in aggregate | C.2 #1–#6, #13, #17, MD-1…MD-11 |
| 25 | Electrical / fire contractor, GC, EPC | Build, schedule | V (order/submittal) · Be | Medium | A.4, C.2 #7, #9 |
| 26 | Independent panel-repair shops, grey/parallel market (India) `[2-src]` | Unofficial service | Invisible to KGS; partial V via forums | Low–medium | 0.3, 0.4 |
| **Specification, approval, standards** | | | | | |
| 27 | Consulting engineer / specifier / fire engineer | Locks brand in or out pre-tender | V (C.2 #9, #19, #32) · Be | Very high | A.4 |
| 28 | AHJ / fire marshal / building control | Acceptance, occupancy | V (indirect, #19, #20) · Be | **Veto**, buys nothing | A.4, G |
| 29 | Standards / listing bodies (UL, FM, NFPA, LPCB, VdS, BIS, SAI, CCC) | Market access, change control | Gatekeeper of KGS products, not of LiSN | Gatekeeper | A.4, G |
| 30 | Regulators — CPSC (US), EU market-surveillance authorities, ENISA/CSIRTs (CRA) | Reporting clocks | Not a LiSN party; LiSN supports KGS's evidence chronology | Statutory | G |
| **Owners and operators** | | | | | |
| 31 | Building owner / FM / EHS / UK Responsible Person | Funds retrofit and service | V (mostly via dealer, #25, #28) · Be | High at retrofit | A.4, D.3 |
| 32 | National / multi-site accounts | Standardisation, fleet reporting | V (#33) · Be | High | A.4, C.2 #33 |
| 33 | ITM firms (inspection, testing, maintenance) | Device-health evidence; parts and legacy | V (#15, #27) · Be | Medium | A.4 |
| 34 | Monitoring station / BMS / security OEM | Signal transmission, interoperability | V (#25, #27) · Be | Medium | A.4 |
| 35 | Insurer / risk engineer (e.g. FM Global) | Resilience beyond code | Be (indirect); rarely V | Medium–high (industrial, data centres) | A.4 |
| 36 | Mission-critical owners (data centres, labs, energy storage, rail, petrochemical) | Kartik's growth verticals | V · Be | High (reference sites) | M0.1-1, MH-15 |
| **Security and public** | | | | | |
| 37 | Cyber researchers / CERTs / CSIRTs | Disclosure; statutory clocks | V (#21, #35) | Rising | A.4, MH-3 |
| 38 | Occupants / residents | Alarm works without nuisance | Be; weak V via reviews | Low individually, high aggregate | A.4 |
| 39 | Residential consumers (adjacency, not Kartik's P&L) | Chirps, false alarms, recalls | V (future scope) | High aggregate (CPSC, reviews) | 0.7, C.2 #36, MH-12 |
| 40 | Residential buying groups / retailers; OEM partners (Ring) | Fill rate, returns, integration | V (adjacency) | Medium | A.4 (P, C) |
| **Competitive and vendor** | | | | | |
| 41 | Competitors (Honeywell, JCI/Simplex, Siemens, Bosch, Hochiki, Potter, Mircom; Chinese domestic rivals to GST) | Named in dealer "competitor substitution" language | Mentioned in V; JCI OpenBlue OBI is a narrative rival | — | A.3, F3 |
| 42 | Incumbent/adjacent vendors (Salesforce/Einstein, ServiceNow Now Assist, Medallia, Qualtrics, CallMiner/NICE/Verint) | Could counter-pitch | X (competitor for budget) | Medium | F2 |
| 43 | Separation SIs / TSA provider (Carrier) `[gap — none named]` | Run the systems LiSN would read | G (data access during TSA) | Medium–high | 0.5 "not found", E.2 |

**Structural insight** `[inference, G + P, D.2]`: one building can involve owner, operator, specifier, AHJ, national account, local partner and subcontracted technician — "customer" cannot be one account field. LiSN's entity graph must hold these as linked roles, not one identity.

---

## 2. Internal persona cards

Card order reflects importance to the pitch. Named individuals appear only where the dossier names them, with evidence grade.

---

### P1 · President, Global Commercial Fire — Kartik Kumar `[4-src]`

**Owns:** Commercial Fire P&L (~$1bn+, `[fact — supplied]` M0.3-11); portfolio Edwards, Kidde Commercial, GST, Aritech, EMS, AirSense; carve-out management team; China growth (M0.1-1); digital & lifecycle services (M0.1-11).
**KPIs (B):** organic growth, bookings/backlog; EBITDA and margin leakage; cash/DSO; aftermarket/lifecycle mix; channel share and spec wins; quality (field failure, warranty); TSA exit milestones.

**Questions he asks**
- *Daily/weekly:* Is anything in the field that could become a quality or safety event? Which big partners are unhappy? What is shipping late?
- *Monthly:* Why did warranty/RMA cost move? Are we winning EST3→EST4 migrations or losing them to Honeywell/JCI? How is China tracking?
- *Event-triggered:* After a firmware release, a TSA cutover, a product launch (Edge, Evolve) or a large lost bid — "what are dealers saying, and since when?"

**Top pain points**
| Pain | Evidence | Fact / inference |
|---|---|---|
| Learns of quality issues when warranty cost spikes, weeks after installers first described them | MH-1 (4-src rank 1); C persona table ("learns of quality issues when warranty cost spikes") | Inference — no KGS evidence either way (E framing rule) |
| Channel risk surfaces at the lost bid | MH-4; A.4 (channel power high) | Inference |
| Carve-out friction reaches him as escalations | MH-5; C.2 #34; elc@carrier.com residue (0.2) | Fact that residue exists; inference on impact |
| Migration leakage in EST3 base | EST3 new orders halted 31 Dec 2023 `[single C]`; MD-7 ($45k migration anecdote) | Fact (halt); illustration (anecdote) |
| "Quality and reliability are as critical as innovation" — his own words | M0.1-5 `[single C]` | Fact (quote) |

**Workarounds today** `[inference]`: monthly operating reviews; RMA dashboards; RSM escalations; personal dealer visits (M0.1-7). They fall short because aggregates hide clusters (D.2 "aggregate-rate blindness") and escalations are already late.

**How LiSN addresses it:** a weekly executive digest of the 3–5 ranked signals that cross his threshold, each evidence-linked and owned by a named executive, plus the ability to open any signal to its source calls, cases and RMAs.
> **Signal card [illustrative]:** "EST4 loop-mapping trouble calls 3.4× their own seasonal baseline in US Southeast; 71% mention SIGA-series modules after firmware 2.x; RMA returns from two Florida distributors 2.1× over 5 weeks." · **Tags:** Edwards · EST4 · fw 2.x · SIGA · US-SE · 2 distributors · tech-support calls + RMA · 5 weeks · **Severity:** major product anomaly · slope · blast radius ~420 shipped panels `[illustrative]` · incident flag: no · **Confidence:** medium (3 independent sources) · **P&L:** warranty cost; est. exposure $1.8m `[illustrative]` · **Owner:** VP Engineering — human decision · **Maps to:** MH-1, MH-4, MH-13.

**Buying role:** executive sponsor; holds P&L authority. Because he is Ranjith's relative, he should **sponsor and delegate evaluation**, not be the evaluator or sign the commercial decision (§4).
**Likely objections → response**
- "We already have Salesforce and ConnectedSafety+." → "ConnectedSafety+ shows what connected panels do; LiSN shows what installers say about all panels, connected or not — joined to firmware and RMA." (F3, P)
- "Our volumes are small." → "The consequential signal may have a count of three." (C.1, G)
- "Not during the carve-out." → "Read-only overlay; offline-first pilot; zero production integration." (E.2, G)

**What must be true to say yes:** a credible arm's-length evaluation his peers own; a pilot that asks nothing of the CIO's separation team beyond an extract; one signal his engineering team did not already know, or knew later; nothing that implies a current defect.

**Residual risks LiSN does NOT address for him**
- Cannot fix supply shortages, price or product design — it names where they bite.
- Cannot protect his reputation if the evaluation looks like favouritism; only process can.
- Cannot make his organisation act on a signal; without named owners, signals decay into another report.
- Cannot deliver China/GST value early if the Mandarin corpus and GST case data are not in scope.
- Value arithmetic in B is sensitivity, not savings (G PE partner) — LiSN cannot promise a $ figure before Discovery.

**Messages that land:** "gaps and needs", "quality and reliability", "grow core", "lifecycle services", "special-cause variation against each product's own baseline" (Six Sigma, M0.1-11), "your ConnectedSafety+ stays the hero".
**Avoid:** "300K daily", "contact centre", "sentiment", "your data is fragmented", "Carrier" (say KGS), any hint of a current defect, banking analogies.

**Lens notes:** SVC and PE agree he acts on signals tied to revenue, cash, safety, acceptance or a partner's ability to sell/service — not sentiment (B, X). PE (P) expects his near-term agenda to be dominated by standalone execution and cash; SVC (P) reads him as dealer-productivity led. Both are compatible; public evidence cannot weight them (M0.1).

---

### P2 · VP Engineering / Product Engineering — Paul Schatz `[aggregator, single C]`; Frank Busse, Global Director Systems (joined May 2026) `[aggregator, single C]`; Hyderabad R&D (firmware, software, digital systems, quality engineering) `[4-src]`

**Owns:** hardware and firmware design, engineering change, release quality, listed-configuration integrity (UL 864 — edition conflict K-7), root-cause analysis.
**KPIs:** field failure ppm, repeat failure, time-to-root-cause, release escape rate, engineering change cycle time (B quality row) `[inference on exact metrics]`.

**Questions:** *Weekly:* what broke after the last release? *Monthly:* which families drive warranty? *Event:* "Is this installer's problem a one-off or a population?"

**Top pain points**
- Symptom language does not reach engineering with serial, firmware and topology attached — "lost technical context" (D.2, `[4-src]`).
- EST4 Signature diagnostics weaker than EST3's, by Edwards' own admission (MD-2 `[single C]`, fact as of the June 2022 HDT webinar Q&A; current status unverified — do not present as today's product state) — migration questions arrive as support noise.
- Batch/component issues look like isolated installer error (C.2 #13, `[3-src]`, inference).
- Firmware changes to listed configurations are not ordinary SaaS releases (G, G section) — compatibility questions rise after releases (C.4 #8).

**Workarounds:** RMA sample returns, escalation tickets from Tier 2/3, engineer-to-dealer calls. Fall short: escalation is a filtered, late subset (5–15% of contacts, C.1 panel `[estimate]`).

**How LiSN addresses it:** new-phrasing detection across independent technicians (C.4 #2); symptom × model × firmware × hardware revision × partner × region × time-since-install cohorts (D.3); installed-base denominator (E.1 #6); counter-evidence and candidate causes, never a root-cause verdict (F4).
> **Signal card [illustrative]:** "'Won't map after upgrade' — new phrasing in 5 unrelated ESDs in 3 regions; 4 of 5 on EST4 fw 4.x with SIGA modules; 2 matching RMAs dispositioned 'no fault found'." · **Tags:** Edwards · EST4 · fw 4.x · SIGA · NA-SE/NA-MW/CA · 5 ESDs · calls + RMA · **Severity:** major product anomaly · cliff (new since release) · blast radius 1,100 panels on fw 4.x `[illustrative]` · **Confidence:** low–medium (5 sources, 2 independent confirmations) · **Counter-evidence:** 3 cases trace to one training cohort · **P&L:** warranty and field cost · **Maps to:** MH-1, MH-13.

**Buying role:** technical evaluator; natural champion if the retrospective test finds something real.
**Objections → response:** "Free text can't identify a batch." → "Correct without structured serials (C.4 caveat); Discovery tests field fill-rate first." · "We'll drown in weak signals." → "Recall broad at ingestion, ranking severe at the executive boundary" (F2 consensus).

**Must be true:** cases or RMAs carry model/serial/firmware for a usable share; retrospective back-test on a known historical issue shows earlier detection; engineers can see every excerpt.

**Residual risks not addressed**
- Root cause stays engineering's; LiSN supplies correlated evidence only.
- If model/serial/firmware fields are sparse, cohorts stay at family level and batch attribution is weak.
- Dealer-held programme files and site topology (MD-4) are invisible.
- Poor entity resolution can create false cohorts (X architect caution).
- Hyderabad R&D bandwidth is shared with separation work.

**Lands:** "cohort", "baseline", "candidate causes", "counter-evidence", "time since install". **Avoid:** "root cause", "AI finds the defect", "sentiment".

---

### P3 · Quality / Field Quality lead `[gap — not named]`

**Owns:** DOA and early-life failure, RMA disposition, containment, supplier recovery, input to recall decisions.
**KPIs (B):** DOA, field failure ppm, RMA and warranty cost, repeat failure, time-to-containment; "always critical / sharply rising" `[4-src]`.

**Questions:** *Daily:* new DOA reports? *Weekly:* RMA mix by family and ship-to. *Monthly:* warranty accrual drivers, NFF rate. *Event:* "Is this serial range contained? When did we first hear of it?"

**Top pain points**
- RMA narratives concentrate in a serial range while the aggregate return rate is normal (C.4 #7, `[3-src]`).
- "Most RMAs need ≥1 follow-up" for evidence (C.2 #12, P `[single]`) — defect evidence lost (C.2 #11).
- NFF and multiple replacement cycles (MH-13, P `[single — preserve]`).
- The CPSC chronology question "when did you first know?" (G) — for residential and some commercial products.

**Workarounds:** RMA database, 8D/CAPA, sample returns, periodic Pareto charts. Fall short: RMA systems record logistics, not the earlier conversation (MH-13).

**How LiSN addresses it:** contact ↔ RMA timeline; serial-range concentration; DOA narrative clustering; safety-language watch across every channel from day one (H.4); an immutable first-mention timestamp.
> **Signal card [illustrative]:** "DOA 'won't initialise' narratives for one detector family concentrated in one date-code window: 9 of 14 reports from 3 ship-tos; aggregate RMA rate within limits." · **Tags:** brand · detector family (generic by design — reviewer removed a real product name from this hypothetical DOA card, brief rule 8) · date-code window · UK-EU · 3 distributors · RMA + email · **Severity:** major product anomaly · slope · blast radius ~6,000 units in window `[illustrative]` · incident flag: none · **Confidence:** medium · **P&L:** warranty cost / warranty accrual · **Route:** Product + Quality within hours · **Maps to:** MH-1, MH-13, MH-2.

**Buying role:** champion and daily user of the hero use case.
**Objections → response:** "We already do Pareto on RMAs." → "Pareto ranks volume; LiSN ranks change against each family's own baseline and pulls in the calls before the RMA." · "A false alarm costs us an investigation." → "Every signal shows confidence, source independence and counter-evidence; single-source commercial anomalies go to a watchlist."

**Must be true:** RMA data joinable to contacts; safety signals never suppressed but labelled `[single]`; Quality, not LiSN, owns disposition.

**Residual risks not addressed**
- LiSN cannot decide containment, recall or reportability.
- Cannot see failures reported only to dealers who never call KGS (channel opacity, D.2).
- Cannot reach supplier/component data unless MES/supplier lots are joined.
- A retained timestamped record of "first weak evidence" cuts both ways legally — counsel must set retention and review policy (P10).

**Lands:** "containment population", "first credible mention", "serial concentration", "NFF loop". **Avoid:** "defect found", "recall prediction".

**Lens notes:** ARCH would surface single-source safety anomalies immediately with a weak-evidence label; SVC would suppress single-source commercial anomalies; consensus — never suppress safety, route as `[single]` with calibrated severity (C.4, P).

---

### P4 · VP Customer Service & Technical Support, Commercial Fire — `[4-src gap: not identified — ask Kartik, I.4 Q5]`

**Owns:** tech-support lines (application, technical, after-hours emergency), order desk, order-change email, RMA desk, Kidde FX ticket portal, possibly training line (C.3, `[2-src]` P X; Edwards Signaling phone tree `[single C]`).
**KPIs (B):** FCR, repeat contact, escalation age, abandonment, cost per contact, partner ease of doing business; SVC: leading indicators **only when segmented by product/site/partner** (X).

**Questions:** *Daily:* queue, backlog, escalations. *Weekly:* top drivers, repeat callers. *Monthly:* cost-to-serve, headcount case. *Event:* launches (Edge, Evolve), firmware releases, TSA cutovers.

**Top pain points**
- Separate queues by design; customers restate context (D.2, `[2-src]`).
- Samples calls; how-to repeats unseen (C persona table).
- Repeat contacts caused by upstream order, entitlement or RMA data (MH-6).
- EST4 skills gap: many technicians' first TCP/IPv6, cyber-enabled panel (MD-9); June 2026 classes full (MD-11).
- Carve-out friction lands on the order desk first (C.2 #34).

**Workarounds:** CRM reason codes (agent-chosen, coarse — MH-1 "why CRM misses"), QA sampling, supervisor intuition, knowledge articles written from memory. Possibly contact-centre analytics — none found (F2, `[4-src]`; do not imply absence).

**How LiSN addresses it:** 100% coverage instead of sampling; multi-label intent (backorder + commissioning + compatibility in one contact, C.1); repeat-contact clusters traced to upstream process defects; knowledge-gap and training-gap signals; defects routed to engineering with evidence, relieving Tier 3.
> **Signal card [illustrative]:** "EST4 audio/NCA configuration how-to contacts 2.1× baseline since Edge launch; 38% recontact within 7 days; 62% from partners with no EST4-certified technician." · **Tags:** Edwards · EST4/Edge · NA · partner certification status · calls + email · 6 weeks · **Severity:** efficiency opportunity · slope · affected: 140 partners `[illustrative]` · **Confidence:** high (volume + LMS join) · **P&L:** cost-to-serve (est. $0.4m/yr `[illustrative]`) · **Route:** Service Ops + Academy, weekly · **Maps to:** MH-6, MH-11.

**Buying role:** **native economic buyer** for an operational tool; champion; primary user. Gap: until identified, the pitch rests on Kartik — a structural weakness (§4).
**Objections → response:** "Another dashboard for my team." → "Not a dashboard: a sparse, ranked evidence packet to the owner who can remove the cause." · "Will this score my agents?" → "LiSN reads for product, partner and process signals, not agent QA; agent identifiers can be pseudonymised." · "My team is already stretched by the separation." → "Discovery runs on an extract; your team reviews outputs, not builds."

**Must be true:** access to recordings or at least case notes and email; clarity on which system holds cases (Salesforce Service Cloud? — I.4 Q1); a deflection or repeat-contact reduction he can own.

**Residual risks not addressed**
- If calls are not recorded or not transcribed, voice is limited to agent notes (quality varies).
- LiSN does not staff queues, write knowledge articles or change IVR — it names what to fix.
- Alert fatigue if routing is not tuned (C.2 #30 analogue).
- Change management: agents may fear monitoring; EU works-council process (§1 rows 17–18; §3.0).
- Outsourced support centres (a residential manager profile shows one, `[single X]`) may hold data under third-party contracts.

**Lands:** "repeat-contact clusters", "first-time fix", "upstream cause", "Tier 3 relief", "100% not a sample". **Avoid:** "agent monitoring", "CSAT uplift", "replace your CRM".

---

### P5 · Regional GM / VP Sales & Channel

Named: Thomas Veltri, VP NA Sales & Sales Ops `[aggregator]`; Kurt Bailey, Director of Global Sales `[single C, dealer site]`; Marcelo Zeppelini, MD LatAm `[aggregator]`. UK-EU, China/GST, India/MEA leaders `[gap]`.

**Owns:** channel share, dealer activation, spec wins, quote conversion, regional P&L.
**KPIs (B):** bookings, backlog, book-to-bill, quote conversion; channel share, active dealers, spec wins (lead revenue 12–36 months); partner NPS only when tied to named accounts (SVC, C).

**Common pains:** partner risk surfaces at the lost bid (C persona table); signal scattered across RSM inboxes and QBR notes (MH-4, E); average AHT/NPS hides one strategic partner's repeat failures (MH-4); metro-level brand dominance varies (A.3, P `[single — preserve]`, anecdotal).

**Workarounds:** RSM relationships, QBRs (C.2 #31), Salesforce pipeline, gut feel. Fall short: tone, frequency and competitor mentions never reach the pipeline record.

**Regional variants**

| Variant | Distinct pain / evidence | LiSN signal card [illustrative] | MH | Distinct residual risk |
|---|---|---|---|---|
| **NA — Edwards ESDs/dealers** | EST4 mapping, programme-file ownership (MD-1, MD-4), migration cost (MD-7), ownership-churn anxiety (MD-8) | "ESD in Ohio Valley: escalation age 2.3× own baseline, 4 competitor mentions (Notifier) in 3 weeks, EST3 parts calls rising; order share flat." · Tags: Edwards · EST3/EST4 · NA-MW · 1 ESD · calls + email + orders · Severity: partner-revenue risk · slope · 60 sites served · Confidence: medium · **P&L:** channel share / spec win rate · Route: Commercial + Service, daily | MH-4, MH-7 | Dealer-held relationships and owner complaints never reach KGS |
| **UK-EU — distributors, BAFE/FIA integrators; EMS, Aritech, Kidde Commercial** | Multi-country documentation, CPR 2024/3110 DoP/CE, golden thread (G); carve-out entity/invoice changes (C.2 #34) | "Invoice/part-number contacts from UK-EU distributors 2.7× since entity cutover; DSO +6 days at top-10 accounts." · Tags: Aritech/EMS · UK, DE, NL · 10 distributors · email + AR · Severity: supply/commercial · cliff · Confidence: high · **P&L:** DSO | MH-5, MH-9 | Multilingual corpus (DE, FR, NL, IT, ES, PL); GDPR and works councils `[not in dossier — counsel to confirm]`; Gloria perimeter (K-11, `[src-unresolved]`) |
| **China — GST** | Kartik's verticals: energy storage, petrochemicals, rail, electronics, data centres (M0.1-1); localisation margin risk vs ideal early-warning case (X split) | "GST detector fault phrasing in energy-storage projects 2.4× the same model's baseline in other verticals; 2 integrators." · Tags: GST · model · China · vertical = BESS · 2 integrators · Severity: major product anomaly · slope · 35 sites · Confidence: low · **P&L:** reference-site protection / vertical growth | MH-15 | Mandarin corpus; China data rules (PIPL, cross-border transfer) `[not in dossier — counsel to confirm]`; GST systems may be separate from NA stack |
| **India / MEA** | Consultant/EPC route; NBC via authorities (G); grey market and independent repairers (0.4, `[2-src]`); GST Experience Centre, Hyderabad (M0.1-8) | "Submittal-rejection language on GST panels clustering in one state authority; 3 EPCs." · Tags: GST · India-state · 3 EPCs · email + Salesforce notes · Severity: spec/compliance friction · slope · Confidence: low · **P&L:** spec win rate / quote-to-order | MH-9, MH-4 | Arabic and Indian-language contacts; channel largely off-system; small volumes make baselines noisy |

**Buying role:** users and influencers; the NA Edwards lead is the likely **pilot-region co-owner** (H.4: one portfolio, one or two regions).
**Objections → response:** "I know my dealers." → "You know the ones you visit; LiSN watches the other 90% every day." · "Will partners think we're spying on them?" → "LiSN reads only interactions partners send to KGS; no customer-facing action without human approval."

**Must be true:** territory and partner master data joinable (partner identity is duplicated across systems, E, `[3-src]`); signals feed QBRs, not replace them.

**Residual risks not addressed (all variants)**
- Cannot see dealer-to-owner conversations or dealer CRM.
- Competition-law caution when analysing distributor pricing or resale behaviour — LiSN must not become a resale-price monitoring tool (§3).
- Cannot fix lead times or allocation.
- Partner "drift" signals are probabilistic; acting on a false one can damage a relationship.

**Lands:** "hold the channel", "regain key accounts before they're lost", "spec pull-through", "territory". **Avoid:** "churn prediction" (retail flavour), "sentiment score for your partners".

---

### P6 · COO / Supply Chain & Order Management — James Booth, COO `[aggregator, single C]`

**Owns:** plants (GST Qinhuangdao; European sites; 7 plants `[src-unresolved]`, M0.3-13), planning (Kinaxis, `[2-src]`), order-to-cash operations, allocation, expedite, substitution.
**KPIs (B):** OTIF, fill rate, lead-time promise accuracy, order-exception rate (**very high**); inventory, overdue backlog; tariffs (`[single C, not verified]`).

**Questions:** *Daily:* what's late, what's expedited? *Weekly:* backlog ageing, allocation. *Event:* supply shock, EOL, quality hold.

**Top pain points**
- ERP knows dates, not customer consequence (MH-8).
- Repeated "where is my order?" contacts can be a leading indicator of ATP/ERP/master-data errors, forecast failure, missing acknowledgements or distributor inventory imbalance (D.3, G PE `[single — preserve]`).
- Separation can disrupt master data and supply planning (B, X).

**Workarounds:** ERP exception reports, OTIF dashboards, customer-service escalations. Fall short: lag KPIs; blind to "substitute / cancel / competitor" language before cancellation.

**How LiSN addresses it:** backorder language by SKU/region/partner against own baseline, joined to line-level promise dates; divergence of contact language from ERP promise-date performance (C.4 #6).
> **Signal card [illustrative]:** "'When will it ship / can I substitute' contacts for Genesis LED notification SKUs 2.6× baseline in NA-West, 11 days before OTIF moved; 3 partners mention a competitor." · **Tags:** Edwards · Genesis LED · SKU family · NA-West · 3 ESDs · order desk + email + ERP · **Severity:** supply-chain risk · slope · open backlog $0.9m `[illustrative]` · **Confidence:** medium · **P&L:** OTIF / backlog conversion · **Route:** Supply chain + Sales, daily · **Maps to:** MH-8, MH-5.

**Buying role:** user; influencer; potential co-sponsor for MH-8.
**Objections → response:** "I have OTIF." → "OTIF tells you an order is late; LiSN tells you which customer is about to walk and why, before cancellation."

**Must be true:** ERP backlog extract joinable to order-desk contacts (order number or PO fill rate).

**Residual risks not addressed**
- Cannot fix component shortages, plant capacity or tariffs.
- Cannot see distributor inventory unless distributors share POS/stock data (Honeywell does, X `[proxy]`; KGS status unknown).
- Order data may sit in multiple ERPs (SAP/Oracle/JDE, `[3-src]`) during separation — joins may be per-region.

**Lands:** "leading indicator of backlog conversion", "before OTIF moves", "premium freight". **Avoid:** "customer journey".

---

### P7 · CIO / Separation-programme lead / Hyderabad digital hub — Nick Tullio, CIO `[2-src C P, aggregator/profile]`; Devin C. Smith (digital strategy, finance & M&A) `[single P, profile]`

**Owns:** standalone applications platform ("stand up an independent digital organisation separate from the former owners", `[single G, src-unresolved]`, 0.5); Salesforce Sales/Service/Marketing/Data Clouds architecture (India hub, `[3-src]`); ERP transformation; TSA exit; data access and security.
**KPIs (B):** TSA exit, app/data migration %, stranded costs, cyber incidents — "temporarily extreme, then falls" (`[4-src]`).

**Questions:** *Weekly PMO:* which cutovers are on track? *Monthly board:* stranded cost, TSA fees. *Event:* after each cutover — "did the business notice?"

**Top pain points**
- Programmes report technical cutover, not business effect (MH-16, P `[single — preserve]`).
- "The ERP programme can be 'green' while dealers experience missing acknowledgements, duplicate accounts, slow quotes, wrong entitlement or new support hand-offs" (G, raw file, panel inference).
- A correlation once obtainable through inherited tooling may temporarily require five manual extracts (E.2, G).
- Carrier-era interaction history at risk as repositories retire (MH-16).

**Workarounds:** hypercare desks, PMO RAID logs, escalation calls. Fall short: no "carve-out" reason code exists (MH-5).

**How LiSN addresses it:** carve-out friction radar by entity, portal, distributor and cutover date; business-outcome validation of each TSA exit; a read-only overlay that preserves signal continuity while systems of record change (G positioning) and never becomes a system of record (E.2 design consequence).
> **Signal card [illustrative]:** "Since the UK-EU order-portal cutover (week 36), 'can't log in / duplicate account / missing acknowledgement' contacts from 14 distributors 2.7× their own baseline; recontact rate +18 pts." · **Tags:** KGS UK entity · portal · UK-EU · 14 distributors · email + portal tickets · since cutover · **Severity:** operational · cliff · 14 distributors, 31% of UK-EU orders `[illustrative]` · **Confidence:** high · **P&L:** DSO / TSA stranded cost · **Route:** CIO + COO, daily · **Maps to:** MH-5, MH-16.

**Buying role:** technical evaluator and **gatekeeper**; the most likely **blocker by bandwidth**, not by disagreement. Could become a champion if LiSN is framed as a TSA-exit validation asset.
**Objections → response:** "No capacity for another integration." → "Offline-first: one-off extracts for Discovery, zero production integration." · "Where does the data go?" → "Nowhere; LiSN deploys in your cloud, your approved models." · "Why not our Salesforce Data Cloud/Einstein?" → "Use it as a source; LiSN adds entity baselines, cross-source joins and evidence lineage that CRM fields lack (F2)."

**Must be true:** extracts possible from systems still under Carrier TSA (contractual permission); deployment in a KGS tenant approved by InfoSec; no dependency on the separation critical path.

**Residual risks not addressed**
- Data access under TSA may be contractually constrained — LiSN cannot negotiate that.
- Cannot reduce CIO bandwidth; can only minimise the ask.
- If KGS's cloud landing zone is itself mid-build, deployment options narrow.
- The Hyderabad hub may prefer to build (Data Cloud + LLM) — a make-vs-buy contest LiSN must win on evidence.

**Lands:** "read-only overlay", "signal continuity through separation", "validate TSA exit by business outcome", "not a system of record". **Avoid:** "replace", "integrate with everything", "platform consolidation".

---

### P8 · CFO / Global CFO Commercial Fire / FP&A — Derek Peabody, CFO `[2-src aggregator/profile]`; Merched Tayoun, Global CFO Commercial Fire `[aggregator, single C]`; Chris Comiskey, VP FP&A `[single P, profile]`; Jorge Alberto, CFO Americas `[aggregator]`

**Owns:** EBITDA, cash conversion, DSO, warranty accrual, vendor spend; finance openings at a 12-month high (0.5, `[aggregator]`).
**KPIs (B):** EBITDA/margin leakage (discounts, expedites, warranty, obsolete stock, credits) — **dominant**; cash/DSO — rising sharply; cost-to-serve — rising as allocated Carrier costs are replaced.

**Questions:** *Monthly:* why did warranty accrual move? What is our standalone cost-to-serve? *Quarterly:* value-creation plan tracking.

**Top pain points**
- Standalone cost base reveals unpriced technical complexity (B cost-to-serve row).
- Leakage is visible only after it posts (credits, freight, warranty).
- PE partner won't accept CX metrics unless they reconcile to margin, cash or growth (B, P).

**Workarounds:** Power BI finance reporting (`[single C]`), ERP GL analysis, accrual models. Fall short: no link from a cost line to its interaction cause.

**How LiSN addresses it:** every signal carries a P&L destination metric; contact-driven cost-to-serve by product/partner/process defect; credits, freight and repeat visits tied to cause (E.1 #7).
> **Signal card [illustrative]:** "Four upstream process causes (entitlement, ship-date, RMA credit, part-number mapping) explain 22% of repeat partner contacts in NA this quarter; linked credits and expedite freight $0.6m." · **Tags:** NA · process cause · partner tier · order desk + RMA + AR · quarter · **Severity:** efficiency · slope · blast radius: NA repeat contacts and $0.6m linked cost `[illustrative]` · incident flag: no · **Confidence:** medium (cost allocation modelled) · **P&L:** cost-to-serve / margin leakage · **Maps to:** MH-6, MH-8.

**Buying role:** economic validator; gatekeeper of the value case; signs vendor spend above threshold.
**Objections → response:** "Show me savings." → "We show decisions changed and exposure touched; savings arithmetic is sensitivity, not a claim (B, G PE)." · "Why a small vendor?" → "Pilot is bounded, offline and in your cloud — risk is capped."

**Must be true:** a value frame using Commercial Fire's ~$1bn, not KGS's ~$2bn (B merge note); pilot success measure includes "did a signal change a decision" (H.4, G).

**Residual risks not addressed**
- LiSN cannot book savings; attribution is contestable.
- Warranty accrual methodology is Finance's; LiSN only informs drivers.
- Budget freezes during separation.

**Lands:** "margin leakage", "cost-to-serve by cause", "working capital", "reconciles to the P&L". **Avoid:** "ROI guaranteed", "CX score", low-price framing (use "cost-efficient at scale").

---

### P9 · PSIRT / Product Security + CLO / Regulatory & Product Compliance — Mike Sprenger, CLO `[aggregator, single C]`; PSIRT lead `[gap]`

**Owns:** PSIRT intake (product, version/firmware, reproduction steps; **48-hour acknowledgement**, `[3-src]`); advisories; EU CRA Art. 14 reporting (**live 11 Sep 2026**: 24h early warning, 72h notification, `[4-src]`); CPSC §15 (24h, `[4-src]`); UL/EN listing compliance; CPR 2024/3110; privacy and contracts.
**KPIs (B):** product-safety / cyber time-to-detection; cyber remediation SLA — "cannot be traded off / rapidly rising".

**Questions:** *Continuous:* are exploitation or safety reports arriving anywhere? *Event:* "When did we first possess reportable information?" *Quarterly:* advisory reach and patch completion.

**Top pain points**
- Awareness can arise in support, forums, partner email or field notes — not only PSIRT (G row CRA; C.2 #35: informal cyber symptoms arrive as ordinary support calls).
- Regulators care when the manufacturer possessed information, not when a CRM category was assigned (G section, P).
- Advisory reach: affected versions seen in calls/telemetry without acknowledgement (MH-17, X).
- Kidde strobe notice (UL 1971/1638) shows listing-related notices exist (0.7, X `[single]`).

**Workarounds:** PSIRT mailbox, CERT coordination, legal hold on request. Fall short: PSIRT tooling sees submitted reports only (MH-3).

**How LiSN addresses it:** a **safety/cyber language watch** across every available channel from day one (H.4, P consensus); first-mention timestamp; firmware/fleet join; routing to PSIRT + Legal immediately with human decision (H.4 routing design); evidence chronology for counsel.
> **Signal card [illustrative]:** "'Panel rebooted after network scan' — 3 support cases, 2 EU countries, EST4 fw 4.x, first mention 09:14 CET; no PSIRT ticket yet." · **Tags:** Edwards · EST4 · fw 4.x · DE, NL · 2 integrators · support cases · **Severity:** cyber-critical candidate · cliff · blast radius: EU installed fw 4.x panels (count from install base) · **incident flag: candidate — not confirmed** · **Confidence:** low (single-channel, 3 reports) · **P&L / exposure:** CRA reporting exposure; metric = time from first mention to PSIRT triage · **Route:** PSIRT + Legal, immediately — **human decision on reportability** · **Maps to:** MH-3, MH-17, MH-2.

**Buying role:** PSIRT = user and potential champion; CLO = **gatekeeper with veto** (privacy, retention, reportability boundary).
**Objections → response:** "A timestamped record of weak evidence creates discoverable liability." → "The information already exists in your systems; LiSN makes it findable and routes it under your privilege, retention and review policy — counsel sets the rules." · "Will it decide what's reportable?" → "Never. It routes evidence; Legal decides (F4 must-not-do)."

**Must be true:** Legal-designed retention, legal-hold and privilege workflow; clear statement that LiSN makes no reportability determination; privacy DPIA for EU data.

**Residual risks not addressed**
- Reportability decisions remain Legal's; LiSN cannot shorten the legal assessment itself.
- Cannot detect exploitation that nobody mentions in any channel.
- Cannot map vulnerability to components without an SBOM/inventory join.
- Discoverability of retained evidence is a legal policy question, not a product one.
- UL 864 edition conflict (K-7) and NFPA 10/25 editions unverified — don't encode rules until verified.

**Lands:** "first credible mention", "awareness clock", "evidence chronology", "human decision", "governed capability inside quality early warning" (H.2 note). **Avoid:** "compliance automation", "auto-report", "we tell you what's reportable", leading with regulation (C/X: de-risking alongside the margin case, not the headline).

**Lens notes:** COMP treats CRA/CPSC timing as escalation even on thin signal; SVC warns contact frequency alone is not a defect finding (G, X). PE sees CRA as a cost line; COMP as board-level risk (G).

---

### P10 · Product Management — Jon Hughes, VP Product Management, Edwards; Wally Ortiz, Global Product Management Director, Kidde Commercial `[single C, trade press]`

**Owns:** roadmap; launches (Edwards Edge, Kidde Commercial Evolve — May 2025, `[2-src]`); EOL and migration (EST3→EST4); compatibility tables; datasheets and listings content.
**KPIs (B):** aftermarket/lifecycle mix; installed-base retention/migration win rate (`[single C]`); launch adoption.

**Questions:** *Monthly:* what are installers asking for? Which gaps block a spec? *Event:* post-launch — "what's confusing people?"; at EOL — "who will migrate and who will defect?"

**Top pain points**
- Roadmaps are supply-side; latent installed-base resistance invisible (MH-7, P).
- Compatibility confusion Kidde ↔ Edwards (MD-5); programme-file ownership (MD-4); $45k migration anecdote (MD-7).
- CRM opportunity created only after sales notices (MH-7).

**Workarounds:** dealer councils, Million Dollar Club/Dealer Summit feedback, sales anecdotes. Fall short: loudest voices, not the base rate.

**How LiSN addresses it:** migration intent and EOL language by site/installer; "replacement for…" and competitor-migration language; post-launch confusion clusters; documentation gaps.
> **Signal card [illustrative]:** "412 EST3 sites whose installers asked about replacement parts in Q2; 38% served by partners showing rising competitor mentions." · **Tags:** Edwards · EST3 · NA · 57 partners · calls + orders · Q2 · **Severity:** growth opportunity / retention risk · slope · 412 sites · **Confidence:** medium · **P&L:** aftermarket revenue / migration win rate · **Maps to:** MH-7, MH-9. (C Demo 2 — hold for v2.)

**Buying role:** user; influencer; v2 growth champion.
**Residual risks not addressed:** cannot price migrations or fund incentives; site identity often sits with the dealer, not KGS; public forum voice is thin and brand-ambiguous (K-8) — never quantify from it.
**Lands:** "gaps and needs" (Kartik's phrase), "migration intent", "installed base". **Avoid:** "feature requests", "roadmap automation".

---

### P11 · Edwards Learning Center / Fire & Security Academy lead `[gap — not named]`

**Owns:** EST4 certification (5 days + eLearning gates materials and ITM courses, 0.4); learning.edwardsfire.com; Bradenton Learning Center; Academy e-learning; contact still **elc@carrier.com** (0.2, `[single C]`).
**KPIs:** certification throughput; seat utilisation; renewal (B training row, stable/high).
**Pains:** June 2026 EST4 classes full (MD-11); LMS reports completions, not whether training reduced faults (MH-11); skills gap on EST4 networking and cyber (MD-9).
**Workaround:** add sessions where waitlists grow (e.g. EST3→EST4 migration course, 11 Aug 2026, `[single C]`).
**LiSN:** training-gap signals by partner/technician/product joined to LMS.
> **Signal card [illustrative]:** "Partners without an EST4-certified technician generate 3.1× commissioning contacts per shipped panel; 18 of them are in Texas and Arizona, where June classes were full." · **Tags:** Edwards · EST4 · US-SW · 18 partners · calls + LMS · **Severity:** efficiency · slope · **Confidence:** medium · **P&L:** cost-to-serve / training throughput · **Maps to:** MH-11, MH-6.

**Buying role:** user. **Residual risks:** cannot add trainers or seats; technician identity rarely captured on calls (needs partner-level proxy); LMS may still sit on Carrier systems (TSA).
**Lands:** "training that reduces repeat calls", "seats where the faults are". **Avoid:** "learner analytics".

---

### P12 · Strategic Accounts lead (Edwards) `[gap — team evidenced (0.4, G), lead not named]`

**Owns:** multi-site owners and national accounts; replacement, inspection, service/maintenance and lifecycle modernisation (G, B aftermarket row); coordination through channel partners.
**KPIs:** service-contract attach and renewal; modernisation pipeline; account retention.
**Pains:** national accounts want standardisation, fleet visibility, audit evidence, cyber assurance (A.4); owner complaints arrive via several dealers and escalate to insurer/AHJ (C.2 #28); nuisance alarms by model (MH-10).
**LiSN:** account-level signal roll-up across dealers and sites.
> **Signal card [illustrative]:** "National retail account: nuisance-alarm complaints from 3 sites via 2 different dealers on the same detector model; one mention of the insurer." · **Tags:** Kidde Commercial · detector model · NA · 3 sites · 2 dealers · calls + email · **Severity:** partner-revenue risk · slope · 3 of 140 sites · **Confidence:** low–medium · **P&L:** service-contract renewal / aftermarket revenue · **Maps to:** MH-4, MH-10, MH-7.

**Buying role:** user; influencer. **Residual risks:** owner identity across dealers is hard to resolve (D.2 "fragmented identity"); nuisance causes are often environmental or installation, not product — LiSN presents candidates only; much nuisance never reaches KGS (C.2 #25).
**Lands:** "one view of the account across dealers". **Avoid:** "customer 360".

---

### P13 · Connected Services / digital product owner (ConnectedSafety+, KESMobile, GST cloud) `[gap — owner not named]`

**Owns:** ConnectedSafety+ (Manager+, FloorPlan+, Inspection+, TechSupport+); KESMobile; Kartik's personal digital theme (M0.1-4, `[2-src]`).
**KPIs (B):** connected-service adoption, activation, renewal — rising.
**Pains:** connected services cover only enrolled sites; older or rival-maintained sites may generate the most pain and no telemetry (F1, P); alert fatigue erases digital value (C.2 #30); users still call for tasks the product should remove (MH-14, G `[single — preserve]`).
**LiSN:** the human layer beside the machine layer — "telemetry says what the panel did; interactions say what the humans think is wrong" (F3, C).
> **Signal card [illustrative]:** "'TechSupport+ session won't connect' contacts 2.2× baseline after the gateway firmware update; 70% from sites onboarded in the last 90 days." · **Tags:** ConnectedSafety+ · gateway fw · NA · 23 dealers · calls + app tickets · **Severity:** adoption risk · cliff · blast radius: recently onboarded sites across 23 dealers `[illustrative]` · incident flag: no · **Confidence:** medium · **P&L:** connected-service activation/renewal · **Maps to:** MH-14, MH-3.

**Buying role:** potential champion **or territorial blocker** ("our platform already does analytics"). Frame LiSN as making ConnectedSafety+ the hero (I.1 pillar 6).
**Residual risks:** telemetry join depends on device-ID ↔ case mapping (E, `[4-src]`); LiSN does not ingest telemetry in pilot phase (H.4 "add later"); roadmap overlap perception.
**Lands:** "complementary", "the human layer", "makes ConnectedSafety+ smarter". **Avoid:** "competes with", "replaces your analytics".

---

### P14 · CISO / InfoSec `[gap — not named]`

**Owns:** vendor security review; cloud deployment approval; identity and access.
**Pains / questions:** a small non-US vendor with **no SOC 2 / ISO 27001** (brief); model provenance; data residency; access to recordings.
**LiSN position:** deploys in KGS's own cloud/on-prem; data never leaves; KGS-approved models; role-based access; full audit log; read-only (brief).
**Buying role:** **gatekeeper / potential blocker.**
**Objection → response:** "No SOC 2, no deal." → "SOC 2 attests to a vendor-hosted service; LiSN runs inside your controls. We will complete your questionnaire, provide architecture, SBOM and pen-test evidence for the deployable, and support your own assessment." `[inference — YaaraLabs must confirm what evidence it can actually supply]`
**Residual risks:** some InfoSec policies require SOC 2 regardless of deployment model; YaaraLabs support staff access paths (remote support) still need controls; open-source/model supply-chain questions; this is a process risk LiSN cannot argue away.
**Lands:** "inside your perimeter", "your models", "least privilege", "no egress". **Avoid:** "certifications don't apply" as a flat assertion.

---

### P15 · Lone Star operating partner / KGS board (external but decisive) — Chairman Daniel Ajamian `[aggregator]`; operating partner `[gap — not named]`

**Owns:** value-creation plan; EBITDA, cash, standalone controls, TSA exit, exit narrative (A.4, P `[single — preserve]`).
**KPIs (B):** EBITDA; cash conversion; TSA exit; stranded cost; growth for exit multiple.
**Questions:** *Monthly/board:* is the carve-out on track? Where is leakage? *Event:* "What would a buyer diligence find?"
**Pains:** a carve-out can fail even while sales grow (B, X); peer analogues — APi–Chubb 17-country migration; HVAC carve-out avoided >$750k/month stranded costs (X `[proxy]`).
**LiSN:** a durable standalone data asset — "PE partner would fund this first where it reduces warranty, expedites and contact/field cost while creating a durable standalone data asset" (X, raw file); exit-narrative evidence of quality and channel control.
> **Readout [illustrative]:** "Pilot quarter: 7 signals routed; 4 changed a decision (1 engineering containment, 2 partner interventions, 1 knowledge fix); exposure touched $2.3m; median first-mention-to-owner time 6 days → 1 day." · **P&L:** EBITDA / cash · **Maps to:** MH-1, MH-5, MH-6.

**Buying role:** decisive influencer; can accelerate or deprioritise any spend.
**Objection → response:** "Distraction during separation." → "Offline, bounded, in your cloud; measured by decisions changed, not dashboards."
**Residual risks:** portfolio-company vendor policies (preferred suppliers, related-party screening); operating partners may prefer established vendors; exit timing may shorten payback horizon.
**Lands:** "leakage", "standalone data asset", "exit narrative", "decisions changed". **Avoid:** "CX transformation", NPS-first framing.

---

## 3. External stakeholder cards — voice sources and beneficiaries

### 3.0 Listening to external voices: privacy, consent and competition law (applies to all cards)

`[not in dossier — counsel to confirm]` No engine researched this. Panel (COMP) view, to be validated by KGS Legal and local counsel before any Discovery extract:

| Topic | Consideration | LiSN design response |
|---|---|---|
| **Call-recording consent (US)** | Several US states require all-party consent to record calls (e.g. California, Florida — KGS HQ and Edwards Bradenton are in Florida; Illinois). Existing KGS recordings are lawful only for the purposes disclosed at capture | Use only recordings KGS already holds lawfully; confirm the IVR notice covers "quality and product improvement" analysis; no new recording by LiSN |
| **GDPR / UK GDPR** | Partner technicians and owners are data subjects; lawful basis likely legitimate interests (product safety, quality) with a documented LIA and DPIA; data minimisation; retention; data-subject rights | Deploy in KGS EU tenant; pseudonymise personal identifiers at ingestion where the signal does not need them; purpose limitation to product, partner and process signals |
| **EU works councils / employee reps** | Analysing KGS agents' calls can be "technical monitoring of employees" (e.g. Germany's co-determination rules) — consultation may be mandatory before deployment | Exclude agent-performance analytics; pseudonymise agent IDs; document that LiSN is not a QA/performance tool |
| **China PIPL / India DPDP Act 2023** | Personal data processing and cross-border transfer rules | Keep GST China data in-country; no cross-border model calls; India deployment in KGS India tenant |
| **Partner data** | Distributor agreements may restrict use of partner-supplied data (POS, inventory, pricing) | Use only interactions partners send to KGS; confirm contract terms before joining partner-supplied data |
| **Competition law** | Analysing distributor resale prices or margin complaints can drift into resale-price monitoring or facilitate information exchange between competing distributors (EU Art. 101 / VBER hardcore RPM; US state and federal law) | Exclude resale-price analytics; report pricing friction on KGS's own quotes/net prices only; never surface one distributor's pricing to another; Legal reviews channel-signal taxonomy |
| **Public web (forums, reviews)** | Terms of service; identity matching (E: "avoid unjustified identity matching") | Aggregate only; no re-identification of forum users; corroboration signal, never sole evidence |

---

### E1 · Installer / programmer / commissioning & service technician
- **Why they contact KGS:** C.2 #1 programming/commissioning; #2 trouble codes; #3 loop mapping; #4 compatibility; #5 firmware/licences/MyEddie access; #13 DOA; #17 training; #35 informal cyber symptoms.
- **Pains (evidence):** "EST4 loop won't map, seemingly nothing wrong" (MD-1); "mapping issue when going from EST2 to EST4" (MD-3); intermittent ground faults vanish before arrival (MD-6); EST4 is many technicians' first TCP/IPv6 cyber-enabled panel (MD-9); classes full (MD-11); three repositories disagree — "the dangerous failure mode is not 'support took six minutes too long'" (D.2, G). *Quotes are facts; representativeness is inference (K-8).*
- **Needs:** one authoritative answer across version, panel, peripheral, firmware, application and listing; first-time-right commissioning; EST4 diagnostics as good as EST3's (D.3).
- **How LiSN helps indirectly:** when KGS acts — a known-issue bulletin sooner, a corrected compatibility table, a firmware fix, extra certification seats where faults cluster, fewer repeat calls because the upstream cause was removed.
- **What LiSN cannot do:** answer their call, programme their panel, recover a missing programme file (MD-4), or shorten a class waitlist.
- **Privacy:** personal names/phone numbers in recordings; NICET IDs; pseudonymise; all-party consent states.

### E2 · Edwards Strategic Partner / ESD / dealer (NA)
- **Why they contact:** #7 order status/backorder; #9 quotes and submittals; #11 warranty/RMA; #12 RMA evidence requests; #15 legacy/EOL parts; #31 account management; #34 carve-out friction.
- **Pains:** margin, protected territory, lead times, escalation, training seats, backward compatibility, low RMA friction (A.4, `[4-src]`); ownership-churn anxiety — "EST just can't stay a part of one company for too long before getting pawned off" (MD-8); must restate context across queues (D.3).
- **Needs:** predictable availability; fewer order chases; clean part numbers, invoicing and portals through the carve-out; one interaction history (D.3).
- **LiSN helps indirectly:** faster fixes to portal/invoice friction after cutovers; earlier supply communication; KGS executive intervention before a relationship breaks; migration support targeted to their EST3 sites.
- **Cannot do:** give them allocation, change pricing, or see their own CRM/owner relationships.
- **Privacy/competition:** partner-sent data only; no resale-price analytics; contractual data-use terms.

### E3 · Distributor / integrator (UK-EU, MEA, APAC, India, China)
- **Why they contact:** #7, #8 (allocation notices), #9, #19 (DoP/CE, certificates), #31, #34.
- **Pains:** CPR 2024/3110 documentation, EN 54 certificates, multi-country paperwork (G); carve-out entity changes (C.2 #34); India grey market and independent repairers (0.4); MEA consultant-driven approvals `[inference]`.
- **Needs:** correct documents in their language; stable part numbers; dependable lead times.
- **LiSN helps indirectly:** document gaps fixed by jurisdiction; entity cutover problems found in days, not quarters.
- **Cannot do:** translate or localise documents; see sub-distributor or installer interactions they don't forward.
- **Privacy/competition:** GDPR, PIPL, DPDP; multilingual processing in-region; strict exclusion of competitor-distributor price comparisons.

### E4 · Consulting engineer / specifier / fire engineer
- **Why they contact:** #9 application support/submittals; #19 datasheets, listings, battery calcs, UL 268 7th status; #32 specification education/CPD.
- **Pains:** need trustworthy listing, certificate and submittal evidence with revision provenance; rapid compatibility exceptions; **"an incorrect confident answer is worse than none"** (D.3, G compliance adviser `[single — preserve]`).
- **LiSN helps indirectly:** clusters of repeated certificate/listing requests trigger corrected or clearer documentation; spec-team attention to where approvals fail.
- **Cannot do:** answer spec questions; LiSN must never become an LLM front end giving listing answers without controlled retrieval and human approval.
- **Privacy:** professional contact data; low sensitivity; low volume, very high value — every contact matters.

### E5 · AHJ / fire marshal / building control
- **Why (indirect):** #19 documentation at acceptance; #20 listing changes; #27 test/impairment notices (X `[single — preserve]`).
- **Pains:** listings, compliant design, documented testing, compatibility evidence (A.4). Veto without buying (G: "do not put the AHJ on the commercial scale").
- **LiSN helps indirectly:** documentation/AHJ rejection language clustering by certificate, configuration or jurisdiction (C.4 #9) → KGS fixes documents before more rejections.
- **Cannot do:** interpret local code; engage AHJs; India NBC rules need Indian counsel before encoding (G).
- **Privacy:** public officials named in dealer emails — minimise; no profiling of individual inspectors.

### E6 · Building owner / FM / EHS / UK Responsible Person
- **Why:** mostly via dealer — #25 nuisance alarms; #28 general complaint; #29 connected services; #15 migration.
- **Pains:** fewer nuisance alarms, uptime, confidence that "green on dashboard" means auditable and maintainable, transparent lifecycle cost and phased migration, programme ownership/escrow (D.3); golden thread for Responsible Persons (G, BSA 2022).
- **LiSN helps indirectly:** product-family nuisance patterns found earlier; migration offers based on real intent; programme-file ownership pain made visible to KGS policy (MD-4).
- **Cannot do:** reach owners who talk only to their dealer (channel opacity); fix site environment causes.
- **Privacy:** owner/site data is commercial; occupant data out of scope.

### E7 · National / multi-site account
- **Why:** #33 service contracts/ITM/lifecycle; #28 escalations; #29 connected services.
- **Pains:** standardisation, fleet visibility, common reporting, audit evidence, cyber assurance (A.4).
- **LiSN helps indirectly:** Strategic Accounts sees cross-dealer patterns for the account before the renewal conversation.
- **Cannot do:** replace fleet reporting (ConnectedSafety+); resolve cross-dealer identity without a site master.
- **Privacy:** contractual confidentiality clauses in national-account agreements may restrict analytic use — check.

### E8 · ITM firm (inspection, testing, maintenance)
- **Why:** #15 spares, EOL, approved substitutes; #27 test/impairment notices; #2 troubleshooting.
- **Pains:** parts, legacy support, test functions, device history (A.4); recurring evidence about device health "long before procurement teams do" (G raw file, panel inference).
- **LiSN helps indirectly:** legacy-part demand and repeated deficiency language inform last-buy and migration decisions.
- **Cannot do:** see inspection PDFs held in their FSM systems (E).
- **Privacy:** technician data; partner-sent only.

### E9 · Monitoring centre / BMS / security OEM
- **Why:** #25 nuisance/false alarms (dispatch outcomes); integration support; #27 test notices.
- **Pains:** reliable signal transmission, clear event semantics, stable interfaces, cyber-safe updates (A.4, P X).
- **LiSN helps indirectly:** interoperability complaints after firmware releases surface as a cohort (C.4 #8).
- **Cannot do:** see alarm-receiving-centre logs; judge false-dispatch causation.
- **Privacy:** event data may include premises addresses — minimise.

### E10 · Insurer / risk engineer (e.g. FM Global)
- **Why:** rarely contacts KGS directly; appears in owner escalations (#28) and approvals.
- **Pains:** resilience beyond code; testing evidence (A.4); mission-critical sites want early detection without false alarms (D.3, X `[marketing-grade]`).
- **LiSN helps indirectly:** fewer escalations reaching insurers; stronger quality evidence for reference sites in Kartik's verticals.
- **Cannot do:** anything insurer-facing; any insurer mention is a severity cue, not a relationship.
- **Privacy:** low.

### E11 · Cyber researcher / CERT / CSIRT
- **Why:** #21 vulnerability report (PSIRT, encrypted option); #35 symptoms reported informally as support calls.
- **Pains:** disclosure route, acknowledgement, coordinated remediation (A.4); KGS promises 48h acknowledgement.
- **LiSN helps indirectly:** informal reports are spotted outside the PSIRT inbox and routed to PSIRT with a timestamp — the researcher gets a faster, coherent response.
- **Cannot do:** triage, reproduce or disclose; coordinated disclosure remains PSIRT's.
- **Privacy:** researcher identities and exploit details are sensitive — restricted RBAC on cyber-flagged evidence.

### E12 · Occupant / resident
- **Why:** almost never contacts Commercial Fire directly; voice arrives via owners, dealers and public reviews (#25).
- **Pains:** alarms that work without nuisance; clear guidance (A.4).
- **LiSN helps indirectly:** nuisance patterns by model reach Product sooner (MH-10) — fewer disruptive evacuations and less risk that systems are disabled (C.2 #25).
- **Cannot do:** communicate with occupants; see building-level alarm events.
- **Privacy:** out of scope by design.

### E13 · Residential consumer (adjacency — not Kartik's P&L)
- **Why:** #36 chirps, false alarms, battery/EOL, interconnect, app, warranty, date codes, recall eligibility; #23 recall scope checks.
- **Pains:** proxies only — Nov 2017 extinguisher recall (~37.8m US units; 391 reports, 16 injuries, one death); Mar 2018 (~452k alarms, yellow cap); May 2021 TruSense (~226k) (0.7, `[proxy]`).
- **LiSN helps indirectly (future scope, MH-12):** hazard language by model/date code; recall-surge triage — for President Residential, not this pitch.
- **Cannot do:** make CPSC determinations; must never be used to imply a Commercial Fire defect (brief rule 8).
- **Privacy:** consumer PII at high volume; CCPA/state privacy laws; retailer review terms `[not in dossier]`.

---

## 4. Buying committee & sequencing

### 4.1 Committee

| Role | Who (evidence grade) | What they decide | What they need to see |
|---|---|---|---|
| **Executive sponsor** | Kartik Kumar `[4-src]` | Whether to open the door and nominate an owner | A one-page brief without banking residue; one credible signal; a clean arm's-length process |
| **Business owner / economic buyer (operational)** | VP Customer Service & Tech Support `[gap]` — or Quality lead if MH-1 is the pilot | Pilot scope, success criteria, budget | Discovery design on their data; repeat-contact and early-warning outcomes they can own |
| **Hero-use-case evaluators** | VP Engineering (Paul Schatz `[aggregator]`), Quality lead `[gap]`, Product Management (Hughes, Ortiz `[single C]`) | Is the signal real and earlier? | Blind retrospective back-test on a known historical issue; excerpts; counter-evidence |
| **Technical evaluator / gatekeeper** | CIO Nick Tullio `[aggregator]`; Hyderabad digital hub; Global Director Systems (Frank Busse `[aggregator]`) | Data access, deployment, TSA constraints | One-off extracts; no production integration; no critical-path dependency; deploy in KGS tenant |
| **Security gatekeeper — can block** | CISO/InfoSec `[gap]` | Vendor approval | Architecture, data-flow, model provenance, access model; response to "no SOC 2/ISO" |
| **Legal / privacy gatekeeper — can block** | CLO Mike Sprenger `[aggregator]`; privacy counsel; EU works-council process via CHRO (Randy Michel `[aggregator]`) | Lawful basis, retention, reportability boundary, related-party approval | DPIA support; no reportability decisions by LiSN; competition-law guardrails; conflict disclosure |
| **Procurement — can delay** | `[gap]` | Supplier onboarding, MSA, related-party screen | Company documents, insurance, standard terms, disclosed relationship |
| **Value validator** | CFO Derek Peabody / Global CFO CF Merched Tayoun `[aggregator]` / FP&A | Spend approval; value case | Reconciles to warranty, cost-to-serve, DSO — Commercial Fire ~$1bn frame |
| **Decisive external influencer** | Lone Star operating partner `[gap]`; board | Priority during separation | Bounded risk; decisions changed; standalone data asset |
| **Potential blockers by position** | Connected-services owner (territorial); Hyderabad hub (build preference); incumbent vendors (Salesforce/Einstein, Medallia) | — | LiSN as complement, not competitor |

**Four-lens view on who can block:** PE — the CFO/operating partner kill anything not tied to EBITDA or cash. SVC — the missing VP Service is the biggest gap; without a native owner the pilot is orphaned. ARCH — the CIO decides whether the join is feasible at all. COMP — Legal can stop listening to EU voice data outright. **Not averaged: all four are real, and they sequence differently (below).**

### 4.2 Recommended engagement sequence (after Kartik)

| Step | Who | Purpose | Exit criterion |
|---|---|---|---|
| 0 | **Kartik** | Written disclosure of the relationship; agree he sponsors but does not evaluate; ask him to name the business owner and answer I.4 Q1, Q2, Q5 | Owner named; evaluation owner is not Kartik |
| 1 | **Named owner (VP Service & Tech Support or Quality)** + **VP Engineering** | Frame the question (quality early warning vs repeat-contact cost); agree success measures *before* seeing data (H.4: time-to-recognition, false-positive rate, decision changed) | Written Discovery charter and scoring rubric owned by KGS |
| 2 (parallel) | **CIO / Hyderabad hub + CISO** and **CLO / privacy + Procurement** | Clear the gates early: extract feasibility under TSA; deployment in KGS tenant; InfoSec questionnaire; DPIA scope; related-party approval; competition-law guardrails | Signed NDA; data-access approval for one region/portfolio; InfoSec conditional approval |
| 3 | **Evaluators (Engineering, Quality, Product Management)** | Blind retrospective back-test: KGS selects a historical period containing an issue known to them but withheld from YaaraLabs; LiSN runs offline; KGS scores | Scored readout by KGS evaluators, not by YaaraLabs or Kartik |
| 4 | **CFO / Global CFO CF / FP&A** | Reconcile findings to warranty accrual, cost-to-serve, DSO | Value frame accepted as sensitivity, not savings |
| 5 | **Regional GM NA Edwards, COO** | Extend to channel and backorder signals in the pilot region | Pilot region and cadence agreed |
| 6 | **Lone Star operating partner** (via Kartik and CFO) | Readout on decisions changed and exposure touched | Always-on engine decision, commercial terms via Procurement |
| Later | UK-EU, China/GST, India/MEA leads; Connected services; Residential | Expansion, multilingual scope, telemetry join, adjacency | — |

**Why gates in step 2, not last:** SVC and ARCH agree late gate discovery is the most common way a promising pilot dies; PE adds that the CIO's separation calendar will not move for a vendor, so the ask must be sized to fit it on day one.

### 4.3 Making the evaluation arm's-length and credible (relationship risk)

**The risk:** Kartik is Ranjith's relative. Even a meritorious evaluation can look like favouritism to KGS colleagues, Legal, Procurement and Lone Star — and the reputational cost falls on Kartik, not only on the deal. Most corporate codes of conduct, and PE portfolio policies, require disclosure of related-party vendor relationships `[inference — confirm KGS policy]`.

**Protocol**
1. **Disclose first, in writing** — Ranjith to Kartik, and Kartik to his compliance/Legal contact, before any KGS data is shared. Put the relationship on the table at the first meeting with the owner.
2. **Sponsor, not judge** — Kartik opens the door and nominates the owner; he does not set success criteria, score the back-test, negotiate commercials or approve the purchase. The economic decision sits with the owner and CFO/Procurement.
3. **Criteria before data** — the owner and evaluators write the scoring rubric (H.4 success measures) before YaaraLabs sees any data.
4. **Blind retrospective test** — KGS chooses a past period with a known outcome it withholds; LiSN must find it (or not) offline. KGS evaluators score; results are shared as-is, including misses.
5. **Standard process** — full InfoSec, Legal, Procurement review; no fast-tracking; standard or KGS paper; pilot fee (or no fee) set on the same basis YaaraLabs would offer any prospect.
6. **Single channel** — all working communication goes through the named owner; family conversations stay off the project.
7. **Walk-away clause** — if the test does not beat existing reporting on time-to-recognition, YaaraLabs says so and stops.
8. **Truthful credentials** — YaaraLabs' HDFC Bank, Visa and Société Générale logos are AI Fluency programme references, not LiSN deployments; LiSN's current pursuits are retail/e-commerce pilots that are not yet referenceable. Say exactly that. `[YaaraLabs context, not in dossier — Ranjith to confirm the exact credential wording]`

---

## 5. Residual risk register — what remains even if LiSN works

Likelihood / impact: H / M / L.

| # | Risk | Category | L | I | Owner | Mitigation LiSN / YaaraLabs can offer | What stays open |
|---|---|---|---|---|---|---|---|
| R1 | **Data access during TSA** — cases, RMAs, orders may sit on Carrier-run systems with contractual limits on extraction | Data & integration | H | H | CIO / Legal | Offline one-off extracts; ask I.4 Q1 first; start with systems KGS already owns | TSA terms; Carrier cooperation |
| R2 | **Missing model/serial/firmware fields in cases** — batch attribution unreliable from free text (C.4 caveat) | Data & integration | H | H | VP Service / Quality | Discovery measures field fill-rate first; extraction from text with confidence; fall back to family-level cohorts | Upstream case-capture discipline — KGS process change |
| R3 | **Call recordings absent, partial or not transcribed** | Data & integration | M | H | VP Service / CIO | Start with case notes, email, RMA narratives; transcribe in KGS tenant if recordings exist | Voice coverage depends on KGS telephony (vendor not identified, 0.6) |
| R4 | **Multilingual corpus** — Mandarin (GST), Arabic (MEA), European languages (UK-EU), Indian languages | Product scope | H | M | YaaraLabs | Pilot in NA English; language-specific taxonomies and baselines (F4 consensus) validated before expansion | Model quality per language; local reviewers needed |
| R5 | **Dealer-held interactions invisible** — owners talk to dealers; programme files and site history sit with partners (D.2 channel opacity, MD-4) | Product scope | H | M | Channel / Sales | Treat partner-sent traffic as proxy; corroborate with RMA and orders | Most owner voice never reaches KGS |
| R6 | **False-positive executive alerts** erode trust (SVC: executives reject 300 weak signals a week, F2) | Product scope | M | H | YaaraLabs + owner | Recall broad, rank severe; confidence, source independence, counter-evidence on every signal; watchlist tier; FP rate is a pilot metric (H.4) | Tuning takes cycles; one bad alert to Kartik can end the pilot |
| R7 | **Reportability decisions must remain Legal's** — any perception that LiSN "decides" is disqualifying (F4, H.2 note) | Regulatory & legal | M | H | CLO | Route with human gate; no reportability language in product; audit log | Legal assessment speed is outside LiSN |
| R8 | **Discoverability of retained weak-evidence timestamps** | Regulatory & legal | M | H | CLO | Counsel-designed retention, privilege and review workflow | Policy choice for KGS Legal |
| R9 | **Privacy/consent in EU and US all-party-consent states; works councils** `[not in dossier]` | Regulatory & legal | M | H | CLO / CHRO | DPIA support; pseudonymisation; purpose limitation; no agent QA | Consultation timelines in EU; lawful-basis decision is KGS's |
| R10 | **Competition law on channel data** — resale-price monitoring or distributor information exchange `[not in dossier]` | Regulatory & legal | L | H | CLO | Exclude resale-price analytics; KGS-own-price friction only; Legal-reviewed taxonomy | Misuse by users outside the design |
| R11 | **InfoSec without SOC 2 / ISO 27001** | Commercial & pilot | H | H | CISO / YaaraLabs | In-tenant deployment; architecture pack; questionnaire; pen-test/SBOM of deployable `[confirm availability]` | Policies that require SOC 2 regardless |
| R12 | **CIO bandwidth during separation** | Organisational | H | H | CIO | Minimal ask; no production integration; fit to separation calendar | Priority is KGS's call |
| R13 | **No native owner** — VP Service & Tech Support not identified; pilot orphaned without one | Organisational | M | H | Kartik | Ask Kartik to name owner at step 0 | Owner's appetite and capacity |
| R14 | **Incumbent counter-pitch** — Salesforce Service Cloud/Einstein/Data Cloud (India hub building it), Medallia/Qualtrics, CallMiner/NICE | Competitive | M | M | YaaraLabs | The competitive test (F2, G): continuous cross-source correlation, entity baselines, evidence packet; position Salesforce as a source | Hyderabad "build" preference; bundled pricing |
| R15 | **JCI OpenBlue OBI agentic-AI narrative** (Aug 2026, `[single G]` `[src-unresolved]`) sets board expectations for "agentic" | Competitive | M | M | YaaraLabs | Human-gated by design is a feature in life safety (F4); contrast telemetry-agents vs human-voice signals | Narrative pressure on KGS's own digital roadmap |
| R16 | **Scale mismatch** — LiSN marketed at 300K/day; KGS Commercial Fire ~0.8k–3.5k/day (C.1). Risk of looking over-engineered or over-priced; sparse data makes per-entity baselines noisy | Product scope / commercial | H | M | YaaraLabs | Retire "300K daily"; right-size deployment ("cost-efficient at scale" means sized to KGS, not to banks); hierarchical/pooled baselines for small entities; lead with "count of three" | Statistical power for small distributors and rare symptoms remains limited |
| R17 | **Small Indian vendor credibility with a US PE-owned company** | Commercial & pilot | H | M | YaaraLabs | Arm's-length process; bounded offline pilot; US SI channel-partner route as an option (YaaraLabs context, not in dossier — individual not named here per the naming rule; Ranjith to decide whether to use) | No fire/industrial LiSN reference yet |
| R18 | **Perimeter uncertainty** — Gloria sale (K-11), suppression/special hazards (K-10), extinguishers Commercial vs Residential (0.4) | Commercial & pilot | M | M | YaaraLabs | Don't name Gloria or suppression until confirmed (I.4 Q11) | Legal-entity facts sit with KGS |
| R19 | **`[src-unresolved]` facts in pitch material** — >1.5m buildings, 18 facilities, Hyderabad "independent digital organisation" ad, GP01 UL 864 | Commercial & pilot | M | H | YaaraLabs | Re-source or remove before any client document | Some may never re-source |
| R20 | **Relationship / perceived conflict** | Relationship | H | H | Ranjith / Kartik | §4.3 protocol | Perception among KGS peers and Lone Star |
| R21 | **Implying a current KGS defect** in demo figures | Regulatory & legal / relationship | M | H | YaaraLabs | `[illustrative]` on every figure; residential recalls as proxy only | Reader inference |
| R22 | **Poor entity resolution creates false cohorts** (X architect) — partner identity duplicated across systems (E) | Data & integration | M | H | YaaraLabs + CIO | Entity-resolution confidence shown; human review of cohorts | Master-data quality is KGS's |
| R23 | **Alert fatigue / signals without owners** — signals decay into another report | Organisational | M | H | Owner | Routing table (H.4) with named owners and cadence; "did it change a decision" metric | Management follow-through |
| R24 | **Change management and agent fear of monitoring** | Organisational | M | M | VP Service / CHRO | Exclude agent QA; communicate purpose | Culture |
| R25 | **LiSN cannot fix what it finds** — supply shortages, design changes, pricing, training capacity | Product scope | H | M | Respective owners | Route with evidence and P&L metric so fixes are funded | Execution is KGS's |
| R26 | **Value attribution contested** — CFO/PE discount soft savings | Commercial & pilot | M | M | CFO | Measure decisions changed, time-to-recognition, exposure touched — not claimed savings | Counterfactual is unprovable |
| R27 | **Telemetry join deferred** — ConnectedSafety+ device IDs not mapped to cases (E) | Data & integration | M | M | Connected-services owner | "Add later" (H.4); design entity graph to accept it | Territorial overlap perception |
| R28 | **Outsourced/third-party support data** — outsourced centres (residential evidence, `[single X]`) and SIs hold data under their contracts | Data & integration | L | M | VP Service / Procurement | Confirm data ownership clauses | Third-party cooperation |
| R29 | **Demo/product maturity** — LiSN's retail build had a severity model coded but not rendered (project history — YaaraLabs context, not in dossier; Ranjith to confirm) | Product scope | M | H | YaaraLabs | Render severity class, cliff/slope, blast radius, incident flag and confidence on the KGS demo (brief rule 3) | Engineering capacity before v2 |
| R30 | **Unverified regulatory specifics** — UL 864 edition (K-7), NFPA 10/25, India NBC/BIS editions | Regulatory & legal | M | M | YaaraLabs / CLO | Avoid encoding or quoting until verified | Verification effort |

---

## 6. Persona → message matrix

| Persona | Their one-line pain | LiSN one-line answer | Proof point to show | Demo tile that speaks to them |
|---|---|---|---|---|
| **President GCF (Kartik)** | "I hear about field and channel problems when they hit EBITDA." | "The handful of product, partner and carve-out signals that matter this week, each traced to the calls behind it and owned by a named executive." | Blind back-test result on a known historical issue; "count of three" (C.1) | Hero signal + signal map (brand × platform × region) |
| **VP Engineering** | "Symptoms reach us late and without firmware or serial." | "New fault phrasing across unrelated partners, joined to model, firmware and RMA — candidate causes, you decide root cause." | Retrospective detection lead time vs existing escalation | Firmware/batch breakdown + verbatim snippets + counter-evidence line |
| **Quality lead** | "Aggregate RMA rate looks fine while a serial range goes bad." | "Serial-range concentration and DOA narratives against each family's own baseline, with first-mention timestamp." | Contact ↔ RMA timeline on historical data | Contact ↔ RMA timeline + installed-base denominator |
| **VP Service & Tech Support** | "I sample calls; repeat how-to and upstream defects stay hidden." | "100% of contacts, multi-label, repeat clusters traced to the upstream cause." | Repeat-contact cluster with cost-to-serve tag | Top-5 emerging signals (volume, emotion, impact) with owner routing |
| **Regional GM / VP Sales (NA)** | "Partner risk shows up at the lost bid." | "Partner drift flagged weeks early — escalations, competitor mentions and backorder chases against that partner's own baseline." | Kartik's regained-key-accounts playbook (M0.1-11) as the frame | Affected partners tile |
| **Regional GM UK-EU / China / India-MEA** | "Global dashboards average away my region." | "Region-, brand- and language-specific baselines under one global model." | Carve-out friction example (UK-EU); China vertical anomaly (MH-15) | Carve-out friction radar (UK-EU) · vertical split (China) |
| **COO / Supply chain** | "OTIF tells me an order is late, not who will walk." | "Backorder and substitution language by SKU and partner before OTIF moves." | Contact-language vs promise-date divergence (C.4 #6) | Backorder signal with open-backlog $ `[illustrative]` |
| **CIO / separation lead** | "Cutover is green; the business effect is invisible." | "Read-only overlay that validates each TSA exit by business outcome and keeps signal continuity through separation." | Offline extract plan; zero production integration | Carve-out friction radar by entity/portal/cutover date |
| **CFO / FP&A** | "Leakage posts after the fact; CX metrics don't reconcile." | "Every signal carries its P&L destination — warranty, cost-to-serve, DSO." | Sensitivity arithmetic on $1bn (B), labelled as sensitivity | P&L metric tag + exposure on each signal |
| **PSIRT / CLO** | "Awareness can start outside the PSIRT inbox; the clock may already be running." | "Safety/cyber language watch across every channel from day one, timestamped and routed — Legal decides." | CRA Art. 14 live 11 Sep 2026; CPSC 24h | Safety/cyber language watch tile — "routed to PSIRT — human decision" |
| **Product Management** | "Roadmaps are supply-side; migration intent is invisible." | "Migration intent and gaps-and-needs language by site and installer." | EST3 order halt (31 Dec 2023) + migration demand | Migration & channel health (v2 tile, shown as teaser) |
| **Learning Center / Academy** | "Completions don't tell me if training reduced faults." | "Repeat commissioning contacts by partner certification status." | June 2026 EST4 classes full (MD-11) | Partner tile filtered by certification |
| **Strategic Accounts** | "Owner complaints arrive through several dealers." | "One account-level view across dealers and sites." | Cross-dealer cluster example `[illustrative]` | Affected partners + site roll-up |
| **Connected Services owner** | "Telemetry shows what panels do, not why users struggle." | "The human layer beside ConnectedSafety+ — makes your platform the hero." | F3 convergent insight (no peer analyses human voice) | Signal map with "connected / not connected" split |
| **CISO / InfoSec** | "Unknown vendor, no SOC 2." | "Runs inside your perimeter, your models, no egress, full audit log." | Architecture and data-flow diagram | Evidence-trace drawer (audit log, RBAC) |
| **Lone Star operating partner** | "Will this distract the carve-out or add value?" | "Bounded, offline, in your cloud; measured by decisions changed and exposure touched." | Pilot scorecard: decisions changed (H.4, G) | Weekly executive digest with decision log |

---

*Open items to carry into Stage 1 and the Kartik conversation: name of the Commercial Fire service/tech-support owner; case-field fill rate (model/serial/firmware); TSA status of case, RMA and order systems; Gloria and suppression perimeter; re-sourcing of all `[src-unresolved]` facts; KGS related-party and vendor-security policies; Legal view on EU listening and competition-law guardrails.*
