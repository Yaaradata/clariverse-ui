# IndusInd · Customer pulse: build plan

Branch `feat/indusind-v1`, cut from `main` (the latest HDFC build; `release/vidya-demo` does not exist). Routes under
`/role-based/indusind_bank/customer-pulse/*` (first built at `/indusind-v1/*`, which redirects; IV-41); HDFC routes are not touched. Precedence: IND-B4 on screens, IND-B3 on data, IND-D1 on numbers, IND-B2
on wording. Judgement calls are logged in `docs/demo-rebuild/MORNING_DECISIONS.md` under "IndusInd V1" (IDs IV-xx).

**IND-D1 is missing.** It was not in the zips and is not in the repo. Every register value is therefore `null` and
renders as "pending verification". Labels, periods and bases come from IND-B3 §2 with the figure stripped out. Nothing
is filled from IND-B3's tables, the research files or memory.

## 1. Architecture

| Layer | Where | Notes |
|---|---|---|
| Config | `config/indusind.yaml` | Peers, business rows, product mapping, windows, data freeze, flags (`manual_read_logged`, `l2_loaded`) |
| L1 register | `data/public/indusind_register.json`, `indusind_sensitivities.json`, `indusind_owners_reference.json` | One figure per entry. `value: null` until IND-D1; `d1: "missing"` on every entry. Owners file holds roles only (names come from IND-D1 §8, absent) |
| L2 public | `data/raw/indusind/*` | Not loaded: no social pull, rate captures, ads or press in the repo. Screens say "Public data not yet loaded". No synthetic public data |
| L3 seed | `scripts/indusind/seed_indusind.py` → `data/seed/indusind_v1/` | Deterministic. Weekly from 1 Apr 2026 to the freeze. Counts stay in the seed; screens get shares and indices until N31 lands (IV-05) |
| Page payloads | `scripts/indusind/build_indusind.py` → `data/out/indusind_v1/<page>.json` | One file per page, all three windows precomputed, every figure `{id, layer, value, display}`. Nothing computed in the browser |
| Checks | `scripts/indusind/check_indusind.py`; `scripts/lint_terms.py` (26 rules); `scripts/check_pii.py`; fixtures in `scripts/test_checks.py` | Wired into `scripts/hdfc_pipeline/run_all.sh` after the HDFC steps |
| Frontend | `frontend/app/indusind-v1/*`, `frontend/components/indusind-v1/*`, `frontend/lib/indusind-v1/*` | Copies of the HDFC V3 components, HDFC strings stripped |

## 2. Component map

| Screen block (IND-B4) | HDFC component copied | What changes or is removed |
|---|---|---|
| Shell: header, nav, footer | `hdfc-v3/Shell.tsx` | Title "IndusInd Bank · Customer pulse", date, freeze time. View toggle CEO's office · Head of CX; window This week · Last 4 weeks · Last 13 weeks; business filter. Watermark on every screen. IND-B2 §4 rule 9 footer. HDFC nav, persona and My view removed |
| Theme, format | `lib/hdfc-v3/theme.ts`, `format.ts` | Copied as is (no HDFC strings) |
| Primitives (Tile, Kpi, Table, gauges, area chart with hover) | `hdfc-v3/primitives.tsx`, gauge and chart parts of `Pulse.tsx` | Copied; `ProvenanceTag` gets the three IndusInd tags; a `Pending` chip for unverified register values |
| S-HOME header quarter line | new | N27, N28, N29; chips S01, S07, each opening its basis |
| S-HOME customer pulse (inside · outside · doing) | `Pulse.tsx` CustomerPulse + CxPulse layout | Inside: complaints by IndusInd channel (L3 shares). Outside: "Public data not yet loaded". Doing: savings (N04/N06/N07), weekly flow index and closures (L3), N42. Priority lists, RM alerts and high-priority mentions removed |
| S-HOME Ombudsman watch | `hdfc-v3/Ombudsman.tsx` | IndusInd L3, shares of pending. Rule text bound to register; RB-IOS timelines "confirm with the bank". Save list removed |
| S-HOME pulse by business | `Brief.tsx` business cards / reputation table | One table row per business with money line (register). Wholesale greyed "next" |
| S-HOME needs you this week (cards A–D) | `Brief.tsx` morning brief | Four tiles, 2×2, card drawer with the eight-part anatomy. Conditional E/G off |
| S-HOME improving, peer moves, horizon, checked and within range | new | Register-bound; peer moves need L2 (not loaded); one computed quiet item from an L3 check |
| CEO's office vs Head of CX | `MdView.tsx` | Same blocks; Head of CX opens evidence and adds "Owners and status" |
| S-DEP | `ModuleView.tsx` template | Verified dots (pending), L3 indexed flows, slab × region × branch-type heatmap, why-from-outside (L2 not loaded), S01/S03/S04, owner and action |
| S-PEER | new | P01–P09 table (pending), rate-card and ads sections (L2 not loaded), press and ratings (N40) |
| S-RISK | `Ombudsman.tsx` + table patterns | Calendar N35–N39, card D, complaint register (N31, N32 + L3 weekly), IO pattern analysis, penalties N33/N34, escalation language (L2 not loaded) |
| S-CARDS | `CardsView.tsx` | IndusInd card categories; issue pulse, Ombudsman watch, accounts at risk of closure by category (aggregate, replaces the save list), issues by category with owner roles; money line N18 |
| S-APPR | replaces `ActionQueue.tsx` | One list of drafted actions; Approve and Return change state locally; audit line |
| Ask LisN | `AskBar.tsx` | Answer bank only: the five questions plus "show me" chips; otherwise "I'd need your data for that. Here is what I'd look at." Pin to my view removed |
| Removed for IndusInd | — | Priority relationships, customer signal trail, MD-marked mail, email triage, deliverables ledger, save list |

