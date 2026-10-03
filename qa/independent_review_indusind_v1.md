# IndusInd V1 · independent review (IND-B4 §10.8)

Reviewer: fresh session; did not build this. Branch reviewed: `feat/indusind-v1` at `1929080`; review branch `review/indusind-v1`.
Server: `next build` + `next start -p 3100` on this machine, 3 Oct 2026 15:35 IST. Data freeze on screen: 2 Oct 2026, 18:00 IST (provisional).
Screenshots: `qa/screens_review_indusind_v1/` (1440 and 390; `_first-screen`, `_full`, `_end` per route; card drawers; Ask LisN). Per-route measurements: `qa/screens_review_indusind_v1/report.json`.
No real person's name was found on any screen or payload, so nothing needed masking here.

---

## A. Verdict

**No.** The reader's office cannot take this to the MD. All 80 register values are null (IND-D1 is missing), so the home page shows "pending verification" 49 times. It holds no RoA, no CASA ratio, no cost of deposits and no rupee line, so not one figure can be checked against the investor presentation.

The "outside" half is 99.8% Google Play reviews of the INDIE app. So every one of the four cards shows "Not enough public items" for what customers said.

A live route under the same role page (`/role-based/indusind_bank/head_cards`) shows hard-coded card figures that contradict the disclosures, without the watermark.

## B. Top 5 fixes before the first preview (most embarrassing first)

1. **Take down `/role-based/indusind_bank/head_cards`.** Redirect it to S-CARDS or return 404. It still renders the earlier cards demo at an IndusInd URL. It shows:
   - "Receivables ₹9,760 Cr" against IND-B3 N18's ₹9,418 crore;
   - "Net credit cost 6.0%" and "Cards in force 31.2 L";
   - real co-brand names (Avios, Jio-bp, EazyDiner, Legend, Pioneer Heritage);
   - "mis-selling claims add conduct exposure", an allegation stated as a finding;
   - "Sourcing Q2" and ✨ "AI" callouts;
   - no watermark and no footer.

   It is noindex but answers 200 to anyone with the link. The builder's crawl skips it because nothing links to it.
2. **Get IND-D1 into the repo and fill the register, or do not preview.** With every L1 value pending, the quarter line, the money lines, all four cards, Improving, the horizon and S-PEER are empty frames. Nothing on the page passes the "first five minutes" check.
3. **Fix the bank's name and the exit to other clients.**
   - The role page says "Indus Ind Bank" (`frontend/lib/role-based-dashboard/registry.tsx:484`).
   - Its "Back to industries" link opens `/role-based`, which lists HDFC, Sterling Bank, Openbank and others. That breaks DEC-7: our other bank work is never named.
4. **Fix the two wrong-number bugs that will show the moment IND-D1 lands.**
   - (a) Yes Bank's row on S-PEER has no figures. `peers.core: [federal, yes, idfc_first]` in `config/indusind.yaml` parses `yes` as boolean `True`, so P02, P06 and P07 never match `bank == "yes"`.
   - (b) The Improving strip binds N10 alone. It will print "Cost of deposits · Q1 FY26 … 6.44%" in green, the old, higher cost, instead of "6.44% → 5.95%".
5. **Say what "Outside" really is.** Lead the outside tile and every card's voice block with "INDIE app reviews (Google Play)", not "public voice". Move the "99.8% Google Play" source note out from behind the (i). An MD's office will read "2,509 public items" as the market's view of the bank. Either pull deposit, vehicle-finance and peer sources, or stop implying cards A–D have a voice line.

## C. Findings

Severity: Blocker = cannot show; Major = the reader's office would catch it or it breaks a brief rule; Minor = fix before preview; Polish = nice to have.

