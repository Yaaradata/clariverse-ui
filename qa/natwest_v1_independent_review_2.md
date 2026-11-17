# NatWest Pulse v1: second read-only review (HL-11)

16 Nov 2026. main @ 62ff7b4, production build on :3100. 85 routes from `scripts/routes_natwest.json`, rendered with Playwright
at 1536x864 and 390x844 (170 page views), plus the 42 Ask LisN suggested answers on the Head of Customer Experience view,
the credit cards product view and /market. No code or data changed.

Note on independence: at Usha's request this review was run in the building session, not a fresh one. HL-11 asks for a
fresh session; the checks below are scripted against rendered pages, not against the build notes.

## 1. Routes 200, no client error: PASS (0)
170/170 views return 200 with no page error.

## 2. HDFC / India wording, internal ids: FAIL (4)
No India or HDFC word on screen or in the Ask answers (RBI, IO, UPI, KYC, TAT, lakh, crore, ₹, grievance, nodal officer,
consumer court, stage payment, title deeds, car finance, dealer, visa application, list A, RELM, L2, variant: 0 hits).
Internal ids are still on screen:
1. Complaint ids: /business/cards save list "1. CMP-22992 · XXXX3644" (ten rows), and the Ask answer "Which credit card
   complaints should we call today?": "The first: CMP-22992, Credit limit (eligible)".
2. Masked customer ids (XXXX3644 and so on) on the save list, /priority and the customer pages. They are masked by
   design, but read as ids.
3. Register ids in the standards notes on /deliverables (and /service-promise): "(register REG-DISP-8W)",
   "(register REG-FPS-SAMEDAY)", "(register REG-PSR-APP)".
4. /customer/XXXX4821: "An assistant (contact PC-4821-1), linked through the bank's own contact records".

## 3. NatWest Group / RBS / Ulster: PASS (0)
Only the footer exclusion sentence and, under the ticked /market toggle, "Excluded brands, not loaded: Royal Bank of
Scotland · Ulster Bank · Coutts · Mettle".

## 4. Pass 2 banned words, "business", "MD's": PASS (0)

## 5. Figures a UK banker would question: FAIL (4)
Ombudsman watch is steady: week-on-week brink +2%, past 8 weeks −8%, unhappy +1%, referred −4%; referred 947 is within
past 8 weeks + unhappy (3,383). Clocks read correctly (8 weeks FCA DISP; end of the next business day, PSRs 2017; same day,
Faster Payments; 28 days industry practice; 10 business days bank standard, confirm). Redress shows no figure. Escalation
ladder: complaints 59,647 of 6.24m contacts (1.0%).
1. Cora open too long (home, CX pulse, last 7 days): 4,640 of 9,388 open (49%), above Calls (4,196). The fix target was at
   most 40% of Cora open and below Calls; it held at 23% before the last two data re-runs and has slipped back.
2. Referral pace disagrees between two screens: the Ombudsman "Referred" tile 947 is an 8-week stock (about 118 a week);
   the escalation ladder's Financial Ombudsman Service rung is 2,206 over 15 weeks (about 147 a week). Target about 150.
3. Home, Recent complainants (90 days) card: "Owners alerted 0 of 209". Zero alerts for the list most likely to complain
   again will be queried.
4. Sample counts in sentences beside bank-scale tiles, without saying "sample": /priority headline "66 customers on the
   bank's priority lists have an issue open this morning; 55 issues … Owners have been told about 6 of the 28 customers"
   (home shows 1,126 of 3,075 for one list alone); /satisfaction retention watchlist "6 / 25 / 33 customers with switching
   intent". The page header says "Sample rows · 32,000 kept for drill-down", the sentences do not.

## 6. 390x844: FAIL (2)
No page scrolls sideways at either width (0 of 85).
1. /business/cards "At risk, by category": "Rewards and redemp…" cut with an ellipsis.
2. /business/cards/happy "Repeat contact by category": the fixed-height scroll box cuts a row mid-line
   ("1,160 internal repeats of 17,723 contacts · 0" half visible) at 390px, and at 1536px on "Card delivery". Inherited
   from oct13; seen in round 1 and not counted then.

## 7. Brief coverage: PASS (0)
No "undefined", "NaN" or "null" on screen; the market and satisfaction sentences fall back to "not yet loaded"; six products
on the satisfaction chart and priority table; Ask links fixed; Reward tier owned by the current account product owner;
escalation ids off screen. Accepted: /natwest-pulse redirects to the Head of Customer Experience view (NW-D58).

| Item | Result | Findings |
|---|---|---|
| 1 Routes 200, no client error | PASS | 0 |
| 2 HDFC / India wording, internal ids | FAIL | 4 |
| 3 NatWest Group / RBS / Ulster | PASS | 0 |
| 4 Banned words | PASS | 0 |
| 5 Figures a UK banker would question | FAIL | 4 |
| 6 390px | FAIL | 2 |
| 7 Brief coverage | PASS | 0 |
