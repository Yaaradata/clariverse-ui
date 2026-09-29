# CONTEXT_DIGEST — LiSN × KGS Global Commercial Fire demo (Pass 0)

**Written:** 29 Sep 2026 · **Scope:** everything in `frontend/Carrier KiddeGlobal/` · **Status:** read-only digest; nothing in the KB was changed.

## How this was read

- **Read by me directly:** `00_README_START_HERE.md` (top-level and pack copies are byte-identical), `CONTEXT.md`, `REVIEW_NOTES.md`, `08_Demo_Script_and_QA.md`, `Stage1-ReviewLog-UseCaseIndex…md`, `Kartik Kumar Carrier.pdf` (3 pages).
- **Read in full by parallel reader agents, notes checked against each other:**
  - the four Stage 0 dossiers and the MERGED dossier;
  - Stage 1 Personas and Messaging;
  - both Stage 1 use-case files;
  - 01, 02, 03, 04, 05a, 06 and 07;
  - everything in `mock/`: README, `types.ts`, `lib/*.ts`, 9 JSON files, `check_report.txt`, and both `.py` files;
  - the 7 `ref/*.png`;
  - the 4 PDFs in `Screens for CardsHead/`.
- **Files that could not be read:** none.
  - The four screen PDFs could not be page-selected because poppler is not installed. Each was read whole instead: 1 + 2 + 2 + 2 pages, one 2560px image per page, the same content as the `ref/*.png` renders.
- **Checks not re-run:** `check_mock.py` writes `check_report.txt`, and the KB is read-only, so I did not run it. The 19 / 19 result below is from the committed report.

**Source tags used below:**

| Tag | File |
|---|---|
| [00] … [08] | the numbered briefs in `LiSN_KGS_Demo_DevBrief_v1/` |
| [CTX] | `CONTEXT.md` |
| [RN] | `REVIEW_NOTES.md` |
| [mock/…] | the mock files |
| [S0-C] | Opus |
| [S0-G] | ChatGPT |
| [S0-P] | Perplexity |
| [S0-X] | Exa |
| [S0-M] | MERGED |
| [S1-Per] | Stage 1 Personas |
| [S1-Msg] | Stage 1 Messaging |
| [S1-UCQ] | Stage 1 quality/safety/cyber use cases |
| [S1-UCC] | Stage 1 channel/commercial/carve-out use cases |
| [S1-RT] | Stage 1 review log and use-case index |
| [KK] | `Kartik Kumar Carrier.pdf` |
| [REF] | the bank screen PDFs and PNGs |

---

## 1. Who KGS is

### Ownership and carve-out timeline

| Date | Event | Source |
|---|---|---|
| Apr 2023 | Carrier said it would exit Fire & Security | [S0-P] |
| 15 Aug 2024 | Carrier signed to sell its Commercial & Residential Fire business to an affiliate of Lone Star Funds | [S0-M] 4-src |
| 2 Dec 2024 | Deal closed; the business runs independently as Kidde Global Solutions | [S0-M]; [KK] |
| Sep 2026 | Year 2 of the carve-out. Standalone systems are being built; some systems are still on Carrier TSAs. TSA terms and exit dates are not public. | [S0-M]; [01 §1]; [S1-Per] |

- **Deal value.** Enterprise value was $3.0bn [S0-M] 4-src. Carrier's 2024 10-K reports $2.9bn cash proceeds and about $1.4bn net gain; the earlier 8-K estimate was $2.2bn (see §5).
- **Headquarters and ownership.** HQ is Palm Beach Gardens, Florida. The company is privately held by Lone Star [S0-M]. Dan Thompson was CEO at close; that is assumed until confirmed [S0-M K-4].
- **Sold separately, not part of KGS:**
  - Industrial Fire went to Sentinel Capital (2 Jul 2024).
  - Access Solutions went to Honeywell.
  - Kidde-Fenwal went to Pacific Avenue, and the AFFF liability stays with the KFI wind-down estate [S0-C]; [S0-M].
  - Say "KGS", never "Carrier", for the current business [S0-M]; [01].

### Brands

- **KGS at formation:** Kidde, Kidde Commercial, Edwards, GST, Badger, Gloria, Aritech [S0-M] 4-src.
- **Global Commercial Fire, as Kartik states it:** Edwards, Kidde Commercial, GST, Aritech, EMS, AirSense [KK]. The demo's brand filter carries exactly these six [01 §1]; [08 §5.3].
- **Kept out of scope:**
  - Gloria (sale to Anaf agreed Apr 2026, G-only, not confirmed).
  - Badger and suppression (perimeter unknown).
  - Residential (a separate P&L) [S1-Per]; [S0-M K-10, K-11].

### What Global Commercial Fire sells, and to whom

- **Edwards (NA primary, plus MEA, India, APAC):**
  - EST4 addressable panels, IP-connected with a web server and cloud link.
  - EST3/EST3X, the legacy panel it replaces. The halt date for new EST3 orders is single-source [S0-C].
  - Also: iO, Edge (2025), Signature/SIGA devices, Genesis notification, FireWorks, and the ConnectedSafety+ connected service [S0-M §0.4].
- **Kidde Commercial:** Evolve, VM/VS, EXCELLENCE, AIO detectors, the KESMobile diagnostics app, and ModuLaser aspirating [S0-M].
- **Aritech:** 2X panels (EN 54), sold in UK-EU and APAC [S0-M].
- **GST:** detection and panels from Qinhuangdao, sold in China, India, MEA and 80+ countries [S0-M]; [S0-X].
- **EMS:** FireCell/SmartCell wireless for UK-EU [S0-M].
- **AirSense:** aspirating smoke detection for data centres, labs and clean rooms [S0-M].
- **End buyers:**
  - building owners, campuses and national accounts;
  - project owners through EPCs in MEA, India and China.
