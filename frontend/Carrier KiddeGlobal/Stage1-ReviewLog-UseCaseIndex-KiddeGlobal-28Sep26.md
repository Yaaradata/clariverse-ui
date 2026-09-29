# Red-Team Review Log and Master Index — LiSN × KGS Global Commercial Fire · Stage 1 wave 1

**Reviewer:** independent red-team (did not author the reviewed files) · **Date:** 28 Sep 2026 · **Evidence base:** `KGS_Stage0_Merged_Dossier_v1.md` (read in full), `BRIEF.md`, spot-checks against raw engine files C (`Opus.md`), G (`ChatGPT.md`), P (`Perplexity.md`) and X (Exa, read from Drive).

**Files reviewed and edited in place:** `UC_Q_quality_safety_cyber.md` (19 UCs) · `UC_C_channel_commercial_carveout.md` (21 UCs) · `Personas_Stakeholders_Risks.md` (15 internal personas, 13 external cards, 30 risks).

---

## A. Review log

**Totals: 36 issues — High 4 · Medium 16 · Low 16.** Fixed in place: 31 (one partially). Left open: 5 (all Medium or Low; no High issue is open).

**Raw-file verification (no issue found):** every "recovered from raw engine" claim spot-checked was present in the cited engine file. C: CISA ICSA-25-148-03 (Consilium CS5000), US TREAD Act analogy, NFPA 73% cooking figure as a 2010 *household* survey, ORR "replacements must comply", EST4 web server, 2017 recall "structured replacement requests", "Chubb Edwards" Ontario post, "wiring and most rail modules are backward compatible", IndiaMART cities, NFPA 72-2022 §10.5.3 gating, EDGE-ML/Evolve-ML, ERP/CRM builds 18–36 months, "partner risk surfaces at the lost bid", persona-table lines. G: GP01 gas-releasing, "KB may normalise a new failure", "ERP programme can be green…", "unable to bid", India standards metadata at state/AHJ/project level, partner sanctions, sale terms on lead times, Strategic Accounts. P: production/lot/inspection data, sensitivity setting and batch, EN 54-25 battery/radio-range, FireCell I/O ten-year claim, regional process divergence, vendor portability, training aligned to launches, licence/MFA lockouts, CCC and MEA mega-project lines, Honeywell multi-criteria, "recall or patch completion status". X: silent degradation, remedy reach, false cohorts, ASD "intelligent filtering", database reconciliation, job stage, credit friction, durable standalone data asset, NFPA system-record fields, acceptance records for life of system. All named individuals in the three files trace to dossier 0.3 with an evidence grade, except one (P-1 below).

