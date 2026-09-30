# Independent review: LisN HDFC Bank demo, V3 build (B7)

- **Reviewer:** independent. I did not build this demo.
- **Date:** 29 Sep 2026.
- **Build reviewed:** `main` @ 5ac3a2f. The live path is `/hdfc-pulse/v2/*`, and `/hdfc-v3/*` redirects there (`frontend/next.config.mjs:18-19`).
- **Scope:** this review file and the screenshots in `qa/screens_review_v3/` are the only outputs. No app code, data or config was edited.
- **How the checks were run:**
  - The seed generator was re-run in place. Its output was byte-identical, so the working tree is unchanged.
  - The public pipeline was re-run into a scratch copy. Its output was also byte-identical to `data/out/app_jul_sep/`.
- **Screenshots:**
  - `qa/screens_review_v3/<screen>-<1440|390>.png` are full-page, 35 routes × 2 widths.
  - `qa/screens_review_v3/viewport/*.png` are above-the-fold crops.

---

## A. Verdict

**Joint working session: Yes, with fixes. Do not show it to the sponsor until the top 5 fixes below land.**

The structure is right, and the priority-relationships answer is the strongest thing in the build. It matches the morning review: numbers first, then product by product, then cohorts, with a TAT for every item.

But in its current state the build would embarrass us in the room:
- It ships real people's names, including the bank's own CEO and ex-chairman, plus a potentially defamatory quote, inside every page.
- It labels the build with the sponsor's colleague's name.
- It shows "Re-promise" on the one screen the client asked us to rename.
- It puts two different internal datasets on the same page.
- Its mood and trend headlines are partly collection artefacts, not customer behaviour.

---

## B. Top 5 fixes before the sponsor review, ranked by embarrassment risk

1. **Stop shipping real names and the whole evidence set.**
   - What happens now:
     - Every V2 page passes the full `Bundle` to a `"use client"` component, e.g. `frontend/app/hdfc-pulse/v2/priority/page.tsx:15` → `PriorityView b={b}`.
     - As a result, all 358 evidence items, with `redacted_text` and source URLs, are serialised into the HTML of every page. Each page is about 735 KB, and I counted 358 `redacted_text` fields on `/priority` itself.
   - What that payload contains:
     - "Sashi Jagdishan", who is the bank's CEO, in an "alibi" allegation.
     - "ex-Chairman Atanu Chakraborty".
     - "Jose Garcia CEO of Carlisle Fund", with allegations of drug abuse. This is potentially defamatory.
     - Named staff: "Rajiv Kumar", "Shreyas, can you be more stupid?", and branch manager "Debmalya Mukherjee" with a call for his dismissal.
     - "Abhishek Tyagi", "Shivaji Tonpe" and "Rahul Gandhi".
     - Personal handles: @CardsHdfc60342, Reddit `/u/…` usernames, @nsitharaman and @PMOIndia.
   - Several of these also render visibly, in the top-5 exemplars on `/signal/*` (`SignalDetail.tsx:181-199`).
   - The on-screen footer claims that "names, handles … are redacted" (`SignalDetail.tsx:186-189`). That is false.
   - Root causes:
     - `scripts/hdfc_pipeline/normalise.py:93` whitelists any handle containing "hdfc", "finmin" or "nsitharaman".
     - There is no name redaction at all.
     - `scripts/check_pii.py:13-25` has no name or handle rule, so it passes.
   - Fix:
     - Pass only the slice each screen needs to client components.
     - Redact names and non-institutional handles.
     - Drop defamatory items from the exemplars.
     - Extend `check_pii.py` to cover names and handles.
2. **Remove "V2 · after Vidya call" from the header.**
   - It shows on every screen (`frontend/components/hdfc-pulse-shared/VersionSwitch.tsx:11-12`, rendered at `Shell.tsx:328`).
   - It names a bank officer and exposes our internal milestone. B7 §E1.9 and §4.5 apply.
   - Fix: hide the version switch in the bank build, or use neutral labels.
3. **"Re-promise" still renders on D1.**
   - This is the client's explicit ask 8.
   - D1's public ledger shows "Re-promise" on the Card closure, Failed-transaction reversal and Credit-information rows, and in the action-triage KPI. Evidence: `ServicePromiseView.tsx:65-69, 207, 596`; rendered text in `qa/screens_review_v3/D1-deliverables-1440.png`.
   - It also leaks raw on `SignalDetail.tsx:207, 317`, and in `themes.json` 9 themes carry "Re-promise".
   - `lint_terms.py` allow-lists the string, so the lint cannot catch it.
   - Fix: route every action string through `ACTION_LABEL` (`primitives.tsx:299`), and remove "Re-promise" from the lint allow-list.
4. **Two internal datasets are on screen.** `load.ts:31` still loads the V1 seed `data/seed/internal.json` (seed 20260925, 1,842,000 interactions). It feeds four places:
   - D1's lower half: "Beyond TAT (internal) 1,850", 14,950 open, and the escalation ladder with "Voice 1,842,000" (`ServicePromiseView.tsx:78, 150-153, 205, 230, 596`).
   - Satisfaction: "18,42,000 interactions across all channels" (`SatisfactionView.tsx:105`).
   - MD-marked mail: 640.
   - The overnight "routed" and "acknowledged" times.

   The same screens state a demo sample of 32,000. This breaks B7 §2 ("every total reconciles") and D8 ("does not scale up").
