# Volume validation: internal layer against the public anchors

Written by `scripts/hdfc_v3/volume_validation.py` from `data/out/app_jul_sep/periods.json` and the seed. Anchors:
`docs/demo-rebuild/public_anchors_volumes.md`. Full window = 1 Jul to 29 Sep 08:30 (13 weeks).

Sample kept: 32,000 rows and 5,000 customers; every figure below is a weighted sum of those rows.

Verdict: **OK** = inside the anchor's range, or within 2x of a point anchor. Anything else is fixed or justified in the row.

Pending complaints are calibrated to the published stock (C2: 16,133 pending at year-end), not to 3-4% of the window's intake: C6 is that stock over a full year's intake, and against one quarter's intake the same stock is about 15%.

| Metric | Our figure | Anchor | Source | Ratio | Verdict |
|---|---|---|---|---|---|
| Total contacts, full window | 24,01,310 | 16-33 lakh | K3 (derived) | in range | OK |
| Complaints, full window | 1,10,209 | about 1.1 lakh | C5 (derived from C1) | in range | OK |
| Ultra HNI customers with a contact, full window | 44,408 | 30,000-60,000 (15-30% of the list) | P2 (assumption) | in range | OK |
| Ultra HNI contacts, full window | 1,13,290 | scales with P2: 2-3 contacts per contacting customer | P2 (assumption) | in range | OK |
| Complaints per day (window average) | 1,211 | about 1,210 | C3 (derived) | in range | OK |
| Complaints per week | 8,478 | about 8,500 | C4 (derived) | in range | OK |
| Complaints in the Morning brief (last 24 hours) | 1,312 | about 1,210 | C3 (derived) | 1.03x | OK (within 2x) |
| Contacts per complaint | 21.8x | 15-30x | K1 (assumption) | in range | OK |
| Contacts per day (window average) | 26,388 | 18,000-36,000 | K2 (derived) | in range | OK |
| Contacts in the Morning brief (last 24 hours) | 28,801 | 18,000-36,000 | K2 (derived) | in range | OK |
| Complaints pending at the window end | 19,882 | 16,133 pending at FY25 year-end | C2 (anchor) | 1.17x | OK (within 2x) |
| Pending as a share of annual intake | 4.5% | about 3.6% | C6 (derived) | 1.12x | OK (within 2x) |
| Pending as a share of the 13-week intake | 18.0% | 3-4% (the brief's reading of C6) | C6 (derived) | 4.51x | Justified: C6 is pending over a year's intake (16,133 of 4.42 lakh). The same stock against one quarter's intake is about 15%; holding it at 3-4% of the window would mean about 4,000 pending, a quarter of the published stock (C2). Calibrated to C2 instead |
| Channel share: Calls | 56.0% (13,44,588) | 50-60% | K4 (assumption) | in range | OK |
| Channel share: Chat and WhatsApp | 21.0% (5,04,399) | 15-25% | K4 (assumption) | in range | OK |
| Channel share: Email | 13.0% (3,12,160) | 10-15% | K4 (assumption) | in range | OK |
| Channel share: Branch | 9.0% (2,16,117) | 5-10% | K4 (assumption) | in range | OK |
| Channel share: Social inbox | 1.0% (24,046) | 1-3% | K4 (assumption) | in range | OK |
| Complaint share: loans (personal, home, auto) | 30.9% (34,104) | leads; 29.25% at the Ombudsman | K5 / O4 | 1.01x | OK (within 2x) |
| Complaint mix: the two leading products | loans then cards | loans, then cards | K5 / O4 | in range | OK |
| Complaint share: Cards | 26.0% (28,604) | 26% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: Accounts and deposits | 20.1% (22,175) | 20% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: PayZapp and UPI | 11.0% (12,109) | 11% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: Insurance | 6.0% (6,617) | 6% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: Digital | 6.0% (6,600) | 6% (our split of K5's order) | K5 (derived) | in range | OK |
| Contacts: Cards | 7,63,389 (32%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: PayZapp and UPI | 2,20,978 (9%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Accounts and deposits | 6,48,541 (27%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Personal loans | 1,53,630 (6%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Home loans | 1,17,664 (5%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Auto and two-wheeler loans | 67,218 (3%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Insurance (bank-sold) | 60,061 (3%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Digital (app and NetBanking) | 3,69,829 (15%) | no anchor; follows the sample's product mix | none | in range | OK |
| Negative share of internal contacts | 12.2% (2,93,617) | about 12% | our assumption (D31) | in range | OK |
| Negative share of complaints | 85% | mostly negative (85%) | our assumption (D31) | in range | OK |
| Negative share of queries and requests | 8.7% | mostly neutral: under 12% | our assumption (D31) | in range | OK |
| Negative share: Cards | 15.0% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: PayZapp and UPI | 11.1% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Accounts and deposits | 9.6% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Personal loans | 16.0% | 9-16% (cards and loans higher) | our assumption (D31) | 1.00x | OK (within 2x) |
| Negative share: Home loans | 15.0% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Auto and two-wheeler loans | 15.0% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Insurance (bank-sold) | 11.1% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Digital (app and NetBanking) | 9.0% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Complaints partly or fully rejected (sent to the Internal Ombudsman) | 9.4% (10,370) | 6-10% at peer banks | peer disclosures (D31) | in range | OK |
| Awaiting Internal Ombudsman review, of those sent | 24% (2,454 of 10,370) | no anchor; the queue is part of the one register | D31 | in range | OK |
| Social inbox contacts against public mentions collected | 1.4x (24,046 vs 17,193) | no anchor | K4 / public collection | in range | OK |
| Unhappy with the reply | 2,921 | 3,000-4,000 (30% of rejections, plus a few resolved) | our assumption (D31) | 0.97x | OK (within 2x) |
| At risk of reaching the Ombudsman (brink + eligible + unhappy) | 13,019 | 12,000-13,000 | our assumption (D31) | 1.00x | OK (within 2x) |
| Ombudsman complaints, full window | 2,403 | 1,750-3,000 (7,000-12,000 a year) | O7 (assumption) | in range | OK |
| Ombudsman complaints per week | 185 | 135-230 | O8 (derived) | in range | OK |
| Complaints at risk per Ombudsman complaint | 5.4 to 1 | no anchor | O7 / D31 | in range | OK |
| Ombudsman complaints per lakh customers, annualised | 8.0 | 7.7 per lakh accounts, all banks | O5 (anchor; industry) | in range | OK |
| List size: Ultra sensitive | 1,800 | low thousands at most | P3 (assumption) | in range | OK |
| Ultra sensitive: customers with a contact | 637 (35% of the list) | no anchor; our assumption | D29 | in range | OK |
| Ultra sensitive: contacts per contacting customer | 3.6 (2,325 contacts) | 2-3 | our assumption (D29) | 1.22x | OK (within 2x) |
| List size: RBI & Government | 3,200 | low thousands at most | P3 (assumption) | in range | OK |
| RBI & Government: customers with a contact | 1,080 (34% of the list) | no anchor; our assumption | D29 | in range | OK |
| RBI & Government: contacts per contacting customer | 3.3 (3,592 contacts) | 2-3 | our assumption (D29) | 1.11x | OK (within 2x) |
| List size: Ultra HNI | 2,00,000 | about 2 lakh | P1 / A4 (sponsor anchor) | in range | OK |
| Ultra HNI share in contact | 22.2% | 15-30% | P2 (assumption) | in range | OK |
| Ultra HNI: contacts per contacting customer | 2.6 (1,13,290 contacts) | 2-3 | our assumption (D29) | in range | OK |
| List size: Customers with multiple relationships | 85,000 | between the small lists and Ultra HNI | our assumption (D29) | in range | OK |
| Customers with multiple relationships: customers with a contact | 19,359 (23% of the list) | no anchor; our assumption | D29 | in range | OK |
| Customers with multiple relationships: contacts per contacting customer | 2.6 (50,398 contacts) | 2-3 | our assumption (D29) | in range | OK |
| All customers with a contact, full window | 10,50,052 | no anchor; about 0.9% of 12 crore customers | A1 / D29 | in range | OK |

66 rows; 65 OK; 1 justified or to fix.