| # | File | Location | Issue | Sev | Fixed | Note |
|---|---|---|---|---|---|---|
| Q4 | UC-Q | UC-Q-4 card headline | Paired a real product (FireCell I/O, 2026 preview) with the real EMS production-transfer event (0.3 `[2-src]`) in a hypothetical early-life hazard card, which reads as a claim of a current defect (brief rule 8) | **High** | Y | Genericised to "Wireless I/O units built after a production transfer", with a note explaining why |
| C1 | UC-C | All 21 card headlines | Invented figures in every headline (e.g. "$6.4m", "£1.1m", "412 EST3 sites", "$2.3m backlog") carried no `[illustrative]` tag; the framing covered only worked examples, and headlines are the part lifted into decks and demos | **High** | Y | `[illustrative]` added to each headline; framing now covers headlines and thresholds |
| C2 | UC-C | UC-C-2, 6, 9, 12, 15, 20, 21 governance hooks; UC-C-1 tag ambiguous; Panel note 3 | Competition-law statements (RPM, information exchange, territory restriction, India Competition Act, foreclosure) presented as fact, without "not researched / counsel to confirm" (rule 8; dossier has no competition-law research) | **High** | Y | Tagged `[panel guidance — not researched in Stage 0; counsel to confirm]` at each point, plus a blanket tag on Panel note 3 |
| P-2 | Personas | P3 Quality signal card | Named a real, currently promoted product (Kidde Commercial AIO detectors) in a hypothetical DOA date-code cluster, with no dossier precedent (rule 8) | **High** | Y | Genericised to "one detector family", with a reviewer note |
| Q1 | UC-Q | UC-Q-7 source trace, UC-Q-12 source trace, recall-note table | GST GP01 "gas-releasing" / UL 864 is a G-only fact but was cited `[single G]` without `[src-unresolved]` | Med | Y | Tag added in all three places |
| Q2 | UC-Q | UC-Q-1 worked example | Arithmetic did not reconcile: 23 contacts ÷ 1,240 panels ÷ 3 weeks = 6.2 per 1,000 per week, not 4.6 | Med | Y | Rate restated as 6.2 against a 2.0 baseline, which keeps the headline 3.1× |
| Q3 | UC-Q | UC-Q-1, 8, 14, 17 cards; Personas P1, P2, P9 cards | Real platform names (EST4, SIGA, fw 4.x) in hypothetical fault and cyber cards. The dossier's own Demo 1 (I.3) sets the precedent, but readers may infer a current defect | Med | Partial | Caution note added to UC-Q-1; the naming decision is left to Ranjith (see E) |
| Q6 | UC-Q | UC-Q-16 signal line | MD-2 ("EST4 Signature diagnostics not yet as robust") was presented in the present tense; the source is the June 2022 HDT webinar Q&A, so this implies a current product gap | Med | Y | Now past tense, dated, "current status unverified" |
| Q8 | UC-Q | UC-Q-19 surfacing | Mandatory severity rendering was missing | Med | Y | Severity is inherited from the internal signal; a public post never sets the class |
| Q11 | UC-Q | Conventions (all detectors) | Per-entity exact-Poisson baselines (p<0.001, ≥3 partners) had no pooling rule. At ~0.8k–3.5k interactions per working day, most partner × SKU × symptom cells see less than one contact a week (rule 7) | Med | Y | Added a convention: hierarchical pooling (entity → tier/family → region → global), empirical-Bayes shrinkage, multi-week windows, thresholds `[illustrative]` |
| C3 | UC-C | UC-C-3 (GDPR/DPIA), UC-C-13 (DPDP, works councils — tagged only `[panel guidance]`), UC-C-16, UC-C-17, UC-C-19 (PIPL), UC-C-20 (DPDP) | Privacy statements lacked "not researched / counsel to confirm" | Med | Y | Tagged at each point |
| C4 | UC-C | UC-C-2 and UC-C-3 (Gloria/Anaf K-11), UC-C-6 ("G, unresolved"), UC-C-19 (GCC $1.57bn), UC-C-20 (M0.1-8) | G-only facts without `[src-unresolved]`, and M0.1-8 mis-graded as `[single — preserve]` (the centre is `[2-src G P]`; leadership attendance is G-only) | Med | Y | Tags corrected |
| C5 | UC-C | UC-C-5, 10, 11, 12, 13, 15, 16, 17, 18, 19, 20, 21 | Severity rendering was incomplete: blast radius and/or incident flag missing, although the file's own "card grammar" requires both (rule 6) | Med | Y | Minimal blast-radius and incident-flag text added; verified by grep that all 21 now render both |
| C6 | UC-C | UC-C-8 worked example | ~1,150 avoidable status contacts a month from six distributors implies ~300 a month per distributor and 1.5–7% of all Commercial Fire volume (rule 7) | Med | Y | Reduced to ~390 a month (≈$10k–23k), with the reasoning noted |
| C8 | UC-C | UC-C-9 residual risk | Repeated the MD-2 diagnostics gap in the present tense | Med | Y | Dated to June 2022, "current status unverified" |
| P-1 | Personas | R17 mitigation | Named an individual ("Loga") and his employer, drawn from project memory; neither is in the dossier (rule 10) | Med | Y | Replaced with a generic "US SI channel-partner route (YaaraLabs context, not in dossier)" |
| P-3 | Personas | P2 pain points | MD-2 presented as a current fact | Med | Y | Dated and caveated |
| P-4 | Personas | R15 | JCI OpenBlue OBI (Aug 2026) is G-only; `[src-unresolved]` was missing | Med | Y | Tag added |
| P-6 | Personas | §4.3 protocol item 8 | Credential statement ("HDFC/Visa/SocGen are AI Fluency references; LiSN retail pilots not yet referenceable") is not in the dossier or brief, yet is written as instruction for client-facing wording | Med | Y | Tagged `[YaaraLabs context, not in dossier — Ranjith to confirm]` |
| P-9 | Personas | P1, P2, P9 signal cards | Same real-name issue as Q3 (EST4/SIGA; EST4 fw 4.x in an EU cyber card) | Med | N | Open for Ranjith's decision (E-1) |
| Q5 | UC-Q | UC-Q-5 worked example | 412 "device missing" contacts a quarter from 1,900 enrolled Edge panels (~22% of panels on one symptom) is implausibly dense | Low | Y | Reduced to 164 / 51 (31% unchanged), with a note |
| Q7 | UC-Q | UC-Q-17 surfacing | Severity was "n/a", with no blast radius or incident flag; confidence "H" had no number and no K/I split | Low | Y | S4 enabler, blast radius, incident n/a; H 0.9 with K/I split |
| Q9 | UC-Q | UC-Q-10 surfacing | "Severity: inherited" was underspecified | Low | Y | Now names the inherited components |
| Q10 | UC-Q | UC-Q-5 governance hook | Telemetry data-rights point tagged `[inference]` only | Low | Y | Now "not researched; counsel to confirm" |
| Q12 | UC-Q | 13 UCs | No cross-references to overlapping UC-C use cases (rule 9) | Low | Y | "See also UC-C-x (different decision: …)" added to Q-3, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 19 |
| Q13 | UC-Q | UC-Q-13 card | Pairs the real FireCell product with its real published ten-year battery claim in a "life curve vs claim envelope" hypothetical, so it could read as a claim challenge | Low | N | Open (E-1) |
| Q14 | UC-Q | UC-Q-8 worked example | "~2,100 EU panels on EST4 fw 4.x". The dossier places Edwards as NA-primary (0.4), although its CRA row lists EST4 among EU-sold connected panels | Low | N | Keep or switch the example to Aritech 2X (E-8) |
| C7 | UC-C | Framing, UC-C-5, 10, 11, 17, 18, 19, 20; recall note | "Miner B" pointed to a non-existent file label | Low | Y | Replaced with "the UC-Q miner" |
| C9 | UC-C | 12 UCs | No cross-references to UC-Q overlaps (rule 9) | Low | Y | "See also UC-Q-x" added to C-2, 5, 7, 9, 10, 11, 12, 13, 14, 17, 18, 19 |
| C10 | UC-C | UC-C-21 governance hook | "NFPA 72 record retention for the life of the system" overstated X, which says *acceptance* records | Low | Y | Reworded and graded `[single]` X |
| C11 | UC-C | UC-C-18 governance hook | Shared-credential routing named IT security but not PSIRT/CRA | Low | Y | Now routes to PSIRT where a KGS product is implicated (UC-Q-8) |
| C12 | UC-C | UC-C-2, UC-C-6 headlines | Real SKU family (Genesis horn-strobes) named in hypothetical lead-time and backorder cards. Not a defect, but it implies a current supply problem | Low | N | Open (E-1) |
| C13 | UC-C | All detection thresholds | Thresholds (z ≥ 2.5, ≥3× baseline, ≥N lines) were stated as design facts, not starting points | Low | Y | Framing now tags every threshold `[illustrative]`, to be tuned in Discovery. UC-C-1 already shrinks small partners to tier baselines |
| P-5 | Personas | P5 UK-EU residual risk | GDPR and works councils untagged; Gloria without `[src-unresolved]` | Low | Y | Both tagged |
| P-7 | Personas | R29 | "Severity coded but not rendered" (project history) is not in the dossier | Low | Y | Tagged "Ranjith to confirm" |
| P-8 | Personas | P8 and P13 signal cards | Blast radius and incident flag missing | Low | Y | Added |