- **Specification and approval** are shaped by specifiers, AHJs, insurers and certification bodies, who buy nothing [S0-M A.4]; [01 §1].

### How it sells

- **NA:**
  - Edwards sells through authorised engineered-systems distributors and dealers (Strategic Partners / ESDs), whose NICET-certified technicians design, install and service.
  - A Strategic Accounts team handles multi-site clients.
  - EST4 certification gates access to material and ITM courses [S0-C]; [S0-M].
- **UK-EU:** national distributors → specialist integrators → installer/maintainer [S0-M].
- **MEA:** distributors and project integrators → EPCs [S0-M].
- **China:** GST distributors, integrators and vertical projects [S0-M].
- **India:** authorised distributors and service partners → EPCs; there is also a grey market [S0-M].
- **AUS:** distributors and accredited installers [S0-M].
- **Revenue split:** no public split by region, brand or channel exists [S0-M] 4-src.
- **Channel structure:** one building involves many linked roles, so "customer" cannot be a single account field [S0-G via S0-M].

### Size

- KGS is about $1.9–2.0bn; this is aggregator-grade [S0-M K-1].
- Global Commercial Fire is "~$1B+", stated by Kartik on his profile [KK].
- The pack treats the CF figure as privately supplied. It must **never** appear on screen, and neither may anything derived from it [01 §1]; [02 §2].
- Headcount is unresolved [S0-M K-3].

---

## 2. The audience: Kartik Kumar

### Role and career

**Current role** [KK]; [S0-M]:
- President, Global Commercial Fire, KGS, since Dec 2024.
- He held the same role at Carrier from Sep 2022, so the LinkedIn entry for Carrier is stale. It is one business, not two.
- He was on the management team that led the carve-out.
- He owns the end-to-end P&L and business and product strategy.
- His stated growth levers:
  - M&A;
  - growing the core;
  - expanding geographically and into adjacent segments;
  - digital and lifecycle services.

**Earlier career** [KK]:
- Ran Carrier's container-refrigeration P&L, where he regained key accounts worth about $100m.
- Director of Strategy at Honeywell ($350m of acquisitions).
- Six Sigma Black Belt, earned by building a pricing tool that raised win rate 15%.
- INSEAD MBA; B.Tech in chemical engineering.

### Public priorities

- **"Quality and reliability"** alongside innovation, from the Genesis LED release [S0-C, single].
- **A "gaps and needs" lens** [S0-C].
- **Ambitious growth in China** (June 2025), in energy storage, petrochemicals, rail, electronics and data centres [S0-M] 4-src.
- **Connected services** as a personal theme: ConnectedSafety+ for code compliance and fewer service calls, and KESMobile [S0-G]; [S0-P].
- **Personal dealer visits** [S0-C].
- **No long-form interview** on his operating model, EBITDA or AI exists. That is an absence of evidence, not a signal [S0-M].

### How he reads a screen

- He thinks in special cause vs control limits, cohorts and baselines, and will spot false precision [01 §1].
- He acts on signals tied to revenue, cash, safety or a partner's ability to sell and service, not on sentiment [S0-X]; [S1-Per].

### Relationship constraint

- Kartik is related to Ranjith. He must **sponsor and delegate, never evaluate or sign** [S1-Per §4.3].
- The protocol requires all of the following:
  - written disclosure;
  - criteria written before any data;
  - a blind retrospective test;
  - the normal InfoSec, Legal and Procurement path;
  - a walk-away clause.
- On screen he is only ever "President" [00]; [08].

### What success looks like

- **In the meeting:** he says, in substance, "let's try this — and get more people on the next call", **names an owner**, and names who should join [00 §1]; [08 goal].
- **What earns it:** an exec overview that is plainly sized to his business, plus one double-click that feels real — the fw 4.1 hero through to a live approval [00 §1].
- **The close asks for three things** [08 §1.7]:
  - an owner (VP Service & Tech Support or the Quality lead);
  - a 90-day offline Discovery on NA Edwards, using 12–24 months of extracts, in a KGS tenant;
  - a blind test scored by KGS against criteria it writes first, with no commercial proposal until the owner judges it worth one.
- **Two of the five feedback questions are asked in the flow** [08 §2]:
  - who would own this card;
  - which view he would open first on a Monday, and which he would delete.

---

## 3. Where LiSN fits, and why the hero is the EST4 fw 4.1 field-quality signal

### Category and positioning

- **Category:** "installed-base early warning" [S1-Msg §2.1]; [02 §1].
- **What LiSN does:** joins what installers, partners and distributors tell KGS (calls, cases, email, RMA narratives) to firmware, batch/date code, RMA and order data. It then routes one ranked signal to one owner, who approves [S1-Msg].
- **Labels rejected** [S1-Msg]:
  - CX analytics, because it sounds like a contact centre;
  - VoC platform, because it sounds like surveys;
  - conversation analytics, because it sounds like agent QA;
  - AI copilot, because it implies autonomy.
- **Relationship to ConnectedSafety+:** LiSN is the human layer beside it, never a rival. Telemetry says what the panel did; interactions say what people think is wrong [S0-M F3]; [01].

### Ranked use cases the pack chose

1. **Hero — UC-Q-1: firmware-release fault cohort early warning.**
   - Ranked #1 by all four engines: MH-1, merged score 28/30, the top score [S0-M H.2]; [S1-RT C].
   - Three smaller use cases are folded into it [S1-Msg §1]:
     - UC-Q-14, a new-phrasing chip;
     - UC-Q-15, a rollback-workaround chip;
     - UC-Q-10, a product- vs practice-leaning strip.
