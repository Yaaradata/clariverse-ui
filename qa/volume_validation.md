# Volume validation: internal layer against the public anchors

Written by `scripts/hdfc_v3/volume_validation.py` from `data/out/app_jul_sep/periods.json` and the seed. Anchors:
`docs/demo-rebuild/public_anchors_volumes.md`. Full window = 1 Jul to 29 Sep 08:30 (13 weeks).

Sample kept: 32,000 rows and 5,000 customers; every figure below is a weighted sum of those rows.

Verdict: **OK** = inside the anchor's range, or within 2x of a point anchor. Anything else is fixed or justified in the row.

Pending complaints are calibrated to the published stock (C2: 16,133 pending at year-end), not to 3-4% of the window's intake: C6 is that stock over a full year's intake, and against one quarter's intake the same stock is about 15%.

| Metric | Our figure | Anchor | Source | Ratio | Verdict |
|---|---|---|---|---|---|
| Total contacts, full window | 24,00,418 | 16-33 lakh | K3 (derived) | in range | OK |
| Complaints, full window | 1,10,192 | about 1.1 lakh | C5 (derived from C1) | in range | OK |
| Ultra HNI customers with a contact, full window | 44,423 | 30,000-60,000 (15-30% of the list) | P2 (assumption) | in range | OK |
| Ultra HNI contacts, full window | 1,12,829 | scales with P2: 2-3 contacts per contacting customer | P2 (assumption) | in range | OK |
| Complaints per day (window average) | 1,211 | about 1,210 | C3 (derived) | in range | OK |
| Complaints per week | 8,476 | about 8,500 | C4 (derived) | in range | OK |
| Complaints in the Morning brief (last 24 hours) | 1,557 | about 1,210 | C3 (derived) | 1.23x | OK (within 2x) |
| Contacts per complaint | 21.8x | 15-30x | K1 (assumption) | in range | OK |
| Contacts per day (window average) | 26,378 | 18,000-36,000 | K2 (derived) | in range | OK |
| Contacts in the Morning brief (last 24 hours) | 29,488 | 18,000-36,000 | K2 (derived) | in range | OK |
| Complaints pending at the window end | 20,254 | 16,133 pending at FY25 year-end | C2 (anchor) | 1.20x | OK (within 2x) |
| Pending as a share of annual intake | 4.6% | about 3.6% | C6 (derived) | 1.15x | OK (within 2x) |
| Pending as a share of the 13-week intake | 18.4% | 3-4% (the brief's reading of C6) | C6 (derived) | 4.60x | Justified: C6 is pending over a year's intake (16,133 of 4.42 lakh). The same stock against one quarter's intake is about 15%; holding it at 3-4% of the window would mean about 4,000 pending, a quarter of the published stock (C2). Calibrated to C2 instead |
| Channel share: Calls | 56.0% (13,44,120) | 50-60% | K4 (assumption) | in range | OK |
| Channel share: Chat and WhatsApp | 20.0% (4,80,241) | 15-25% | K4 (assumption) | in range | OK |
| Channel share: Email | 13.0% (3,12,045) | 10-15% | K4 (assumption) | in range | OK |
| Channel share: Branch | 9.0% (2,16,014) | 5-10% | K4 (assumption) | in range | OK |
| Channel share: Social inbox | 2.0% (47,998) | 1-3% | K4 (assumption) | in range | OK |
| Complaint share: loans (personal, home, auto) | 30.9% (34,098) | leads; 29.25% at the Ombudsman | K5 / O4 | 1.01x | OK (within 2x) |
| Complaint mix: the two leading products | loans then cards | loans, then cards | K5 / O4 | in range | OK |
| Complaint share: Cards | 26.0% (28,604) | 26% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: Accounts and deposits | 20.1% (22,165) | 20% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: PayZapp and UPI | 11.0% (12,112) | 11% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: Insurance | 6.0% (6,615) | 6% (our split of K5's order) | K5 (derived) | in range | OK |
| Complaint share: Digital | 6.0% (6,598) | 6% (our split of K5's order) | K5 (derived) | in range | OK |
| Contacts: Cards | 7,62,153 (32%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: PayZapp and UPI | 2,20,292 (9%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Accounts and deposits | 6,48,679 (27%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Personal loans | 1,53,143 (6%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Home loans | 1,17,594 (5%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Auto and two-wheeler loans | 67,808 (3%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Insurance (bank-sold) | 62,221 (3%) | no anchor; follows the sample's product mix | none | in range | OK |
| Contacts: Digital (app and NetBanking) | 3,68,528 (15%) | no anchor; follows the sample's product mix | none | in range | OK |
| Ombudsman complaints, full window | 2,400 | 1,750-3,000 (7,000-12,000 a year) | O7 (assumption) | in range | OK |
| Ombudsman complaints per week | 185 | 135-230 | O8 (derived) | in range | OK |
| Ombudsman complaints per lakh customers, annualised | 8.0 | 7.7 per lakh accounts, all banks | O5 (anchor; industry) | in range | OK |
| List size: Ultra sensitive | 1,800 | low thousands at most | P3 (assumption) | in range | OK |
| Ultra sensitive: customers with a contact | 638 (35% of the list) | no anchor; our assumption | D29 | in range | OK |
| Ultra sensitive: contacts per contacting customer | 3.1 (1,983 contacts) | 2-3 | our assumption (D29) | 1.04x | OK (within 2x) |
| List size: RBI & Government | 3,200 | low thousands at most | P3 (assumption) | in range | OK |
| RBI & Government: customers with a contact | 1,078 (34% of the list) | no anchor; our assumption | D29 | in range | OK |
| RBI & Government: contacts per contacting customer | 2.8 (3,067 contacts) | 2-3 | our assumption (D29) | in range | OK |
| List size: Ultra HNI | 2,00,000 | about 2 lakh | P1 / A4 (sponsor anchor) | in range | OK |
| Ultra HNI share in contact | 22.2% | 15-30% | P2 (assumption) | in range | OK |
| Ultra HNI: contacts per contacting customer | 2.5 (1,12,829 contacts) | 2-3 | our assumption (D29) | in range | OK |
| List size: Customers with multiple relationships | 85,000 | between the small lists and Ultra HNI | our assumption (D29) | in range | OK |
| Customers with multiple relationships: customers with a contact | 19,358 (23% of the list) | no anchor; our assumption | D29 | in range | OK |
| Customers with multiple relationships: contacts per contacting customer | 2.6 (51,230 contacts) | 2-3 | our assumption (D29) | in range | OK |
| All customers with a contact, full window | 10,50,052 | no anchor; about 0.9% of 12 crore customers | A1 / D29 | in range | OK |

49 rows; 48 OK; 1 justified or to fix.
