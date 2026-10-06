# IndusInd pulse V2 · volume validation: internal layer against the public anchors

Written by `scripts/indusind_v2/volume_validation.py` from `data/out/indusind_v2/periods.json` and the seed. Anchors:
`docs/demo-rebuild/public_anchors_volumes.md`. Full window = 1 Jul to 29 Sep 08:30 (13 weeks).

Sample kept: 32,000 rows and 5,000 customers; every figure below is a weighted sum of those rows.

Verdict: **OK** = inside the anchor's range, or within 2x of a point anchor. Anything else is fixed or justified in the row.

Pending complaints are calibrated to the published stock (C2: 16,133 pending at year-end), not to 3-4% of the window's intake: C6 is that stock over a full year's intake, and against one quarter's intake the same stock is about 15%.

| Metric | Our figure | Anchor | Source | Ratio | Verdict |
|---|---|---|---|---|---|
| Total contacts, full window | 4,22,186 | 3-6 lakh (15-30 per complaint) | N31 x K1 (derived) | in range | OK |
| Complaints, full window | 20,005 | about 20,000 | N31: 80,062 in FY25, x 91/365 (derived) | in range | OK |
| Pioneer customers with a contact, full window | 13,281 | 9,000-18,000 (15-30% of the list) | P2 (assumption) | in range | OK |
| Pioneer contacts, full window | 35,080 | scales with P2: 2-3 contacts per contacting customer | P2 (assumption) | in range | OK |
| Complaints per day (window average) | 220 | about 219 | N31 (derived) | in range | OK |
| Complaints per week | 1,539 | about 1,540 | N31 (derived) | in range | OK |
| Complaints in the Morning brief (last 24 hours) | 233 | about 219 | N31 (derived) | 1.01x | OK (within 2x) |
| Contacts per complaint | 21.1x | 15-30x | K1 (assumption) | in range | OK |
| Contacts per day (window average) | 4,639 | 3,300-6,600 | N31 x K1 (derived) | in range | OK |
| Contacts in the Morning brief (last 24 hours) | 5,620 | 3,300-6,600 | N31 x K1 (derived) | in range | OK |
| Complaints pending at the window end | 3,245 | 15,811 pending at FY25 year-end | N32 (anchor) | 0.22x | Justified: N32 is a year-end stock against a year of intake (80,062); the bank's classification broadened in FY25. Our pending stock follows the reply-time rules, not N32 |
| Pending as a share of annual intake | 4.0% | about 19.7% | N32 / N31 (derived) | 0.27x | Justified: N32 is a year-end stock; our pending follows the reply-time rules (see the row above) |
| Pending as a share of the 13-week intake | 16.2% | no anchor | N32 / N31 (derived) | in range | OK |
| Channel share: Calls | 55.9% (2,35,953) | 50-60% | K4 (assumption) | in range | OK |
| Channel share: Chat and WhatsApp | 21.1% (89,036) | 15-25% | K4 (assumption) | in range | OK |
| Channel share: Email | 13.0% (54,950) | 10-15% | K4 (assumption) | in range | OK |
| Channel share: Branch | 9.0% (37,927) | 5-10% | K4 (assumption) | in range | OK |
| Channel share: Social inbox | 1.0% (4,320) | 1-3% | K4 (assumption) | in range | OK |
| Complaint share: loans (personal, home, auto) | 30.1% (6,014) | leads; 29.25% at the Ombudsman | K5 / O4 | in range | OK |
| Complaint mix: the leading product | loans then accounts | loans first (vehicle finance is the largest retail book) | our assumption (IndusInd V2) | in range | OK |
| Complaint share: Cards | 22.0% (4,407) | 22% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: Accounts and deposits | 22.6% (4,523) | 20% (our split of K5's order) | K5 (derived) | 1.08x | OK (within 2x) |
| Complaint share: UPI and BHIM IndusPay | 7.1% (1,418) | 7% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: Insurance | 8.2% (1,635) | 8% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: Digital | 10.0% (2,008) | 10% (our split of K5's order) | K5 (derived) | in range | OK |
| Contacts: Cards | 1,13,877 (27%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: UPI and BHIM IndusPay | 29,610 (7%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Accounts and deposits | 93,463 (22%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Personal loans | 37,924 (9%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Home loans | 12,020 (3%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Vehicle finance | 63,201 (15%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Insurance (bank-sold) | 21,128 (5%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Digital (INDIE app and net banking) | 50,963 (12%) | no anchor; follows the sample's product mix | none | in range | OK |
| Negative share of internal contacts | 12.9% (54,348) | about 12% | our assumption (D31) | 1.02x | OK (within 2x) |
| Negative share of complaints | 83% | mostly negative (85%) | our assumption (D31) | in range | OK |
| Negative share of queries and requests | 9.4% | mostly neutral: under 12% | our assumption (D31) | in range | OK |
| Negative share: Cards | 15.2% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: UPI and BHIM IndusPay | 11.4% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Accounts and deposits | 9.9% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Personal loans | 16.1% | 9-16% (cards and loans higher) | our assumption (D31) | 1.01x | OK (within 2x) |
| Negative share: Home loans | 11.5% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Vehicle finance | 15.2% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Insurance (bank-sold) | 11.3% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Negative share: Digital (INDIE app and net banking) | 9.8% | 9-16% (cards and loans higher) | our assumption (D31) | in range | OK |
| Complaints partly or fully rejected (sent to the Internal Ombudsman) | 10.2% (2,036) | 6-10% at peer banks | peer disclosures (D31) | 1.02x | OK (within 2x) |
| Awaiting Internal Ombudsman review, of those sent | 30% (614 of 2,036) | no anchor; the queue is part of the one register | D31 | in range | OK |
| Social inbox contacts against public mentions collected | 0.5x (4,320 vs 9,120) | no anchor | K4 / public collection | 0.95x | OK (the inbox counts every message to the bank's care handles, including direct messages; the public figure is a collected sample of posts and reviews, not a census) |
| Unhappy with the reply | 584 | 550-730 (30% of rejections, plus a few resolved) | our assumption (D31, scaled to IndusInd) | in range | OK |
| At risk of reaching the Ombudsman (brink + eligible + unhappy) | 2,011 | 2,200-2,400 | our assumption (D31, scaled to IndusInd) | 0.91x | OK (within 2x) |
| Ombudsman complaints, full window | 446 | 320-550 (1,300-2,200 a year) | O7 scaled to N31 (assumption) | in range | OK |
| Ombudsman complaints per week | 34 | 25-42 | O8 scaled (derived) | in range | OK |
| Complaints at risk per Ombudsman complaint | 4.5 to 1 | no anchor | O7 / D31 | in range | OK |
| Ombudsman complaints per lakh customers, annualised | 4.3 | 7.7 per lakh accounts, all banks | O5 (anchor; industry) | 0.58x | OK (within 2x) |
| List size: Ultra sensitive | 1,200 | low thousands at most | P3 (assumption) | in range | OK |
| Ultra sensitive: customers with a contact | 431 (36% of the list) | no anchor; our assumption | D29 | in range | OK |
| Ultra sensitive: contacts per contacting customer | 4.2 (1,800 contacts) | 2-3 | our assumption (D29) | 1.39x | OK (within 2x) |
| List size: RBI & Government | 2,200 | low thousands at most | P3 (assumption) | in range | OK |
| RBI & Government: customers with a contact | 745 (34% of the list) | no anchor; our assumption | D29 | in range | OK |
| RBI & Government: contacts per contacting customer | 3.9 (2,870 contacts) | 2-3 | our assumption (D29) | 1.28x | OK (within 2x) |
| List size: Pioneer (Ultra HNI) | 60,000 | about 60,000 | our assumption (IndusInd V2) | in range | OK |
| Ultra HNI share in contact | 22.1% | 15-30% | P2 (assumption) | in range | OK |
| Pioneer (Ultra HNI): contacts per contacting customer | 2.6 (35,080 contacts) | 2-3 | our assumption (D29) | in range | OK |
| List size: Customers with multiple relationships | 24,600 | between the small lists and Pioneer | our assumption (D29) | in range | OK |
| Customers with multiple relationships: customers with a contact | 5,716 (23% of the list) | no anchor; our assumption | D29 | in range | OK |
| Customers with multiple relationships: contacts per contacting customer | 2.8 (15,834 contacts) | 2-3 | our assumption (D29) | in range | OK |
| All customers with a contact, full window | 1,82,009 | no anchor; about 0.4% of an assumed 4.2 crore customers | A1 / D29 | in range | OK |

66 rows; 64 OK; 2 justified or to fix.
