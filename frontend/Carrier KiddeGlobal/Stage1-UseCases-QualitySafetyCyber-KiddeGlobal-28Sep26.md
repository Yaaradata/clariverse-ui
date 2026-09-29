# UC-Q — Quality, field failure, safety and product-cyber use cases · LiSN × KGS Global Commercial Fire

**Miner:** Use-Case Miner Q · **Stage:** 1 (use-case mining) · **Date:** 28 Sep 2026 · **Inputs:** merged dossier v1 + raw engine files C, G, P (disk) and X (Drive) · **Status:** draft for panel merge

## Framing

Every engine ranks product-quality and firmware early warning as KGS Commercial Fire's first unmet need (MH-1 `[4-src]`). This file breaks that need into use cases that can be built. Each one names the operational join it depends on, the baseline that defines "normal", the numeric condition that trips it, the noise it suppresses and the executive who receives it. The sharpest point from Stage 0 is G's line that "the consequential signal may have a count of three" (C.1). In this domain LiSN therefore ranks by consequence, source independence and affected population, never by volume. Of the 20 use cases below, 14 are Bucket B (they require a join of the interaction corpus with KGS operational data) and 6 are Bucket A. UC-Q-20 was added by the red-team reviewer and sits at the end of Bucket B. **Tier convention used here:** T1 is self-serve descriptive. T2 is a proactive anomaly card built only on joins inside the H.4 pilot ingest list (cases, RMA, product/firmware/serial master, orders, partner/site master). T3 is a cross-correlation that needs a system outside the pilot (ConnectedSafety+ telemetry, MES/PLM, LMS, China project register) and is parked until Discovery confirms access. **Every worked example is a hypothetical built to show the evidence structure `[illustrative]`. None is a claim about any current KGS product, firmware or batch** (brief rule 8). LiSN surfaces correlated evidence and candidate causes. Engineering, Quality, PSIRT and Legal decide. LiSN never auto-fires any action.

### Conventions used in every use case

- **Severity class:** S1 is life-safety or active exploitation (failure to alarm, notify or release; injury; smoke or heat from a device; disabled or bypassed system; exploitation or compromise). S2 is impairment or availability (trouble, node offline, loss of supervision, commissioning blocked). S3 is performance or nuisance (false alarm, NFF loop, battery life). S4 is friction.
- **Type:** *cliff* (a step change at a release, batch or change date), *slope* (sustained drift, CUSUM), *spread* (a known issue reaching a new batch, partner, country or vertical) or *novel* (new phrasing).
- **Blast radius:** installed units, sites and countries in the cohort, from the installed-base denominator. Shown with its own confidence when inferred.
- **Incident flag:** set when any source mentions a fire event, injury, dispatch or exploitation.
- **Confidence marker:** H, M or L with a numeric probability. It always splits **K (knowledge: joined, verified records)** from **I (inference: text-extracted or imputed attributes)**.
- **Source-independence score (SI, 0–1):** rises with distinct partners, sites, technicians and channels (call, email, RMA, field note, telemetry). It is discounted for same-site recontacts and for one partner echoing across its branches.
- **Default detectors:** small-count exact Poisson or negative-binomial tests against each entity's own seasonal baseline; CUSUM for slopes; a 1-D scan statistic along the serial or date-code axis; embedding-cluster novelty for new phrasing.
- **Volume realism and pooling (reviewer addition):** KGS Commercial Fire handles ~200k–900k interactions a year, ~0.8k–3.5k per working day (C.1 `[2-src estimate]`), so most partner × SKU × symptom cells see fewer than one contact a week. Per-entity baselines for small partners, SKUs and regions are therefore **pooled hierarchically** (entity → partner tier or SKU family → region → global) with empirical-Bayes shrinkage, and daily cadences evaluate rolling multi-week windows. All numeric thresholds below are `[illustrative]` starting points to be tuned in Discovery.
- **Gates:** S1 is never suppressed for lack of corroboration. It routes as `[single]` with calibrated severity (C.4 consensus `[3-src]`).
- **No external-signal claims:** "environment" always means site attributes held in KGS's install-base or site master (building type, application, vertical). It never means weather or other external feeds (brief rule 5).

---

## Bucket B — net-new joins (interaction corpus × KGS operational data)