2. **UC-Q-2:** date-code window hidden under a green SKU p-chart (D-2).
3. **UC-C-1:** Strategic Partner drift (ESD-SE-07).
4. **UC-C-6:** backorder consequence (N-3).
5. **UC-C-3:** carve-out separation friction (UK-EU entity cutover).
6. **UC-Q-7 / UC-Q-8:** a governed safety & cyber watch, showing counts and clocks only.
7. **UC-Q-17:** evidence readiness, an enabler tile.

- **Held for v2:** UC-C-9, EST3→EST4 migration, as a locked teaser [S1-RT E-6]; [02 §5].

### Why the hero is a field-quality signal and not a CX or sentiment view

- **It is his own words.** "Quality and reliability" is his stated lens [S0-C].
- **It is his method.** A Six Sigma Black Belt reads "special cause under a green aggregate" natively. In the demo, 4.1 runs at 6.2 vs 2.0 per 1,000 panel-weeks while the EST4 RMA line stays in control [01 §6.1]; [S1-Msg].
- **It needs the join, so it is visibly impossible without LiSN** [S1-UCQ UC-Q-1]:
  - agents' reason codes rarely carry firmware;
  - a CRM report cannot compute a per-version rate without the installed-base denominator;
  - a dashboard has to know the symptom in advance;
  - an LLM has no release register or baseline.
- **It ties to P&L lines he owns** (warranty and field cost; tech-support cost-to-serve) and to a decision with a named owner (VP Engineering). A sentiment score does neither [S1-Per P1]; [S0-M].
- **It avoids every trust-breaker** [S1-Msg §7]; [01 §6.2]:
  - sentiment, CSAT, NPS, "customer journey" and "contact centre" are banned as bank/retail leftovers;
  - a PE owner and a CFO will not accept CX metrics that do not reconcile to margin or cash [S1-Per P8].

### Why "partner voice → product or business decision" beats pure CX or pure process

- **Pure CX** measures how partners feel, not what to change. It has no denominator, no cohort and no owner, and it reads as a contact-centre tool. That repeats the retired bank-demo framing [S1-Msg]; [CTX].
- **Pure process** (ERP, OTIF, cutover dashboards) knows dates, not consequences:
  - OTIF is measured against the revised promise date;
  - a cutover reports green while the effect arrives later as a DSO surprise [01 §2]; [S1-Per].
- **Partner voice → decision sits between the two.** The installers' own words are the earliest evidence. Joining them to operational data turns them into a sized, owned, evidence-backed decision, and a human approves.
- **The same method runs across all three of his hats** [01 §6.1]:
  - installed base;
  - channel;
  - separation.

### Panel dissent the pack carries rather than averages [S1-Msg §1]

- The PE lens would lead with cash.
- The compliance lens wanted the safety/cyber watch live on day one. It is accepted as a capability, not the headline.
- The service lens notes that the hero routes away from the native buyer, VP Service. The mitigation is a secondary cost-to-serve line.
- The architecture lens warns that if fewer than half of cases carry firmware, the hero falls back to new-phrasing only.

---

## 4. The chain of reasoning: 41 use cases down to the demo scope

### How the pack narrowed

1. **Stage 0, four independent engines** [S0-C] [S0-G] [S0-P] [S0-X]:
   - Each produced a panel-style dossier: architect, ex-OEM service VP, PE partner, compliance/cyber.
   - G's citations were exported as unresolved tokens, so every G-only fact is tagged [src-unresolved] downstream.
2. **The merge** [S0-M] (recall-first):
   - Each engine was read in full separately, and facts were matched by meaning.
   - Convergence was recomputed, rather than trusting each engine's own tags.
   - Every distinct finding was kept.
   - Conflicts were resolved only by source hierarchy (regulator > filings > industry > trade press > aggregators); anything unresolved is registered as K-1…K-12.
   - Output: 17 unmet needs (MH-1…MH-17), scored on six criteria. The top results: MH-1 28, MH-2 26, MH-4 24, MH-3 24, MH-5 23, MH-7 22.
   - Recommended spine:
     - MH-1 as the hero;
     - MH-4 (channel) and MH-5 (carve-out) as supporting tiles;
     - MH-2 and MH-3 as a governed watch, never as reportability;
     - MH-7 (migration) held for v2.
3. **Stage 1 mining** (on the raw engine files, not the merge):
   - UC-Q file: 20 use cases.
   - UC-C file: 21 use cases.
   - Total: **41**.
   - Classification [S1-UCQ]; [S1-UCC]:
     - Bucket A = interaction-only.
     - Bucket B = needs a join.
     - T1 = self-serve descriptive.
     - T2 = anomaly card inside the pilot ingest list.
     - T3 = needs systems outside the pilot.
   - Each file named its five strongest demo candidates.
4. **Red-team** [S1-RT]:
   - Found 36 issues in wave 1 (4 High, all fixed) and 23 in the messaging pass (1 High, fixed).
   - Main themes:
     - untagged invented figures;
     - real product names on hypothetical faults;
     - competition-law and privacy claims stated as fact;
     - volume implausibility, e.g. a spoken line that implied ~234k interactions a *week*.
   - The index lists 11 demo flags, "more than one screen can carry" [S1-RT E-6]. The cut follows the merge spine.
5. **The dev brief** [00]–[08]:
   - Turned the Messaging §10 single-screen spec into a multi-screen shape:
     - exec overview;
     - three question drill-downs;
     - the hero deep-dive.
   - Fixed every number in a deterministic generator [mock/].
   - An independent pack review made 123 edits and fixed the arithmetic (e.g. 41 → 40, 3.6× → 3.7×, 3% → 2%, 212 → 186) [RN].

### What was dropped, and why [S1-UCQ]; [S1-UCC]; [S1-RT C]

