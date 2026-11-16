# NatWest Pulse v1: independent read-only review (HL-11)

16 Nov 2026. main @ 15e8bc6, production build on :3100. 86 routes from `scripts/routes_natwest.json`, rendered with Playwright at
1536x864 and 390x844, one browser, in sequence. Ask LisN: 14 suggested questions asked on mds-office. /market group-company toggle
clicked. No repo files written. Crawl script and output: scratchpad `crawl.cjs`, `out/` (text per route, results.json, 390 screenshots).

## 1. Routes 200, no client error: PASS (0)
86/86 return 200 at both widths; 0 pageerror, 0 console errors. Redirects: `/natwest-pulse` and `/natwest-pulse/v1` go to
`/v1/mds-office`; `/service-promise` goes to `/deliverables`.

## 2. HDFC / India wording: FAIL (9)
The listed terms (RBI, IO, UPI, NEFT, IMPS, KYC, PAN, Aadhaar, EMI, TAT, lakh, crore, ₹, PayZapp, RM, HDFC, IndusInd, IST, Indian
places) appear 0 times in visible text and 0 times in the page payloads. These HDFC-carried items are still on screen:
1. module/cards, "Needs you today": `Rung` / `Grievance`.
2. business/cards, Issue pulse tile: `ESCALATED 1,756 to a grievance desk or beyond`; footnote "Escalations: internal contacts escalated to a grievance desk or beyond".
3. priority headline: "57 issues on `list A` have been open for more than 24 hours" (HDFC priority_a).
4. priority table owner column and customer/XXXX4821: `RELM-017`, `RELM-008`, … ; "CRM task for RELM-017"; "To: RELM-017". (RELM = HDFC relationship-manager id.)
5. Card variant story, which Pass 2 §8 drops: module/cards "Credit cards: 0 negative public items out of 0. `Variant migration and forced upgrade leads.`"; row `Variant migration and forced upgrade`; row `Upgrades and downgrades`; action "Set a new date on variant migration and upgrade requests; notify customers proactively before a variant change"; priority "Asked why the card was moved to a `new variant` without consent".
6. action-queue scenarios that come from India: "My developer is asking for the next `stage payment`… Release date for my mortgage stage payment" / "Stage release scheduled 13 Nov after the surveyor's report"; "I need the interest certificate for my fixed-term savings for a `visa application`"; "My `car finance` was approved but the `dealer` has not received the payment"; "An insurance premium has been debited from my savings account… Policy sold through the branch" (bancassurance); "`title deeds` have not been returned… Deeds at the central deeds store". Priority: "Visited the branch about the car finance repayment date"; "an insurance policy was added to the account"; "Email from the customer's office: title deeds and the mortgage discharge confirmation not returned".
7. priority: "Reward points on travel `spends`" (Indian English).
8. deliverables footnote: "Working days `skip Sundays`" (India's six-day week; UK business days skip Saturdays and Sundays, and NW-D22 says weekends).
9. URL slugs in the address bar on signal pages: `/signal/upi_failures`, `/signal/kyc_updates`, `/signal/nri_forex`, `/signal/login_mpin`, `/signal/rm_service`, `/signal/card_variant_migration` (titles are UK; NW-D21 renamed product ids for exactly this reason but not theme ids).

## 3. NatWest Group / RBS / Ulster: PASS (0)
Only the footer sentence "…Royal Bank of Scotland, Ulster Bank and group companies are excluded." and, once the /market toggle is ticked,
"Excluded brands, not loaded: Royal Bank of Scotland · Ulster Bank · Coutts · Mettle". `<title>` is "LisN · NatWest"; header "NatWest · Customer Pulse".

## 4. Pass 2 §15 banned words: FAIL (3)
1. module/cards: "…the same issue list the cards `business` reviews…".
2. Ask LisN answers on mds-office: the table column header reads `Business` in "Which product has the most Ombudsman risk?", "Which product needs my attention first?", "Which product has the largest backlog?".
3. business/cards subtitle: "The same figures as the credit card card on the `MD's view`." (also "credit card card").

## 5. Figures a UK retail banker would question: FAIL (20)
Ombudsman watch
1. "As of 12 Nov, `08:30`" (home, business/cards, Ask): later than the data freeze, 12 Nov 07:45 GMT.
2. Week-on-week swings: "Within 8 weeks, 10 days or fewer left 15 ▼ −1,306 since 5 Nov" (99% fall in a week); "Past 8 weeks, no final response 296 ▲ +268" (tenfold in a week).
3. "Referred to the Ombudsman 2,216 ▲ +518 since 5 Nov": a pace of about 27,000 a year against the brief's anchor of 5,935 FOS cases in 9 months (about 150 a week). Referred > past 8 weeks everywhere (known NW-D34); on business/cards it is 377 referred with 0 past 8 weeks.
4. Credit cards has the largest backlog ("22,448 open, 10,641 of them for more than 48 hours") but the smallest Ombudsman risk bar but one (64), while Savings shows 434 and Mortgages 172 (home, Ask).
5. Full-window view: "changes since `21 Sep, 16:15`" (window starts 1 Aug; odd time of day).
6. FOS award limit "up to £445,000 (2025/26)" (deliverables, Redress): at a November 2026 freeze the limit in force is the 2026/27 one (re-indexed every 1 April); needs the research pack figure.
Regulatory clocks carried from RBI rules
7. Unauthorised transactions: "Temporary credit pending; day 8 of the bank's 10-working-day service standard" (action-queue) and "card blocked, temporary credit pending" (priority). UK PSRs 2017 require the refund by the end of the next business day; there is no "temporary credit" concept. Ledger row "Unauthorised transaction refund · Bank standard: confirm with the bank" should be the regulatory D+1.
8. Card closure "7-working-day" rule: module/cards "hold closure to the 7-working-day rule"; action-queue "the bank's 7-working-day service standard passed 11 Nov" (RBI card-closure rule).
9. "Deeds… day 28 of a 30-calendar-day service standard" and ledger row "Title deeds after mortgage redemption" (RBI 30-day document-return rule; in England and Wales the lender files the discharge with HM Land Registry). Also shown under Loans at 95%.
10. "Correction not sent to the credit reference agencies; day 34 of a 30-day service standard" (RBI CIC 30 days; UK CRA disputes run on 28 days).
Deliverables / service standards
11. STANDARD column shows raw codes `fca` and `psr` ("Failed payment returned · fca", "Final response to a complaint · fca", "Push payment scam reimbursement · psr") instead of "8 weeks (FCA DISP)", "5 business days (PSR)", "Same day". "Failed payment returned" is labelled FCA; same-day return is a Faster Payments scheme rule.
12. "Final response to a complaint 99% met, 22 outside" next to the home page's "296 past 8 weeks, no final response" (sample vs bank scale, unlabelled).
13. Escalation ladder: Complaint rung 1,692 of 32,000 contacts = 5.3% of contacts are complaints; the bank-scale ratio is about 0.85% (49,200 complaints / 5.8m contacts).
Cohorts and sizing
14. Owners alerted do not add up: Ask "Owners alerted for 1,453 of 8,107 customers due an alert" vs the four tiles 1,338 of 6,800 + 0 of 266 + 1,211 of 6,674 + 239 of 3,856 = 2,788 of 17,596.
15. "Multi-product customers 758,300 customers" = 5.8% of 13m; priority defines it as "four or more products". The label suggests far more customers.
16. Cora: "21,445 open, 10,737 open too long (over 48 hours)" in 7 days; Cora has more open-too-long than Calls (8,806). A chatbot session left open for two days will be queried.
17. Satisfaction tier table: Premier Select 11,022 + Premier Reward 10,848 = 68% of the 32,000 sample, against Select 6,663 and Reward 3,467 (NW-D36 says 55/27/10/8%; Premier is 750,000 of 13m). Positive/negative is 12–13% / 31–32% for every tier, yet the headline names Reward as highest negative.
18. Journey answer: "17,489 switching-intent contacts in the last 7 days" (4.2% of all contacts, about 900,000 a year).
19. business/cards/happy: stage table "Service requests 855 contacts, 84% negative" (others 10–32%); "Contacts by customer list" sums to 98,865 against 81,043 credit card contacts (overlap not explained).
20. module/cards and module/cora_digital: "1 Aug to this morning (`13 weeks`)": 1 Aug to 12 Nov is about 15 weeks.

## 6. 390x844: FAIL (3)
0 of 86 routes scroll sideways (document scrollWidth = 390 everywhere).
1. Home "AT RISK, BY PRODUCT": label cut to `Current accounts and…` (mds-office, head-cx, /natwest-pulse, /v1, ?period=brief/30d/all).
2. business/cards issue-pulse tile: `0 / 0` (HIGH IMPACT + / −) overlaps the text `No high-impact posts`.
3. business/cards "AT RISK, BY CATEGORY": `Applications and verification` and `Disputes, refunds and reversals` ellipsised.
Notes, not counted: wide tables (CX pulse channel table, ledger, priority) scroll inside their card, so WAITING / TOO LONG start off-screen; business/cards/happy "Repeat contact by category" is a 222px scroll box that cuts the "Card delivery" row mid-line at both widths (inherited).

## 7. Brief coverage and ruled-out content: FAIL (9)
1. satisfaction: "Customers are most positive on `undefined` and least positive on `undefined`; Reward relationships show the highest negative share (illustrative)."
2. market: "Across 0 public posts and reviews since 1 Aug, `undefined` leads; `undefined` is rising fastest; praise is thin."
3. satisfaction "Repeat contact by theme and product" axis: `Credit cards Loans Payments Retail banking SME and merchant Wealth` (HDFC lines, not the six products; Pass 2 §4–5).
4. priority table product column shows `Insurance`, `Retail`, `Loans` (not the six products).
5. Ask LisN link "`Open priority relationships`" (Pass 2 §9 renamed the page "Priority customers"). "Which product has the most Ombudsman risk?" answers Current accounts but links "Open the Credit cards product view".
6. satisfaction retention watchlist: Reward tier (a packaged, non-Premier account) owned by "Premier banking managers".
7. Brief Step 5.12 asks deliverables to show UK timelines (FCA DISP 8 weeks, PSR 5 business days, Faster Payments same day): the column shows codes (see 5.11).
8. action-queue ids `L2-01` … `L2-20` on screen; brief Step 1.4 bans internal labels and IDs, and "L2" is the brief's own name for the public layer.
9. Brief Step 2.2: `app/natwest-pulse/page.tsx` "lists only v1"; it redirects to mds-office instead.
Seen and fine: five persona questions lead Ask LisN, with "Which journey is leaking most customers this week?" and no brand-gap question; Cora module populated (309,137 = 114,633 + 77,908 + 53,903 + 62,693; open and too-long add up); CX pulse channel rows add up to volume, resolved, open, waiting and too long; six product cards add to 411,768; at-risk by product adds to tiles 1–3 (2,183); six products in Current accounts → Personal loans order; Ombudsman tile labels; "Financial Ombudsman watch"; "Secure message"; Consumer Duty outcomes; Select · Reward · Premier Select · Premier Reward; watermark "not NatWest MIS"; GMT in header and footer; 12 Nov 2026 is a Thursday.

| Item | Result | Findings |
|---|---|---|
| 1 Routes 200, no client error | PASS | 0 |
| 2 HDFC / India wording | FAIL | 9 |
| 3 NatWest Group / RBS / Ulster | PASS | 0 |
| 4 Pass 2 banned words | FAIL | 3 |
| 5 Figures a UK banker would question | FAIL | 20 |
| 6 390px overflow / overlap | FAIL | 3 |
| 7 Brief coverage | FAIL | 9 |