| # | Screen | Severity | Finding | Evidence | Fix | Rule |
|---|---|---|---|---|---|---|
| 1 | `/role-based/indusind_bank/head_cards` | Blocker | Earlier cards demo still served under the IndusInd path: hard-coded figures that contradict N18 (₹9,760 Cr vs ₹9,418 crore), real co-brand names, "mis-selling claims add conduct exposure", "Sourcing Q2", ✨ AI callouts, no watermark or footer. Not in any check: the crawl starts at the role page and the role is `unlisted` | `screens_review_indusind_v1/12_earlier-cards-demo_1440_full.png`; `report.json` (watermark false, footer false); `registry.tsx` role `head_cards` (`unlisted: true`); `RoleDashboardView.tsx:4573` | Delete the role entry and the branch in `RoleDashboardView`, or redirect to `/customer-pulse/cards`. Add the URL to `routes_indusind.json` | B4 §1 watermark; B2 §3 allegation, Q2; B3 §1 L1 only; HL-06, HL-23 |
| 2 | All | Blocker | IND-D1 missing: 80/80 register values null. Home shows 49 "pending verification" chips; the quarter line, money lines, Card A–C figures, rupee lines, Improving, horizon dates and countdowns, peer cells and penalties are all empty | `data/public/indusind_register.json` (`value: null` ×80); `01_home_ceo_1440_full.png`; `report.json` pending=49 | Commit IND-D1; fill the register; rerun §10 | B4 §10.1, §10.4, §10.5 |
| 3 | Role page, shell | Major | Bank name misspelt "Indus Ind Bank" on the first screen the MD's office sees | `00_role-page_1440_full.png`; `registry.tsx:484` | "IndusInd Bank" | B4 §1 brand (name as header text) |
| 4 | Role page | Major | "Back to industries" goes to `/role-based`, which lists HDFC and other client demos; the shared chrome's JS also carries "HDFC"/"Flipkart"/"Standard Chartered" logos and titles on every IndusInd route | `/role-based` (browser, link `href="/role-based/hdfc"`); IndusInd page chunks contain the `HDFC Logo` string | Hide the back link for IndusInd and serve IndusInd routes without the multi-client chrome | DEC-7 |
| 5 | S-PEER | Major | Yes Bank row shows only "Peer deposit sizes and growth: pending" and none of P02, P06, P07. YAML 1.1 parses `yes` as `True` | `07_peers_1440_first-screen.png`; `python -c "yaml.safe_load(...)['peers']['core']"` → `['federal', True, 'idfc_first']`; `scripts/build_indusind.py:507` | Quote `"yes"` in `config/indusind.yaml` (core and names); add a check that every core peer row has its register IDs | B4 §5.1; B3 §3 |
| 6 | S-HOME Improving | Major | Item 1 binds N10 only, labelled "Cost of deposits · Q1 FY26". Once filled it will show 6.44% in green: the year-ago cost, not the improvement. N08 is never shown here. The strip also says "Verified items only" while all three are pending | `01_home_ceo_1440_full.png`; `config/indusind.yaml` `improving: [N10, N14, N20, N26, N40]` | Bind the item to N10 → N08 as one line ("6.44% → 5.95% year on year") | B4 §2.5; B2 §4.1 |
| 7 | S-HOME, cards, S-DEP, S-RISK, S-CARDS | Major | "Outside" is INDIE app reviews: Google Play 99.8% (w4). Every card voice block is thin: A 39 items, B and D are the whole app pull (2,509, "99.8% Google Play"), C has 0. The dominance footnote sits behind "Source notes (2) (i)" | home payload `cards[*].voice.footnotes`; `13_home_card-A-drawer_390.png`; `08_risk` text | Retitle as "INDIE app reviews"; show the source share inline; scope B and D voice to deposit or distribution items only, or show "No public source for this yet" | B3 §7 (60% footnote); B2 §4.7; HL-12 |
| 8 | S-HOME depth test | Major | No card shows what customers said (all "Not enough public items"), and the only thing "not in his pack" is synthetic L3 splits. The core proposition (the join) is not visible anywhere | `drawer_A..D` text; §10.4 | Load L2 sources that carry deposit and VF voice (B3 §7 query sets), or reorder the home page so the app-release story (which has data) is a card | B4 §10.4; B2 §1 |
| 9 | S-PEER | Major | Rates side by side lists P10–P17 with no IndusInd column. When values land, Federal, Yes and RBL rates (RBL savings 6%) will stand alone, which implies peers out-pay IndusInd | `07_peers` text; `build_indusind.py:509` | Hide the peer rate rows until `manual_read_logged`, or render them only in a two-column row with IndusInd's same-band rate | B2 §4.4; B3 §3 honesty rule |
| 10 | S-PEER, home peer moves | Major | No rate captures, ads or press loaded. Card effective dates, ads and press read "Public data not yet loaded"; the quiet item cannot be the "5 banks checked daily" line | `07_peers` text; `config/indusind.yaml` `l2_loaded: false` | Start the daily captures (B3 §4) now; the fallback line needs a start date | B3 §4, §5; B4 §2.6 |
| 11 | Ask LisN | Major | Free text "what is our RoA gap to target" is answered with "What changed since Monday?" (closest question shown) instead of "I'd need your data for that". An MD's office will ask exactly this | `14_ask-freeform_1440.png`; `AskBar.tsx` matcher | Require a minimum match score; otherwise use the fallback | B4 §9.7 |
| 12 | All L1 tiles | Major | "Public · verified" tag sits on every pending, unverified figure (quarter line, money lines, evidence list "source pending verification · Public · verified") | `06_deposits` Evidence block; `01_home_ceo_1440_first-screen.png` | Show "pending verification" in place of the tag when `pending` | B2 §4.1; HL-04 (claims must be true) |
| 13 | S-RISK weekly register | Major | "To the IO" is below "Rejected" in 6 of 13 weeks (for example 2 Oct: rejected 7.9%, to the IO 6.4%), while the definition says every rejection is reviewed by the IO first. A Head of CX will spot it | `08_risk` weekly table; `config/indusind.yaml` `defs.io` | Make IO referrals ≥ rejections in the same week, or say "referrals lag decisions by up to a week" | HL-19 (one IO register) |
| 14 | Lint rule 21 | Major | The discovery-names list is empty. `scripts/lint_local_terms.txt` (IND-B3's name) does not exist and is **not gitignored**, so if someone creates it as the brief says, it can be committed. `lint_terms_local.txt` is present but has no terms ("list is empty") | `lint_terms.py` output; `.gitignore` lines 1, 12–15 | Gitignore `scripts/lint_local_terms.txt`; ask the decision owner to fill it before the preview | B3 §8 rule 21; HL-06, HL-08 |
| 15 | S-CARDS | Major | Opened from "Head of Cards", the title reads "Customer pulse — CEO's office" with avatar "CO". The Cards head lands in the CEO's view | `09_cards_1440_first-screen.png`; `INDUSIND_PULSE_ROLE_HREF` (no `v`) | A Cards view label, or no view label on module pages | B4 §7; DEC-9 |
| 16 | S-CARDS | Major | 12 categories with near-identical open (7.0–8.6%), waiting (4.3–5.4%) and negative (11.2–13.6%) shares. The table says nothing to a Cards head | `09_cards` text | Generate distinct category profiles (still neutral, no causal story) or show only share and change | B4 §7; HL-22 |
| 17 | S-HOME Card C | Major | The "inside" line promises "application-to-disbursement time and dealer drop-offs" but the figures are conduct-complaint shares by region (19.7–25.4%) | `drawer_C` text; `config/indusind.yaml` card C `inside` | Make the label match the data, or add the VF dataset | B4 §3 card C; B3 §6 |
| 18 | S-CARDS | Minor | "Accounts at risk of closure: n" is shown as an index (114), not n | `09_cards` text | Show n once N31 sets the scale (IV-05); until then label it "index" in the title | B4 §7 |
| 19 | S-CARDS | Minor | Closure risk by category leads with "Closure 49.5%", which is circular | `09_cards` text | Drop the Closure category from that list | — |
| 20 | Floating Ask bar | Minor | On the first screen at 1440 the bar covers the bottom of the Outside tile (rating line, "Public · live") and, on S-CARDS, the gauge labels. It clears the footer at the page end only | `01_home_ceo_1440_first-screen.png`; `09_cards_1440_first-screen.png` | Collapse to an icon until scrolled, or dock it into the header | HL-26 |
| 21 | S-HOME | Minor | Escalation language: home and business rows show counts (4; "2 escalation"), while S-RISK shows "Not enough public items" for the same thing | `01_home_ceo` vs `08_risk` text | One threshold rule for one metric | B4 §6.6 |
| 22 | config | Minor | Public escalation definition adds "cyber crime" to RBI, Ombudsman or court | `config/indusind.yaml` `defs.escalation_public` | Match B4 §2.2 or rename the metric | B4 §2.2 |
| 23 | S-HOME table | Minor | Extra row "Not tied to one business"; Digital's "money line" is a user count (N41), not money | `01_home_ceo` text | Drop the row; label the Digital line "scale", not money | B4 §2.3 |
| 24 | S-HOME quiet item | Minor | "Checked and within range" is computed on our synthetic complaints. It is a "check passed" about the bank on invented data, and in the week view it sits beside "+23% vs previous period" | `05_home_ceo_week` text | Use an L2 or capture-based check (B4 examples) | B4 §2.8 |
| 25 | Approvals | Minor | Cards B, C and D are approved by their own owner (CFO, Head of VF, CCO). The human gate reads as self-approval | `11_approvals` text; `config/indusind.yaml` | A different approver role per card (for example the MD's office for B) | B4 §8 |
| 26 | Card C | Minor | Peer column names Federal, Yes and IDFC First as pending. For vehicle finance the brief's peer is AU (held) | `drawer_C` text | Label "AU vehicle books: pending verification" | B4 §3 card C; B3 §3 |
| 27 | S-PEER | Minor | Kotak row is not greyed; same weight as the core peers | `07_peers_1440_first-screen.png` | Grey the upper-benchmark row | B4 §5.1 |
| 28 | S-RISK penalties | Minor | The B4 line "Both RBI penalties cite the Interest Rate on Deposits Directions" is absent; only the two penalty labels show | `08_risk` text | Add the line, bound to N33 and N34 | B4 §6.5 |
| 29 | Role page | Minor | No footer on the role page (watermark present) | `report.json` footer false | Add the footer | B2 §4.9 |
| 30 | Card D tile and drawer | Minor | "What moved" label is the full ~25-word N36 text | `01_home_ceo` text | Short label; detail behind the (i) | HL-22 |
| 31 | eng-qa step 5 | Minor | `npm run lint` fails repo-wide (2,585 errors, none in IndusInd files). Scoped Biome on IndusInd files passes (IV-15) | review run | Record the scoped gate in AGENTS.md or fix the repo baseline | eng-qa |
| 32 | Phone 390 | Polish | The first phone screen is controls plus five pending chips; the pulse starts below the fold | `01_home_ceo_390_first-screen.png` | Collapse the filters into one control on phones | HL-33 |
| 33 | Repo data | Polish | `items.jsonl` keeps second-precise timestamps, star rating and app version, which is enough to find each Play review again. The handle-hash salt is in the repo. Pseudonymised, not anonymous | `data/processed/indusind_l2/items.jsonl`; `scripts/indusind_l2_common.py:37` | Round `created_at` to the day in the committed store; move the salt to an env var | HL-02 |
| 34 | `qa/indusind_volume_validation.md` | Polish | Says 1,180 complaints a week; the seed's Q1 weekly average recomputes to 1,229 | recompute from `complaints.jsonl` | Correct the note | HL-18 |

## D. IND-B4 §10 checklist

"D1-only" = fails only because IND-D1 is missing. "Real" = fails on its own merits.

| # | Item | Result | Evidence |
|---|---|---|---|
| 1 | Every on-screen number checked against the register; labels and bases match IND-D1 | **FAIL (D1-only)** | `check_indusind.py`: 2,167 bound figures, 0 failures, 80/80 values pending. Binding works; the values are absent |
| 2 | IND-B3 §8 lint, all 26 rules | **PASS, with one real gap** | `lint_terms.py` 0 hits over 111 files and 67 rendered routes; 41 lint fixtures pass. Real gap: rule 21's discovery list is empty and its file is not gitignored (finding 14). `head_cards` is not linted (finding 1) |
| 3a | Business row = module | **PASS** | Deposits and Cards rows equal their screens in every window (`check_indusind.py`; re-read: Cards row 93 / 38.8% / 11.2% / 63 items = S-CARDS) |
| 3b | Cards row = S-CARDS | **PASS** | As above, all three windows (fixture `Cards row out of step` trips) |
| 3c | L3 totals = register at 31 Mar and 30 Jun | **FAIL (D1-only)** | Balances bound to N03–N06, D03, D04, all null |
| 4 | Depth test per home card | **FAIL (real + D1)** | Rupee line: A, B, C pending (D1); D carries the exposure statement. Peer: pending chips (D1). **What customers said: real failure.** All four are thin and C has 0 items. Owner and action: pass. **"Not in his pack": real failure.** Only synthetic L3 splits |
| 5 | Exactly four tiles; one computed quiet item; Improving verified only | **FAIL (real + D1)** | Four tiles on every home variant (`report.json`). Quiet item present but synthetic (finding 24). Improving pending (D1) and mis-bound (finding 6, real) |
| 6 | No home or Cards text mentions SFIO, SEBI, derivatives, fraud at the bank, former management | **PASS** on `/customer-pulse/*`. **FAIL** on `/role-based/indusind_bank/head_cards` ("mis-selling claims add conduct exposure"; the old Cards view) | rendered-text scan of 13 routes |
| 7 | Screenshots 1440 and phone, no large blank gaps, watermark on every screen | **FAIL (real)** | No horizontal scroll at 390 on any route; watermark on all `/customer-pulse/*` routes and the role page. Watermark missing on `head_cards`. Ask bar covers content on the first screen (finding 20) |
| 8 | Independent review | **This file** | — |

## E. Number trace sheet

**L1 (register).** Every on-screen L1 figure is null, so none recomputes from the build. As a cross-check, I recomputed the IND-B3 §2 table's own derived arithmetic, which is what the register will carry once IND-D1 lands. Brief figures are quoted from IND-B3, not from outside sources.

| Screen | IDs shown | On screen | Brief arithmetic recomputed |
|---|---|---|---|
| Home quarter line | N27, N28, N29; S01, S07 | pending | S01 = 4,14,766 × 0.01% = ₹41.48 cr ✓; S07 = 3,26,274 × 0.01% = ₹32.6 cr ✓ |
| Home "doing" | N04, N06, N07, D08, N42 | pending | D08 = −2.74% QoQ, −4.03% YoY ✓ |
| Pulse by business money | N04, D08, N21, N16, N18, N19, N41, N26 | pending | — |
| Card A | N04, D08, D06, D05, D07; P04–P08; S03, S04 | pending | D01 1,22,060 ✓; D02 1,24,933 ✓; D05 29.43% ✓; D06 31.24% ✓; D07 +3.71% ✓; S03 ≈ ₹7,507 cr ✓ (restore-ratio variant ₹10,926 cr ✓); D09 7.02% ✓; D10 3.38% ✓; S04 ₹173–273 cr ✓ ("170–275") |
| Card B | N10, N09, N08; P01, P02, P03 (own line, "cost of funds"); S01, S02 | pending | S02 = ₹414.8 cr ✓ |
| Card C | N22, N24, D11, N23, N21; S05 | pending | D11 = −4.1% YoY ✓, −14.5% vs Q4 ✓ ("14%"); S05 = ₹99.7 cr ✓ |
| Card D | N36 (+ days to go) | pending | — |
| Improving | N10, N14, N20 | pending | **mis-bound** (finding 6) |
| Horizon / S-RISK calendar | N35, N38, N36, N37, N39 | pending; countdowns pending | — |
| S-DEP | N03–N06, D03, D04, D05, D06, N08–N10, P01–P03, N13, N14, S01, S03, S04 | pending | D03 2,92,706 ✓; D04 2,74,998 ✓ |
| S-PEER | P01, P03, P04, P05, P08, H01, P09, P10–P17, N40 | pending; **P02, P06, P07 missing** (finding 5) | — |
| S-RISK register and penalties | N31, N32, N33, N34 | pending | — |
| S-CARDS money | N18 | pending | — |

**L2 (public, `data/processed/indusind_l2/items.jsonl`, on-topic, de-duplicated). I recomputed every figure below myself.**

| Figure | ID | Screen | Recomputed | ✓ |
|---|---|---|---|---|
| Public items, last 4 weeks | `L2:items:all:w4` | 2,509 | 2,509 (Play 2,504; App Store 5) | ✓ |
| Public items, this week | `L2:items:all:week` | 358 | 358 | ✓ |
| Play · bank replied, w4 | L2 responded | 99.5%, n = 2,504 | 99.5% | ✓ |
| Escalation language, w4 | L2 | 4 | 4 | ✓ |
| Top theme, w4 | security_block | 338 | 338 (non-positive) | ✓ |
| Top theme, week | security_block | 25 | 25–26 (26 with duplicates) | ✓ |
| Cards items, w4 | `L2:items:cards:w4` | 63 | 63 | ✓ |
| Deposits items, w4 | `L2:items:deposits:w4` | 39 | 39 | ✓ |
| Digital items, w4 | `L2:items:digital:w4` | 2,405 | 2,405–2,408 | ✓ |
| INDIE listing rating | LIVE-01 | 4.5 from 8,17,954, as of 1 Oct 2026 | `listing.json` | ✓ (IND-B3 says 8.19 lakh "reviews"; this is the dated ratings count) |

**L3 (synthetic, `data/seed/indusind_v1/complaints.jsonl`). I recomputed these from the case rows.**

| Figure | Screen (w4 / week) | Recomputed | ✓ |
|---|---|---|---|
| Complaints received index | 96 / 110 | 96 / 110 (Q1 weekly mean 1,229) | ✓ |
| Change vs previous period | −1% / +23% | −1% / +23% | ✓ |
| Grievance desk | 8.3% / 8.6% | 8.3% / 8.6% | ✓ |
| Escalation language (inside) | 5.9% / 5.6% | 5.9% / 5.6% | ✓ |
| Reject rate | 8.1% (validation file) | 8.06% (2,468 of 30,637 replied) | ✓ |
| Resolved / open / waiting | 57.1 / 36.0 / 6.8 | open + waiting ≈ 42.8 against 41.8 with no final reply by my simpler rule; `check_indusind.py` reconciles exactly | ✓ (approx.) |
| Cards row = S-CARDS | 93 · 38.8% · 11.2% | identical on both screens | ✓ |
| All other L3 cells (heatmap, categories, channels, pattern shares, Ombudsman states) | — | Covered by `check_indusind.py` (0 failures, 2,167 figures). Not recomputed cell by cell | not independently recomputed |

## F. Ten questions the MD's office will ask that this can't answer

| # | Question | Suggested build change |
|---|---|---|
| 1 | "What is our RoA this quarter, and how far are we from the 1% exit?" | Fill N27–N29 from IND-D1. Keep "no rupee gap" (B4), but show the three figures. Make Ask LisN fall back properly (finding 11) |
| 2 | "Is the Q2 update out, and does any of this change?" | A visible "anchored to Q1 FY27; Q2 update not yet in" line beside the freeze; re-anchor when filed |
| 3 | "Where did the savings money actually go, by segment?" | Card A and S-DEP show only synthetic, flat splits (all cells move together by design). Lead with the CASA → TD arithmetic (S03/S04), and present the heatmap as "what your data would show" in a smaller tile |
| 4 | "Are peers paying more than us for the same money?" | Needs the manual IndusInd rate read and the daily captures (finding 9, 10). Until then, drop the rate section from S-PEER |
| 5 | "What are deposit customers saying, not app users?" | Pull the B3 §7 deposit and peer query sets (consumercomplaints.in, YouTube, licensed Reddit or X). Today there are 39 deposit items in 4 weeks |
| 6 | "Is the vehicle-finance slowdown demand, service or credit?" | Card C has no voice (0 items) and no VF dataset. Build `vf_region_monthly` (stretch) or drop the question from the title |
| 7 | "Which journeys carry conduct-rule exposure, in rupees?" | The answer is the exposure statement only. Add the count of distribution-ground complaints by product once N31 scales them (IV-05) |
| 8 | "How do our complaint numbers compare with what we disclosed?" | N31 and N32 pending; screens show only indices. Show counts scaled to N31 when it lands (IV-05 plan) |
| 9 | "Our app is being blocked on new phones. How many customers, and since which release?" | The data exists (`docs/indusind/card_g_candidate.md`). It is the only story with real public evidence. Ask the decision owner to swap Card G in or give it a home strip |
| 10 | "Who signed off each action, and when?" | Approvals keep state in the browser only, and three cards are self-approved (finding 25). Make the approver a different role, and show the audit line on the card drawer too |

## G. What's working (do not change)

- **The privacy pipeline.**
  - No raw scrape or `_audit/` file in any commit (`git log --all`); both paths are gitignored.
  - No L2 item id, URL, handle, email, phone or PAN in any route payload (re-checked on all six screens) or in the build.
  - The committed glosses are paraphrases.
- **Reconciliation and fixtures.** Business row = module and Cards row = S-CARDS in every window. 41 lint and 25 reconcile fixtures each fail the check they target. The pipeline is deterministic: a full rerun changed no tracked file.
- **Public-data discipline.**
  - The 10 Aug start marker, the App Store gap note, "Play Store · bank replied" with n, and the listing rating dated and apart from the window.
  - Negative share is absent while `sentiment_check_passed` is false.
  - X, Reddit and MouthShut are on no screen, and themes need 15 items.
- **Refusing to invent figures.** No figure is typed into a component or filled from memory; pending is shown as pending.
- **Copy on `/customer-pulse/*`.** No banned word, no Q2 or H1 FY27, owners as roles with the Internal Ombudsman "informed", allegation labels exact, the three provenance tags, the watermark and the footer on every screen.
- **Theme paraphrases** are mostly fair. Of 20 random non-positive items behind the top themes (`sample_check_indusind_l2.py show`), 15 fit their theme. The misses are listed below.

### Theme spot-check (20 items, seed 31003)

| Theme | Read | Fair | Notes |
|---|---|---|---|
| App blocked as a security risk | 6 | 6 | All describe the "threat detected / secure operating system" block |
| Login and registration | 4 | 3 | One item says only "unable to login": no OTP or mobile-number detail |
| The latest app update | 2 | 1 | One reviewer had updated everything and blames no update |
| Customer care | 2 | 0 | One is a loan foreclosure and part-payment complaint (product mis-tagged as Digital); one is a three-word "not supported" with no care content |
| Card missing from the app | 3 | 2 | One is a new card-only customer who cannot register (belongs in "Card-only sign-up") |
| Debit card set-up | 3 | 3 | One is really a benefits-removed and annual-fee complaint; fits only the widened paraphrase |

Paraphrase verdict: "App blocked" and "Login" are safe to show. "Customer care" and "The latest app update" are not reliable at this sample size and should not lead a row.

## Appendix 1 · Route map

| Route | IND-B4 ID | Views | Windows | Business filter |
|---|---|---|---|---|
| `/role-based/indusind_bank` | role page | — | — | — |
| `/role-based/indusind_bank/{indusind_ceo_office, indusind_head_cx, indusind_head_cards}` | redirects | — | — | — |
| `/role-based/indusind_bank/customer-pulse` | S-HOME | CEO's office, Head of CX (`?v=cx`) | week, w4, w13 | all, deposits, vehicle, micro, cards, digital |
| `…/customer-pulse/deposits` | S-DEP (tabs: savings and flows, cost of deposits, retail franchise) | both (same content, IV-23) | all three | — |
| `…/customer-pulse/peers` | S-PEER | both | — | — |
| `…/customer-pulse/risk` | S-RISK | both | all three | — |
| `…/customer-pulse/cards` | S-CARDS | both | all three | — |
| `…/customer-pulse/approvals` | S-APPR (mock) | both | — | — |
| `/role-based/indusind_bank/head_cards` | **none: old demo, live** (finding 1) | — | — | — |
| `/indusind-v1/*` | 307 to the above | — | — | — |

Every Core screen has a route. The Stretch screens (S-VF, S-MICRO, S-APP) are not built, as planned. No Core screen is missing.

## Appendix 2 · Checks re-run by the reviewer

| # | Check | Result |
|---|---|---|
| 1 | `bash scripts/hdfc_pipeline/run_all.sh` (with raw L2 present) | PASS, exit 0, 7 min. No tracked file changed |
| 2 | `check_reconcile_v3.py`; `check_indusind.py` | 0 failures; 0 failures (2,167 figures, 80/80 pending) |
| 3 | `lint_terms.py`; `check_pii.py` (after the build) | 0 hits (111 files, 67 rendered routes); 0 hits (90 files, 67 routes). Rule 21 local list empty |
| 4 | `test_check_pii.py`; `test_checks.py` | PASS; 41 + 25 IndusInd and 39 + 26 HDFC fixtures, 0 failures |
| 5 | `npm run lint`; scoped Biome; `tsc --noEmit` | FAIL repo-wide (2,585 errors, pre-existing, none in IndusInd files); PASS (25 files); PASS |
| 6 | `npm run build` | PASS |
| 7 | `qa_routes_v2.mjs` IndusInd and HDFC route lists | 14/14 and 26/26 → 200 |
| — | `qa_indusind_routes.mjs` crawl | 67/67: 200, noindex, watermark, grep clean. **Does not reach `head_cards`** |
| — | Payload grep (6 screens, CX view) | 0 L2 item ids, 0 external URLs |

**Coverage:** the checks cover every route reachable from the role page. They do not cover `/role-based/indusind_bank/head_cards` (live, unlinked) or `/role-based` (one click away). Both should be in scope.

## Appendix 3 · MORNING_DECISIONS, IndusInd V1 (IV-01 to IV-45)

| ID | Call | Judgement |
|---|---|---|
| IV-01 | Branch from `main` | Agree |
| IV-02 | Register values null until IND-D1 | Agree on not inventing figures. But IND-B3 §2 states its table is IND-D1-verified, and the result is an unpreviewable build. Getting IND-D1 should have been raised as a stop-ship blocker, not left as a status |
| IV-03 | Owners file holds roles only | Agree |
| IV-04 | Provisional freeze 2 Oct 18:00 | Agree. Re-set when the preview date is known; check the Q2 update first |
| IV-05 | Counts withheld until N31 | Agree. Consequence: "n" on S-CARDS becomes an index (finding 18) |
| IV-06 | Seed shape | Agree |
| IV-07 | `contacts_weekly`, waiting and grievance fields added | Agree |
| IV-08 | Illustrative rates | Agree on the ranges. **Disagree** on the weekly IO-vs-rejected inconsistency (finding 13) |
| IV-09 | Ombudsman states; "confirm with the bank" | Agree |
| IV-10 | No causal story | Agree on the rule. **Disagree** with the outcome: flows and the heatmap are so uniform they read as empty (findings 16, F3). Neutral noise can still be varied |
| IV-11 | Lint read as "same string" | Agree (stricter). **Disagree** with leaving rule 21's list empty |
| IV-12 | Reconcile and privacy checks | Agree |
| IV-13 | Selection in the URL, sliced on the server | Agree |
| IV-14 | Arithmetic in words | Agree |
| IV-15 | Biome scoped to IndusInd files | Agree as a gate. Record it in AGENTS.md so `npm run lint` is not reported as passing |
| IV-16 | Rule 18 skips CSS | Agree |
| IV-17 | Internal labels out of payloads | Agree |
| IV-18 | Seed account counts | Agree |
| IV-19 | Definitions behind (i) | Agree, except the source-dominance note, which is the headline caveat (finding 7) |
| IV-20 | Home layout; colours | Agree |
| IV-21 | Weekly register as stock and flow | Agree |
| IV-22 | Business filter changes the pulse only | Agree |
| IV-23 | Views change the home page only | Partly. Module pages keep the CEO title even for Head of Cards (finding 15) |
| IV-24 | Peer rates listed pending, no comparison | **Disagree.** Listing peer rates without IndusInd's rate breaks B2 §4.4 as soon as values land (finding 9) |
| IV-25 | Separate IndusInd routes file; full-page shots hide the Ask bar | Partly. Hiding the bar hides the first-screen overlap (finding 20) |
| IV-26 | Licence buckets | Agree |
| IV-27 | INDIE only; group insurers excluded | Agree |
| IV-28 | Raw outside the repo; no free text committed | Agree. See finding 33 on re-identifiability |
| IV-29 | Deterministic keyword tagging; stars for sentiment | Agree for V1. The spot-check shows product mis-tags from the "default to app" rule |
| IV-30 | Hand-written themes; 15-item floor | Agree. Tighten "Customer care" and "Update" (section G) |
| IV-31 | Thresholds and states | Agree. One rule for escalation counts (finding 21) |
| IV-32 | Cards sub-line "Business view: Cards" | Agree |
| IV-33 | Captures not loaded | Agree it is honest, but it leaves S-PEER empty (finding 10) |
| IV-34 | INDIE rating once, dated | Agree |
| IV-35 | Peer apps bucket | Agree |
| IV-36 | Sharper sub-themes | Agree |
| IV-37 | 10 Aug cut | Agree |
| IV-38 | Card G trigger; not swapped | Agree it is the decision owner's call. Recommend swapping it in: it is the only card with evidence (F9) |
| IV-39 | App Store drop footnoted | Agree |
| IV-40 | Seed artefacts; neutral Card A title | Agree |
| IV-41 | Role-based home | Agree on the move. **Disagree** with keeping the multi-client chrome and the "Back to industries" exit (finding 4) |
| IV-42 | Carry-forward file not found | Superseded by IV-43 |
| IV-43 | Carry-forward rules applied | Mostly agree. HL-06 and HL-08 still have the empty rule-21 list; HL-26 is partly met |
| IV-44 | Head of Cards opens S-CARDS; old demo unlisted | **Disagree.** "Unlisted" is not removed: the old demo is live, unwatermarked and contradicts N18 (finding 1) |
| IV-45 | Check scope = crawl from the role page | **Disagree.** Scope must include every route under `/role-based/indusind_bank/`, linked or not |

### Decisions DEC-1 to DEC-10, as built

| ID | Built as decided? |
|---|---|
| DEC-1 | Pulse leads, no blended score, money line per row: yes, in structure. The money lines are all pending |
| DEC-2 | Trust watch out: yes; `trust_governance` excluded |
| DEC-3 | No 150 bp: yes (N15 `display_default: false`, not rendered) |
| DEC-4 | Peer set: yes on `/customer-pulse/*`. Yes Bank row broken (finding 5); Kotak not greyed (finding 27) |
| DEC-5 | No MD cards remark: none found |
| DEC-6 | Route: n/a to the build |
| DEC-7 | Other bank work never named: **breached** through the role page exit and the shared chrome (finding 4) |
| DEC-8 | Freeze provisional: yes |
| DEC-9 | Views and roles, no names: yes. Head of Cards lands in the CEO title (finding 15) |
| DEC-10 | Cards business view: yes (S-CARDS); the old demo still live (finding 1) |