5. **The mood headline and the trends partly measure collection, not customers.**
   - Mood −23 pts:
     - The last 7 days are 43% X (747 of 1,721), because a capped X run returned exactly 1,000 items between 20 and 27 Sep.
     - Excluding X, the mood change is −3.6 pts.
   - Reddit collector change:
     - Reddit switched collector on 1 Sep, going from about 2.9 to 10–12 comments per post.
     - Reddit is still treated as full-window trend basis, because `aggregate.py:100` only checks the first and last dates.
     - Effect: Cards' "+18%" becomes −20% if the new collector is dropped, and card_application's −6% becomes +160% if Reddit is excluded.
   - This is the V2 equivalent of the old 8 Sep false spike. B7 §1 method fixes and §4.4 apply.

---

## C. Findings

### 10-second takeaways, per screen (as the MD)

| Screen | What an MD takes away in 10 s | Right one? |
|---|---|---|
| E1 MD (`E1-md-1440.png`) | "Priority lists have 18 or more issues open over 24 h. 372 internal items are past TAT. Complaints closed without resolution lead." | Mostly. But the priority strip leads while none of the 3 MD actions touch the priority cohorts, and the actions sit about 4 screens down (text line 309 of 360). |
| E1 Head of CX (`E1-headcx-1440.png`) | "Dials first, 96% of Play Store reviews answered, but 88% of those are redirects." | Yes. "Responded is not resolved" is the best line in the build. |
| B1 Cards (`B1-cards-md-1440.png`) | "Cards: 307 open, 75 past TAT, rewards lead." | Partly. The outside reply dials are blank with a false message (F11), and the actions cite bank-wide counts that disagree with the table on the same page. |
| E2 (`E2-priority-1440.png`) | "61 list customers have an issue open; RMs know about 16 of 60." | Yes, but 61 vs 60 in one sentence invites a challenge, and the 12-row list is not reconciled to the 287 customers with an open issue. |
| E3 Persona 1 (`viewport/E3-1440.png`) | "Assistant's email open 35 h, no response, RM not notified." | Yes. This is the story that sells. But the bot call shows green "Closed", which undercuts it. |
| M1 Digital (`M1-digital-1440.png`) | "The new app release: 2,126 negative reviews, v11 at 2.4★ vs v9 at 4.5★ (Play)." | Mislabelled: 2,126 covers all versions. v11 alone is about 1,188. |
| M2 Cards (`M2-cards-1440.png`) | "Rewards and caps lead; 8 issues listed." | Adequate, but thinner than M1 and resting on an unstable +18%. |
| D1 (`D1-deliverables-1440.png`, 6,055 px tall) | "80.7% met, 372 open past TAT." Then a second ledger says "To verify" and "Re-promise". | No. Two ledgers contradict each other, and red is on nearly every cell. |
| A1 (`A1-action-queue-1440.png`) | "20 escalation mails triaged into 6 buckets, 3 hours saved." | Yes. |
| Satisfaction and market | 18,42,000 interactions; mixed-store ratings. | No. Both use stale data or a banned comparison. |

### Findings table