### UC-Q-1 — Firmware-release fault cohort early warning
- **Archetype:** release-regression cohort · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** **Y**. It is the hero (MH-1, ranked #1 by all four engines), and the per-version denominator makes it visibly impossible without the join.
- **Signal:** after a firmware or software release, a symptom family's contact rate per installed panel on the new version breaks away from panels still on the prior version over the same weeks.
- **Cadence/trigger:** starts on each release date in the firmware register or MyEddie publish date. Daily for 90 days after release, weekly after that.
- **Primary user → routed exec(s):** VP Engineering → Quality; VP Service & Tech Support; President Commercial Fire (only when S1/S2 and the blast radius exceeds the agreed threshold); PSIRT if cyber-indicative language co-occurs (UC-Q-8).
- **Source trace:** MH-1 `[4-src]` C G P X; C.4 #1 and #8 `[P X]`; contact-map rows 2 and 5 `[4-src]`; MD-1 `[single P]`, MD-2 and MD-3 `[C]`; E.1 #1 and #6 `[4-src / 2-src P G]`; D.3 quality-engineering cut `[3-src G P C]`; G UL 864 note, "firmware changes to listed configurations are not ordinary SaaS releases" `[single G]`; monitoring-station "cyber-safe updates" `[single X]`.
- **1. Data aggregation:** *Interaction:* tech-support call recordings, Salesforce cases (if used for service), support and after-hours emails, KESMobile/app support tickets, monitoring-station integration tickets, RMA narratives. *Operational:* firmware release register (engineering/PLM), MyEddie download and licence logs, firmware per panel (ConnectedSafety+ inventory for connected sites; commissioning uploads or service records otherwise), ERP shipments, RMA system.
- **2. Baseline creation:** platform (EST4, Edge, Evolve, Aritech 2X, GST panels) × firmware lineage × symptom family (multi-label: loop mapping, node offline, ground fault, audio/NCA, upload/download, network redundancy) × region × channel. "Normal" is the trailing 26-week contact rate per 1,000 panels on the prior version, adjusted for commissioning seasonality (quarter-end, pre-AHJ deadlines) and install age, because new installs generate more contacts. The denominator is panels on each version: known for connected sites, imputed from ship date and download logs elsewhere, with a confidence band.
- **3. Dynamic detection:** a difference-in-differences test. The trigger is new-version rate ÷ prior-version rate ≥2.5× over the same weeks (Poisson exact p<0.001) **and** ≥3 independent partners. A cliff is dated to the release; a slope is caught by weekly CUSUM crossing h=5σ. Any S1 phrase in the version cohort escalates immediately. **Join:** contact timestamps are aligned to each panel's upgrade date (event-time, not calendar-time), so a panel counts in the new-version cohort only after it upgraded.
- **4. Distillation:** merges phrasings ("won't map", "devices not found after upgrade", "SIGA not responding") into one signal. Suppresses how-to questions about new features (tagged adoption, not fault), same-site recontacts, and behaviour listed in the release notes as an expected change. Ranking = severity × rate ratio × panels on version × SI × estimated field cost. SI counts distinct partners, sites and channels.
- **5. Surfacing & routing:**
  - **Card headline:** "EST4 v4.1 — 'loop won't map' contacts 3.1× vs panels still on v4.0; 9 partners, 3 regions; 1,240 panels on version" `[illustrative]`.
  - **Severity:** S2 · cliff (step at release) · blast radius 1,240 panels / ~610 sites · incident flag off.
  - **Confidence:** M 0.7 (K: 15 cases with firmware in record; I: 8 imputed from ship date).
  - **Recommended action:** engineering reproduction on the candidate configuration, and a decision on whether to hold the staged rollout or download.
  - **Draft artefact:** engineering investigation brief (excerpts, serials, configurations, ranked candidate causes, counter-evidence from sites on v4.1 without the symptom), plus a draft known-issue note for tech-support agents (not sent).
  - **Human gate:** VP Engineering approves any rollout hold or bulletin. Regulatory is consulted if a listed configuration is involved.
  - **UI hero:** *firmware lineage river*, a rate ribbon per version with the release marker and denominator shading.
- **Join tags:** brand · platform · firmware · region · partner · site type · channel · time. **P&L destination:** warranty cost and tech-support cost-to-serve (truck rolls, repeat contacts); secondary: upgrade adoption for aftermarket.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** agent-chosen reason codes rarely carry firmware. A CRM report cannot compute a per-version rate without the install-base denominator. A dashboard has to know the symptom in advance. An LLM summarises cases but holds no release register, no event-time alignment and no baseline.
- **Differentiation:** **requires the join — does not exist today** (per-panel firmware × contact language × release date).
- **Worked example `[illustrative]`:** EST4 v4.1 publishes on 2 March. By week 3 there are 23 contacts from 9 ESDs (FL, GA, TX, ON) describing Signature loop-mapping failures after the upgrade. Rate: 6.2 per 1,000 v4.1 panels per week (23 contacts ÷ 1,240 panels ÷ 3 weeks), against 2.0 on v4.0 over the same weeks. Two SIGA module RMAs come back NFF. The 1,240 panels on v4.1 imply ~38 extra truck rolls by week 6 at the current trajectory (≈$17k at $450 each) plus repeat-contact cost. The monthly RMA dashboard stays green.
- **Regulatory/governance hook:** UL 864 listed-configuration change control (edition conflict K-7 unresolved; verify before use); NFPA 72-2025 network-connected system provisions; IEC 62443-4-1 defect management; EU CRA Art. 14 if exploitation language appears (hand-off to UC-Q-8).
- **Feasibility (four-lens):**
  - *Data needed:* structured firmware per panel, or site→panel linkage; the release register.
  - *Hardest part:* the firmware denominator for disconnected sites. C's caveat applies: free text alone is not reliable for this.
  - *False-positive risk:* medium. A new-install surge on the new version confounds the comparison, so install age is controlled for.
  - *Must be true in Discovery:* cases carry firmware or site ID, and release dates and download logs are available.
  - *Panel disagreement:* the architect alerts at 3 independent partners. The service VP wants a reproduction before the President sees it. The PE partner routes to the President only above an exposure threshold. The compliance adviser involves Regulatory from the first signal if a listed configuration is touched.
- **Residual risk LiSN does NOT address:** sites where dealers fix locally and never call; panels on versions that are never recorded; root cause (engineering decides); rollout control itself.
- **Demo-naming caution (reviewer):** the card uses real platform names (EST4, SIGA) in a hypothetical, following the dossier's own Demo 1 precedent (I.3). Before any client use, confirm with Ranjith whether to keep real names or genericise ("Platform A, v4.1"), so no reader infers a current defect (brief rule 8).

### UC-Q-2 — Early-life failure concentrated in a serial/date-code window (DOA cohort under a green aggregate)
- **Archetype:** batch concentration · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** **Y**. The serial-range heat strip sits beside a green aggregate chart, which is the clearest visual of "aggregate-rate blindness".
- **Signal:** DOA and early-life contacts and RMAs cluster in one production window while the SKU-level return rate stays inside control limits.
- **Cadence/trigger:** daily scan; re-run whenever an RMA disposition posts.
- **Primary user → routed exec(s):** Quality (Director of Product Quality) → VP Engineering; Operations/plant leadership (Qinhuangdao or the relevant plant); Supply chain for stock quarantine checks; President Commercial Fire at S1 or when containable stock is large.
- **Source trace:** MH-1 `[4-src]`; MH-13 `[single P]`; C.4 #4 and #7 `[P G]`; contact rows 11, 12, 13 `[4-src / 2-src / 3-src]`; D.2 aggregate-rate blindness `[4-src]`; E "Is an RMA spike a batch issue?" `[4-src]`; E.1 worked example `[G]`; P quality-engineer row on the 2018 dual-sensor recall ("combine contact symptoms with production process, lot and inspection data"), **recovered** `[single P, proxy]`.
- **1. Data aggregation:** *Interaction:* DOA calls, "won't initialise / communicate / stay stable" cases, RMA forms, photos and repair notes, distributor emails. *Operational:* serial → date code → lot (ERP/MES), production line and end-of-line test results (MES), component supplier lot (BOM/ERP), ship-to and ship date (ERP), install date where known, RMA disposition.
- **2. Baseline creation:** early-life failure rate (≤90 days from install, or ≤180 days from ship when install date is unknown) per 10,000 units per production week, by SKU family (Signature detectors, GST detectors, Genesis notification, FireCell devices) and plant/line. "Normal" is a 52-production-week p-chart. The denominator is units shipped per week, lag-adjusted for units still in distributor stock using each channel's ship-to-install lag distribution.
- **3. Dynamic detection:** a 1-D scan statistic along the serial/date-code axis finds a window with relative risk ≥3 (p<0.01) **while** the SKU-level p-chart stays in control, **and** narrative consistency holds (≥60% of the window's cases fall in one failure-mode cluster). **Join:** contact and RMA timestamps are re-indexed to manufacturing time. That re-indexing is the step no existing report makes.
- **4. Distillation:** sends NFF-dominant windows without a consistent narrative to UC-Q-3. Sends windows where ≥70% of cases come from one partner to UC-Q-10. Dedupes multi-unit RMAs from one site. Ranking = failure-mode severity × units in window × share still in distributor stock (containable) × SI.
- **5. Surfacing & routing:**
  - **Card headline:** "Photo detectors, date codes 2611–2614: early-life 'device not responding' 4.2× vs adjacent weeks — SKU return rate in control" `[illustrative]`.
  - **Severity:** S2 (S1 if narratives indicate no alarm) · cliff on the serial axis · blast radius 4,800 units, of which 1,900 are still in stock at 11 distributors · incident flag off.
  - **Confidence:** M 0.65 (K: 22 serial-verified cases; I: 9 date codes read from photos).
  - **Recommended action:** sample return and teardown; a quarantine decision on remaining stock.
  - **Draft artefact:** containment memo draft (stock by distributor, installed sites where known) with a pre-filled 8D D1–D3.
  - **Human gate:** Quality director. Any stop-ship is decided by Quality/Operations only.
  - **UI hero:** *serial-range heat strip* beside the green aggregate p-chart.
- **Join tags:** brand · SKU family · batch/date code · plant/line · component lot · ship-to distributor · region · time since ship. **P&L destination:** warranty cost and containment cost (units × replacement + logistics); scrap; supplier recovery.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** the dashboard reports the SKU return rate, which is green by construction. The CRM report counts DOA cases, not manufacturing windows. An LLM cannot run a scan statistic over serials it does not hold.
- **Differentiation:** **requires the join — does not exist today** (narrative × serial → MES lot × ship-to stock).
- **Worked example `[illustrative]`:** 31 early-life contacts arrive over 6 weeks on one detector family. 22 fall inside 4 production weeks on one line, and 14 of those share one optical-chamber component lot. 4,800 units shipped in the window; 1,900 sit in 11 distributors' stock. The SKU return rate is 0.21% against a 0.30% control limit: green.
- **Regulatory/governance hook:** listing-body factory follow-up and production control (UL follow-up service; EN 54 factory production control) `[inference]`; CPSC §15 applies only where a product is in scope (UC-Q-7).
- **Feasibility (four-lens):**
  - *Data needed:* serial or date code on RMAs; MES test history retained.
  - *Hardest part:* install-date imputation; photo date-code extraction must be validated.
  - *False-positive risk:* random small windows. This is controlled by the narrative-consistency gate and the p-value.
  - *Must be true in Discovery:* the share of RMAs carrying serials (P: "most RMAs need ≥1 follow-up"; see UC-Q-17).
  - *Panel disagreement:* the PE partner wants containment $ on the card first. The compliance adviser says the card must never wait for a $ figure when narratives indicate non-alarm.
- **Residual risk LiSN does NOT address:** latent defects in units not yet tested or called in (a detector that cannot alarm produces no contact until a test or a fire); causation (teardown decides).

### UC-Q-3 — NFF loop and repeat-replacement detector (RMA-to-root-cause closure)
- **Archetype:** closed-loop disposition failure · **Bucket:** B · **Proposed tier:** T2 (Quality view); supplier-recovery extension T3 · **Demo candidate:** N. Strong CFO story, weaker one-screen visual.
- **Signal:** a symptom keeps recurring at the same sites after "no fault found" dispositions or ≥2 replacements. Contacts continue after the swap, so the problem is probably not in the part. Candidates are configuration, wiring, firmware interaction or a gap in bench-test coverage.
- **Cadence/trigger:** weekly; triggered on each NFF disposition.
- **Primary user → routed exec(s):** Quality → VP Engineering (test coverage); VP Service & Tech Support (field guidance); CFO/Global CFO Commercial Fire for credits and freight leakage.
- **Source trace:** MH-13 `[single — preserve]` P; C.4 #5 and E.1 #5 `[3-src P X C]`; contact row 12 "No fault found… unnecessary replacement" `[2-src P X]`; MD-6 intermittent ground faults `[single P]`.
- **1. Data aggregation:** *Interaction:* contacts before and after each RMA per site, field notes, repair-bench notes. *Operational:* RMA system (disposition, NFF flag), ERP credits and freight, site master, firmware per panel.
- **2. Baseline creation:** NFF rate and repeat-RMA rate (same site and position within 180 days) per SKU × symptom × partner, over a trailing 12 months. The denominator is RMAs per SKU × symptom.
- **3. Dynamic detection:** NFF rate for SKU × symptom ≥1.8× its baseline **and** post-RMA recontact within 30 days ≥40%; or a site with ≥3 replacements at the same loop/position within 180 days `[illustrative thresholds, tuned in Discovery]`. **Join:** contact sequences are aligned to RMA disposition events per site.
- **4. Distillation:** splits partner-practice "swap-first" patterns (one partner dominates) from product-wide patterns. Suppresses sites with a documented wiring fault in field notes. Ranking = recurring cost (credits + freight + truck rolls) × severity × site count.
- **5. Surfacing & routing:**
  - **Card headline:** "Horn-strobes, 'intermittent trouble': 38% NFF; 61% of sites call again within 30 days of replacement" `[illustrative]`.
  - **Severity:** S3 (S2 if impairment persists) · slope · blast radius 140 sites · incident flag off.
  - **Confidence:** M 0.6.
  - **Recommended action:** bench testing under loop-load conditions; a field study at 5 sites.
  - **Draft artefact:** engineering brief plus a revised RMA evidence-request template (captures loop load, firmware, wiring type).
  - **Human gate:** Quality.
  - **UI hero:** *replacement loop* Sankey (contact → RMA → NFF → recontact → RMA).
- **Join tags:** brand · SKU · symptom · firmware · partner · site · time. **P&L destination:** warranty cost (credits, freight, scrap), cost-to-serve, supplier recovery.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** RMA systems record logistics, not the conversation that came before or after. The NFF rate alone does not show that the fault persisted.
- **Differentiation:** **requires the join — does not exist today** (RMA disposition × pre/post contact sequence × site).
- **Worked example `[illustrative]`:** 212 NFF returns in two quarters on one notification family; 129 sites call again within 30 days. The partner distribution is broad (SI 0.8), which points to a product/configuration interaction rather than one dealer's practice. Credits and freight total ≈$96k; truck rolls ≈$58k.
- **Regulatory/governance hook:** NFPA 72 documentation and record retention for repeated deficiencies `[4-src]`; supports a CPSC chronology if the symptom is S1.
- **Feasibility (four-lens):**
  - *Data needed:* NFF disposition plus site ID on RMAs.
  - *Hardest part:* linking an RMA to its site when the RMA is raised by a distributor.
  - *False-positive risk:* genuinely intermittent site faults (MD-6).
  - *Must be true in Discovery:* RMAs carry an end-site or project reference.
  - *Panel disagreement:* the PE partner rates this above UC-Q-2 as the fastest cash return. The service VP warns that it blames partners unless the attribution in UC-Q-10 is shown.
- **Residual risk LiSN does NOT address:** dealer swap-first habits that never reach KGS; bench-test redesign.
- **See also:** UC-C-12 (different decision: partner/product cost-to-serve tiering and pricing, not engineering test coverage).

### UC-Q-4 — Engineering-change, supplier-change and production-transfer impact watch
- **Archetype:** change-point cohort (ECO/PCN/transfer) · **Bucket:** B · **Proposed tier:** T3 (parked: needs PLM/MES) · **Demo candidate:** N.
- **Signal:** units built after an engineering change, supplier substitution or production transfer show new or elevated symptom language compared with units built before it.
- **Cadence/trigger:** starts on each ECO/PCN or transfer date; runs for 180 days.
- **Primary user → routed exec(s):** VP Engineering → Quality / Supplier Quality; Operations; Global CFO Commercial Fire when the change was made for cost reasons.
- **Source trace:** D.3 "hardware revision/batch" cut `[3-src G P C]`; E RMA ↔ supplier component `[4-src]`; tariffs on China-made components `[single C, not verified]`; EMS manufacturing "moved to other KGS European sites" `[2-src G P]`, which is a transfer event **recovered as a trigger**; GST smart workshop `[3-src, marketing-grade]`.
- **1. Data aggregation:** *Interaction:* contacts and RMAs by serial. *Operational:* PLM ECO/PCN register, BOM revisions, supplier lots, production-transfer dates, MES build records.
- **2. Baseline creation:** a pre-change cohort matched on months since ship, SKU and region. The denominator is units shipped per cohort.
- **3. Dynamic detection:** survival analysis. The trigger is a post-change vs pre-change hazard ratio ≥2 with the 95% CI above 1 at 60/90 days, or a novel phrase cluster that appears only in the post-change cohort. **Join:** serial → build date relative to the change date.
- **4. Distillation:** changes with fewer than 500 post-change units go to a watchlist (underpowered). Documented intended behaviour changes are suppressed. Ranking = hazard ratio × post-change units shipped × severity.
- **5. Surfacing & routing:**
  - **Card headline:** "Wireless I/O units built after a production transfer: 'radio link lost' early-life hazard 2.3× (CI 1.4–3.8) vs pre-transfer" `[illustrative]` (product deliberately generic: pairing a real product with the real EMS transfer event would read as a claim).
  - **Severity:** S2 · slope · blast radius 6,200 post-change units in UK-EU · incident flag off.
  - **Confidence:** M 0.55.
  - **Recommended action:** first-article / PPAP re-review with the supplier or plant.
  - **Draft artefact:** change-impact note to Supplier Quality.
  - **Human gate:** VP Engineering.
  - **UI hero:** *before/after change survival curves*.
- **Join tags:** brand · SKU · ECO/PCN ID · supplier lot · plant · region · time since ship. **P&L destination:** warranty cost netted against the sourcing savings the change was meant to deliver (COGS); supplier recovery.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** PLM knows the change and the field knows the symptom. Neither links the two by build date.
- **Differentiation:** **requires the join — does not exist today**.
- **Worked example `[illustrative]`:** a tariff-driven substitution of a radio module supplier `[C inference, unverified]` saves $0.80/unit on 40,000 units a year (≈$32k). The post-change early-life hazard implies ≈$110k in warranty and field cost in year 1, so the saving is net-negative. The card shows both figures.
- **Regulatory/governance hook:** listing change control (UL/EN 54 certification bodies require notification of certain construction changes) `[inference, verify per scheme]`; EU CPR 2024/3110 product-information obligations `[3-src]`.
- **Feasibility (four-lens):**
  - *Data needed:* PLM change register plus serial → build date.
  - *Hardest part:* PLM access during the carve-out.
  - *False-positive risk:* low volumes in engineered systems.
  - *Must be true in Discovery:* the change register exists and is dated.
  - *Panel disagreement:* the PE partner rates this highly because sourcing savings under tariff pressure are live. The architect parks it until UC-Q-2 proves the serial join.
- **Residual risk LiSN does NOT address:** changes not recorded in PLM; supplier-internal process changes that KGS never hears about.

### UC-Q-5 — Voice-vs-telemetry divergence (ConnectedSafety+ / KESMobile join)
- **Archetype:** machine–human signal reconciliation · **Bucket:** B · **Proposed tier:** T3 (T2 once telemetry is in the pilot) · **Demo candidate:** **Y**. It makes Kartik's own ConnectedSafety+ the hero (F3 `[4-src]`, P message) and directly answers "is LiSN competitive with our digital product?"
- **Signal:** three quadrants.
  - (a) Humans report a fault the telemetry does not show: a possible detection or reporting blind spot.
  - (b) Telemetry raises trouble or degradation that produces no contact, work order or acknowledgement: alert fatigue, or "silent degradation".
  - (c) Both rise together: corroboration, which raises confidence in UC-Q-1/2.
- **Cadence/trigger:** daily for connected sites.
- **Primary user → routed exec(s):** digital product lead for ConnectedSafety+ → VP Service & Tech Support; VP Engineering (event model); President Commercial Fire (connected-service adoption).
- **Source trace:** M0.1-4 `[2-src G P]`; F3 "telemetry says what the panel did; interactions say what the humans think is wrong" `[4-src]`; E "Is the panel degrading?" `[4-src]`; contact rows 29, 30 `[4-src / 2-src]`; F1 selection problem `[P]`; MH-14 `[single G]`; X E-map "silent degradation or poor incident communication" **recovered** `[single X]`; X outbound test/impairment notices (contact row 27) used as a suppression input `[single X]`.
- **1. Data aggregation:** *Interaction:* calls, cases and emails mentioning connected sites; TechSupport+ remote-session notes; KESMobile support. *Operational:* ConnectedSafety+ event history (trouble, supervisory, alarm), Inspection+ reports, Manager+ acknowledgements, KESMobile events; identity map from CS+ site ID ↔ CRM account ↔ dealer.
- **2. Baseline creation:** per connected cohort (platform × firmware × site type): events per panel-week, contacts per event, and the share of fault contacts with no matching telemetry event within ±48h. "Normal" is the trailing 13 weeks. The denominator is enrolled panels only.
- **3. Dynamic detection:**
  - (a) Unmatched fault contacts exceed 25% of a cohort's fault contacts against an 8% baseline `[illustrative]` for 2 consecutive weeks.
  - (b) Trouble events unacknowledged for >72h with no contact or work order reach ≥2× baseline.
  - (c) Co-movement, where both series cross their own thresholds, raises SI on the linked quality signal.

  **Join:** contact ↔ site ↔ panel ↔ event stream on a ±48h window.
- **4. Distillation:** suppresses planned-test and impairment windows (from NFPA-style test notifications) and commissioning periods. Excludes non-connected sites from the denominator. Ranking = impairment duration × site criticality (healthcare, data centre, high-rise) × cohort size.
- **5. Surfacing & routing:**
  - **Card headline:** "Edge on ConnectedSafety+: 31% of 'device missing' calls have no matching event — possible reporting gap; 142 sites with ground-fault events unacknowledged >72h and no dealer contact" `[illustrative]`.
  - **Severity:** S2 (S1 if impairment persists at a critical site) · slope · blast radius 142 sites · incident flag off.
  - **Confidence:** M 0.6.
  - **Recommended action:** event-model review; an alert-routing review with the relevant partners.
  - **Draft artefact:** product brief to the ConnectedSafety+ team, plus a partner outreach draft that is never sent without approval.
  - **Human gate:** digital product lead and VP Service.
  - **UI hero:** *voice-vs-telemetry quadrant*.
- **Join tags:** brand · platform · firmware · site type · partner · region · connected status · time. **P&L destination:** connected-service adoption and renewal (recurring revenue); truck rolls avoided (cost-to-serve).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** the telemetry dashboard cannot see what humans report that the panel did not register, and the CRM cannot see alerts nobody called about.
- **Differentiation:** **requires the join — does not exist today**. Peers (Honeywell CLSS, JCI, Siemens) also interpret telemetry only (F3 `[3-src]`).
- **Worked example `[illustrative]`:** 1,900 Edge panels enrolled. 164 "device missing" contacts in a quarter, of which 51 have no matching event (31% vs 8% baseline). (Reviewer: count reduced from 412 so that one symptom on one enrolled cohort stays plausible against ~50k–225k Commercial Fire interactions a quarter.) Separately, 142 sites carry ground-fault events unacknowledged for >72h, 38 of them healthcare.
- **Regulatory/governance hook:** NFPA 72 impairment and record requirements `[4-src]`; UK golden thread for records continuity `[4-src]`; data-rights terms over owner telemetry `[inference — not researched in Stage 0; counsel to confirm]`.
- **Feasibility (four-lens):**
  - *Data needed:* CS+ event export plus site identity map.
  - *Hardest part:* entity resolution between CS+ and CRM. X's architect warns that poor identity resolution creates false cohorts (recovered).
  - *False-positive risk:* medium; timestamp skew.
  - *Must be true in Discovery:* telemetry is joinable (Question 7) and KGS holds the rights to use it.
  - *Panel disagreement:* see Panel notes.
- **Residual risk LiSN does NOT address:** disconnected, older and rival-maintained sites, which may be the most painful (P); whether an owner acts on an alert.
- **See also:** UC-C-17 (different decision: connected-service adoption and renewal rescue, not event-model or product-quality review).

### UC-Q-6 — Nuisance-alarm cohort by detector model × listing edition × sensitivity × site type
- **Archetype:** performance cohort · **Bucket:** B · **Proposed tier:** T2 (T3 where sensitivity settings come from telemetry) · **Demo candidate:** N (v2 candidate).
- **Signal:** nuisance-alarm complaints and alarm events per installed detector rise for a model × site-type combination against its own seasonal baseline, or 7th-edition replacement detectors underperform the units they replaced at the same sites.
- **Cadence/trigger:** weekly; monthly seasonality review.
- **Primary user → routed exec(s):** Product Management (detection) → Quality; VP Service & Tech Support (application guidance); regional GM when key accounts are affected.
- **Source trace:** MH-10 `[2-src C P]`; contact row 25 `[4-src]`; G UL 268 7th / UL 217 8th `[3-src]`; E nuisance join `[2-src C P]`; P UL 268 row "join nuisance language to detector type, **setting**, environment and **production batch**" **recovered** (setting and batch dimensions were flattened); C NFPA 73%-cooking statistic is a *household* survey, not commercial data, **recovered as a baseline caveat**; P Honeywell multi-criteria sensing as a competitor proxy **recovered**; ORR "replacements must comply with 7th edition" `[C]` **recovered**; Siemens care-provider false-alarm case `[3-src, proxy]`.
- **1. Data aggregation:** *Interaction:* dealer calls and cases ("keeps going off", "false alarm", "nuisance"), monitoring-station complaints, owner escalations, field notes. *Operational:* detector model and listing edition (product master), sensitivity/verification settings (programme uploads or CS+ configuration), alarm events (CS+), site type and application (install-base), install and replacement dates, batch.
- **2. Baseline creation:** nuisance contacts and alarm events per 1,000 installed detectors per month, by model × listing edition × site type (hotel, healthcare, car park, commercial kitchen-adjacent, warehouse). Seasonality comes only from each cohort's own history. A paired baseline (same site, before and after replacement) is used for retrofits.
- **3. Dynamic detection:** model × site-type rate ≥2× its own seasonal baseline for 2 consecutive months; or the paired post-replacement rate ≥1.5× the pre-replacement rate across ≥10 sites; or a batch concentration via scan statistic. **Join:** complaint text ↔ detector model/edition/setting ↔ site type ↔ alarm events.
- **4. Distillation:** labels candidate causes (cooking, steam, dust, contractor works, device behaviour) as candidates only. Rolls single-site repeats into a site-service signal. **Escalates** any "disconnected", "bypassed" or "put on disable" language to S1 (disabled system). Ranking = alarm burden × dispatch cost × bypass language × population.
- **5. Surfacing & routing:**
  - **Card headline:** "7th-edition photo detectors in hotel corridors: nuisance events 1.7× the units they replaced at the same 14 sites; 3 sites mention bypass" `[illustrative]`.
  - **Severity:** S3 escalated to S1 for the bypass sites · slope · blast radius 2,300 detectors · incident flag off.
  - **Confidence:** M 0.6 (K: 14 paired sites; I: site type from account name for 5).
  - **Recommended action:** application-guidance and sensitivity-setting review; product review.
  - **Draft artefact:** application note draft plus a product brief.
  - **Human gate:** Product Management; Quality for S1 bypass sites.
  - **UI hero:** *nuisance matrix* (model × site type) with bypass flags.
- **Join tags:** brand · model · listing edition · sensitivity setting · batch · site type · region · partner · time. **P&L destination:** service cost (dispatches, truck rolls); aftermarket replacement revenue (7th-edition cycle); spec retention with owners.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** telemetry lacks the "why". Complaint totals mix cooking, dust, design and defects. Neither knows the listing edition or setting.
- **Differentiation:** **requires the join — does not exist today**.
- **Worked example `[illustrative]`:** as in the card. The paired before/after design removes site-level confounding, and the bypass language turns a nuisance issue into a life-safety impairment.
- **Regulatory/governance hook:** UL 268 7th / UL 217 8th cooking-nuisance tests (30 Jun 2024) `[3-src]`; NFPA 72-2025 from 1 Jan 2025 where adopted `[4-src]`; nuisance complaints become listing-performance evidence `[C P X]`.
- **Feasibility (four-lens):**
  - *Data needed:* model per site, site type, settings.
  - *Hardest part:* most nuisance never reaches KGS `[4-src]`.
  - *False-positive risk:* renovation or occupancy changes.
  - *Must be true in Discovery:* the install base records model and site type.
  - *Panel disagreement:* the compliance adviser wants bypass language to go to Quality same-day. The service VP treats it as a partner-service matter first.
- **Residual risk LiSN does NOT address:** events handled by dealers or monitoring centres without contacting KGS; the owner's decision to disable.
- **See also:** UC-C-10 (different decision: 7th-edition replacement campaign and edition-status documentation, not detector performance).

### UC-Q-7 — Safety-language watch and awareness chronology (CPSC §15 / field-action readiness)
- **Archetype:** rare-event safety surveillance · **Bucket:** B · **Proposed tier:** T2, always on, single-source S1 escalates · **Demo candidate:** **Y**. It is the governed "safety/cyber language watch" tile (H.2 note, I.3 refinement).
- **Signal:** the first credible mention of a failure to alarm, notify or release; smoke, heat or burning smell from a device; battery swelling; discharge failure (extinguishers, if in the perimeter); or injury. The pattern is corroborated when independent sources mention the same model or date code.
- **Cadence/trigger:** real time on ingestion; a daily backward chronology rebuild.
- **Primary user → routed exec(s):** Quality + CLO/Regulatory (immediately) → President Commercial Fire (S1 corroborated); President Residential if the product crosses into consumer channels.
- **Source trace:** MH-2 `[4-src]`; G CPSC §15 row `[4-src]`; "why regulation raises the value of full coverage" `[4-src]`; C.4 single-source disagreement `[3-src]`; H.4 routing table `[single P]`; contact rows 23, 24 `[4-src]`; 0.7 recalls `[proxy]`; GST GP01 is a **gas-releasing** control panel `[single G]` `[src-unresolved]`, so "failure to release" is an S1 phrase, **recovered**; C F4 US TREAD Act early-warning reporting (warranty claims, field reports, complaints) as an analogy **recovered** `[single C, proxy — automotive, not applicable to KGS]`; X "contact clustering can speed triage, never substitute legal assessment" `[single X]`.
- **1. Data aggregation:** *Interaction:* all channels, including the after-hours emergency line, RMA narratives, field notes, distributor emails, monitoring-station tickets and public reviews. *Operational:* distributed population by model and date code (ERP shipments), serial, product-safety notice register, regulatory case system, product-perimeter master (CPSC-scope flag per SKU).
- **2. Baseline creation:** for S1 phrases the baseline is near zero, so detection is on presence, not rate. For S1-adjacent phrases (overheating, odour), the baseline is a rate per model. A benign-context baseline is also learned ("failed test" during ITM, training questions) so it can be subtracted.
- **3. Dynamic detection:** any S1 mention creates a watch item labelled `[single]`. It upgrades to corroborated when a second independent source (different partner or site, or a different channel) mentions the same model or date code within 180 days. On each new item, a semantic back-search over 36 months finds earlier matching interactions. **Join:** mention ↔ model/date code ↔ distributed population ↔ prior interactions.
- **4. Distillation:** suppresses planned-test and drill language, hypotheticals, training-course questions and competitor products (after brand resolution). **Never** suppresses a credible S1. Ranking = severity × corroboration × distributed population × incident flag.
- **5. Surfacing & routing:**
  - **Card headline:** "S1 watch — 2 independent reports 'agent did not release', gas-releasing panel, firmware 1.x, MEA and China; first mention 19 days ago" `[illustrative]`.
  - **Severity:** S1 · novel · blast radius (units shipped of model/version) with confidence · incident flag on if any event or injury is mentioned.
  - **Confidence:** L–M (0.35) `[single → corroborating]`.
  - **Recommended action:** Quality and CLO evaluate. **LiSN makes no reportability determination.**
  - **Draft artefact:** *awareness chronology pack*: first-information timestamp, every matching interaction, population, counter-evidence, and an access log of who viewed it when.
  - **Human gate:** CLO/Regulatory.
  - **UI hero:** *awareness chronology timeline* (first weak evidence → corroboration → owner assigned), with a 24h marker.
- **Join tags:** brand · model · firmware · date code · region/country · channel · partner · time. **P&L destination:** recall/field-action cost and warranty reserve; product-liability exposure (regulatory penalty exposure is shown alongside, not as the P&L line).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** volume dashboards suppress rare events. CRM categories are assigned late. Regulators ask when information was *possessed*, not when it was coded (G regulation row `[4-src]`). An LLM has no clock and no population.
- **Differentiation:** **requires the join — does not exist today** (mention ↔ distributed population ↔ chronology).
- **Worked example `[illustrative]`:** as in the card. The back-search finds a third, earlier email from a distributor 7 months ago that was coded "commissioning", which moves the candidate first-information date. Quality decides the significance.
- **Regulatory/governance hook:** CPSC CPSA §15(b), generally within 24h of reportable information, no need to wait for injury `[4-src]`, for residential and some commercial products; scope per SKU is set by counsel. Chinese and other national product-safety regimes for GST products were **not verified in Stage 0**.
- **Feasibility (four-lens):**
  - *Data needed:* all-channel ingestion; shipment population by model.
  - *Hardest part:* benign-context false positives ("failed" during testing).
  - *False-positive risk:* medium, accepted by design.
  - *Must be true in Discovery:* the after-hours line and RMA narratives are ingestible, and a legal owner for the chronology pack is named.
  - *Panel disagreement:* see Panel notes #1.
- **Residual risk LiSN does NOT address:** reportability decisions; latent failures that are never reported; products outside the ingested channels; privilege and legal hold handling (counsel's process).
- **See also:** UC-C-5 (different decision: preserving Carrier-era evidence before repositories retire, which this chronology depends on).

### UC-Q-8 — Cyber-signal fusion outside the PSIRT inbox (EU CRA Art. 14)
- **Archetype:** statutory-clock surveillance · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** **Y**. The CRA clock has been live since 11 Sep 2026 and is time-sensitive (a 4-src fact).
- **Signal:** cyber-indicative language in ordinary support ("unexpected restart after network event", "admin password changed, nobody did it", "unknown device on panel network", "web server unreachable after update", "BMS network compromised") clusters on sites sharing a firmware or component. It is mapped to the fleet by country.
- **Cadence/trigger:** real time; hourly cluster refresh.
- **Primary user → routed exec(s):** PSIRT lead / CISO → CLO; VP Engineering; President Commercial Fire on a severe incident.
- **Source trace:** MH-3 `[4-src]`; contact row 35 `[3-src G P X]`; rows 21, 22 `[4-src]`; G EU CRA `[4-src]`; PSIRT 48h acknowledgement `[3-src]`; E.1 #8 `[3-src]`; C peer fire-panel precedent **CISA ICSA-25-148-03 (Consilium CS5000)**, **recovered** (the dossier carried only the non-KGS Carrier Block Load advisory) `[single C]`; EST4 web server + AES firewall surface `[C]`.
- **1. Data aggregation:** *Interaction:* support calls, cases and emails, KESMobile app-store reviews, dealer emails, monitoring-station tickets, the PSIRT mailbox. *Operational:* PSIRT's own vulnerability and case register, SBOM/component inventory, firmware per panel, EU installed base by member state (shipments / CS+), advisory register. LiSN consumes PSIRT's register and does **not** claim external threat-intelligence monitoring.
- **2. Baseline creation:** weekly rate of cyber-indicative phrases per platform and firmware. The baseline is small and mostly benign (password resets, certificate expiry). The per-entity baseline stops login-entitlement noise from the carve-out (the other miner's domain) from swamping the signal.
- **3. Dynamic detection:** any "exploited", "compromised" or "ransomware" language tied to a KGS product creates an S1 cyber watch. Separately, ≥3 independent sites with the same anomalous-behaviour cluster on one firmware within 14 days trigger an escalation. Both are matched against open PSIRT cases, and an unmatched cluster is flagged "not in PSIRT queue". **Join:** mention ↔ firmware/SBOM component ↔ EU fleet by country ↔ PSIRT case.
- **4. Distillation:** suppresses entitlement and password-reset contacts unless paired with an unexplained configuration change; dedupes. Ranking = exploitation indicators × EU population on the version × SI × criticality of site types.
- **5. Surfacing & routing:**
  - **Card headline:** "Cyber watch — 4 unrelated EU sites report EST4 restarts plus configuration change after a network event; firmware 4.x; ~2,100 EU panels on version; not in PSIRT queue" `[illustrative]`.
  - **Severity:** S1-candidate · novel · blast radius by member state · incident flag set only when a compromise is asserted.
  - **Confidence:** L 0.3.
  - **Clock:** the card marks the *candidate* awareness timestamp. PSIRT decides whether awareness under Art. 14 has begun.
  - **Draft artefact:** PSIRT triage note (excerpts, versions, fleet by country, first-seen timestamps, counter-evidence).
  - **Human gate:** PSIRT lead + CLO.
  - **UI hero:** *CRA clock ring* (24h / 72h) beside a fleet-by-country map.
- **Join tags:** brand · platform · firmware · SBOM component · country · channel · partner · time. **P&L destination:** incident and field-update cost; connected-service retention (trust); regulatory penalty exposure shown separately.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** PSIRT tooling sees only submitted reports. Support dashboards code these contacts as "connectivity". An LLM has neither the SBOM nor the fleet.
- **Differentiation:** **requires the join — does not exist today**.
- **Worked example `[illustrative]`:** as in the card. Three of the four contacts were coded "network/IT issue – customer side". One was a monitoring-station ticket. The fleet join shows 2,100 EU panels on the version across 9 member states.
- **Regulatory/governance hook:** EU CRA Art. 14 (early warning ≤24h, notification ≤72h, from 11 Sep 2026; covers products already on market) `[4-src]`; IEC 62443-4-1 `[4-src]`; NFPA 72-2025 network-connected provisions `[4-src]`. Whether each KGS product is in CRA scope is for counsel to confirm.
- **Feasibility (four-lens):**
  - *Data needed:* firmware per panel; SBOM; EU fleet.
  - *Hardest part:* distinguishing IT-network noise from product behaviour.
  - *False-positive risk:* high, labelled as such.
  - *Must be true in Discovery:* PSIRT agrees to receive LiSN watch items (Question 9).
  - *Panel disagreement:* the architect wants every exploitation mention routed. The service VP fears PSIRT fatigue. The compliance adviser sides with the architect for anything tied to the EU fleet.
- **Residual risk LiSN does NOT address:** exploitation that never produces a human contact; confirming a vulnerability; the notification itself.
- **See also:** UC-C-18 (different decision: grace period or rollback after an access-policy change; shared-credential patterns flagged there are routed here).

### UC-Q-9 — Advisory and field-notice reach and remedy completion (cyber, firmware, listing and safety notices)
- **Archetype:** remedy-effectiveness tracking · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** N.
- **Signal:** after a cyber advisory, firmware bulletin, listing-change notice or safety notice, affected sites keep generating symptom contacts; partners report they cannot apply the remedy (no licence, EOL hardware, no site access); or "does this apply to me?" contacts persist. Each of these means the notice is not reaching people or cannot be acted on.
- **Cadence/trigger:** starts on each advisory or notice; checks at day 7, 14, 30 and 90.
- **Primary user → routed exec(s):** PSIRT (cyber) or Quality/CLO (safety/listing) → VP Service & Tech Support; regional GM for partner cascade gaps.
- **Source trace:** MH-17 `[single — preserve]` X; X E-map row "Listing/safety/cyber: PLM/QMS, document control, PSIRT, regulator correspondence → **incomplete notification/remedy reach**", **recovered**, because the dossier narrowed it to cyber only; contact rows 20, 22, 24 `[2-src / 4-src]`; P "recall or patch completion status" `[P]`; IEC 62443-4-1 EOL / supported-life `[4-src]`; Kidde strobe notice related to UL 1971/1638 `[single X]`; low recall completion rate risk (row 24) `[4-src]`.
- **1. Data aggregation:** *Interaction:* contacts citing the advisory ID, product or version; partner emails; outbound cascade replies. *Operational:* advisory and notice register (affected versions, serials, date), update status (CS+ / download logs), install base, support-life status, dealer distribution lists.
- **2. Baseline creation:** the expected uptake curve for the affected-version share after an advisory, taken from KGS's past advisories and bulletins by region and partner type. The expected question volume comes from the same history.
- **3. Dynamic detection:** at day 30, uptake ≥30% below the expected curve for a region or partner; or ≥5 "cannot apply" contacts from ≥3 partners; or affected-version symptom contacts still arriving after day 14. **Join:** advisory scope ↔ install base ↔ update status ↔ post-notice contacts.
- **4. Distillation:** classifies each gap as comprehension (documentation), capability (cannot patch) or distribution (never received). Ranking = advisory severity × unremediated population × criticality.
- **5. Surfacing & routing:**
  - **Card headline:** "Advisory A-26-07: 41% of affected EU panels still on vulnerable version at day 30 vs 70% expected; installers at 3 distributors report 'no licence to update'" `[illustrative]`.
  - **Severity:** follows the advisory severity (S1/S2) · slope · blast radius (unremediated units) · incident flag off.
  - **Confidence:** H 0.8 for connected sites, L for others.
  - **Recommended action:** targeted re-notification plus a licence exception process.
  - **Draft artefact:** re-notification list and dealer FAQ draft.
  - **Human gate:** PSIRT / Quality.
  - **UI hero:** *remedy-reach funnel* (notified → acknowledged → updated → confirmed).
- **Join tags:** advisory/notice ID · brand · platform · firmware · country · partner · support-life status · time. **P&L destination:** field-campaign and cost-to-serve; regulatory exposure; recall completion cost.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** an asset inventory shows versions, not the human reasons for not patching (X). Contacts show the reasons, not the population.
- **Differentiation:** **requires the join — does not exist today**.
- **Worked example `[illustrative]`:** as in the card. The capability gap concentrates in panels past supported life, which opens a hand-off to the EOL-migration miner. That decision differs and belongs to them.
- **Regulatory/governance hook:** EU CRA (remediation and advisory duties, main obligations from 11 Dec 2027) `[4-src]`; IEC 62443-4-1 patch management and EOL `[X]`; CPSC corrective-action effectiveness (residential) `[4-src]`.
- **Feasibility (four-lens):**
  - *Data needed:* the advisory register; update status.
  - *Hardest part:* update status for disconnected panels.
  - *False-positive risk:* low for connected sites.
  - *Must be true in Discovery:* past advisories exist to build the curve; if not, a peer-free default curve is marked L.
  - *Panel disagreement:* the PE partner sees this as cost-to-serve. The compliance adviser sees it as evidence of diligence.
- **Residual risk LiSN does NOT address:** the owner's decision whether to patch or remediate; sites nobody talks about.
- **See also:** UC-C-9 (different decision: migration opportunity for panels past supported life, not remedy reach).

### UC-Q-10 — Product-defect vs installation-practice attribution (Quality's cohort disambiguation)
- **Archetype:** causal-candidate attribution (not root cause) · **Bucket:** B · **Proposed tier:** T3 (needs LMS) · **Demo candidate:** N.
- **Signal:** for a detected fault cluster, tests whether the concentration follows product attributes (batch, firmware) or installer attributes (partner, certification cohort, technician). The decision is **containment vs no containment**. This differs from the training miner's decision (where to spend on training).
- **Cadence/trigger:** runs on every UC-Q-1/2/3 signal before it reaches an executive.
- **Primary user → routed exec(s):** Quality → VP Engineering; VP Service (hand-off to training only if practice-leaning).
- **Source trace:** E.1 #3 `[4-src]`; contact row 13 "batch/component issue looks like isolated installer error" `[3-src]`; G worked example "11 via three partners trained in the same period" `[single G]`; E installer abnormal failures `[3-src]`; LMS `[4-src]`; X architect "poor identity resolution can create false cohorts" **recovered** `[single X]`.
- **1. Data aggregation:** *Interaction:* cluster members from UC-Q-1/2/3, technician names and IDs in cases, wiring and termination language. *Operational:* partner master, LMS certification records (Edwards Learning Center, Fire & Security Academy), ship-to share by partner, batch and firmware.
- **2. Baseline creation:** each partner's expected share of a cluster equals its share of installs of that SKU/version (from shipments). Certification status is taken at install date.
- **3. Dynamic detection:** stratified relative risk. If the batch/firmware effect persists within certified installers (RR within ±25% of the effect among uncertified installers), the cluster is *product-leaning*. If the effect is confined to one certification cohort or partner regardless of batch, it is *practice-leaning*. With N<15 the result is labelled "indeterminate".
- **4. Distillation:** suppresses attribution when the partner identity-match confidence is below 0.8. Output is a label with confidence, **never a verdict**.
- **5. Surfacing & routing:**
  - **Card:** an attribution strip added to the parent signal: "Cluster C-114 — effect persists across certified and uncertified installers (RR 3.0 vs 2.8): product-leaning" `[illustrative]`.
  - **Severity:** inherited from the parent (class, type, blast radius and incident flag of the UC-Q-1/2/3 signal it annotates).
  - **Confidence:** M 0.6.
  - **Draft artefact:** attribution note in the investigation brief.
  - **Human gate:** Quality.
  - **UI hero:** *attribution balance* (product vs practice bar).
- **Join tags:** partner · certification cohort · technician · batch · firmware · region. **P&L destination:** warranty and containment cost (avoiding both over-containment and a missed defect); training-spend targeting as a secondary.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** no report joins certification to the fault cluster and the batch at the same time.
- **Differentiation:** **requires the join — does not exist today**.
- **Worked example `[illustrative]`:** 18 cases. Eleven come from three partners certified in the same month, but the component-lot effect holds equally among 7 cases from long-certified partners, so the cluster is product-leaning. Without this strip, it would have gone to Training.
- **Regulatory/governance hook:** NFPA 72 qualified-personnel requirements `[4-src]`; recall-scope defensibility.
- **Feasibility (four-lens):**
  - *Data needed:* technician IDs and LMS records.
  - *Hardest part:* partner identity duplicated across systems `[3-src]`.
  - *False-positive risk:* confounding, when partners buy specific batches.
  - *Must be true in Discovery:* LMS is exportable by partner.
  - *Panel disagreement:* the service VP says this strip is what makes a Quality director trust the card. The architect warns the statistics are thin at typical cluster sizes.
- **Residual risk LiSN does NOT address:** true causal inference; installer-ID gaps.
- **See also:** UC-C-13 (different decision: where to allocate training seats, not containment vs no containment).

### UC-Q-11 — Listed-configuration drift signal
- **Archetype:** listing/compatibility risk · **Bucket:** B · **Proposed tier:** T2 · **Demo candidate:** N.
- **Signal:** compatibility and firmware complaints show equipment installed in combinations outside the documented or listed configuration (panel × device × firmware × listing edition). This points to a documentation problem or unlisted field use, which is a product-risk decision. The spec-win decision belongs to the other miner.
- **Cadence/trigger:** weekly; triggered on each compatibility-document revision or SKU substitution.
- **Primary user → routed exec(s):** Product Management → CLO/Regulatory; Quality; regional GM.
- **Source trace:** G UL 864 row "compatibility or firmware complaints can indicate use outside a listed configuration" `[P G; K-7]`; MD-5 Kidde↔Edwards parts `[single P]`; contact row 4 `[3-src]`; E listing join `[4-src]`; MH-9 (adjacent; different decision) `[4-src]`; C ORR "replacements must comply with 7th edition" **recovered**.
- **1. Data aggregation:** *Interaction:* compatibility questions, AHJ rejections citing compatibility, field notes, forum mentions (as corroboration only). *Operational:* compatibility matrix and listing documents (document control), product master, sold configurations (project BOMs, orders by site), firmware.
- **2. Baseline creation:** compatibility-contact rate per product pair per month, and the share that mentions *installed* (versus *planned*) off-list combinations.
- **3. Dynamic detection:** installed off-list combinations reported by ≥3 independent partners in 30 days for one pair, or a ≥2× step after a document revision or SKU substitution. **Join:** mentioned combination ↔ matrix ↔ sold configuration at the site.
- **4. Distillation:** separates "asking before install" (knowledge gap, lower severity) from "installed and failing" (field risk). Ranking = installed count × trouble reports × listing criticality.
- **5. Surfacing & routing:**
  - **Card headline:** "Pair X↔Y reported installed at 6 sites; not in current compatibility list; 2 with trouble reports; step change after document rev. C" `[illustrative]`.
  - **Severity:** S2 · cliff · blast radius (sites with the sold configuration) · incident flag off.
  - **Confidence:** M 0.55.
  - **Draft artefact:** compatibility clarification bulletin draft plus a regulatory note.
  - **Human gate:** Product Management + Regulatory.
  - **UI hero:** *compatibility matrix heat-map* with off-list cells lit.
- **Join tags:** brand · product pair · firmware · listing edition · document revision · region/jurisdiction · partner · time. **P&L destination:** warranty and liability exposure; cost-to-serve; spec retention (secondary).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** document downloads show activity, not field configurations. An LLM answering compatibility questions without controlled retrieval is the failure mode the compliance adviser warns about (D.3 `[single G]`).
- **Differentiation:** **requires the join — does not exist today**.
- **Worked example `[illustrative]`:** after a backorder-driven SKU substitution, 6 sites report the substitute on a legacy loop. LiSN flags it. Product Management decides whether the combination is supported.
- **Regulatory/governance hook:** UL 864 (edition K-7), UL 268 7th replacement rules `[3-src]`, EN 54 system compatibility `[2-src]`, EU CPR 2024/3110 `[3-src]`.
- **Feasibility (four-lens):**
  - *Data needed:* a machine-readable compatibility matrix.
  - *Hardest part:* extracting part numbers from free text.
  - *False-positive risk:* medium.
  - *Must be true in Discovery:* the matrix exists as data, not just as PDFs.
  - *Panel disagreement:* the compliance adviser wants this at T2 day one. The PE partner ranks it low unless it is tied to warranty.
- **Residual risk LiSN does NOT address:** listing determination; unreported field use.
- **See also:** UC-C-7 (different decision: unblocking backlog when substitutes are refused) and UC-C-14 (different decision: spec-win risk from documentation friction).

### UC-Q-12 — China vertical/application anomaly (GST and localised Edwards × energy storage, rail, petrochemicals, electronics, data centres)
- **Archetype:** application-segment baseline · **Bucket:** B · **Proposed tier:** T3 (parked; v2) · **Demo candidate:** **Y for v2**. These are Kartik's own stated verticals (M0.1-1 `[4-src]`).
- **Signal:** the same product shows different symptom rates or new phrasing in one vertical or application, for example aspirating detection in energy-storage sites, intermittent faults in rail, or gas-releasing panels in electronics fabs.
- **Cadence/trigger:** weekly; runs around each new vertical project.
- **Primary user → routed exec(s):** China GM → Product Management (localisation); Quality; President Commercial Fire for flagship reference sites.
- **Source trace:** MH-15 `[single — preserve]` P, supported by the X architect; M0.1-1 `[4-src]`; X China disagreement (margin risk vs ideal early-warning case) `[single X]`; GST GP01 `[single G]` `[src-unresolved]`; AirSense/ASD data centres `[3-src]`; X "Kidde ASD claims intelligent filtering… must be verified at site level" **recovered** `[single X, marketing-grade]`.
- **1. Data aggregation:** *Interaction:* Chinese-language service records, distributor and integrator tickets, project emails (channels to be confirmed in Discovery). *Operational:* project register with vertical/application tag, GST and localised Edwards product master, shipments, commissioning dates.
- **2. Baseline creation:** per product × vertical rate against the same product's all-vertical rate. Seasonality (including Lunar New Year shutdowns) comes from own history. The denominator is installed units per project.
- **3. Dynamic detection:** vertical-specific rate ratio ≥2.5 across ≥3 projects, or a novel phrase cluster confined to one vertical. **Join:** contact ↔ project ↔ vertical tag ↔ product.
- **4. Distillation:** uses a bilingual taxonomy (brand-, language- and region-specific thresholds per the F4 consensus). Suppresses commissioning-volume spikes at large project starts. Ranking = reference-site weight × vertical growth priority × severity.
- **5. Surfacing & routing:**
  - **Card headline:** "Aspirating detectors at energy-storage projects: 'flow fault / filter blocked' 3.4× vs same model elsewhere; 5 projects, 2 provinces" `[illustrative]`.
  - **Severity:** S2 · spread · blast radius 5 projects · incident flag off.
  - **Confidence:** L–M 0.45.
  - **Draft artefact:** application-engineering brief plus localisation input.
  - **Human gate:** China GM + Product Management.
  - **UI hero:** *vertical lens* small multiples.
- **Join tags:** brand (GST/Edwards-localised) · product · vertical/application · province · project · partner · time. **P&L destination:** bookings growth in stated verticals; reference-site protection; warranty cost.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** global dashboards average dissimilar environments (P).
- **Differentiation:** **requires the join — does not exist today**.
- **Worked example `[illustrative]`:** as in the card. Filter and flow faults at energy-storage sites could reflect the application rather than the product. LiSN presents both candidates, and application engineering decides.
- **Regulatory/governance hook:** CCC and Chinese national standards (GST cites CCC approvals `[3-src, marketing-grade]`); specific energy-storage fire codes and China data-residency rules were **not verified in Stage 0**, so local counsel is needed.
- **Feasibility (four-lens):**
  - *Data needed:* vertical tags on projects.
  - *Hardest part:* Chinese-language channel access and in-country deployment.
  - *False-positive risk:* medium, from small numbers of projects.
  - *Must be true in Discovery:* a project register exists.
  - *Panel disagreement:* X preserved: the PE partner sees China as a margin and working-capital risk; the architect sees the ideal early-warning case.
- **Residual risk LiSN does NOT address:** channels KGS does not hold (domestic integrators' own tools); in-country deployment constraints.
- **See also:** UC-C-19 (different decision: tender, approval, delivery and receivable friction in the same verticals — commercial, not product).

### UC-Q-13 — Site-type performance of wireless and aspirating products (EMS FireCell/SmartCell battery and radio; AirSense)
- **Archetype:** life-curve vs claim envelope · **Bucket:** B · **Proposed tier:** T3 · **Demo candidate:** N `[long-tail — preserve]`.
- **Signal:** battery-low and radio-link-loss contacts arrive well ahead of claimed life, or concentrate in a building type (cold store, heavy steel/concrete, heritage); aspirating flow faults concentrate by site type.
- **Cadence/trigger:** monthly.
- **Primary user → routed exec(s):** VP Engineering (UK-EU wireless) → Product Management; Marketing/Legal where a published claim is affected.
- **Source trace:** EN 54-25 row "battery, radio-range and installation-condition issues by product and country" `[2-src G P]`, **recovered as a use case** (it was held only as a regulatory row); EMS FireCell I/O "claimed battery life up to ten years" `[single P]`; AirSense `[4-src]`; X ASD claim-verification point **recovered**.
- **1. Data aggregation:** *Interaction:* battery, radio and flow contacts; field notes. *Operational:* site master (building type), device install dates, CS+ battery telemetry where available, RMA.
- **2. Baseline creation:** hazard of battery-replacement contact by months in service, per device × site type, compared with the expected curve implied by the published claim.
- **3. Dynamic detection:** the hazard curve crosses the claim envelope. For example, battery-low contacts at under 40% of claimed life at ≥2× other site types. **Join:** contact ↔ device install date ↔ site type.
- **4. Distillation:** single-site radio interference becomes a site-service signal. No weather or external data is used; environment comes only from the site master.
- **5. Surfacing & routing:**
  - **Card headline:** "FireCell devices in cold-store sites: battery-low contacts at month 30, 3.1× other site types" `[illustrative]`.
  - **Severity:** S3 (S2 if devices drop off supervision) · slope · blast radius (devices in site type) · incident flag off.
  - **Confidence:** L 0.4.
  - **Draft artefact:** application guidance plus an engineering brief.
  - **Human gate:** VP Engineering.
  - **UI hero:** *life-curve vs claim envelope*.
- **Join tags:** brand · product · site type · country · install cohort. **P&L destination:** warranty cost; service cost; marketing-claim exposure.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** it needs a months-in-service denominator that no case report carries.
- **Differentiation:** **requires the join — does not exist today**.
- **Worked example `[illustrative]`:** as in the card.
- **Regulatory/governance hook:** EN 54-25 `[2-src]`; EU CPR declaration of performance `[3-src]`.
- **Feasibility (four-lens):**
  - *Data needed:* device-level install dates and site type.
  - *Hardest part:* data sparsity.
  - *False-positive risk:* medium.
  - *Must be true in Discovery:* the site type is recorded.
  - *Panel disagreement:* the PE partner parks it. The compliance adviser values the claim-exposure angle.
- **Residual risk LiSN does NOT address:** installation-quality effects on radio range; small populations.

### UC-Q-20 — Monitoring-centre interoperability, test/impairment-notice and repeat-event preventive-action watch
*(Added by the red-team reviewer to close a coverage gap: contact-map rows 26 and 27 and the monitoring-station stakeholder had no owning use case.)*
- **Archetype:** signal-path integrity (panel → communicator → monitoring centre) · **Bucket:** B · **Proposed tier:** T2 for the monitoring-ticket × site × firmware join; T3 for the test-notice and preventive-action join, because ITM/FSM work orders sit outside the H.4 pilot ingest · **Demo candidate:** N `[long-tail — preserve]`.
- **Signal:** three linked patterns on one site cohort.
  - (a) Monitoring-station and integrator tickets describe event-semantics problems (alarm received as trouble, events not restoring, supervisory mis-mapped, duplicate or missing signals). They rise for one platform × firmware × communicator/receiver-format combination, often after a release.
  - (b) Unwanted-dispatch or "not on test" language clusters around planned ITM tests, which means pre- and post-test notifications are not reaching the monitoring centre or AHJ.
  - (c) Nuisance or trouble events recur at the same sites after a documented preventive action (cleaning, replacement, sensitivity change), which means the action did not hold.
- **Cadence/trigger:** weekly; starts on each firmware release and each communicator/receiver-format change; monthly for preventive-action effectiveness.
- **Primary user → routed exec(s):** VP Service & Tech Support → VP Engineering (event model and interfaces) for (a); service operations / ITM partner channel lead for (b); Product Management + Quality for (c); PSIRT only if (a) co-occurs with cyber-indicative language (UC-Q-8).
- **Source trace:** contact row 27 planned test/impairment/restoration notices `[single — preserve]` X; row 26 preventive action `[single]` P; row 25 nuisance and monitoring-centre complaints `[4-src]`; A.4 monitoring station / BMS / security OEM ("reliable signal transmission, clear event semantics, stable interfaces, cyber-safe updates") `[2-src P X]`; C.4 #8 firmware/compatibility questions after a release `[P X]`; C.2 "why KGS must initiate contact" (NFPA-style pre/post-test notifications and record retention) `[X, supported by G P]`; G NFPA 72 row (test notifications and records) `[4-src]`; Personas E9. **Recovered as a use case**: the dossier held these only as contact rows and a stakeholder row, and the UC-C file noted row 27 as "not mined".
- **1. Data aggregation:** *Interaction:* monitoring-station integration tickets; integrator and dealer calls and emails mentioning central station, dispatch, "test", "impairment" or "placed on test"; after-hours line; field notes. *Operational:* site master with monitoring-centre and communicator details where held; panel firmware per site; product master for communicators and dialers; release register; (T3) ITM/FSM work orders with test dates and notification records; preventive-action records from service recommendations.
- **2. Baseline creation:** monitoring-related tickets per 1,000 monitored sites per month, by platform × firmware × communicator format. Counts are small at KGS volume (tens a month in total), so baselines are **pooled hierarchically** (combination → platform → region → global). Test-window language has its own baseline. For (c), each site's own pre-action event rate is the baseline.
- **3. Dynamic detection:**
  - (a) Event-semantics tickets for one combination reach ≥2× the pooled baseline over 6 weeks **and** come from ≥3 independent integrators or monitoring centres, or step up within 30 days of a release.
  - (b) ≥3 unwanted-dispatch or "not on test" mentions from ≥2 partners in a region within a quarter; at T3, joined to work orders that show a test on the same day.
  - (c) The post-action event rate stays ≥80% of the pre-action rate at ≥5 sites for the same action type.

  All thresholds are `[illustrative]` and tuned in Discovery. **Join:** ticket ↔ site ↔ panel firmware/communicator ↔ release date; at T3 also ↔ work-order test date ↔ notification record.
- **4. Distillation:** separates receiver-side or telecom-carrier issues (one monitoring centre, all brands) from panel-side patterns (many centres, one firmware). Suppresses planned-test windows that were notified, so row 27 serves both as suppression input and as signal. Routes any "alarm not received" or "system disabled after false dispatch" language to S1 through UC-Q-7. Ranking = severity × sites affected × monitoring centres involved × dispatch cost.
- **5. Surfacing & routing:**
  - **Card headline:** "Panel platform B (synthetic), fw B.2 (synthetic): 'alarm received as trouble' tickets from 5 monitoring centres 2.4× pooled baseline since release; 31 sites" `[illustrative]`.
  - **Severity:** S2 (S1 if any "alarm not received") · cliff · blast radius 31 sites / 5 monitoring centres · incident flag on only if a missed or delayed dispatch is mentioned.
  - **Confidence:** M 0.55 (K: 19 tickets with site and firmware in record; I: 12 with firmware imputed from ship date).
  - **Recommended action:** interface and event-mapping review against the receiver formats involved; application note to integrators; for (b), a test-notification checklist for ITM partners.
  - **Draft artefact:** engineering interface brief (tickets, receiver formats, firmware, counter-evidence) plus a draft partner bulletin (not sent).
  - **Human gate:** VP Engineering for interface changes; VP Service for partner guidance.
  - **UI hero:** *signal-path Sankey* (panel → communicator → receiver format → outcome) with the fault flows lit.
- **Join tags:** brand · platform · firmware · communicator/receiver format · monitoring centre (as counterparty, never scored) · site type · region · partner · time. **P&L destination:** cost-to-serve (truck rolls and escalations after unwanted dispatch) and warranty cost; secondary: service-contract retention with national accounts.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** monitoring-station tickets are coded "integration" or "connectivity" and spread across integrators. No report joins them to firmware and release date. Test-notification failures sit in partner work orders that KGS never sees aggregated. An LLM has no site-to-firmware map and no baseline.
- **Differentiation:** **requires the join — does not exist today** (to be tested in Discovery, not asserted).
- **Worked example `[illustrative]`:** over six weeks after a synthetic release B.2, 31 tickets from 5 monitoring centres across 11 integrators describe supervisory and alarm events arriving as trouble, against a pooled baseline of ~5 a month for that platform. 24 of the 31 sites run B.2 and one receiver format. Sites on B.1 with the same format show nothing, which is the counter-evidence line. Separately, 4 unwanted-dispatch mentions in one region cluster on scheduled test days (the T3 join is pending).
- **Regulatory/governance hook:** NFPA 72 test notifications, qualified service and record retention `[4-src]`; UL 864 listed-configuration change control if communicator compatibility is affected (edition K-7 unverified); monitoring-centre standards (e.g. UL 827) were **not researched in Stage 0**, so verify before citing.
- **Feasibility (four-lens):**
  - *Data needed:* monitoring-station tickets identifiable by queue or account type; site → panel firmware.
  - *Hardest part:* identifying the monitoring centre and receiver format from free text. Most monitoring traffic goes dealer → centre and never reaches KGS (row 25).
  - *False-positive risk:* medium. Telecom or carrier outages mimic panel-side patterns; the multi-centre condition controls for this.
  - *Must be true in Discovery:* monitoring-station tickets form a recognisable queue or account type; for T3, ITM partners share work orders.
  - *Panel disagreement:* the service VP says (b) is a partner-process matter on which KGS can only advise. The compliance adviser says missed test notifications are an NFPA records issue worth tracking. The architect says counts are so small that pooling is mandatory. The PE partner rates it low unless it is tied to national-account renewals.
- **Residual risk LiSN does NOT address:** dispatch outcomes held only by monitoring centres; AHJ fines; receiver-side defects outside KGS; whether partners adopt test-notification guidance.
- **See also:** UC-Q-6 (different decision: detector nuisance performance) and UC-C-16 (different decision: national-account renewal risk, which these escalations feed).

---

## Bucket A — pipeline use cases that beat a self-built dashboard (interaction-side or substrate-side)

### UC-Q-14 — Emergent fault-phrasing and taxonomy-drift detector
- **Archetype:** semantic novelty / code drift · **Bucket:** A (interaction-side) · **Proposed tier:** T2 · **Demo candidate:** N. It sits inside the hero as the "new phrasing" chip.
- **Signal:** a new symptom phrasing appears across independent technicians, or a new failure is absorbed into an old reason code, so the code total stays flat while its meaning shifts.
- **Cadence/trigger:** daily.
- **Primary user → routed exec(s):** VP Service & Tech Support → VP Engineering (if severity terms appear); feeds UC-Q-1/2.
- **Source trace:** C.4 #2 `[C P]`; G white-space row "technical-support emerging issue → engineering loop… KB may normalise a new failure into an old category" **recovered** (the dossier folded it into MH-1/MH-6) `[single G]`; MD-1 `[single P]`; C.1 multi-label `[2-src G P]`; D.2 lost technical context `[4-src]`.
- **1. Data aggregation:** *Interaction:* all transcripts, notes and emails. *Substrate:* the reason-code set, KB article links used in resolutions.
- **2. Baseline creation:** the historical frequency of each embedding cluster; each reason code's semantic centroid and dispersion over 26 weeks.
- **3. Dynamic detection:** a novel cluster (distance to every centroid above the calibrated threshold) with ≥3 independent partners in 21 days; or a sub-cluster inside one code growing ≥3× while the code total stays within ±10%.
- **4. Distillation:** merges synonyms across English, Mandarin and other languages; suppresses new-product how-to (launch-tagged); suppresses single-author clusters. Ranking = severity lexicon × growth × SI.
- **5. Surfacing & routing:**
  - **Card headline:** "New phrasing — 'NAC goes into trouble after drill reset': 7 partners, 3 weeks; currently coded 'Programming – general'" `[illustrative]`.
  - **Severity:** S2 · novel · blast radius unknown until joined (shown as "unsized") · incident flag off.
  - **Confidence:** M 0.5.
  - **Draft artefact:** taxonomy change proposal plus an engineering heads-up.
  - **Human gate:** VP Service.
  - **UI hero:** *emerging-phrase constellation*.
- **Join tags:** platform (text-extracted) · partner · region · channel · time. **P&L destination:** warranty cost (earlier detection); cost-to-serve.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** CRM reports count named categories only. An LLM reads case by case, with no cross-case memory or baseline.
- **Differentiation:** interaction-visible.
- **Worked example `[illustrative]`:** as in the card.
- **Regulatory/governance hook:** feeds the chronology in UC-Q-7 (the first-mention timestamp).
- **Feasibility (four-lens):**
  - *Data needed:* text only.
  - *Hardest part:* calibrating the novelty threshold.
  - *False-positive risk:* medium.
  - *Must be true in Discovery:* access to 12+ months of history.
  - *Panel disagreement:* the architect wants every novel cluster listed. The service VP wants only severity-lexicon clusters shown.
- **Residual risk LiSN does NOT address:** it cannot size the population without the Bucket B joins.
- **See also:** UC-C-11 (different decision: knowledge/tool fixes for genuine how-to clusters; its guard routes suspected new failures here).

### UC-Q-15 — Workaround proliferation and conflicting-guidance detector
- **Archetype:** guidance-drift · **Bucket:** A · **Proposed tier:** T2 · **Demo candidate:** N.
- **Signal:** KGS agents' outbound resolutions and partner-shared advice converge on an undocumented workaround ("roll back to prior version", "power-cycle node twice", "disable ground-fault detection"), or answers from three repositories disagree. Either can mask a defect or introduce unsafe practice.
- **Cadence/trigger:** weekly.
- **Primary user → routed exec(s):** VP Service & Tech Support → VP Engineering; Quality if the workaround disables supervision or detection.
- **Source trace:** contact row 6 "undocumented workaround proliferation" `[2-src P X]`; D.2 conflicting repositories `[single — preserve]` G; MH-1 earliest signal "repeated workaround" `[4-src]`; X outbound "known issue / firmware guidance" `[single X]`.
- **1. Data aggregation:** *Interaction:* agent notes, outbound emails, screen-share notes. *Substrate:* KB and technical-literature repository.
- **2. Baseline creation:** frequency of each workaround phrase per platform, per agent team, over 13 weeks.
- **3. Dynamic detection:** a workaround used by ≥3 agents or partners without a KB article, or ≥3× its baseline. Any workaround that disables supervision is S1-adjacent.
- **4. Distillation:** excludes sanctioned KB steps. Ranking = safety impact × spread.
- **5. Surfacing & routing:**
  - **Card headline:** "'Roll back to v[x-1]' advised in 19 cases by 6 agents; no bulletin exists" `[illustrative]`.
  - **Severity:** S2 · spread · blast radius (cases) · incident flag off.
  - **Confidence:** H 0.8 (knowledge: the agents' own text).
  - **Draft artefact:** KB article draft or engineering escalation.
  - **Human gate:** VP Service + Engineering.
  - **UI hero:** *workaround spread graph*.
- **Join tags:** platform · firmware (text) · agent team · partner · time. **P&L destination:** cost-to-serve; warranty; liability.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** no code exists for "advice given". Only full-text coverage across agents shows convergence.
- **Differentiation:** interaction-visible (substrate KB comparison).
- **Worked example `[illustrative]`:** as in the card. A rollback workaround is often the earliest trace of a firmware regression (hand-off to UC-Q-1).
- **Regulatory/governance hook:** NFPA 72 qualified-service expectations; documented-guidance defensibility.
- **Feasibility (four-lens):**
  - *Data needed:* outbound text.
  - *Hardest part:* KB matching.
  - *False-positive risk:* low.
  - *Must be true in Discovery:* agent notes are captured.
  - *Panel disagreement:* the service VP rates this high (agent behaviour is in their control). The architect rates it moderate.
- **Residual risk LiSN does NOT address:** dealer-to-dealer advice outside KGS channels.
- **See also:** UC-C-11 (different decision: deflection via KB and tools; its conflicting-repository flag overlaps, but safety-relevant workarounds belong here).

### UC-Q-16 — Product capability-gap signal (migration diagnostics)
- **Archetype:** roadmap input from field friction · **Bucket:** A · **Proposed tier:** T1/T2 · **Demo candidate:** N.
- **Signal:** during EST3→EST4 migration, contacts ask for diagnostics the predecessor offered. Edwards itself stated Signature diagnostics in EST4 were not yet as robust (MD-2; June 2022 HDT webinar Q&A — current status unverified, not a claim about today's product). The gap generates calls and truck rolls. The decision is the product roadmap; the EOL-migration miner owns the revenue decision.
- **Cadence/trigger:** monthly.
- **Primary user → routed exec(s):** Product Management (Edwards) → VP Engineering; VP Service.
- **Source trace:** MD-2 `[single — preserve]` C; D.2 migration diagnostic gap `[2-src C P]`; MD-3, MD-9 `[C]`; EST3 halt 31 Dec 2023 `[single C]`.
- **1. Data aggregation:** *Interaction:* post-migration troubleshooting contacts. *Substrate:* feature list and release notes; HDT tool references.
- **2. Baseline creation:** capability-request rate per migrated site per month.
- **3. Dynamic detection:** request share ≥10% of post-migration troubleshooting contacts, or ≥2× growth as migrations scale.
- **4. Distillation:** separates the capability gap from training need ("where is the menu"). Ranking = attributed truck rolls.
- **5. Surfacing & routing:**
  - **Card headline:** "12% of post-migration EST4 troubleshooting contacts ask for Signature device diagnostics available on EST3; ~0.4 extra truck rolls per migrated site" `[illustrative]`.
  - **Severity:** S4 · slope · blast radius (migrated sites) · incident flag off.
  - **Confidence:** M 0.6.
  - **Draft artefact:** product requirement brief.
  - **Human gate:** Product Management.
  - **UI hero:** *gap-cost bar*.
- **Join tags:** platform · migration cohort · region · partner. **P&L destination:** cost-to-serve; migration win rate (secondary).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** feature requests are scattered across cases and never coded.
- **Differentiation:** interaction-visible.
- **Worked example `[illustrative]`:** as in the card.
- **Regulatory/governance hook:** none direct; NFPA 72 ITM efficiency.
- **Feasibility (four-lens):**
  - *Data needed:* text plus migration flag.
  - *Hardest part:* separating the gap from training.
  - *False-positive risk:* low.
  - *Must be true in Discovery:* migration sites can be identified.
  - *Panel disagreement:* none material.
- **Residual risk LiSN does NOT address:** roadmap capacity.
- **See also:** UC-C-9 (different decision: migration revenue and at-risk EST3 sites, not the product roadmap).

### UC-Q-17 — RMA and case evidence-completeness radar (traceability prerequisite)
- **Archetype:** data-quality radar · **Bucket:** A (substrate-side) · **Proposed tier:** T1 · **Demo candidate:** N. It is Discovery-critical, because it is how LiSN earns the right to run UC-Q-1/2.
- **Signal:** the share of fault cases and RMAs missing model, serial/date code, firmware or end-site, by channel, partner and region, and the share recoverable from text or photos. It also tracks RMA evidence-request loops.
- **Cadence/trigger:** weekly; also on any system cutover.
- **Primary user → routed exec(s):** Quality → VP Service & Tech Support; CIO (field requirements).
- **Source trace:** contact row 12 "most RMA cases require at least one follow-up" `[2-src P X]`; C.4 caveat on structured serials `[single C]`; H.4 precondition; D.2 lost technical context `[4-src]`.
- **1. Data aggregation:** *Substrate:* case and RMA structured fields. *Interaction:* free-text and photo extraction of serials and date codes (photo extraction `[inference, to validate]`).
- **2. Baseline creation:** completeness rate per channel and partner over 13 weeks.
- **3. Dynamic detection:** a completeness drop of ≥10 points in any channel or partner, or recoverable-but-missing ≥30%.
- **4. Distillation:** reports only the fields that feed quality joins.
- **5. Surfacing & routing:**
  - **Card headline:** "Only 38% of EST4 trouble cases carry firmware; 61% recoverable from text" `[illustrative]`.
  - **Severity:** S4 (enabler; no product-risk class) · slope · blast radius: share of fault cases and RMAs unusable for UC-Q-1/2 joins · incident flag n/a.
  - **Confidence:** H 0.9 (K: blank-field counts; I: "recoverable from text" share, which is an extraction estimate).
  - **Draft artefact:** RMA/case form field-change proposal.
  - **Human gate:** Quality + VP Service.
  - **UI hero:** *traceability gauge*.
- **Join tags:** channel · partner · region · system · field. **P&L destination:** warranty cost (NFF reduction) and containment precision (narrower scope means lower recall cost).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** a dashboard can count blank fields but cannot say what is recoverable from text.
- **Differentiation:** substrate-visible.
- **Worked example `[illustrative]`:** as in the card.
- **Regulatory/governance hook:** CPSC chronologies and CRA fleet mapping both depend on product identity `[4-src]`.
- **Feasibility (four-lens):**
  - *Data needed:* field exports.
  - *Hardest part:* photo extraction.
  - *False-positive risk:* low.
  - *Must be true in Discovery:* this is the first Discovery output.
  - *Panel disagreement:* the PE partner sees data plumbing. The architect sees the licence to operate.
- **Residual risk LiSN does NOT address:** serials that were never captured.

### UC-Q-18 — Residential consumer hazard and recall-surge intelligence (adjacency only)
- **Archetype:** consumer rare-event surveillance plus surge triage · **Bucket:** A (B extension with a lot join) · **Proposed tier:** T3 parked for the Commercial Fire pitch · **Demo candidate:** N. Framing rule: residential is a proxy only (0.7 `[3-src]`); this is not Kartik's P&L.
- **Signal:** "did not alarm", heat, smoke, discharge failure or injury language by model and date code in consumer calls, retailer reviews and social; plus recall-period triage of eligibility contacts.
- **Cadence/trigger:** daily; real-time during any recall.
- **Primary user → routed exec(s):** President Residential → Quality; CLO/Regulatory; Care.
- **Source trace:** MH-12 `[2-src C P]`; 0.7 recalls `[2-src/3-src]`; contact row 36 `[4-src]`; C: the 2017 recall "generated structured replacement requests by model, serial and date code" **recovered** `[single C]`; P residential care outbound fulfilment row `[single P]`; Kidde strobe notice `[single X]`.
- **1. Data aggregation:** *Interaction:* consumer calls, chat, web forms, retailer reviews, social. *Operational (extension):* date code ↔ factory lot, retailer sell-in.
- **2. Baseline creation:** per model × date code rate of severe-lexicon mentions; recall-period eligibility-contact curves.
- **3. Dynamic detection:** as UC-Q-7 (presence-based S1), plus a date-code scan.
- **4. Distillation:** separates chirp and battery end-of-life noise from hazard, and recall eligibility from hazard.
- **5. Surfacing & routing:**
  - **Card headline:** "Model family Z, date codes 2502–2505: 'did not sound during fire' in 3 independent reviews and 1 call" `[illustrative, hypothetical]`.
  - **Severity:** S1 · novel · blast radius (units sold) · incident flag on if a fire is mentioned.
  - **Confidence:** L.
  - **Draft artefact:** awareness chronology pack (as UC-Q-7).
  - **Human gate:** CLO.
  - **UI hero:** as UC-Q-7.
- **Join tags:** model · date code · retailer · region · channel. **P&L destination:** recall cost; retailer charge-backs; brand spill-over into Commercial.
- **Why it beats a self-built dashboard / CRM report / generic LLM:** sentiment scoring underweights rare severe reports (P).
- **Differentiation:** interaction-visible (join required for the lot extension).
- **Worked example `[illustrative]`:** a proxy narrative only: historical recalls ranged from ~226k TruSense units (2021) to ~40.5m extinguishers (2017) `[proxy]`.
- **Regulatory/governance hook:** CPSC §15(b) `[4-src]`.
- **Feasibility (four-lens):**
  - *Data needed:* consumer channels.
  - *Hardest part:* review-to-product identity.
  - *False-positive risk:* high.
  - *Must be true in Discovery:* Residential sponsorship (not Kartik).
  - *Panel disagreement:* the PE partner says keep it out of the Kartik pitch. The compliance adviser says mention it as portfolio-level de-risking.
- **Residual risk LiSN does NOT address:** consumer products never discussed publicly.

### UC-Q-19 — External corroboration of internal quality signals (installer forums and reviews)
- **Archetype:** corroboration-only external layer · **Bucket:** A · **Proposed tier:** T1 (T3 for automated corroboration) · **Demo candidate:** N `[long-tail — preserve]`.
- **Signal:** a public installer thread (r/firealarms, thefirepanel.com, and later eng-tips and Mike Holt) describes the same symptom as an internal cluster. This adds SI; it is never a primary trigger.
- **Cadence/trigger:** weekly.
- **Primary user → routed exec(s):** Quality (as an evidence attachment) → Product Management.
- **Source trace:** D.1 MD-1, MD-5, MD-6, MD-8 `[P C]`; K-8 sufficiency conflict; E public chatter join `[4-src]`; 4-src gap: eng-tips, Mike Holt, Trustpilot not mined.
- **1. Data aggregation:** *Interaction:* public forum posts and reviews.
- **2. Baseline creation:** mention frequency per platform; thin by design (K-8: illustrate, never quantify).
- **3. Dynamic detection:** semantic match of a public post to an active internal cluster, time-aligned within ±60 days.
- **4. Distillation:** **no identity matching** of posters to accounts; brand-ambiguous posts are dropped.
- **5. Surfacing & routing:**
  - **Card:** a chip on the internal signal: "1 public installer post matches (r/firealarms, 12 days ago)" `[illustrative]`.
  - **Severity:** inherited from the internal signal it corroborates; a public post never sets or raises the severity class on its own.
  - **Confidence effect:** raises SI by 0.05–0.1 only.
  - **Human gate:** Quality.
  - **UI hero:** *public-echo chip*.
- **Join tags:** platform · symptom · time. **P&L destination:** warranty cost (confidence in earlier action).
- **Why it beats a self-built dashboard / CRM report / generic LLM:** it ties public anecdote to a baseline-scored internal cluster instead of treating it as noise or as fact.
- **Differentiation:** interaction-visible (external).
- **Worked example `[illustrative]`:** as in the card.
- **Regulatory/governance hook:** public posts can be part of "information reasonably supporting" awareness; counsel decides.
- **Feasibility (four-lens):**
  - *Data needed:* public scraping within site terms.
  - *Hardest part:* brand ambiguity (G, X).
  - *False-positive risk:* high, so it is used for corroboration only.
  - *Must be true in Discovery:* none.
  - *Panel disagreement:* G/X say the public corpus is too thin; C/P say it is illustrative (K-8).
- **Residual risk LiSN does NOT address:** it cannot represent the installer base.
- **See also:** UC-C-2 (different decision: competitive response to switching language; it also uses public forums as corroboration only).

---

## Panel notes

### Sharpest disagreements (not averaged)

1. **Single-source S1 routing to the President (UC-Q-7, UC-Q-8).** The architect and compliance adviser route any credible S1 immediately to Quality and CLO and let the President see the uncorroborated watch item. The service VP insists the President sees only corroborated cohorts with a named owner, or the tile becomes noise. The PE partner agrees with the VP except where a statutory clock may be running (X). My position: route S1 to Quality/CLO/PSIRT at once, and show the President a count of open S1 watches and their clock status, not the items.
2. **Imputed firmware and serials (UC-Q-1, UC-Q-2).** The architect says an imputed denominator (ship date, download logs) is enough to alert with a confidence band. The compliance adviser says any imputed attribute must stay visibly marked I (inference) and must never enter a regulator chronology pack as fact. The service VP adds that if fewer than half the cases carry firmware, UC-Q-1 falls back to UC-Q-14 and the demo must not overclaim.
3. **Telemetry join (UC-Q-5).** The PE partner and the digital lead see it as a ConnectedSafety+ renewal lever and want it in v1. The compliance adviser raises owner and dealer data rights over telemetry. The architect warns of selection bias, because connected sites are newer and better maintained, so rates do not generalise to the disconnected base.
4. **Where safety and cyber sit in the pitch.** The compliance adviser wants UC-Q-7/8 at T2 from pilot day one across all channels (P consensus). The PE partner wants the headline to stay margin (UC-Q-1/2/3) and regulation shown as de-risking (C). This matches the dossier's resolution: narrow commercial pilot, all-channel safety and cyber surveillance, governed tile.

### Five strongest demo / UI candidates

1. **UC-Q-1 firmware lineage river:** the hero. A per-version rate against the release marker with an installed-base denominator shows the join in one glance.
2. **UC-Q-2 serial-range heat strip beside a green aggregate:** the most persuasive single visual of aggregate-rate blindness, and it speaks Kartik's Six Sigma language (special cause vs control limit).
3. **UC-Q-7 awareness chronology timeline:** shows "when did we first possess the information", with the human gate visible and no reportability claim.
4. **UC-Q-8 CRA clock ring with fleet-by-country map:** time-sensitive (live since 11 Sep 2026) and concrete about the governed PSIRT hand-off.
5. **UC-Q-5 voice-vs-telemetry quadrant:** makes ConnectedSafety+ the hero and pre-empts "does this compete with our digital product?"

(UC-Q-12 China vertical lens is the reserve for v2, tied to Kartik's stated verticals.)

### Recall note: items recovered from raw engine files that the dossier dropped or under-weighted

| Item | Engine | Used in |
|---|---|---|
| Peer fire-panel cyber advisory **CISA ICSA-25-148-03 (Consilium CS5000)**. The dossier kept only the non-KGS Carrier Block Load advisory | C | UC-Q-8 |
| **US TREAD Act** early-warning reporting (warranty claims, field reports, complaints) as a regulatory analogy for systematic text-mining of defects `[proxy]` | C | UC-Q-7 |
| The 2017 recall "generated structured replacement requests by model, serial and date code", which fits surge triage | C | UC-Q-18 |
| NFPA's 73%-cooking statistic comes from a 2010 *household* survey and is not commercial data (baseline caveat) | C | UC-Q-6 |
| ORR: replacements must comply with UL 268 7th edition (retrofit detector cohorts) | C | UC-Q-6, UC-Q-11 |
| Tariffs on China-made components (TruSense made in China) as a trigger for supplier substitution `[C inference, unverified]` | C | UC-Q-4 |
| EST4 embedded web server alongside the AES/FIPS 197 firewall (cyber surface) | C | UC-Q-8 |
| Quality-engineer need from the 2018 dual-sensor recall: join contact symptoms to **production process, lot and inspection data**, not complaint text alone | P | UC-Q-2 |
| UL 268 row: join nuisance language to detector **sensitivity setting** and **production batch**. The dossier kept only type and environment | P | UC-Q-6 |
| EN 54-25 relevance "battery, radio-range and installation-condition issues by product and country", plus FireCell I/O 10-year battery claim. The dossier held it only as a regulatory row | P | UC-Q-13 |
| Honeywell multi-criteria sensing to cut false alarms (competitive proxy for nuisance performance) | P | UC-Q-6 |
| G white-space row "technical-support emerging issue → engineering loop"; the **KB may normalise a new failure into an old category**. The dossier folded it into MH-1/MH-6 | G | UC-Q-14 |
| GST GP01 is a **gas-releasing** control panel, so "failure to release" belongs in the S1 lexicon. The dossier carried GP01 only as a UL 864 certification fact `[src-unresolved]` — re-source before client use | G | UC-Q-7, UC-Q-12 |
| X E-map: connected-panel join detects "**silent degradation or poor incident communication**"; cloud identity/access logs as a source | X | UC-Q-5 |
| X E-map: listing/safety/cyber notices, "**incomplete notification/remedy reach**". The dossier's MH-17 narrowed it to cyber advisories only | X | UC-Q-9 |
| X architect: "**poor identity resolution can create false cohorts**", so confidence and evidence links must be kept | X | UC-Q-5, UC-Q-10 |
| X PE partner: fund first where it cuts warranty, expedite and field cost **and creates a durable standalone data asset** (a carve-out value angle for quality joins) | X | framing for UC-Q-1/2/3 |
| X: Kidde ASD "intelligent filtering" for data centres is a vendor claim to verify at site level | X | UC-Q-12, UC-Q-13 |
| EMS manufacturing moved to other KGS European sites, used as a **production-transfer change event** `[2-src G P]` | G P | UC-Q-4 |

**Brief compliance check:** join tags and a P&L metric appear on every use case. Confidence markers split K from I. Severity is rendered (class, type, blast radius, incident flag). Every action has a human gate, and "aids resolution" is the framing throughout. There are no weather or macro claims. Candidate causes only, never root cause. No KGS defect is implied, and all examples are `[illustrative]`. Residential appears as adjacency only.