| Reason | Use cases |
|---|---|
| Weak one-screen visual | UC-Q-3 NFF loop; UC-C-8 order-status-as-EDI-defect; UC-C-7 substitution (too intricate) |
| Needs systems outside the pilot (T3, parked) | UC-Q-4 (PLM/MES); UC-Q-10 (LMS); UC-Q-12 and UC-C-19 (China/MEA register, language, residency); UC-Q-13 (sparse); UC-Q-20 b/c (ITM work orders) |
| Not Kartik's P&L | UC-Q-18 residential recall surge |
| Too slow to show value | UC-C-14 spec/AHJ friction (spec wins lag 12–36 months) |
| Board or PMO instrument, not a President hero | UC-C-4 TSA-exit gate |
| Hygiene, low drama | UC-C-5 legacy residue; survives only as a Q3 panel |
| Interaction-only, low confidence | UC-C-2 competitor-switching language; folded into UC-C-1 |
| Folded into another card | UC-C-13 into C-1; UC-Q-14/15/10 into the hero; UC-Q-19 kept as a possible chip |
| Demo-flagged but cut for one screen | UC-Q-5 voice-vs-telemetry (T3 until telemetry is joinable); UC-C-17 ConnectedSafety+ adoption; UC-Q-12 China lens and UC-C-9 migration go to v2 (question 5 of the close asks which he wants) |
| Long tail, preserved but not mined for the demo | UC-Q-6, Q-9, Q-11, Q-15, Q-16, C-10, C-11, C-12, C-15, C-16, C-18, C-20, C-21 |

---

## 5. Where the sources disagree

### 5.1 Between the four Stage 0 engines (register K-1…K-12 [S0-M], plus the engine notes)

| Topic | What the engines say | Status |
|---|---|---|
| Deal proceeds | $2.2bn estimated net (C, from the Aug 2024 8-K) vs $2.9bn cash and ~$1.4bn gain (G, P, X, from the 2024 10-K) | Resolved to the 10-K |
| KGS revenue | ~$1.99bn ZoomInfo / $1.9bn Wikipedia (C, P); ~$2bn trade association (G); not disclosed (X) | Use "~$2bn", aggregator-grade |
| Headcount | 1,225; ~2,100 to >6,000; 5,001–10,000; 6,021; >8,700 | Unresolved; keep out of client material |
| CEO | Dan Thompson (C, G, X) vs a TheOrg listing that is probably a KiddeFenwal mix-up | Thompson assumed |
| Interaction volume | C: 200–500k a year (~800–2,000 per working day). G: 300–900k a year | Working range 200k–900k (0.8k–3.5k per working day). No engine found a published figure |
| Contact mix | Shares differ by engine. Order status: C 20–30% vs P 15–25%. Firmware: C 3–5% vs P 1–4%. RMA: C 5–8% vs P 8–15% | Estimates only |
| Cost per contact | $25–60 B2B tier-1 (C) vs $13.50 US assisted median, consumer-centric (P) | Use C's range; both are estimates |
| Tech stack | C found no Salesforce, ServiceNow or SAP. P, G and X found Salesforce, SAP/Oracle/JDE and ServiceNow in job ads | Job-ad grade |
| Market size | $60–95bn fire protection/safety; $33.6–42.6bn alarm & detection; figures ~$23bn apart between vendors | Directional only; never a KGS TAM |
| Market share | FMI, FactMR and GMI inconsistent | Do not quote |
| UL 864 edition | 10th (C) vs 11th (P) | Prefer 11th; verify |
| NFPA 72-2025 effective date | 1 Jan 2025 (C) vs 18 Sep 2024 (P) | Unverified |
| EU CPR 2024/3110 | "not verified" (C) vs applies 8 Jan 2026 (P, G) | P/G more specific |
| Suppression perimeter | Graviner and LatAm suppression marketing vs Industrial Fire sold to Sentinel | Needs legal-entity check |
| Gloria | A KGS brand at formation (C, P, X) vs sale agreed Apr 2026 (G only) | Confirm the close before naming |
| Public installer VoC | Enough to illustrate (C, P) vs too thin to quantify (G, X) | Illustrate, never quantify |
| Earlier hero drafts | C: EST4 loop-mapping 3.4×, fw 2.x, $1.8m exposure. P: "firmware X", 420 panels. G: 18 cases, 6.8×, fw 4.x. Persona file: fw 2.x and fw 4.x with 1,100 panels | Superseded by fw 4.1, 3.1×, 1,240 panels [S1-Msg §10]; [mock] |

### 5.2 Items marked [src-unresolved] (G-only, URL lost; must be re-sourced before client use) [S1-RT E-2]; [S1-Msg]

- >1.5m commercial buildings installed.
- 18 facilities / 7 plants / 11 R&D centres.
- The Hyderabad ad about an "independent digital organisation".
- The Gloria sale to Anaf.
- GST GP01 UL 864 certification (Jul 2026).
- CommerceHub/EDI.
- "KGS sale terms discuss lead times".
- JCI OpenBlue OBI (Aug 2026).
- The GCC $1.57bn market figure.
- Hyderabad leadership attendance.
- Uncertified partners "unable to bid".
- Strategic Accounts roles.

None of these appears in the demo copy or mock.

### 5.3 Items marked "Ranjith to confirm", or left open by the red-team