| # | Screen (B7 ID + route) | Severity | Finding | Evidence | Fix | B7 § |
|---|---|---|---|---|---|---|
| 1 | All V2 routes | **Blocker** | The full bundle, including 358 evidence texts with real names and URLs, is serialised into every page's HTML (about 735 KB per page). | `app/hdfc-pulse/v2/priority/page.tsx:15`, `mds-office/page.tsx:15` pass `b={b}` into `"use client"` components. `curl /hdfc-pulse/v2/priority` contains "Jose Garcia", "Sashi Jagdishan", "Rajiv Kumar" and "Debmalya Mukherjee". | Pass per-screen slices from server components; never ship `evidence`, `internal` or `joined` whole. | §E2 (no real names), B4 §8 |
| 2 | Signal drill `/hdfc-pulse/v2/signal/*` (from E1 and M1/M2) | **Blocker** | Real names, staff names, personal handles and a defamatory allegation render visibly. The footer claims names are redacted. | `SignalDetail.tsx:181-199, 186-189`; `data/out/app_jul_sep/evidence.json` items x:2091726609783115995, x:2091734455606300890, x:2089296882455687170, x:2089762403869438008, x:2087116156645802139; `normalise.py:93` | Name and handle redaction, exclude defamatory exemplars, and extend `check_pii.py` | §E2, B4 §8 |
| 3 | All screens, header | **Blocker** | "V2 · after Vidya call" names a bank officer and an internal milestone. | `VersionSwitch.tsx:11-12`; `viewport/E1-md-1440.png` | Hide the switch or use neutral labels | §E1.9, §4.5 |
| 4 | D1 `/deliverables`, signal pages | **Blocker** | "Re-promise" renders on 3 ledger rows and in a KPI. The lint allow-lists it. | `ServicePromiseView.tsx:65-69, 207, 596`; `SignalDetail.tsx:207, 317`; `scripts/lint_terms.py` ALLOW regex | Map through `ACTION_LABEL` and remove it from ALLOW | §1 D1, §0a.8 |
| 5 | D1, satisfaction, E1 MD-marked mail, E1 routed | **Blocker** | The V1 internal seed (1,842,000 interactions) renders beside the V3 sample (32,000). | `lib/hdfc-v3/load.ts:31`; `ServicePromiseView.tsx:78, 150-153, 205, 230`; `SatisfactionView.tsx:105`; `satisfaction-1440.png` "18,42,000 interactions" | Derive from `internal_v3` or remove these blocks | §2 |
| 6 | E1 mood, satisfaction | Major | The −23 pts mood change is a source-mix artefact (43% X in the last 7 days, from a capped run). It is −3.6 excluding X. | `data/out/app_jul_sep/mood.json`; raw X run WhOLVGQsnVo9H7jHb = 1,000 items, none on 20–22 Sep | Per-source net then average, or flag the last week as incomplete | §4.4 |
| 7 | E1 trends, M2, market, signal bars | Major | Reddit changed collector on 1 Sep, yet it is treated as full-window trend basis. This produces a false rise from 1 Sep, and the Cards +18% flips to −20% on the old collector. | `aggregate.py:100`; `meta.json` reddit `full_window: true`; 6,436 records from the new runs, all from 1 Sep | Treat Reddit as a stream starting 1 Sep and exclude it from trends | §1 method fixes |
| 8 | E1 dials | Major | The "Closed or responded" ring shows 95% (closed share) under the number 31,978, which is 99.9%. 1,459 of 1,481 open items count as "responded" because first response = contact time for voice, chat and branch. | `V3Blocks.tsx:222`; `seed_internal_v3.py:279-280`; `viewport/E1-md-1440.png` | Count responded only for async channels, and make the ring match the number | §E1.2 |
| 9 | E1 dials | Major | Outside dials mix denominators: Total 17,193 against Responded, Open and Open too long on 10,617 Play Store reviews. The table's "Total" for the same row reads 10,617. Open = Open too long = 377, so the ring shows a meaningless 100%. | `V3Blocks.tsx:186, 264, 281-290, 342-345` | State "of 10,617 Play Store reviews" on each reply dial, add a %, and drop the duplicate dial or explain it | §E1.2 |
| 10 | E1 MD `/mds-office` | Major | The MD's 3 actions drop the app fix list, which D3 and §4.2 place second. None of the 3 addresses the priority cohorts. All 3 show "Rung: RBI Ombudsman". | `selectors.ts:217-230`; rendered text "Actions to take" in `E1-md-1440.png` | Pin the fix list at #2; make one action cohort-led; derive the rung per item | §4.2, §E1.7 |
| 11 | E1 "Improving" | Major | "Where customers praise us" shows as Improving while its share fell 28% (1,793 → 1,280). It is hard-coded as improving and counts toward "2 improving". | `aggregate.py:241-243`; `selectors.ts:197-202`; `copy.ts:17` | Show praise as its own line, not "improving" | §4.3 |
| 12 | E1 market card, M1, Ask LisN | Major | "New HDFC Bank app" is applied to all-version counts: 2,126 negative, 55% positive. For v11 the figures are about 1,188 negative and 31–33% positive. | `selectors.ts:108`; `ExecPage.tsx:737, 765`; `ModuleView.tsx:199`; `ask.json` | Relabel as "all versions" or use v11 counts | §4.2 |
| 13 | E1 market card, market view | Major | Mixed-store ratings are still compared across apps: HDFC app 55% vs PayZapp 48% "4–5★ share", each blending Play and App Store. | `ExecPage.tsx:740-751`; `MarketView.tsx:127-199, 346-356` | One store with counts, or remove it | §4.1 |
| 14 | E1 | Major | "Acknowledged 23:45" and "Awaiting owner" appear on the same page for the same theme (complaint handling). The times are hard-coded in the V1 seed. | `selectors.ts:92`; `ExecPage.tsx:510-512, 638`; `data/seed/internal.json` since_830_ack | One source for acknowledgement | §2 |
| 15 | E1 copy | Major | "190 of them naming a regulator, court or ombudsman" and "RBI, ombudsman, court" are escalation-language counts. 126 of 478 are grievance, minister or null targets. | `copy.ts:30`; `ExecPage.tsx:800`; `signals.escalation_by_target` | Say "escalation language" | §E1.4 |
| 16 | B1 `/business/cards` (+ accounts, insurance) | Major | Outside reply dials are blank with "No bank replies are visible…", yet 133 Cards Play Store items carry replies. | `V3Blocks.tsx:49-54, 301-302`; `B1-cards-md-1440.png` | Compute replies from Play Store items tagged to the product | §1 B1 |
| 17 | B1 `/business/cards` | Major | Actions cite bank-wide counts (679 / 378 / 714), while the issue table on the same page shows 644 / 341 / 672. | `BusinessView.tsx:52-56` → `selectors.ts:90` | Pass product counts | §1 B1 |
| 18 | B1 Cards ledger | Major | The Cards ledger lists "Loan sanction and disbursal" and "Debit freeze review", because 378 card-theme interactions are tagged to other products and vice versa. | `seed_internal_v3.py` theme/product assignment; `B1-cards-md-1440.png` | Constrain themes to their product | §2 |
| 19 | E2 `/priority` | Major | RM-notified status contradicts itself: persona rows (hand-set) disagree with `rm_notifications.json` for 8 of 12 personas. `notified_today` is an arithmetic rule, `(i*37)%100<21`. | `personas.py` rm_notified; `seed_internal_v3.py:782`; `PriorityView.tsx` list | Derive the persona flag from notifications | §E2, §0a.5 |
| 20 | E2 `/priority` | Major | The list "Priority customers this morning" shows 12 personas against 287 cohort customers with an open issue. 3 listed personas have nothing open. Nothing on screen explains this. | `PriorityView.tsx:195-199`; `aggregates.json` cohorts | Label it "12 example customers of 287", and sort or filter to open issues | §E2 |
| 21 | E2 `/priority` | Major | "Added this week (n suggested by LisN)" appears on the Ultra-HNI and HNI tier tiles. This implies LisN suggests people into core-banking tiers, which contradicts D1. | `seed_internal_v3.py:531-536`; `PriorityView.tsx:185-190` | Show it on list tiles only | §E2 |
| 22 | E3 `/customer/XXXX4821` | Major | B7's story needs "a bot call that didn't resolve it", but it renders green "Closed". The before line says "2 teams", where B7 says 3. "6 touchpoints" counts a system decline event. | `scripts/hdfc_v3/personas.py:37-38`; `viewport/E3-1440.png` | Mark the bot step unresolved; add a third team or change the copy | §E3 |
| 23 | E3, all personas | Major | Proxy linking is asserted, not modelled. `proxy_contacts` is an integer 0 or 1, no contact record exists, and proxy interactions carry no contact reference. | `data/seed/internal_v3/customers.json`; `interactions.jsonl` `sender:"proxy"` | Add proxy contact records (masked) linked by the bank contact id | §E3, §0a.3 |
| 24 | Seed | Major | The sample is 32,000 interactions over 13 weeks (1 Jul–29 Sep), against B7 §2 and D8's "20,000 over 8 weeks". The generator docstring still says 20,000 over 8 weeks. | `seed_internal_v3.py:5, 42, 44` | Align the brief or the seed; state "5,000 customers, 32,000 interactions, 13 weeks" on screen | §2 |
| 25 | Seed | Major | 7 scripted persona records are `status:"open"` but carry a random past `closed_at`. For Persona 3's T+1 reversal, `breached:false` is wrong. | `seed_internal_v3.py:296-307, 333-343`; INT-00008, INT-00016 | Null `closed_at` when status is forced open | §2 |
| 26 | Seed and reconcile | Major | The theme-mix check is circular: themes are assigned by quota, and the check only reads back the stored flag. Against the real public mix, auto loans fails 5 of 7 themes and insurance fails 3 of 3. | `check_reconcile_v3.py:62`; `seed_internal_v3.py` HAND_MIX | Recompute in the check and disclose the hand-set mixes | §2 |
| 27 | D1 | Major | The "First response to a query or complaint" deliverable is measured on closure: 3,295 outside, against 81 on first response. | `seed_internal_v3.py` deliverable_stats | Measure on `first_response_at` | §1 D1 |
| 28 | D1 | Major | The ledger shows RBI TATs, and the block below says "To verify" on every row. The note cites "(B2 §7)", an internal document, on screen. Two tiles share `id="ledger"`. | `ServicePromiseView.tsx:116, 196, 214`; `DeliverablesLedger.tsx:82` | Delete the old block | §1 D1 |
| 29 | M1 `/module/digital` | Major | "Customers ask for" is "—" on all 7 rows: every ask is filtered out, and the raw asks are junk. | `ModuleView.tsx:80-94, 246-254` | Derive per theme or drop the column | §1 M method |
| 30 | Satisfaction | Major | Pillar level (+15) sits outside both halves (7.7, −3.9), because the level includes the mid-window Play Store stream and the halves do not. | `themes.json` pillars | Use the same basis for level and halves | §1 M method |
| 31 | Market | Major | The "top ten" tile shows 6. Counts (e.g. 2,020) sit above bars summing to 980, which exclude the Play Store export. The partial last week (1 day) reads as a collapse. | `MarketView.tsx:642-676` | Reconcile the header to its bars; drop the partial week | §4 |
| 32 | M3 `/module/payzapp` | Minor | 404 (stretch). The PayZapp row correctly routes to `/business/payzapp`. | `M3-payzapp-1440.png`; `module/[id]/page.tsx:26-28` | None for core | §1 M3 |
| 33 | E1 | Minor | "Negative mentions anywhere" counts internal channels only. No public mentions per cohort are shown. | `V3Blocks.tsx:414` | Add public mentions linked through permitted channels, or relabel | §E1.3 |
| 34 | E2 headline | Minor | "61 customers … RMs know about 16 of 60": two denominators in one sentence. | `E2-priority-1440.png` | Use one base | §E2 |
| 35 | E1 / M1 dials | Minor | The median reply time is rounded to 0.1 h and then converted to minutes: 12 min is shown against 9.8 min actual, and 6 min against 5.4. | `aggregate.py:572`; `V3Blocks.tsx:56-60` | Compute in minutes | §E1.2 |
| 36 | E3 | Minor | The callback owner chip is `Retail ? retail : cards`, which is wrong for Personas 4, 5, 6, 8 and 9. | `PriorityView.tsx:729-731` | Derive the owner from the open item | §E3 |
| 37 | E3 | Minor | "The sensitivity flag is set once and follows the customer" reads as a person flag, in tension with "never a flag on the person". | `PriorityView.tsx:661` | Call it "priority-list context" | §E2 |
| 38 | E3 | Minor | "First response in 5 hours, closure in 24" renders as fact, including for customers not on any list and with 0 open items. | `PriorityView.tsx:618, 726` | Label it "working target (to confirm)" and scope it to list customers | D11 |
| 39 | D1 | Minor | Red appears on almost every met-% cell (76–83%), so red no longer means breach. | `viewport/D1-lower-1440.png` | Red only below TAT threshold | §1 layout |
| 40 | D1 | Minor | The Action column is "Set a new date" on all 13 rows. Working days skip Sundays only, and T+5 for ATM is not modelled. | `DeliverablesLedger.tsx:152` | Row-specific actions and a holiday calendar | §1 D1 |
| 41 | A1 | Minor | "20 escalation emails this morning", but they were received 25–28 Sep. L2-06 "day 7 of 7 today" and L2-09 "TAT ends today" are wrong for 29 Sep. Drafts sit behind a toggle with no Approve control. | `scripts/hdfc_v3/personas.py` ESCALATION_EMAILS; `ActionQueue.tsx:105-108` | Fix the dates; add a visible "Approve and send (human)" control | §1 A1 |
| 42 | E1 Head of CX | Minor | "Who should hear what" labels theme-tag sums as "items" (double counts), and the RM owner is filtered out. | `ExecPage.tsx:880, 893-903, 933` | Count items; include RMs | §E1 |
| 43 | E1 | Minor | The channel sub-label omits WhatsApp (1,968 interactions). | `V3Blocks.tsx:219` | Add it | §E1.2 |
| 44 | Mobile 390 | Minor | The sticky header takes about 150 px of an 844 px screen. There is no horizontal scroll on any route. | `viewport/E1-md-dials-390.png` | Collapse the header on scroll | §1 layout |
| 45 | Satisfaction | Minor | The note "All sources cover 1 July to 28 September" is false for the Play Store HDFC app (from 25 Jul), Reddit (collector change on 1 Sep) and X (gap on 20–22 Sep). | `SatisfactionView.tsx` coverage note | Correct it | §1 M method |
| 46 | Footer | Polish | ISO dates "2026-07-01 to 2026-09-28". The internal window runs to 29 Sep 07:32. | `Shell.tsx:445` | Use "1 Jul – 28 Sep" and state the internal end | §E1.9 |
| 47 | Repo | Polish | `.pyc` files are committed. Biome fails 1 format rule and 1 lint warning. | commit ceab0c0 `scripts/hdfc_v3/__pycache__`; `app/hdfc-pulse/v2/module/[id]/page.tsx`; `ModuleView.tsx:367` | Gitignore and format | B4 §8 |