## 3. Steps

| # | Step | Status |
|---|---|---|
| 0 | Inputs unzipped outside the repo; branch; `docs/indusind/` committed | Done |
| 1 | This plan | Done |
| 2 | Config, register, sensitivities, owners reference | Done (values pending IND-D1) |
| 3 | L3 seed (`deposits_weekly`, `complaints_weekly`, `contacts_weekly`, `cards_internal`, `actions`) and reconcile | Done |
| 4 | Lint: all 26 IND-B3 §8 rules, each with a failing fixture | Done |
| 5 | Page payloads, privacy and payload grep | Done |
| 6 | S-HOME | Done |
| 7 | S-DEP | Done |
| 8 | S-PEER | Done (reduced; captures not loaded) |
| 9 | S-RISK | Done |
| 10 | S-CARDS | Done |
| 11 | S-APPR mock | Done |
| 12 | Checks, routes, screenshots, `qa/indusind_qa_checklist.md`, `qa/indusind_volume_validation.md` | Done (see checklist; independent review not run) |
| 13 | Push `feat/indusind-v1` | After the Vercel protection confirmation |
| — | Stretch: S-VF, S-MICRO, S-APP | Not started (core QA first) |

## 4. Blocked on people

| Item | Who | Unblocks |
|---|---|---|
| IND-D1 (and v1.1 with the S03/S04 rows) | Claude (chat) / Ranjith | Every register value, sensitivity, peer cell, date and countdown; the N31 complaint scale; QA items 1, 4 and 5 |
| First-preview date (DEC-8) | Ranjith | The data freeze; "This week" |
| Social pull to IND-B3 §7, with redaction | Dev | The whole outside side, voice on every card, escalation language, the Cards voice section |
| Rate captures, 5 banks daily; ad captures (10) | Dev | Peer moves, S-PEER rate cards and ads, the "no peer rate card changed" quiet item |
| Manual read of IndusInd and IDFC First rate pages | Ranjith or Usha | Rates side by side (`manual_read_logged`) |
| Sentiment-accuracy sample (100 items) and hand-verified top themes | Dev | Negative share on the business table |
| `scripts/lint_local_terms.txt` (discovery names) | Ranjith | Lint rule 21's local list |
| Vercel Deployment Protection on | Usha | The first push |
| Q2 FY27 business update | Dev or Usha | Re-anchor L3 to 30 Sep |
| Independent review in a fresh session | Ranjith | QA item 8 |

## 5. Conflicts

| ID | Conflict | Resolution |
|---|---|---|
| CF-01 | IND-D1 missing, but every screen is built on register values | Values `null`, shown as "pending verification"; labels and bases from IND-B3 with figures stripped |
| CF-02 | IND-B4 copy embeds register values in text (card C and D titles, the quarter line, Improving items, the Federal rate-card example, the footer date) | Each value is a bound placeholder rendered from its register ID |
| CF-03 | User rule "resolved + open + waiting on customer = volume"; IND-B3 `complaints_weekly` has no waiting field | `waiting_on_customer` added to the dataset |
| CF-04 | User rule "negative share of internal contacts about 12%"; IND-B3 core has no contacts dataset | `contacts_weekly` added (week × product × channel), complaints a subset of negative contacts |
| CF-05 | User rule: no count may imply an annual complaint rate more than 2× off N31; N31 is pending | L3 counts stay in the seed; screens show shares and indices (Q1 weekly average = 100) until N31 lands |
| CF-06 | HDFC Ombudsman text carries RB-IOS timelines and an IO Directions date; neither is a register entry here, and N37 is pending | States are computed on the 30-day reply rule, labelled "RB-IOS timelines: confirm with the bank"; the IO Directions date renders from N37 |
| CF-07 | IND-B4 quiet item and peer moves assume rate captures; none are loaded | Peer moves say "Public data not yet loaded"; the quiet item comes from a computed L3 check that passed |
| CF-08 | IND-B4 kickoff says commit and push after each screen; the user says ask before the first push | Commit after each step; push once, after the Vercel protection confirmation |
| CF-09 | IND-B4 asks for `config/indusind.yaml` injected into components; the frontend has no YAML reader | The pipeline reads the YAML and writes JSON page payloads; components import those |
| CF-10 | Pulse-by-business "Open" assumes modules or a generic product page; stretch modules are not built | Deposits and Cards open their screens; other rows show "Module next" |
| CF-11 | `release/vidya-demo` does not exist; the repo's QA commands sit on `chore/qa-setup` | Branched from `main`; cherry-picked the one QA-setup commit |
| CF-12 | DEC-8: no preview date, so no freeze | Provisional freeze 2 Oct 2026, 18:00 IST in config, shown on screen as the freeze |
| CF-13 | Register IDs are needed for provenance, but internal labels are banned on screen | IDs live in `data-register` attributes and the payloads, never in visible text |