1. **Real product names in hypothetical fault cards** [S1-RT E-1; M23]; [S1-UCQ UC-Q-1].
2. **Unit costs behind V-01…V-10** [02 §2, §12]; [00 §8 #1].
3. **YaaraLabs-context statements not in the dossier** [S1-RT E-9]; [S1-Per]:
   - credential wording (HDFC/Visa/SocGen as AI Fluency references);
   - the US SI channel route;
   - the "severity coded but not rendered" history.
4. **Messaging brief items** [S1-RT M15, M22]:
   - the contact address and the "enterprise scale" line;
   - "RELIABILITY ↑" vs "EARLY WARNING ↑".
5. **Other open items** [S1-Msg]:
   - covering-note channel and tone;
   - contracting entity;
   - Discovery fee position;
   - engine-latency and model-refresh claims.
6. **Needs external validation, not a document edit** [S1-RT E-3, E-4, E-10, E-11]:
   - the whole legal layer, which is panel guidance only;
   - whether MD-2 is still current (EST4 Signature diagnostics weaker than EST3, dated June 2022);
   - the relationship protocol;
   - the SOC 2 answer.
7. **Low-grade source facts** [S0-M]; [01 §3]:
   - The EST3 halt date is single-source; "re-check before quoting".
   - All named executives are aggregator-grade.
   - Kartik's quotes are single-source.

### 5.4 Pack-internal inconsistencies not caught by the 19 checks

These came from the reader agents; I spot-checked where possible.

- **Real names outside tokens in fixed strings** [04]; [05a]:
  - Several strings carry raw "EST4", "UK-EU" or "fw 4.1" outside `{{…}}`: the FSM card 1 title, "EST4 RMA rate" labels and KPI captions, and the card 5 title.
  - In anonymised mode these would leak. The 06 leak check expects them tokenised.
- **ESD-SE-07 sell-in scale** [mock/channel.json vs V-06]:
  - The EST4 sell-in series (labelled $k a week) sums to about $5.9m over 26 weeks, which is about $11.9m a year.
  - V-06 says the partner's trailing-12-month sell-in is $6.4m.
  - The chart units or the $6.4m need confirming.
- **"412 panels at 180 sites show no symptom"** out of a 1,240-panel cohort with 23 contacts reads oddly. It probably means ≤2-loop configurations. It is also the same "412" as the loop-mapping contact count.
- **Three different weekly EST4 volumes** on Q1 with no explanation on screen:
  - 1,960 interactions;
  - 460 in the symptom stack;
  - 277 trouble contacts.
- **"6,040 units"** adds panels to detectors.
- **Phrasing count:** "9 phrasings merged into 3 signals" vs "into 1".
- **Suppressed-reason wording** drifts between the funnel, the end card and the FSM subtitle.
- **Number collisions:** 212 (look-alikes and invoices), 412, 312.
- **Charge-out currency:** V-09 and V-10 cost UK-EU contacts in $. They are counts × a $ unit cost, but this sits awkwardly with the "$ for NA, £ for UK-EU" rule [02].
- **Approve control:** 04 says "disabled (Lock)", 06 says `aria-disabled`. 06's version is needed for the tooltip.
- **06 adds copy that 04 does not have:** "Approved" button state, "RECOMMENDED ACTION — approved by VP Engineering", "LiSN note".
- **Step 14 reads `meta.labels.diagnosisRows`,** which is absent from the 05a spec but present in the mock.
- **The EvidenceDrawer footer** says "No customer-facing action taken", although "customer" is discouraged as the only word [01 §5].
- **Mock path:** pack, 05a and code comments give three different paths (`src/mock/kgs/`, `src/data/kgs/`, `@/mock/…`). This repo's rule overrides all three with `lib/role-based-dashboard/kgs/`.
- **Build model:** the pack assumes a separate app, branch and Vercel project with root routes [06 §1]. This repo builds it as a role inside `/role-based`, which is Pass 1's decision.

---

## 6. Premises the demo depends on

| # | Premise | Verdict | Why |
|---|---|---|---|
| 6.1 | **Volume of ~1,800 interactions per working day** (~9,000 a week; 233,900 over 26 weeks) [CTX]; [02 V-14]; [mock/meta.json] | **Weak** (plausible, unverified) | KGS publishes no contact volumes [S0-M] 4-src. 1,800 sits inside the merged working range of 0.8k–3.5k a day and in the overlap of C's and G's estimates [S0-M K-12], but both are top-down estimates ("could be badly wrong" [S0-G]). The talk track concedes it is sized from industry patterns and that Discovery replaces it [08 §1.2]. Acceptable only because it is labelled synthetic. It is also the fix for the retired "300K daily" claim, which was about 150× too high [S0-C]. |
| 6.2 | **Real product names on synthetic faults** (EST4, Edwards, US-SE, Florida) in the live narrated session [00 §8 #2]; [S1-Msg §10.7] | **Weak** (a live risk, mitigated not removed) | The red-team recommended genericising any card that pairs a real product with a fault [S1-RT E-1]; the Messaging reviewer left it open [M23]. The pack keeps names only live, with the badge, footer and "(synthetic)" on every version, serial, date code and partner ID, and with exports forced anonymised. Kartik's own "quality and reliability" line makes an implied EST4 defect the single worst misread [S1-RT E-4]; [S1-Per R21]. The raw-name strings in §5.4 weaken the mitigation until they are tokenised. |
| 6.3 | **Anonymise OFF by default** live; `?anon=1` and print force it on; named mode is never exported or linked [00 §7]; [04 §7]; [mock/lib/demoState.ts] | **Holds** (decided), with a caveat | This is a lead decision recorded as "do not reopen", and it is implemented in the mock state. The compliance lens preferred anonymised by default and the service lens wanted names; this is the compromise [S1-Msg §10.7]. It depends on print really forcing anonymise and on no named link being shared [00 §8 #6]. |
| 6.4 | EST4 is an Edwards IP panel sold in NA through ESDs, with EST3 as its predecessor | **Holds** | [S0-M §0.4], 4-src for Edwards/ESD. The EST3 halt date is weaker (single-source) and is kept off screen [00 §8 #7]. |
| 6.5 | KGS cases carry enough firmware and site data to compute per-version rates | **Unverified** | This is the pilot's hardest precondition [S1-UCQ UC-Q-1]; [S1-Per R2 (H/H)]. The demo's own 38% / 61% figures are synthetic. The evidence-readiness tile and the close turn this into Discovery's first measurement, which is honest. |
| 6.6 | Contacts lead RMAs, and the monthly RMA review is the right comparator (21-day lead) | **Weak** | This is an industry pattern, not a KGS fact [01 §2]. The review calendar (7 Oct etc.) is synthetic, and the pack's own footnote says lead time is measured against the calendar, not against when teams would otherwise have known [02 §4]. |
| 6.7 | Commercial Fire is ~$1bn+ and the right frame for value | **Holds**, but never on screen | [KK] states it publicly. Nonetheless the pack's rule stands: scale on screen comes only from volumes, never revenue [02 V-14]. |
| 6.8 | Carve-out year 2, with systems still on Carrier TSAs | **Holds / unverified** | The carve-out holds [S0-M] 4-src. TSA status and dates are not public [S0-M]. The demo's cutover calendar (14 Jul, 4 Aug, 12 Aug, 1 Sep) is synthetic. |
| 6.9 | Kartik is a sponsor who delegates, not the evaluator | **Holds** as a design choice | It needs the written relationship disclosure first [S1-Per §4.3]; [S1-RT E-10]. That is a human action outside the build. |
| 6.10 | VP Engineering owns the hero; VP Service & Tech Support is the native buyer and Discovery owner | **Holds** as reasoning | It is inference; no KGS head of tech support has been identified publicly [S0-M] 4-src gap. |
| 6.11 | Unit costs: $750 per excess fault contact, $120 per detector, $25–60 per tier-1 contact | **Unverified** | Synthetic, and open for Ranjith [00 §8 #1]. Every V-01…V-10 figure depends on them. |
| 6.12 | Nothing on screen implies a current KGS defect, residential recall, or banking leftover | **Holds** by design, if QA passes | The retired-string sweeps are in [08 §5.3] and [06 §5]. The mock passes the banned-string checks (C/E, 19 / 19). |
| 6.13 | Mock numbers are the single truth and are internally consistent | **Holds** for everything checked (19 / 19); **weak** on the unchecked items in §5.4 | Includes the sell-in scale, the "412" wording and the EST4 volume trio. |
| 6.14 | The "data as of 25 Sep 2026 18:00 UTC" clock is plausible for the meeting, and live approval shows today's UTC time | **Holds** | [08 §5.8]. |
| 6.15 | The bank Head-of-Cards look can be reproduced from components in this repo | **Holds** (checked in Pass 1) | The bank components exist here, but they are styled with inline styles and a theme context, not with the Tailwind tokens 03 assumes. |

---

## 7. The demo in one page

### Screens

These are in-component views in this repo, not URLs.

| Priority | Screen (pack route) | Contents |
|---|---|---|
| **P0** | Shell | "Li" monogram rail; header with breadcrumb; sticky ContextBar (brand/region filters, period, data-as-of, Anonymise, badge); fixed footer; DemoMenu (Reset, Anonymise mirror) |
| **P0** | Exec overview `/` | Funnel strip; Executive Brief; Pulse ×3; three question cards (count above threshold + WoW delta, gauges, mini-KPIs, LiSN INSIGHT, "What's counted"); Applied value strip + "How we count" drawer; Field Signal Monitor (5 cards + suppressed end card); governed safety & cyber watch; evidence-readiness tile; Ask LiSN button (panel is P2) |
| **P0** | Q1 `/installed-base` | KPIs; interactions table; clusters by severity; cohort monitor; date-code heat strip under a green p-chart; new phrasing; contacts-lead-RMAs-lag; LiSN Signal Wall; "Why field issues surface late" joined panel; LiSN evidence summary; trouble conditions by platform (static in P0); What's stable |
| **P0** | Hero `/installed-base/signal/fw-4-1` (plus the `/signals/A1` redirect) | H1 and metric line; severity strip; lineage "river" chart with 2 Sep / 16 Sep / 7 Oct markers and the flat RMA line; chips; counter-evidence; confidence K/I; joins; cohort; P&L; owner; decision panel with "Viewing as"; evidence drawer (4 tabs); draft brief modal |
| **P1** | Q2 `/channel` | Partner league, partner timeline, backorder revised/original toggle, certification, switching language, wall, diagnosis |
| **P1** | Q3 `/separation` | Cutover timeline vs control, scorecard, topic detail, FAQ vs defect split, three gates, legacy residue, wall, diagnosis |
| **P1** | Extras | P-J bar interaction, lifecycle table, live filters, intro |
| **P2** | Extras | Ask LiSN canned panel, global role switcher, `/signal/:id`, presenter shortcuts, v2 migration teaser |

### The hero story, beat by beat [08 §1.4]; [04 §4]

1. **Open.** Click "Open signal →" on wall card 1 and pause. The headline:
   - EST4 · firmware 4.1 (synthetic);
   - "devices not found after upgrade" at 3.1× panels still on 4.0;
   - 9 partners, 3 regions, 1,240 panels on the version.
2. **The river:**
   - 6.2 vs 2.0 contacts per 1,000 panel-weeks over the same 3 weeks, each panel aligned to its own upgrade date.
   - Released 2 Sep.
   - Above threshold 16 Sep at the third independent partner.
   - Next monthly RMA review 7 Oct, **21 days** later.
   - The grey EST4 RMA line is flat, in control. That is the special-cause test applied to installer calls.
3. **Severity, confidence, counter-evidence:**
   - S2 Quality, a cliff at the release.
   - 1,240 panels, ~610 sites, 5,560 eligible.
   - Incident flag off.
   - Confidence M 0.70: K 15 known / I 8 inferred.
   - Counter-evidence: 412 panels at 180 sites show no symptom. The symptom concentrates in >2-loop configurations, which is a candidate, not a cause.
4. **Evidence · 23 drawer:**
   - Snippet 1 is a rollback verbatim: 5 rollbacks across 4 partners.
   - Linked RMAs: 2 NFF returns.
   - Method & audit shows "President · just now".
5. **Draft brief:** the LiSN-drafted engineering investigation brief (IB-2609-004):
   - ranked candidate causes, each with for / against / test;
   - it says LiSN does not determine cause;
   - it is not sent.
6. **Gate as President:**
   - Approve is disabled, with a tooltip saying approval sits with VP Engineering.
   - "Ask VP Engineering for a decision" adds a chip and an audit line.
   - In-flow question 1: who would own this card?
7. **Switch "Viewing as" to VP Engineering.**
8. **Approve:**
   - spinner, then a green state;
   - the live UTC timestamp is captured once and shown identically on the gate, audit log, toast and draft chip;
   - the investigation opens as INV-2609-031;
   - the rollout decision stays open;
   - the known-issue note now waits for VP Service & Tech Support, still not sent;
   - "LiSN keeps watching".
9. **Back to the overview:**
   - Pulse chip, FSM card 1 and AV-3 all update (5 → 4 awaiting owners).
   - The state survives the role switch.
   - A reload or "Reset demo" returns everything to the start.

### Fixed figures, from `mock/data/*.json`

| Area | Figures |
|---|---|
| Funnel | 233,900 read (26 weeks; ~9,000 this week) → 1,640 clusters → 212 suppressed (74 / 58 / 41 / 27 / 12) → **5 above threshold** → 2 governed |
| Question cards | **2 / 2 / 1**. WoW 0 / +1 / 0. "+2 / +2 / +1 in 4 weeks" |
| Q1 gauges | 98% (45/46) · 80% (EST4 RMA 0.28% of the 0.35% limit) |
| Q2 gauges | 99.8% (419/420) · 71% (N-3 OTD vs original; 94% vs revised) |
| Q3 gauges | 75% (3/4) · 8% (14/180) |
| Hero | 3.1× · 6.2 vs 2.0 · 23 contacts (11 / 8 / 4 by region) · 1,240 panels · 5,560 eligible · ~610 sites · 9 partners · 3 regions · M 0.70, K 15 / I 8 · source independence 0.78 · rank score 0.84 (next 0.71) · ≈ $12k to date · ≈ $0.15m projected over 12 weeks · ~140 contacts avoidable · 2 Sep / 16 Sep / 7 Oct · 21 days |
| D-2 | 4.2× · 4,800 units · 1,900 in stock (40%) at 11 distributors · ≤ $0.35m · 0.21% vs 0.30% · K 22 / I 9 |
| ESD-SE-07 | 13 → 40 (3.1×) · recontact 14% → 38% · −22% / +4% · $6.4m sell-in · $0.9m backlog · 2 of 5 lapsed · 4 competitor mentions · 34 days before the QBR |
| N-3 | 3.2× · 94% / 71% · $2.3m (2.4% of ~$95m) · 312 lines · 11 partners · 4 projects |
| UK-EU | 2.7× (control 1.1×) · portal 3.4× · 14 of 180 distributors · £1.1m / 212 invoices · DSO +6 days (≈ £1.0m) |
| Applied value | AV-1 21 days (median of 13 / 19 / 21 / 25 / 34) · AV-3 5 → 4 awaiting · 7 drafts · 0 sent · AV-4 three lines, never summed: ≤ $0.5m / $2.3m / £1.1m · AV-5 ~430 contacts, $11k–26k · AV-6 212 |
| Q2 other | Certifications lapsing **186** · Houston 11 vs 3 (3.7×) |
| Q1 other | Contacts-vs-RMA caption "about 2%" |
| Watch | W-1 routed 6 Sep 14:38 UTC, chronology updated 23 Sep 10:02 · W-2 first mention 25 Sep 09:14, routed 09:21, clock frozen at 8h 46m |
| Evidence readiness | 38% / 61% / 44% / 57% |
| Data as of | 25 Sep 2026 18:00 UTC. Mock check report: 19 / 19 pass |

### Non-negotiables [00 §5]; [04]; [06]; [08 §5]

- **Synthetic badge** on every view, drawer and modal, above the backdrops, plus the fixed footer:
  "SYNTHETIC SCENARIO — illustrative data, not KGS data" [00]
- **"(synthetic)" tags.** "(synthetic)" follows every firmware version, serial, date code, SKU family and partner ID.
- **No send, notify or export.** LiSN drafts; people approve.
  - No enabled Send, Notify, Export or Auto control anywhere.
  - Export and "Open source interaction" are disabled, with tooltips.
  - The President cannot approve for the owner.
  - No "sent" or "notified" wording.
  - LiSN never decides cause, rollout or reportability.
- **Money rules:**
  - Never sum USD and GBP; AV-4 stays three separate lines.
  - Every money value carries the ILLUSTRATIVE chip.
  - Money is never green or red.
  - No revenue, savings, ROI or payback.
- **Full signal contract on every signal:**
  - S-class shown with its word and a glyph, never colour alone;
  - type, blast radius and incident flag;
  - K/I confidence;
  - join tags;
  - a P&L line;
  - one routed owner (a role);
  - gate state.
- **House style:**
  - "LiSN" exactly, never CSS-uppercased;
  - British spelling;
  - no exclamation marks;
  - never "cheap";
  - roles only, never names;
  - "[competitor]" for any competitor;
  - "above threshold this week", never "crossed a threshold this week".
- **Retired strings (never on screen):**
  - FCI and every banking leftover: HSHF-type segments, cards/cardholder, chargeback, MCC, merchant, EMI, "Head of Cards" breadcrumbs, the "Y" logo;
  - Conversation AI, AI Risk Spike Monitor, AI Summary Wall, AI Dispute Diagnosis, "Live" pills, "Click for details";
  - sentiment, CSAT, NPS, churn, customer journey, index / health score / score / pts;
  - resolve(s), root cause, predict(s), unqualified real-time, "300K";
  - residential, recall or Gloria content;
  - "Carrier" for the current business;
  - any implication of a current KGS defect.
- **Governed watch:**
  - never shows a platform, firmware or country, in any mode;
  - shows counts and clocks only;
  - states that LiSN does not determine reportability.

---

## 8. Open decisions (00 §8 and red-team §E), each with the pack's default

| # | Decision | Pack's proposed default |
|---|---|---|
| 00-1 | Unit costs behind V-01…V-10: $750 per excess fault contact ($450 truck roll + $150 Tier-3 + $150 NFF share), $120 per detector, $25–60 per tier-1 contact | Keep as written. Changing them means regenerating the mock and re-checking V-01…V-10 |
| 00-2 | Real platform names (EST4, Edwards) in the live narrated session (same as red-team E-1 and M23) | Named, with anonymise OFF and the badge always visible. Everything sent afterwards is anonymised |
| 00-3 | Discovery ask in the close (90 days, NA Edwards, 12–24 months of extracts, blind test) | Say it as written in 08 §1.7 |
| 00-4 | Forwardable paragraph for Kartik (08 §3) | Offer it only if he asks who to invite |
| 00-5 | Covering note after the call: channel and tone | Email within 24h with the anonymised screenshot PDF; no live link |
| 00-6 | Sharing the live link | Do not share. If one is needed, use a Basic-Auth, force-anonymised alias |
| 00-7 | EST3 "new orders halted end-2023" (single-source) | Keep it off screen and out of the talk track |
| 00-8 | Code identifier `askLisn.json` / `AskLisnItem` (never shown in the UI) | Keep. Renaming touches the generator, types and checks for no visible gain |
| E-1 | Real product names in hypothetical cards (EST4/SIGA, Edge, FireCell with its real ten-year claim, Genesis) | The red-team recommended genericising. The pack kept EST4/Edwards named live only, under the Messaging M2 real-name rule, and genericised the rest in the mock: D-2, N-3 and "Panel platform B" instead of AIO, Genesis and FireCell |
| E-2 | [src-unresolved] facts (see §5.2) | Excluded from all demo copy; re-source before any client use |
| E-3 | Legal layer (recording consent, GDPR/DPIA, works councils, PIPL, DPDP, competition law, telemetry rights), none of it researched | Not a demo item. KGS Legal or counsel validates before any Discovery extract |
| E-4 | Whether MD-2 is still current (EST4 Signature diagnostics weaker than EST3, June 2022) | Not cited on screen or in the talk track |
| E-5 | Statistical power at KGS volume; thresholds are placeholders | Every threshold is illustrative; Discovery runs a blind back-test. The talk track says "your team sets the threshold" |
| E-6 | Demo scope (11 demo flags) | Settled: UC-Q-1 hero + UC-Q-2 + UC-C-1 + UC-C-6 + UC-C-3, with UC-Q-7/Q-8 as the governed tile, UC-Q-17 as the enabler, and UC-C-9 as a v2 teaser |
| E-7 | Specifier-education demand (contact-map row 32) as its own use case | No dedicated use case; stays partial inside UC-C-14. Not in the demo |
| E-8 | UC-Q-8 example fleet (~2,100 EU panels on EST4) may overstate Edwards in the EU | Moot for the demo: W-2 shows no platform. The red-team suggested Aritech 2X if the card is ever used |
| E-9 | YaaraLabs-context statements (credentials, US SI route, severity-not-rendered history) | Not in the demo. The talk track names no customers and makes no credential claim |
| E-10 | Relationship protocol (written disclosure; sponsor, not evaluator) | Human action by Ranjith and Kartik before the call. 08 has the "Given we're related…" answer line |
| E-11 | SOC 2 / ISO 27001 objection | 08 answer: runs in their tenant, no egress, questionnaire and architecture documents provided; "if policy needs SOC 2 regardless, we'd rather know now" |
| M22 | Outcome label "RELIABILITY ↑" could imply a current reliability gap | Not in the demo. Low-severity, open for Ranjith (suggested "EARLY WARNING ↑") |
| M15 | "About" line and contact address in the one-page brief | Not in the demo. Confirm before sending the brief |

---

## 9. Questions for you

Only the ones that change what gets built:

1. **Tokenise the raw names in our copy of the mock?**
   - Several fixed strings contain raw "EST4", "UK-EU" and "fw 4.1" outside `{{…}}` tokens (§5.4). With Anonymise ON they leak, which breaks 08 §5.4.
   - My default: tokenise them **in the copied JSON** under `lib/role-based-dashboard/kgs/`, so named mode shows identical text. The KB stays untouched. I'd list every changed string in the commit.
   - The alternative is to leave them raw and accept the leak.
2. **The unchecked mock inconsistencies (§5.4): ship as-is or fix in our copy?** They are:
   - the ESD-SE-07 sell-in chart units vs $6.4m;
   - "412 panels … show no symptom";
   - the three EST4 weekly volumes on Q1;
   - "6,040 units";
   - "3 signals" vs "1".
   - My default: ship as-is (they pass the pack's checks), and add a presenter note to `DRIVER_NOTES.md`.
   - Any change means editing figures, which the KB rule says needs your say-so.
3. **The demo sits in a shared app, so where will it be presented from?**
   - The KGS view will be reachable at `/role-based/kidde_global/president_commercial_fire`, next to other clients' dashboards (HDFC, Openbank, IndusInd and others) on the "Industry dashboards" grid.
   - The pack wanted a separate project, a neutral URL, noindex, Basic Auth, no analytics and no cross-client leakage [06 §1, §6].
   - Tell me whether the demo will be driven from this shared deployment or from a separate deploy of this branch. It decides whether the build needs to hide the grid or deep-link straight to the role.
