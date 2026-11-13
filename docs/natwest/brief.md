# NatWest Pulse v1 build brief (revised, 13 Nov 2026)

Internal to YaaraLabs. Supersedes the earlier version of this file. The research pack it names
(`docs/natwest/research_pack.md`) was not in the repo when this brief arrived; see `build_plan.md` and NW-D01.

---

# CONTEXT
New demo: LisN for NatWest Group (United Kingdom), `natwest-pulse`. It goes in the same repo as the HDFC demo. It is a clone of the **latest HDFC Pulse build, the `oct13` version** (live at `/hdfc-pulse/oct13/mds-office` on the ominipluse-v5 deployment), made exactly the way IndusInd v2 was cloned from HDFC v2: copy the route folder, the components and the data pipeline, point them at a new data folder, swap the register and copy. Do not refactor, do not build new screens, do not clone the older `/hdfc-pulse/v2`.

**Layout rule, non-negotiable:** the NatWest screens are the `oct13` screens with NatWest words and NatWest data. Same sections in the same order, same cards, same tables, same drill routes, same Yaaralabs dark theme (background #1c1c1c, surface #2a2a2a, purple accent #bc6cd3, lime #dcfc84). Nothing is added, moved, merged or restyled. If a section has no NatWest equivalent it is re-labelled, never removed. Any deviation from the `oct13` layout is a defect, not a design choice; log it and revert.

Exposure in the product: a sibling route tree, not a role-based industry. `/hdfc-pulse/oct13/<screen>` becomes `/natwest-pulse/v1/<screen>`, screen for screen (mds-office, head-cx, business, customer, module, priority, satisfaction, service-promise, signal, action-queue, deliverables, market, my-view, and whatever else `oct13` has). The route list `natwest-pulse/v1` must reproduce is whatever `app/hdfc-pulse/oct13/` contains on the branch named below: record it in the plan before copying. Do not add `natwest_bank` to `lib/role-based-dashboard/registry.tsx` unless Usha asks.

Branch carrying `oct13`: **`main`**. Pull the latest `main` first. If `app/hdfc-pulse/oct13/` is not on `main` after the pull, stop and put it at the top of Blocked on people; do not fall back to `v2`.

The buyer persona: Managing Director, Customer Experience and Engagement, Retail Banking (a propositions and segment strategist, not a contact-centre operator). The demo must answer "where is the customer experience leaking, by segment, by journey and by brand", not "how do we handle calls faster".

Reference material in the repo:
- `app/hdfc-pulse/oct13/`, and the component and lib folders it imports — the pattern to copy.
- `components/indusind-v2/`, `lib/indusind-v2/`, `scripts/indusind_v2/`, `data/out/indusind_v2/`, `data/seed/indusind_v2/` — the worked example of a clone. Copy the `oct13` loader, do not change it.
- `docs/indusind/carry_forward_from_hdfc.md` — rules HL-01 to HL-34. They apply unless this brief says otherwise.
- `scripts/lint_terms.py`, `scripts/check_pii.py`, `scripts/qa_*` — reuse and extend; never bypass.
- `docs/natwest/research_pack.md` — the ONLY source of NatWest figures. Do not web-search, do not add figures from memory.

Log every conflict and judgement call in `MORNING_DECISIONS.md` under "NatWest Pulse v1", IDs NW-D01, NW-D02 and so on.

Branch: work directly on `main`. Pull first, then commit after each numbered step and push to `main` after each commit so the Vercel deployment follows. Do not open a PR. Do not change HDFC or IndusInd routes, data or behaviour; extend shared scripts so their checks still pass. Because every push builds a public preview, Step 1.1 runs before anything else lands.

`docs/natwest/build_plan.md` is the resume point. Keep its statuses current.

# STEP 0: PLAN BEFORE CODE
1. Commit `docs/natwest/` (this prompt plus the research pack) as the first commit on `main`.
2. Read `carry_forward_from_hdfc.md`, the `oct13` loader, `app/hdfc-pulse/oct13/layout.tsx` and every `page.tsx` under it. Record the exact `oct13` route list, component folder and lib folder in the plan.
3. Write `docs/natwest/build_plan.md`: component map; register swap table; data inventory; step table; Blocked on people; conflicts with resolutions.
4. Commit, then proceed.

# STEP 1: SAFETY RAILS FIRST
1. No indexing on `/natwest-pulse/*`: noindex meta, `X-Robots-Tag`, robots disallow. If protection exists only at the Vercel level, put "Confirm Vercel Deployment Protection is ON before the first push to main" at the top of Blocked on people and do not push until confirmed.
2. Watermark on every screen: "Demonstration · public data plus illustrative internal data · not NatWest Group MIS". Footer carries the data-freeze date and time. "NatWest Group" as header text only. No logo, no brand purple, no app screenshots.
3. Server-side slicing per page (HL-01). No post URLs or author handles in any payload (HL-03); keep `withoutLinks()`.
4. Extend `scripts/lint_terms.py` with a `natwest` scope (swap-table India terms; internal labels "V1", "V2", "NW-D", "HL-", step and screen IDs, people's names; other demo banks HDFC, IndusInd, Sterling, Starling, Openbank), a failing fixture each.
5. Extend `check_pii.py` (UK mobiles, +44, sort codes, 8-digit accounts, 12–19 digit cards, emails, NI numbers, hashed handles, post-URL payload grep), a failing fixture each.
6. Commit.

# STEP 2: ROUTE TREE
1. Copy `app/hdfc-pulse/oct13/` → `app/natwest-pulse/v1/`, every file including `layout.tsx`; re-point imports to `components/natwest-pulse/`, `lib/natwest-pulse/`. Do not touch `app/hdfc-pulse/`.
2. `app/natwest-pulse/page.tsx` lists only `v1`.
3. Title "LisN · NatWest Group"; description "Customer Pulse: what customers are saying, where it is heading and who needs to act."; footer "Every action is a recommendation routed to its owner; LisN does not execute, authorise or decide. Public figures from NatWest Group and regulator disclosures as dated in the research pack; internal figures illustrative until discovery. Data frozen <date>."
4. Every new route 200 with the copied HDFC data before any NatWest data exists. Commit.

# STEP 3: DATA FOLDER AND PIPELINE
1. Copy the `oct13` data folders → `data/out/natwest_pulse`, `data/seed/natwest_pulse`; pipeline → `scripts/natwest_pulse`; components → `components/natwest-pulse/`; lib → `lib/natwest-pulse/`; data-folder constant in `load.ts` = `natwest_pulse`, nothing else changed.
2. Scope note (meta.json and on screen): "Retail figures: NatWest, Royal Bank of Scotland and Ulster Bank, on-topic items in the window. Coutts, Mettle and other group companies are kept in the data and excluded from retail figures."
3. `brand` (natwest · rbs · ulster · group_other) on every public record in `normalise.py`; brand filter a first-class dimension, alongside product and channel.
4. Products (`common.py` / `products.py`): replace the six HDFC businesses one for one: `current_accounts` (Current accounts and app), `savings`, `mortgages`, `cards` (Credit cards), `loans` (Personal loans), `payments_fraud` (Payments and fraud). Add `cora_digital` (Cora and digital assistant) as a module and a CX-pulse channel, not as a seventh business card. Replace the four priority cohorts one for one: `vulnerable` (Financially vulnerable, Consumer Duty), `premier_private`, `multi_product`, `recent_complainants`. Mappings in config, not components.
5. Taxonomy in UK vocabulary; add Cora unresolved / had to call; branch closure; app login or biometrics; Faster Payments or Open Banking failure; fraud block or account freeze; APP reimbursement; mortgage rate switch; Consumer Duty value or fair treatment. Remove UPI, IMPS, KYC-video, PAN, Aadhaar.
6. Windows This week · Last 4 weeks · Last 13 weeks, anchored to the freeze (HL-17). Window 1 August to the freeze.
7. L2: no synthetic public data (HL-15). Sources in `data/raw/natwest/`: App Store, Google Play (NatWest, RBS, Ulster apps, UK storefront), X, Reddit (r/UKPersonalFinance, r/NatWest, r/RBS), Trustpilot (natwest.com, rbs.co.uk), MoneySavingExpert. Missing → "Public data not yet loaded", listed under Blocked. HL-12, HL-13, HL-14.
8. L3: `seed_internal_v3.py` pattern, fixed seed, "Internal · illustrative until discovery" on every tile; 20-million-customer group; per-product shape of the H1 2026 complaints return (86,498 complaints, 2.74 per 1,000 accounts, about 55% upheld, 48% closed within 3 days). HL-18 to HL-21: `docs/natwest/public_anchors.md`, `qa/natwest_volume_validation.md`, no lumpy values, status arithmetic consistent.
9. Ombudsman watch (`ombudsman_v3.py` → Financial Ombudsman Service rules). Four states mapped one for one onto the `oct13` tiles: *within 8 weeks, 10 days or fewer left* (was on the brink) · *past 8 weeks, no final response* (was already eligible) · *unhappy with the final response* (unchanged) · *referred to the Ombudsman* (was awaiting IO review). Thresholds: 8 weeks to final response; 15 business days for payment-services complaints (35 exceptional); 6 months from final response to refer. One register. At-risk is a subset of pending.
10. Reconcile: brand rows sum to group; product and channel dials reconcile to the overall dial; every window precomputed; met + outside = measured. Failing fixture each.
11. Commit.

# STEP 4: REGISTER AND COPY SWAP (copy, do not refactor)
Grep `components/natwest-pulse/`, `lib/natwest-pulse/copy.ts`, `products.ts`, `askAnswers.ts`; replace; re-bind every regulatory sentence to `data/public/natwest_register.json` (id, label, value, basis, source title, URL, date — research pack only).

| India term | United Kingdom replacement |
|---|---|
| RBI Ombudsman, Banking Ombudsman | Financial Ombudsman Service |
| Internal Ombudsman, IO review | Final response (8-week rule) |
| RBI TAT, RBI published timeline | FCA DISP timeline; PSR 5-business-day APP reimbursement |
| RBI, CEPD circular | FCA (Consumer Duty, DISP), PSR |
| ₹, crore, lakh | £, million |
| UPI, IMPS, NEFT | Faster Payments, Open Banking |
| PayZapp, INDIE, net banking | NatWest app, Royal Bank of Scotland app, online banking |
| Play Store leads | App Store leads (United Kingdom iOS share); show both stores, never combined |
| KYC video, PAN, Aadhaar | Identity check, onboarding |
| EMI | Repayment, instalment |
| Cards Business Head, RM | Product owner, relationship manager (Premier) |
| "RBI & Government" segment | Removed |

Other copy rules: HL-22 text limits, definitions behind an (i); HL-24 colour; peers Lloyds, Barclays, HSBC UK, Santander UK (CMA August 2026, FCA H1 2026), Monzo and Starling greyed as upper benchmark, never Sterling Bank or the Starling demo; Consumer Duty four outcomes on the brief tiles; Ask LisN five questions (cross-channel leak, Cora leakage, Ombudsman risk, brand gap, Consumer Duty evidence) bound to register/L2/L3 ids, no model calls, linted.

# STEP 5: SCREENS — RE-LABEL THE `oct13` LAYOUT, SECTION BY SECTION
Build in this order, commit after each. Every item is an `oct13` section kept exactly where it is, with its NatWest content. No new sections, no reordering.

**MD's office / Head of CX (`mds-office`, mirrored by `head-cx`)**
1. Top bar: "NatWest Group · Customer Pulse · <freeze weekday, date, time>". Period toggle unchanged (Morning brief · Last 7 days · Last 30 days · Full window). Light/dark switch and Ask LisN bar unchanged.
2. Customer pulse → Internal channels, the four priority-cohort cards: grid, open count, "no reply 48h+", trend sparkline and "X of Y alerted" kept. Cohorts: Financially vulnerable (Consumer Duty) · Premier and Private · Multi-product households · Recent complainants (90 days). "RMs alerted" → "Owners alerted". Counts scaled to the 20-million group.
3. Customer pulse → External channels: total mentions, positive/negative, response rate by source, high-impact and high-priority mentions unchanged. Sources: App Store · Google Play · X · Reddit · Trustpilot · Forums (MoneySavingExpert). "Listed customers who tagged the bank" → "Customers who tagged the bank".
4. CX pulse: channel table shape unchanged; rows Calls · Cora · App chat · Email · Social · Branch. Columns Volume · Resolved · Open · Waiting · Too long unchanged; "open too long" stays 48 hours. External signals block unchanged.
5. Ombudsman watch: four tiles, relabelled: Within 8 weeks, 10 days or fewer left · Past 8 weeks, no final response · Unhappy with the final response · Referred to the Ombudsman. Subtitle "Complaints eligible to go to the Financial Ombudsman Service, or close to it." "At risk, by business" with the NatWest products.
6. Today's morning brief: "What needs you" · "Signals that are building" · "What's improving or stable" unchanged; items tagged to NatWest products; first item always the Ombudsman watch line.
7. Business deep-dive cards: six cards, same fields; Current accounts and app · Savings · Mortgages · Credit cards · Personal loans · Payments and fraud. `cora_digital` in the CX pulse table and module drill, not a seventh card.
8. Footer scope note: the Step 3.2 sentence plus the LisN "recommendation, not execution" sentence.

**Drill routes, same shape as `oct13`**
9. `priority`: headline sentence, four cohort columns with open issues / over 5h / over 24h, waiting on customer, negative contacts by channel since window start. "RM notified" → "Owner notified".
10. `business/<product>`: issue pulse (internal and external side by side), Ombudsman watch by category, "Save list: call today" with ten complaint rows (ID, masked account, state, category, why, owner). Owners: Product owner · Complaints lead · Final-response team · Fraud operations · Branch region lead. "Internal Ombudsman office" never appears. `business/cards/<section>` kept for Credit cards.
11. `customer/<id>`, `signal/<id>`, `module/<id>` unchanged in shape; `module/cora_digital` holds "resolved by Cora, back as a call or complaint within 7 days", in the existing module layout.
12. `market`, `action-queue`, `deliverables`, `my-view`, `satisfaction` unchanged in shape. `market`: NatWest · Royal Bank of Scotland · Ulster Bank, peers Lloyds · Barclays · HSBC UK · Santander UK, Monzo and Starling greyed. `deliverables`: UK timelines (FCA DISP 8 weeks, PSR 5 business days, Faster Payments same-day), "confirm with the bank" where no published timeline exists. `service-promise` keeps its redirect.

Nothing is removed: priority relationships, RM alerts (as owner alerts), customer signal trail, deliverables ledger, save list and MD-marked items all stay, relabelled.

# FINISH
1. Checks in order, all passing, HDFC and IndusInd included: pipeline with source counts; check_reconcile; lint_terms (natwest); check_pii and payload grep; fixtures; Biome and tsc; next build; every `/natwest-pulse/v1/*` route 200 plus every HDFC and IndusInd route 200.
2. Restart the server; screenshots of every NatWest screen, both view states, each brand filter, light and dark, at 1440, 390 and 1536×730 at 1.25, into `qa/screens_natwest_pulse_v1/`; gap and overflow scans; sidebar closed, mouse parked, smooth scroll off, local fonts.
3. `qa/natwest_qa_checklist.md`, PASS/FAIL with evidence; not marked reviewed (HL-11).
4. Push to `main`; update `build_plan.md`. No PR.
5. Report in under 15 lines.

## Change of direction (from Usha, 13 Nov)
The NatWest screens must be the `oct13` layout exactly. Drop the eight custom "gap" screens; relabel each `oct13`
section (cohorts, CX pulse rows, Ombudsman tiles, six business cards, owners as above). Revert the teal; keep the
Yaaralabs dark theme (#1c1c1c / #2a2a2a / #bc6cd3 / #dcfc84). "No brand purple" meant NatWest's colour, not ours.