**House-style sweep (all three files):** no "Lisn/LisN", no exclamation marks, no "cheap", no "resolves" attributed to LiSN (Personas states "aids resolution" explicitly; the other uses of "resolve" are entity resolution or negations), no "that" for organisations found, no American spellings (the only "-ize/-er" hits are "size" and the proper noun "Edwards Learning Center"), and no external-signal claims (UC-Q conventions explicitly exclude weather; UC-C-10 frames code adoption as a candidate cause). Reportability is never attributed to LiSN (UC-Q-7, UC-Q-8, Personas P9 and R7 are explicit). No text asserts "your data is fragmented".

---

## B. Coverage check

### B.1 Dossier needs MH-1…MH-17 → UC IDs

| MH | Need | UC IDs | Status |
|---|---|---|---|
| MH-1 | Product-quality & firmware early warning | UC-Q-1, Q-2, Q-10, Q-14, Q-15, Q-17 | Covered |
| MH-2 | Safety / recall awareness clock | UC-Q-7 (Q-18 residential) | Covered |
| MH-3 | Cyber signal fusion outside PSIRT | UC-Q-8 | Covered |
| MH-4 | Partner technical friction & channel health | UC-C-1, C-2, C-21 | Covered |
| MH-5 | Carve-out separation friction | UC-C-3, C-5, C-18 | Covered |
| MH-6 | Cost-to-serve & contact elimination | UC-C-8, C-11, C-12; UC-Q-15 | Covered |
| MH-7 | EOL migration & upgrade detection | UC-C-9, C-7, C-10; UC-Q-16 | Covered |
| MH-8 | Backorder pain tied to partner reaction | UC-C-6, C-7, C-8 | Covered |
| MH-9 | Spec / AHJ / compliance-document friction | UC-C-14, C-10; UC-Q-11 | Covered |
| MH-10 | Nuisance-alarm patterns by model | UC-Q-6 | Covered |
| MH-11 | Training gaps by partner | UC-C-13; UC-Q-10 | Covered |
| MH-12 | Residential hazard & recall surge | UC-Q-18 | Covered (T3 adjacency) |
| MH-13 | RMA-to-root-cause closure (NFF) | UC-Q-3, Q-2 | Covered |
| MH-14 | Connected-services adoption friction | UC-C-17; UC-Q-5 | Covered |
| MH-15 | China vertical anomaly | UC-Q-12; UC-C-19 | Covered |
| MH-16 | TSA-exit validation; preserve Carrier-era history | UC-C-4, C-5 | Covered |
| MH-17 | Connected-product patch/advisory reach | UC-Q-9 | Covered |

**No MH need lacks a UC.**

### B.2 Contact map C.2 rows 1–36 → UC IDs