---

## D. Coverage matrix: B7 §0a client asks

| # | Ask | Status | Evidence |
|---|---|---|---|
| 1 | Numbers first: dials plus a short table, inside and outside | **Partial** | The dials and the table exist (`V3Blocks.tsx:180-360`). But the ring doesn't match its number (#8), denominators are mixed (#9), and open = open too long (#9). |
| 2 | Overall pulse, then product by product | **Met** (with trend caveats) | Pulse by product has 8 rows, and all hrefs return 200. Trends are unstable because of the Reddit collector change (#7). Digital's trend rests on 8% of its row. |
| 3 | Customer memory across products and channels; proxy senders | **Partial** | E3 for 12 personas, and memory tile figures of 2,942 / 840 / 244 reconcile. Proxy linking is not modelled (#23). The sensitivity-flag wording conflicts with the design principle (#37). |
| 4 | Priority relationships first, with issues open over 5 h and 24 h | **Met** on aggregates, **Partial** on list | Cohort counts reconcile exactly. The 12-row list is not reconciled to the 287 customers (#20). |
| 5 | RM alerts at customer level | **Partial** | The CRM task mock is correct and not WhatsApp. The notified status contradicts itself for 8 of 12 personas and comes from an arithmetic rule (#19). |
| 6 | Modular, with app-level depth for Cards | **Partial** | M2 exists with all 8 B7 issues. It is thinner than M1 on "Is it real" and its headline trend is unstable. M3 PayZapp is a stretch item and returns 404. |
| 7 | MD and Head of CX views; business-head view next | **Met** | Toggle order verified (cohorts first on MD, dials first on Head of CX; 3 vs 5 actions). B1 exists as a filter for 8 products. The B1 defects are #16 to #18. |
| 8 | "Deliverables", not "promise" | **Partial** | The rename is done in headings, but "Re-promise" renders on D1 (#4). |

---

## E. Reconciliation sheet

Legend:
- **Recomputed:** from `data/seed/internal_v3/interactions.jsonl`, `customers.json`, raw `data/raw/hdfc_jul_sep/*`, or the re-run pipeline.
- **"Consistent":** sums, shares and trend maths agree, but item-level rebuild isn't possible because `work/classified.jsonl` is gitignored. The scratch re-run still reproduces the outputs byte for byte.

| Screen | Number on screen | Source | Recomputed | Result |
|---|---|---|---|---|
| E1 | Inside total 32,000 | aggregates.dials.total | 32,000 | PASS |
| E1 | Closed or responded 31,978 | dials.closed_or_responded | 31,978 (99.9%) | PASS |
| E1 | Closed-or-responded ring 95% | closed / total (`V3Blocks.tsx:222`) | The metric shown is 99.9% | **FAIL** |
| E1 | Open 1,481 (4.6%); ring 5% | dials.open | 1,481 / 4.6% | PASS (rounding) |
| E1 | Open too long 372 (25% of open) | dials.open_too_long | 372 / 25.1% | PASS |
| E1 | 8 product rows sum to the inside dials | aggregates.products[] | sums equal on total, closed, closed or responded, open and open too long | PASS |
| E1 | Outside total 17,193; 7,510 negative | themes.total_items; ladder_public | 16,329 in rows + 864 excluded; Σ by_business | PASS |
| E1 | Responded 10,240, 96% of 10,617 | responses.all | raw Play Store: 10,617 / 10,240 | PASS |
| E1 | Median reply 12 min | responses.all.median_h 0.2 | 9.8 min | **FAIL** (rounding) |
| E1 | Outside open 377; open too long 377 | responses.all | 377 / 377; no unreplied review is under 48 h old | PASS on count, **FAIL** on presentation |
| E1 | Outside table "Total" 10,617 vs dial 17,193 | responses vs themes | same row, two totals | **FAIL** |
| E1 | Redirect 3,755 of 4,287 (88%) | responses.negative | raw: 3,755 / 4,287 = 87.6% | PASS |
| E1 / E2 | Cohort customers 45 / 124 / 151 / 640 | cohorts[] | customers.json | PASS |
| E1 / E2 | Open 25 / 57 / 62 / 214; over 5 h 25 / 55 / 61 / 209; over 24 h 18 / 46 / 48 / 171 | cohorts[] | interactions.jsonl | PASS |
| E1 / E2 | With open issue 16 / 45 / 48 / 178 | cohorts[] | same | PASS |
| E1 / E2 | Negative mentions 209 / 569 / 713 / 2,257 | Σ negative_by_channel | same (internal only, 13 weeks) | PASS on count |
| E1 / E2 | RM told 6/16, 10/44, 10/47, 38/175 | rm_notifications | 225 should know, 48 told | PASS (rule-derived) |
| E2 | Persona "RM notified" column | personas.rm_notified | differs from rm_notifications for 8 of 12 personas | **FAIL** |
| E2 | Cohort open-issue customers vs the listed customers | cohorts vs personas | 287 vs 12 | **FAIL** (unreconciled) |
| E2 | High impact 762 / 79 open / 18 open too long; reasons 445 / 165 / 115 / 56 / 4 | aggregates.high_impact | interactions.jsonl | PASS |
| E1 | Memory: 2,942 of 4,989; 840; 244; 602; pairs 813 / 508 / 335 | customer_memory | record-level | PASS |
| E1 | Product open / open too long, e.g. Cards 307/75, Accounts 801/217 | aggregates.products | record-level, all 8 | PASS |
| E1 | Deliverables met / outside, e.g. Cards 81%/1,767 | products[].deliverables | record-level, all 8 | PASS |
| E1 | Negative of count, e.g. Cards 1,312/3,626; PayZapp 2,528/5,175 | products.json rows | sum = 16,329 | Consistent |
| E1 | Trend +18 / −27 / +158 / +75 / −33 / — / +25 / −29 | rows.trend_change_pct | reproduced | PASS on arithmetic, **FAIL** on method (#7) |
| E1 | Complaints closed w/o resolution: 633, +87%, 190 | themes | 633 / +86.9% / 190 | PASS on number, **FAIL** on copy (#15) |
| E1 | Fastest riser +389% | card_variant_migration trend | 388.7% | PASS on arithmetic, **FAIL** on method (#7) |
| E1 | Fix list: 2,126 negative, 55% of 5,325 | briefing.release_pulse | all versions; v11 ≈ 1,188 | **FAIL** (label) |
| E1 | Improving: device security 48 → 28 (−41%) | themes.trend | ≥15 per half | PASS |
| E1 | Improving: praise 5,742 | themes.app_praise | share −27.9% | **FAIL** |
| E1 | Mood −23 pts | mood.delta_pts −22.6 | −22.6; −3.6 excluding X | PASS on number, **FAIL** on meaning |
| E1 | Gauges 37% / 47% | themes.pillars | 36.8% / 46.6% | PASS |
| E1 | Market gauges 55% vs 48% | app_pulse | mixed stores | **FAIL** (B7 §4.1) |
| E1 | Deliverables card: 564; 1,180; 478; repeat 30%; status 36% | signals.flags | 30.5% / 36.3% | PASS |
| E1 MD | MD-marked mail 640 (298 / 91 / 65 / 107 / 79) | seed/internal.json (V1) | sums to 640 but not from internal_v3 | **FAIL** (reconcile) |
| E1 CX | Who should hear what: Digital 3,603, Cards 3,054… | briefing.routing | theme-tag sums | Consistent, mislabelled |
| B1 Cards | 9,567 / 9,560 / 307 / 75 | products[cards] | equals the E1 row | PASS |
| B1 Cards | Actions 679 / 378 / 714 vs table 644 / 341 / 672 | themes vs products.rows.issues | same page disagrees | **FAIL** |
| M1 | Play v11 2.4★ (1,781) vs v9 4.5★ (1,772); iOS v11 2.1★ (110) vs v10 3.4★ (205) | store_series.by_major | raw | PASS |
| M1 | Store export starts: Play 25 Jul, iOS 28 Jun | store_series.export_start | raw first dates | PASS (no false spike in store charts) |
| M1 | Fix list 716 / 301 / 179 / 19 / 16 / 13 / 10 / 10 | release_pulse.fix_list | reproduced | PASS |
| M1 | Replies 4,879 of 5,000; median 6 min | responses.by_app | 4,879 / 5,000; 5.4 min | PASS / **FAIL** (median) |
| M2 | Issues: variant 401/156, upgrades 672/156, application 358/137, rewards 952/358, fees 341/163, limits 161/61, disputes 30/22, closure 76/37 | products.cards.issues | reproduced | PASS |
| M2 | Inside met % and TAT for merged issues | `ins[0]` only | uses the first theme only | **FAIL** (minor) |
| M2 | Inside last 3 weeks +12.9% (746 vs 661) | v3.products.cards | reproduced | PASS |
| D1 | 80.7% met; 13 types; 372 open past TAT; weakest card dispatch 67.1% | deliverables | reproduced | PASS (374 after the #25 fix) |
| D1 | First response: 3,295 outside | deliverables.query_response | 81 on first response | **FAIL** |
| D1 | Beyond TAT (internal) 1,850; 14,950 open; Voice 1,842,000 | seed/internal.json (V1) | V3 has 372 / 1,481 / 32,000 | **FAIL** |
| A1 | Buckets 5 / 4 / 3 / 3 / 3 / 2 = 20 | aggregates.triage | escalation_emails.json | PASS |
| A1 | 180 min saved; 3 vs 6.5 days | ActionQueue.tsx:120-121, 202-213 | 20 × (14 − 5) = 180 | PASS (illustrative, labelled) |
| Satisfaction | 17,193; by source 10,617 / 2,839 / 1,844 / 1,293 / 600 | meta.bank_by_source | reproduced | PASS |
| Satisfaction | 18,42,000 interactions; tiers; journey | seed/internal.json (V1) | conflicts with 32,000 | **FAIL** |
| Market | Top-ten header counts vs bars | t.count vs t.weekly | 2,020 vs 980 | **FAIL** |

**Tag check:** every tile with internal data carries "Internal · illustrative until discovery" (`primitives.tsx:115`). This PASSES. The exception is the M2 KPI "Inside: last 3 full weeks", which has no tag of its own.

---

## F. Check results

| Check | Command | Exit | Result |
|---|---|---|---|
| Type-check | `cd frontend && npx tsc --noEmit -p .` | **0** | PASS |
| Build | `cd frontend && npx next build` | **0** | PASS: all V2 routes are static, with 12 customer, 8 business, 2 module and N signal pages |
| Lint (Biome) on V2 scope | `npx biome check components/hdfc-v3 lib/hdfc-v3 app/hdfc-pulse components/hdfc-pulse-shared` | **1** | See the raw output below. The QA report's claim that "biome … passes" is **false**. |
| lint_terms | `python scripts/lint_terms.py` | 0 | "lint_terms: 0 hit(s)". It is **blind**: see the gaps below. |
| Reconcile | `cd scripts/hdfc_v3 && python check_reconcile_v3.py` | **1** on Windows default encoding; 0 with `PYTHONIOENCODING=utf-8` | See the raw output below. |
| PII | `python scripts/check_pii.py` | 0 | "check_pii: 0 hit(s) in 18 files". It is **blind** to names and handles (finding #2). |
| Seed determinism | Re-ran `seed_internal_v3.py` (seed 20260928) and `cmp` against the pre-run copy | 0 | **PASS**: all 7 files are byte-identical (aggregates, bot_calls, customers, escalation_emails, interactions.jsonl, personas, rm_notifications) |
| Public pipeline determinism | normalise, classify, aggregate and public_v3 re-run into scratch | — | **PASS**: 10 outputs byte-identical |
| Routes (Playwright, 1440 and 390) | 35 routes × 2 widths | — | All 200 except `/module/payzapp` (404, stretch). No horizontal scroll. No loading states. 219 internal links, all 200. |

**Biome, raw output.** On the Windows CRLF checkout there are 43 format errors, which are line-ending noise from `core.autocrlf=true`. On an LF export of HEAD, the real result is:

```
components/hdfc-v3\ModuleView.tsx:367:14 lint/complexity/useOptionalChain  FIXABLE
  ! Change to an optional chain.
  > 367 │       return th && th.count
app/hdfc-pulse\v2\module\[id]\page.tsx format
  × Formatter would have printed the following content:
     3    │ - import·{
     4    │ - ··CardsModule,
     5    │ - ··DigitalModule,
     6    │ - }·from·"@/components/hdfc-v3/ModuleView";
        3 │ + import·{·CardsModule,·DigitalModule·}·from·"@/components/hdfc-v3/ModuleView";
Checked 44 files in 86ms. No fixes applied.
Found 1 error.
Found 1 warning.
```

**Reconcile, raw failure on the Windows default code page:**

```
PASS cohort priority_a recomputed (customers, open, over 24 h)
Traceback (most recent call last):
  File "D:\office\clariverse-ui\scripts\hdfc_v3\check_reconcile_v3.py", line 57, in main
    ok(c["open_over_24h"] <= c["open_over_5h"] <= c["open"], f"cohort {c['id']} over 24 h \u2264 over 5 h \u2264 open")
UnicodeEncodeError: 'charmap' codec can't encode character '\u2264' in position 33: character maps to <undefined>
reconcile exit 1
```

With UTF-8 it reports "check_reconcile_v3: 0 failure(s)" over 35 checks. Coverage gaps:
- It trusts the stored `breached` flag, so it misses #25.
- It reads the theme-mix flag back instead of recomputing it (#26).
- It never touches `data/seed/internal.json`, so the V1 seed on screen goes unchecked (#5).
- It never compares persona `rm_notified` with `rm_notifications.json` (#19).

**lint_terms gaps:**
- The ALLOW regex whitelists "Re-promise", which renders (#4).
- It doesn't scan `themes.json`, `evidence.json`, `signals.json` or `seed/internal.json`, all of which render.
- It has no rule for "complementary to", "RBI official", or bank-officer names such as "Vidya".
- `scripts/lint_terms_local.txt`, which holds internal programme names, is **not found**. So the programme-name lint currently checks nothing.

**My own grep across V2 source and rendered text:**
- "promise": code identifiers, plus the rendered "Re-promise" (#4).
- Internal programme names: none found in V2 source or rendered text. But the local list is missing, so this is unverified against the actual names.
- "RBI official": 0 hits.
- "complementary to": 0 hits.
- Real-person names: "Vidya" in the header (#3), plus names in the evidence (#1, #2).

---

## G. MORNING_DECISIONS.md

| Entry | Verdict | Why |
|---|---|---|
| D1 · "How will LisN know who is RBI?" | **Agree**, with two fixes needed | There is no person flag in `customers.json`, high impact is complaint-level (762, with the official-domain reason on only 4), and no occupation labels appear anywhere. Two things undercut the story in front of a banker: "suggested by LisN" on the core-banking tier tiles (#21), and E3's "sensitivity flag … follows the customer" (#37). The talking line is excellent; keep it. I'd choose option (a). Option (b) invites legal review for no demo gain. |
| D2 · Public responded and open-too-long dials | **Disagree (obsolete)** | Play Store data does carry reply fields, and D13 superseded this. "Needs reply data" is no longer rendered. Retire the entry. |
| D3 · MD leads with complaints closed w/o resolution | **Agree, partly implemented** | It is first in "What needs you". But the app fix list is missing from the MD's Actions (#10), and a mixed-store comparison persists on the exec market card (#13). |
| D4 · Improving | **Disagree (stale)** | It describes V1 data. Loan processing is now +24%, not down. The PayZapp App Store share fell (35 → 31%). "31 August" is a V1 date. On screen, praise falls 28% yet shows as improving (#11). |
| D5 · "Set a new date" chip | **Disagree on completeness** | The chip mapping works, but the raw value still renders on D1 and the signal pages (#4). |
| D6 · Mood | **Disagree** | The screen says −23, not −22. The raw weekly net and pillar levels (−79, −89) still render on satisfaction. And the change is mostly a source-mix artefact (−3.6 excluding X) (#6). |
| D7 · Product rows and loan split | **Agree on logic, disagree on text** | Item-level reconciliation holds (16,329 + 864 = 17,193). The figures in the entry (4,966, 471, "insurance has no public items") are V1 figures; insurance now has 48 items. |
| D8 · Synthetic sample scale | **Disagree as written** | The seed is 32,000 interactions over 13 weeks, not 20,000 over 8 (#24). The 86,000-per-8-weeks comparison is unverified and no longer matches the window. Keep it off screen until T5 verifies it. |
| D9 · Deliverable TATs | **Agree the list matches `common.py`** | D-11 is **not found** in the repo, so nothing can be checked against it. The same page still says "To verify" (#28). T+5 ATM and holidays are not modelled (#40). |
| D10 · A1 time saved | **Agree** | 180 min = 20 × 9, and 3 vs 6.5 days, are both labelled illustrative. Add a visible Approve control. |
| D11 · Priority target on E3 | **Agree to keep, conditionally** | Label it as a working target and scope it to list customers with open items (#38). |
| D12 · V2 on the Jul–Sep dataset | **Agree** | Raw counts verified: 11,601 / 826 / 10,826 / 3,682 / 1,570. The pipeline reproduces byte-identical output. `run_all.sh` calls `python3`, which is not on PATH on every Windows setup. |
| D13 · Play Store replies | **Agree, with a correction** | 96.4%, 377 and 87.6% are verified from raw data. The median is about 10 min, not "about 12" (#35). I prefer option (b), leading with the redirect figure: that is the number a Head of CX acts on. |
| D14 · Classification | **Agree** (not re-audited for label quality) | The 90% spot check on 40 is thin for a headline. Show n and precision on screen if it's quoted. |
| D15 · Trend basis | **Partially disagree** | The Play Store exclusion is correct. But Reddit (collector change on 1 Sep) and X (capped final run, gap on 20–22 Sep) need the same treatment (#6, #7). |

---

## H. 10 questions the Head of CX will ask that the build can't yet answer

| # | Question | Build change that would answer it |
|---|---|---|
| 1 | "Who are the 18 list-A issues over 24 hours? Show me them, oldest first, with product and owner." | Make the E2 cohort tiles drill to a filtered, age-sorted list of all open cohort customers. The current list is 12 fixed personas. |
| 2 | "Is this better or worse than yesterday?" | Add day-on-day and week-on-week deltas to every dial, from a daily snapshot of open and open-too-long in the seed. |
| 3 | "How many complaints are about to become ombudsman-eligible?" | Add a D1 countdown bucket for items at 25–30 days, by product and cohort. |
| 4 | "Of 'closed without resolution', how many reopened or went to a regulator?" | Add reopen and regulator-rung counts per product from `internal_v3`, linked to the public theme. |
| 5 | "Which public posts are from my priority customers?" | Add a per-cohort public-mention count through permitted linked channels only (e.g. X DMs to the care handle). Today "negative mentions anywhere" is internal only (#33). |
| 6 | "Did the RM act after the alert?" | Add an RM alert lifecycle (created, acknowledged, customer contacted, closed) per RM, and fix the notified contradiction first (#19). |
| 7 | "Who is sitting on routed items, and what is the acknowledgement SLA per owner?" | Add an owner acknowledgement-SLA column in actions and pulse, from one acknowledgement source (#14). |
| 8 | "How right is your classifier on the headline themes?" | Add an on-screen method note with a validated sample: n, precision per headline theme, and what was hand-checked (B7 §4.6). |
| 9 | "What does 32,000 mean against our real volume?" | Add a scale note: the sample is 5,000 customers and 13 weeks, not a share of the bank. Show nothing extrapolated until the bank's FY complaints figure is verified (D8). |
| 10 | "When does the v11 fix ship, and did the rating recover after each hotfix?" | Add app release markers (from store version dates) on the M1 per-store series, with the within-store rating before and after each release. |

---

## I. What's working: do NOT change

- **The priority-relationships principle.** Cohorts come only from the bank's own lists and tiers, high impact is marked on the complaint and never on the person, and the purpose line reads "Flags prioritise service. They never restrict or downgrade it." (`PriorityView.tsx:111`). Together with the D1 talking line, this is a convincing answer to "how will you know who's an RBI official?", and no occupation labels appear anywhere.
- **"Responded is not resolved"** (96% replied, 88% of replies to negatives only redirect). It's a real, verifiable and uncomfortable insight from the bank's own public replies. Lead with it.
- **The E3 Persona 1 story.** A card decline abroad, then the assistant's email open 35 h with no response and the RM not notified. Keep the shape; just fix the bot-call status (#22).
- **Internal data integrity.** The internal_v3 aggregates reproduce exactly from record-level data, the seed is deterministic, and the public pipeline reproduces byte for byte.
- **Tag discipline.** Every internal tile carries "Internal · illustrative until discovery".
- **The pulse-by-product table and the product filter as B1.** This is how the morning review runs, and the B1 inside dials equal the E1 product rows for every product.
- **M1 per-store series.** They start at each export's first date (no 8 Sep false spike), and the version tables compare within one store with counts.
- **The on-screen 48-hour definition**, and public "responded" sourced from developer replies.
- **A1's framing:** 6 buckets, a draft reply, and "LisN recommends; people send", with illustrative time-saved figures labelled as such.
- **Responsive layout:** no horizontal scroll at 390 px on any route, and all 219 internal links resolve.