| Row | Contact type | UC IDs | Status |
|---|---|---|---|
| 1 | Programming / commissioning | UC-C-11, C-13; UC-Q-14 | Covered |
| 2 | Troubleshooting, fault codes | UC-Q-1, Q-3, Q-14 | Covered |
| 3 | Device/loop mapping | UC-Q-1, Q-16; UC-C-11 | Covered |
| 4 | Compatibility / approved combinations | UC-Q-11; UC-C-7 | Covered |
| 5 | Firmware, licences, login, entitlement | UC-C-18; UC-Q-1 | Covered |
| 6 | KGS → installer known-issue guidance (out) | UC-Q-15 | Covered |
| 7 | Order status / backorder | UC-C-6, C-8 | Covered |
| 8 | Delay / allocation / discontinuance notice (out) | UC-C-6, C-7 | Covered |
| 9 | Pricing, quotes, tender, submittals | UC-C-15, C-14 | Covered |
| 10 | Sales → partner quote follow-up (out) | UC-C-15 | Covered (thin) |
| 11 | Warranty / RMA / credit | UC-Q-2, Q-3, Q-17 | Covered |
| 12 | RMA evidence request (out) | UC-Q-17, Q-3 | Covered |
| 13 | DOA / early-life failure | UC-Q-2 | Covered |
| 14 | Containment investigation (out) | UC-Q-2 (containment memo draft) | Covered (as artefact) |
| 15 | Spares, legacy/EOL, substitutes | UC-C-9, C-7 | Covered |
| 16 | EOL notice / migration campaign (out) | UC-C-9; UC-Q-9 | Covered |
| 17 | Training / certification (in) | UC-C-13 | Covered |
| 18 | Course invitations / release notes (out) | UC-C-13 (invitation drafts) | Covered (as artefact) |
| 19 | Datasheets, listings, DoP, UL 268 7th status | UC-C-14, C-10 | Covered |
| 20 | Listing change / corrected documentation (out) | UC-Q-9, Q-11 | Covered |
| 21 | Cyber vulnerability report | UC-Q-8 | Covered |
| 22 | Cyber advisory / patch (out) | UC-Q-9 | Covered |
| 23 | Recall scope check | UC-Q-7, Q-18 | Covered |
| 24 | Recall / field corrective action (out) | UC-Q-9, Q-7 | Covered |
| 25 | Nuisance / false alarms | UC-Q-6; UC-Q-20 (monitoring-centre complaints) | Covered |
| 26 | Preventive action (out) | UC-Q-20 (c) preventive-action effectiveness; UC-Q-6 (application-note draft) | Covered (added in second pass; T3 join) |
| 27 | Planned test / impairment / restoration notices (out) | UC-Q-20 (b); also a suppression input in UC-Q-5 and UC-Q-7 | Covered (added in second pass; the work-order join is T3) |
| 28 | General complaint / escalation | UC-C-16, C-1 | Covered |
| 29 | Connected services support | UC-C-17; UC-Q-5 | Covered |
| 30 | Health / predictive notification; alert fatigue | UC-Q-5 (quadrant b); UC-C-17 | Covered |
| 31 | Account management / QBR | UC-C-1 | Covered |
| 32 | Specification education / CPD | UC-C-14 (CPD as action) | **Partial, deliberately left**: no signal on specifier-education demand itself. The count is low and the value very high; treat as Tier 1 descriptive inside UC-C-14 unless Ranjith wants a dedicated UC |
| 33 | Service contract / ITM / modernisation | UC-C-16 | Covered |
| 34 | Carve-out friction | UC-C-3, C-4, C-5 | Covered |
| 35 | Informal cyber symptoms | UC-Q-8 | Covered |
| 36 | Residential consumer | UC-Q-18 | Covered (T3 adjacency; not Kartik's P&L) |

### B.3 Raw-engine themes with no UC

- **NFPA test/impairment notification gaps** (X, C.2 row 27): now owned by UC-Q-20 (b), added in the second pass.
- **Monitoring-station interoperability and false-dispatch** (P, X; C.4 #8; persona E9): now owned by UC-Q-20 (a), added in the second pass.
- **Specifier-education demand** (G, P, X; C.2 row 32): still only partial (UC-C-14). See the table above.
- **PFAS/AFFF substitution demand** (X, G): deliberately not mined, because the perimeter is unconfirmed (K-10, K-11). Correct to hold.
- **Australia maintenance-services growth** (P `[single]`): noted in UC-C, not mined.
- **Outsourced / second support centre** (X, residential): persona risk R28 only. It is a data-access risk, not a UC.
- **OEM partner integration support (Ring) and residential retailer charge-backs** (C, P): residential only; partially covered in UC-Q-18.
- **Tariffs 2025–26** (C, unverified): correctly not a UC (it would be an external/macro signal). Used only as a candidate cause in UC-Q-4 and UC-C-15.

---

## C. Master UC index (41 UCs, including UC-Q-20 added in the second pass)

MVP feasibility is my judgement: H = text or light-substrate only, inside the H.4 pilot ingest; M = needs a pilot-list join with a known data-quality risk; L = needs a system outside the pilot or an unproven identity graph. Convergence is of the underlying dossier need.

| ID | Name | Bucket | Tier | Demo | Primary persona → routed exec | P&L destination metric | Convergence (dossier) | MVP | Key Discovery precondition |
|---|---|---|---|---|---|---|---|---|---|
| UC-Q-1 | Firmware-release fault cohort early warning | B | T2 | **Y (hero)** | VP Engineering → Quality, VP Service, President (threshold), PSIRT | Warranty cost; tech-support cost-to-serve | MH-1 `[4-src]` | M | Cases carry firmware or site ID; release register and download logs |
| UC-Q-2 | Early-life failure in serial/date-code window | B | T2 | **Y** | Quality → VP Eng, Operations, Supply chain, President (S1) | Warranty and containment cost | MH-1 `[4-src]`; MH-13 `[single P]` | M | RMAs carry serial/date code; MES lot history retained |
| UC-Q-3 | NFF loop and repeat-replacement detector | B | T2 (T3 supplier) | N | Quality → VP Eng, VP Service, CFO | Warranty cost (credits, freight, scrap) | MH-13 `[single — preserve]` P | M | RMAs carry end-site/project reference |
| UC-Q-4 | ECO / supplier / production-transfer impact watch | B | T3 | N | VP Eng → Supplier Quality, Operations, Global CFO CF | Warranty cost net of COGS saving | D.3 `[3-src]` under MH-1 | L | Dated PLM change register; serial → build date |
| UC-Q-5 | Voice-vs-telemetry divergence | B | T3 (T2 with telemetry) | **Y** | CS+ digital lead → VP Service, VP Eng, President | Connected-service renewal; truck rolls | MH-14 `[single G]`; F3 `[4-src]` | L | Telemetry joinable (I.4 Q7); usage rights confirmed |
| UC-Q-6 | Nuisance-alarm cohort (model × edition × setting × site type) | B | T2 | N (v2) | Product Mgmt → Quality, VP Service, Regional GM | Service cost; aftermarket replacement revenue | MH-10 `[2-src C P]` | M | Install base records model and site type |
| UC-Q-7 | Safety-language watch and awareness chronology | B | T2 always-on | **Y (governed tile)** | Quality + CLO → President | Recall/field-action cost; warranty reserve | MH-2 `[4-src]` | M | After-hours line and RMA narratives ingestible; legal owner named |
| UC-Q-8 | Cyber-signal fusion outside PSIRT (CRA) | B | T2 | **Y (governed tile)** | PSIRT/CISO → CLO, VP Eng, President | Incident and field-update cost; connected retention | MH-3 `[4-src]` | M | PSIRT accepts watch items (I.4 Q9); firmware per panel |
| UC-Q-9 | Advisory and field-notice reach / remedy completion | B | T2 | N | PSIRT or Quality/CLO → VP Service, Regional GM | Field-campaign cost-to-serve; recall completion cost | MH-17 `[single X]` | M | Advisory register and update status |
| UC-Q-10 | Product-defect vs installation-practice attribution | B | T3 | N | Quality → VP Eng, VP Service | Warranty and containment cost | E.1 #3 `[4-src]`; MH-11 | L | LMS exportable by partner; technician IDs on cases |
| UC-Q-11 | Listed-configuration drift | B | T2 | N | Product Mgmt → CLO/Regulatory, Quality, Regional GM | Warranty and liability exposure | MH-9 `[4-src]` (adjacent); UL 864 row | L | Compatibility matrix exists as data, not PDFs |
| UC-Q-12 | China vertical/application anomaly | B | T3 | Y (v2) | China GM → Product Mgmt, Quality, President | Bookings in stated verticals; warranty | MH-15 `[single P]`; M0.1-1 `[4-src]` | L | Project register with vertical tags; Chinese corpus access |
| UC-Q-13 | Wireless/aspirating life-curve vs claim envelope | B | T3 | N | VP Eng (UK-EU) → Product Mgmt, Marketing/Legal | Warranty; service cost; claim exposure | EN 54-25 row `[2-src G P]` (long-tail, no MH) | L | Site type and device install dates recorded |
| UC-Q-14 | Emergent fault-phrasing / taxonomy drift | A | T2 | N (chip in hero) | VP Service → VP Eng | Warranty cost (earlier detection); cost-to-serve | C.4 #2 `[2-src C P]` under MH-1 | H | 12+ months of text history |
| UC-Q-15 | Workaround proliferation / conflicting guidance | A | T2 | N | VP Service → VP Eng, Quality | Cost-to-serve; warranty; liability | Row 6 `[2-src P X]`; D.2 `[single G]` | H | Agent notes and outbound text captured |
| UC-Q-16 | Product capability-gap signal (migration diagnostics) | A | T1/T2 | N | Product Mgmt (Edwards) → VP Eng, VP Service | Cost-to-serve | MD-2 `[single C]`; D.2 `[2-src C P]` | H | Migrated sites identifiable |
| UC-Q-17 | RMA and case evidence-completeness radar | A | T1 | N (Discovery-critical) | Quality → VP Service, CIO | Warranty cost (NFF); containment precision | H.4 precondition `[single C]`; row 12 `[2-src P X]` | H | Case/RMA field exports (first Discovery output) |
| UC-Q-18 | Residential hazard and recall-surge intelligence | A (B ext.) | T3 parked | N | President Residential → Quality, CLO, Care | Recall cost; retailer charge-backs | MH-12 `[2-src C P]` | M | Residential sponsorship (not Kartik) |
| UC-Q-19 | External corroboration (forums/reviews) | A | T1 (T3) | N | Quality → Product Mgmt | Warranty cost (confidence in earlier action) | E public chatter `[4-src]`; K-8 conflict | M | None beyond scraping within site terms |
| UC-Q-20 | Monitoring-centre interoperability, test/impairment-notice and preventive-action watch *(reviewer-added)* | B | T2 (a); T3 (b, c) | N | VP Service & Tech Support → VP Engineering, service ops / ITM channel lead, Product Mgmt + Quality | Cost-to-serve; warranty cost (secondary: service-contract retention) | Rows 25 `[4-src]`, 26 `[single P]`, 27 `[single X]`; A.4 monitoring station `[2-src P X]`; no MH (long-tail) | L | Monitoring-station tickets form a recognisable queue/account type; site → firmware; (T3) ITM work orders shared |
| UC-C-1 | Strategic Partner drift radar | B | T2 | **Y** | Regional GM / VP Sales & Channel → President, VP Service, Learning Center | Partner revenue retention / channel share | MH-4 `[4-src]` | M | Case account ID ↔ ERP sold-to; LMS carries employer |
| UC-C-2 | Competitor-switching and ownership-churn language | A | T2 | N | VP Sales/Channel → Regional GM, Product Mgmt, President | Retrofit/spec win rate | C.4 #11 `[2-src C P]` under MH-4 | H | RSM/QBR notes machine-readable |
| UC-C-3 | Carve-out separation friction radar | B | T2 | **Y** | CIO/separation lead → COO, CFO, Regional GM | DSO / cash conversion | MH-5 `[4-src]` | M | Cutover calendar; I.4 Q1 (which systems remain on TSA) |
| UC-C-4 | TSA-exit readiness gate | B | T2 | N | Separation PMO/CIO → COO, CFO, Lone Star | TSA fees / stranded cost | MH-16 `[single P]` | M | TSA catalogue and wave plan shareable |
| UC-C-5 | Legacy residue and Carrier-era evidence preservation | B | T1+T2 | N | CIO → Legal, VP Service, Learning Center | TSA exit / stranded cost | MH-16 `[single P]`; 0.2 `[single C]` | H | Repository inventory with retirement dates; right to copy |
| UC-C-6 | Backorder consequence vs promise-date slippage | B | T2 | **Y** | COO/VP Supply Chain → VP Sales, Regional GM, CFO | Backlog conversion / OTIF | MH-8 `[4-src]` | M | ERP keeps first- and revised-promise dates |
| UC-C-7 | Substitution-feasibility gap | B | T3→T2 | N | Product Mgmt + Supply Chain → Application eng, Regional GM | Backlog conversion | X white-space #3 `[single X]` (MH-7/8) | L | Compatibility matrix and approved-substitute table as data |
| UC-C-8 | "Where is my order" as upstream EDI/master-data defect | B | T2 | N | Head of order mgmt → COO, CIO, CFO | Cost-to-serve | D.3 `[single G]`; MH-6 `[4-src]` | H | EDI/CommerceHub logs read-only |
| UC-C-9 | EST3→EST4 migration intent and at-risk base | B | T2 | **Y (v2)** | VP Sales / Strategic Accounts → Product Mgmt, Regional GM, President, Learning Center | Aftermarket/modernisation revenue; migration win rate | MH-7 `[4-src]` | M | Ship-to or CS+ records resolve to sites |
| UC-C-10 | UL 268 7th-edition replacement demand / status confusion | A | T2 | N | Product Mgmt → Application eng, VP Sales, Regional GM | Aftermarket replacement revenue | A.2 `[3-src]`; MH-9 adjacent | H | Cases carry site location/jurisdiction |
| UC-C-11 | Deflectable how-to clusters | A | T1+T2 | N | VP Service → Learning Center, Product Mgmt, CFO | Cost-to-serve per contact | MH-6 `[4-src]` | H | Cases record resolution text |
| UC-C-12 | Cost-to-serve ledger by partner/product/job stage | B | T1+T2 | N (v2 CFO) | CFO / Global CFO CF → VP Service, VP Sales, Pricing | Cost-to-serve; contribution margin | B KPI `[4-src]`; MH-6 | M | Handle time and tier on cases |
| UC-C-13 | Training gap → seat allocation | B | T2 | N | Learning Center → VP Service, Regional GM | Cost-to-serve; installable capacity | MH-11 `[3-src C P X]` | M | LMS and CRM share a partner key |
| UC-C-14 | Spec and AHJ documentation friction | B | T2 | N (v2) | Regional spec lead → Regional GM, Product Mgmt/Regulatory, President | Spec win rate / quote-to-order | MH-9 `[4-src]` | M | Opportunities carry consultant and jurisdiction |
| UC-C-15 | Quote and pricing friction, margin leakage | B | T2 | N | Pricing → VP Sales, Regional GM, CFO | Quote conversion; price realisation | Row 9 `[4-src]`; E `[2-src P X]` | M | CPQ access; quotes carry partner/project IDs |
| UC-C-16 | National account multi-site health / renewal risk | B | T2 (T3 identity) | N | Strategic Accounts → Regional GM, VP Service, President | Service-contract renewal / aftermarket revenue | Row 33 `[single G]`; A.4 `[2-src]` | L | Sites carry account IDs |
| UC-C-17 | ConnectedSafety+ / KESMobile adoption and renewal friction | B | T2 | **Y** | CS+ product owner → VP Service, VP Sales, President | Connected-services ARR / renewal | MH-14 `[single G]` | M | Subscription and usage telemetry exports |
| UC-C-18 | Access-policy and licence lockout watch | A | T2 | N | Portal/digital owner → CIO, VP Service (PSIRT if security) | Cost-to-serve | Row 5 `[4-src]` | H | Change calendar exists |
| UC-C-19 | China and MEA project-channel commercial signals | B | T3→T2 | N | China/MEA GM → President, CFO, Product Mgmt | Bookings in stated verticals | MH-15 `[single P]`; M0.1-1 `[4-src]` | L | Regional opportunity data; in-language corpora |
| UC-C-20 | India channel leakage / grey market | B | T2 | N | India country head → channel mgr, Service, Legal | Price realisation / channel margin | 0.3–0.4 `[2-src C P]` | L | Serials captured on India cases; serial → ship-to |
| UC-C-21 | Site service-provider handover / programme-file friction | A | T2 | N | VP Sales/Channel → Product Mgmt, Regional GM, Legal | Installed-base retention / retrofit win rate | MD-4 `[single P]`; D.2 `[2-src]` | H | Site captured on cases |

Counts: 41 UCs (UC-Q 20, UC-C 21); Bucket B 30, Bucket A 11. Demo "Y" flags: 11 (Q-1, Q-2, Q-5, Q-7, Q-8, C-1, C-3, C-6, C-17, plus v2 flags on Q-12 and C-9). This is more than one screen can carry (see E-6).

---

## D. Persona → UC map (internal personas, Personas file §2)

| Persona | UCs that serve them |
|---|---|
| P1 President, Global Commercial Fire (Kartik) | UC-Q-1, Q-2 (S1/large stock), Q-5, Q-7 (corroborated S1), Q-8 (severe), Q-12; UC-C-1, C-2 (digest), C-9, C-14, C-16, C-17, C-19 |
| P2 VP Engineering / Product Engineering | UC-Q-1, Q-2, Q-3, Q-4, Q-5, Q-8, Q-10, Q-13, Q-14, Q-15, Q-16, Q-20 |
| P3 Quality / Field Quality lead | UC-Q-2, Q-3, Q-6, Q-7, Q-9, Q-10, Q-11, Q-17, Q-18, Q-19, Q-20 |
| P4 VP Customer Service & Technical Support | UC-Q-1, Q-3, Q-5, Q-9, Q-14, Q-15, Q-16, Q-17, Q-20 (primary); UC-C-1, C-5, C-11, C-12, C-13, C-16, C-17, C-18, C-20 |
| P5 Regional GM / VP Sales & Channel (incl. China, MEA, India variants) | UC-C-1, C-2, C-3, C-6, C-7, C-9, C-10, C-13, C-14, C-15, C-16, C-19, C-20, C-21; UC-Q-6, Q-9, Q-11, Q-12 |
| P6 COO / Supply Chain & Order Management | UC-C-3, C-4, C-6, C-7, C-8; UC-Q-2, Q-4 |
| P7 CIO / separation lead / Hyderabad hub | UC-C-3, C-4, C-5, C-8, C-18; UC-Q-17 |
| P8 CFO / Global CFO CF / FP&A | UC-C-3, C-4, C-6, C-8, C-11, C-12, C-15, C-19; UC-Q-3, Q-4 |
| P9 PSIRT + CLO / Regulatory | UC-Q-7, Q-8, Q-9, Q-11, Q-18; UC-C-5, C-18 (security routing), C-20, C-21 (Legal) |
| P10 Product Management | UC-Q-6, Q-11, Q-12, Q-13, Q-16, Q-19; UC-C-2, C-7, C-9, C-10, C-11, C-14, C-19, C-21 |
| P11 Learning Center / Academy | UC-C-1, C-5, C-9, C-11, C-13; UC-Q-10 (practice-leaning hand-off) |
| P12 Strategic Accounts | UC-C-9, C-16 |
| P13 Connected Services owner | UC-Q-5; UC-C-17, C-18 |
| P14 CISO / InfoSec | UC-Q-8 (where the CISO leads PSIRT); UC-C-18. Mainly a gatekeeper, not a UC user |
| P15 Lone Star operating partner / board | UC-C-4 (board reporting); readout of UC-C-3, C-12 and the pilot scorecard. No dedicated UC, which is appropriate |
| (President Residential, §1 row 20) | UC-Q-18 |

---

## E. Open risks the reviewer could not fix (Ranjith's decision or external validation)

1. **Real product names in hypothetical cards.** EST4/SIGA/fw 4.x (UC-Q-1, Q-8, Q-14, Q-17; Personas P1, P2, P9, from the dossier's own Demo 1), Edge (UC-Q-5), FireCell with its real ten-year claim (UC-Q-13) and Genesis (UC-C-2, C-6). Before anything reaches Kartik, decide: keep real names with a visible `[illustrative]` banner, or genericise ("Platform A"). I recommend genericising any card that combines a real product with a fault, DOA, cyber or claim-envelope pattern.
2. **`[src-unresolved]` facts need re-sourcing before client use.** GP01 gas-releasing / UL 864 (Jul 2026), Gloria sale to Anaf (K-11), GCC market figure, JCI OBI (Aug 2026), the Hyderabad "independent digital organisation" ad, >1.5m buildings / 18 facilities / 7 plants, and "KGS sale terms discuss lead times".
3. **The legal layer is entirely panel guidance.** US all-party-consent recording (the California, Florida and Illinois examples), GDPR/UK GDPR lawful basis and DPIA, EU works councils, China PIPL, India DPDP Act 2023, EU Art. 101 / VBER RPM, US antitrust, India Competition Act, and telemetry data rights. None was researched in Stage 0. KGS Legal or external counsel must validate before any Discovery extract.
4. **MD-2 currency.** The "EST4 Signature diagnostics less robust than EST3" admission dates from June 2022. Confirm whether it still holds before UC-Q-16 or UC-C-9 cite it to Kartik, whose own quote stresses "quality and reliability".
5. **Statistical power at KGS volume.** At ~0.8k–3.5k interactions per working day, per-partner and per-symptom cells are sparse. The pooling convention I added must be validated by a blind back-test in Discovery. Every numeric threshold in both UC files is a placeholder.
6. **Demo scope.** 11 UCs carry a demo flag. The one-screen demo needs a ranked cut. The dossier's H.2 spine points to UC-Q-1 (hero) + UC-C-1 + UC-C-3, with UC-Q-7/Q-8 as the governed tile and UC-C-9 held for v2.
7. **Coverage gaps (updated in the second pass).** Rows 26 and 27 and monitoring-station interoperability are now owned by UC-Q-20, which was added by the reviewer; its T3 part needs ITM partner work orders. Row 32 (specifier-education demand) remains partial inside UC-C-14. Ranjith to decide whether it warrants its own UC.
8. **UC-Q-8 fleet example.** An EST4 EU fleet of ~2,100 panels on one version may overstate Edwards' EU footprint (dossier 0.4: NA-primary). Consider switching the example to Aritech 2X.
9. **YaaraLabs-context statements in the Personas file.** The credential wording (§4.3 item 8), the US SI channel route (R17) and the "severity coded but not rendered" history (R29) are not in the dossier. Ranjith to confirm before any of it shapes client wording.
10. **Relationship protocol (§4.3).** This needs action by Ranjith and Kartik (written disclosure, sponsor-not-evaluator). No document edit can close it.
11. **SOC 2 / ISO 27001 objection (P14, R11).** The response depends on what architecture, SBOM and pen-test evidence YaaraLabs can actually supply. That is flagged `[inference]` in the file and must be confirmed.

---

## F. Messaging file review (second pass)

**File:** `Messaging_Positioning_Demo_Inputs.md`. It was written in parallel, before the wave-1 fixes, and has now been reviewed against the corrected wave-1 files, the dossier and the brief.

**Totals: 23 issues — High 1 · Medium 9 · Low 13.** Fixed in place: 20. Partly fixed (flagged for confirmation): 1. Left open: 2 (both Low). No High issue is open.

**Checked and found consistent (no issue):**
- The one-page brief is ~399 words (≤400) and uses no `[src-unresolved]` fact.
- Sections 8–9 contain no residential or recall material, no "resolve", no fragmentation assertion and no named KGS individual.
- The retire list already removes "under 30 minutes", "quarterly model refresh" and "300K daily", and flags the AI Fluency client logos.
- The hero matches the corrected UC-Q-1: 23 contacts, 6.2 vs 2.0 per 1,000 panel-weeks, 3.1×, 1,240 panels, 9 partners / 3 regions, M 0.70 (K 15 / I 8).
- Tiles 2–5 match UC-C-1, UC-Q-2, UC-C-3 and UC-C-6. Tile 5 uses a synthetic "N-3" family where UC-C-6 names Genesis, which is safer.
- Dataset cardinalities hold: ~1,800 per working day × 130 days ≈ 234k (inside 0.8k–3.5k/day); ~3,500 partner accounts (inside C.1's 3,000–6,000); ~9,100 RMAs is plausible against a 6% RMA-narrative channel share, given follow-ups.
- The demo already had a synthetic badge, synthetic firmware and serials, and an anonymise toggle.

| # | File | Location | Issue | Sev | Fixed | Note |
|---|---|---|---|---|---|---|
| M1 | Messaging | §10.1 60-second story (the spoken opener) | "One week of Global Commercial Fire… Out of ~234k interactions" implies ~234k a week (~47k per working day), 13–58× KGS volume. It repeats the retired "300K daily" scale error and contradicts the file's own dataset (234k over 26 weeks) | **High** | Y | Now "~1,800 a working day, ~9k this week, ~234k across the 26-week baseline window"; the funnel strip is also clarified (M20) |
| M2 | Messaging | §10.4 / §10.7 demo spec | The rule for real platform names on hypothetical faults was implicit, and exports were not forced into anonymised mode (check c) | Med | Y | Added a mandatory "Real-name rule": real names only in the live narrated session with badge and footer visible and all versions, serials, date codes and IDs marked synthetic; every export defaults to anonymised with a watermark; the governed tile never shows a platform name |
| M3 | Messaging | §9 p8 "Today vs With LiSN" | The "Today" column asserted KGS's current state (sampled calls, problems found only when the RMA trend moves), contrary to rule 7 | Med | Y | Column renamed "Typical today", with a page footnote: "a common industry pattern, not an assessment of KGS" |
| M4 | Messaging | §9 p2 "SEPARATE QUEUES" / "CODED LATE" | Read as facts about KGS's queues and reason codes (rule 7) | Med | Y | Reframed generically ("In most OEMs…", "typically") |
| M5 | Messaging | §9 p3 and p8; §5 VP Engineering and Regional GM lines | "Weeks before / weeks earlier" performance claims are unverified, and two of them are in forwardable lines | Med | Y | Now "before it showed in orders" and "earlier"; the VP Engineering forwardable line no longer claims "weeks" |
| M6 | Messaging | §6 objection 8 (InfoSec) | "SOC 2 attests a vendor-hosted service" overclaims; InfoSec may still require vendor-level assurance | Med | Y | Softened; acknowledges secure development, remote-support access and model supply chain as legitimate asks |
| M7 | Messaging | §6 objection 1 (Salesforce) | The Einstein characterisation went beyond the dossier grade, and the answer risked implying Data Cloud cannot join external data | Med | Y | Graded `[single C]`; explicit instruction not to claim Data Cloud cannot join |
| M8 | Messaging | §6 objection 14 | The "$10–20m a year" figure rests on the Commercial Fire revenue Kartik supplied privately, which §4.5 itself says not to use | Med | Y | Now "1–2% of revenue" only, with the reason noted |
| M9 | Messaging | §2.4 optional fourth trigger | JCI OBI (Aug 2026) is G-only; `[src-unresolved]` was missing | Med | Y | Tagged, with "re-source before saying it" |
| M10 | Messaging | §11 YaaraLabs claims | Named "Loga" and Persistent, neither in the dossier (rule 10); same issue as P-1 | Med | Y | Now generic "US SI channel-partner route", with no individual named |
| M11 | Messaging | §6 objection 2 (Medallia/Qualtrics) | Absolute competitor claim ("hold no seasonal entity baselines") | Low | Y | Softened to a category assessment, "as typically deployed" |
| M12 | Messaging | §7.2 claims table | The EST3 halt date was graded A.2 `[3-src]`; the date itself is 0.4 `[single C]` | Low | Y | Regraded, with "re-check before printing" |
| M13 | Messaging | §9 p1 COVERAGE; p3 subhead | "Every interaction" and "reads everything" overclaim against "channels in scope" (§7.3) | Low | Y | "in scope" added |
| M14 | Messaging | §4.5 credentials line | The AI Fluency / LiSN-reference statement is YaaraLabs context, not in the dossier | Low | Y | Tagged for Ranjith to confirm |
| M15 | Messaging | §8 brief "About" line and contact address | "AI practitioners who have run data and AI at enterprise scale" and "hello@yaaralabs.ai" are unverified YaaraLabs claims in client copy, which cannot carry tags | Low | Partial | Flagged in the layout note for confirmation before sending; text left unchanged |
| M16 | Messaging | §10.6 installed base | "80% in week one" makes exposure ≈3,350 panel-weeks (≈6.9 per 1,000), not the stated 6.2 | Low | Y | Now "nearly all in week one", which keeps the 6.2 rate |
| M17 | Messaging | §10.5 tile 1 W-2 | "09:14 CET" plus "elapsed 8h 46m" against data as of 18:00 UTC does not reconcile (CEST in September) | Low | Y | Timestamp set to 09:14 UTC |
| M18 | Messaging | §10.5 tile 6 | Severity "n/a" and confidence without a number, inconsistent with the corrected UC-Q-17 | Low | Y | Now S4 enabler, blast radius, incident n/a; H 0.9 with K/I split |
| M19 | Messaging | §6 objection 17 | Competition-law point without a counsel tag | Low | Y | Tagged |
| M20 | Messaging | §10.2 funnel strip | "233,900 interactions read" under a "this week" title reads as weekly volume | Low | Y | "(26 weeks; ~9,000 this week)" added |
| M21 | Messaging | Inputs line; §1.3 held-for-v2 table | Did not reflect UC-Q-20, the reviewer-added UC | Low | Y | Inputs updated; row added to §1.3 |
| M22 | Messaging | §9 p8 outcome strip "RELIABILITY ↑" | Could be read as implying a current reliability gap | Low | N | Minor; Ranjith may prefer "EARLY WARNING ↑" |
| M23 | Messaging | §10.4 hero (EST4 · fw 4.1) | Real platform name on a hypothetical fault. Now compliant with the M2 rule, but the name-vs-anonymise decision remains | Low | N | Same decision as E-1 |

**Use case added to close the coverage gap:** **UC-Q-20 — Monitoring-centre interoperability, test/impairment-notice and repeat-event preventive-action watch.** It is Bucket B, T2 for the monitoring-ticket × firmware join and T3 for the ITM work-order joins, not a demo candidate, `[long-tail — preserve]`, and follows the full UC-Q template. It covers C.2 rows 26 and 27 and monitoring-station interoperability. Sections B, C and D above are updated, and UC-C-16 carries a See-also link to it. Row 32 (specifier-education demand) remains partial, deliberately (see B.2).
