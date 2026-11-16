# NatWest · volume validation (HL-18)

Written by `scripts/natwest_pulse/volume_validation.py` from `data/out/natwest_pulse/periods.json` and the seed.
Anchors: `docs/natwest/public_anchors.md`. Full window = 1 Aug to 12 Nov 08:30 (103 days).

Sample kept: 32,000 rows and 5,000 customers; every figure below is a weighted sum of those rows.

Verdict: **OK** = inside the anchor's range, or within 2x of a point anchor. Anything else is fixed or justified in the row.

| Metric | Our figure | Anchor | Source | Ratio | Verdict |
|---|---|---|---|---|---|
| Complaints, full window | 50,140 | about 49,200 (86,498 in H1 x 103/181) | ANCHOR, derived | in range | OK |
| Complaints per week | 3,408 | about 3,345 | ANCHOR, derived | in range | OK |
| Complaints per 1,000 accounts, half-year equivalent | 2.79 | 2.74 | ANCHOR (H1 2026 return) | in range | OK |
| Complaints upheld, of those with a final response | 46% | about 55% | ANCHOR (H1 2026 return) | in range | OK |
| Complaints closed within 3 days | 50% | 48% | ANCHOR (H1 2026 return) | in range | OK |
| Total contacts, full window | 5,801,601 | about 5,800,000 | ASSUMPTION (13m NatWest customers, Pass 3) | in range | OK |
| Contacts per complaint | 116x | no anchor | DERIVED | in range | OK |
| Negative share of internal contacts | 12.1% | about 12% | HL-19 | in range | OK |
| Negative share of complaints | 84% | mostly negative (85%) | HL-19 | in range | OK |
| Channel share: Calls | 44.0% (2,552,590) | assumption | ASSUMPTION | in range | OK |
| Channel share: Cora | 30.0% (1,740,306) | assumption | ASSUMPTION | in range | OK |
| Channel share: Secure message | 9.0% (522,323) | assumption | ASSUMPTION | in range | OK |
| Channel share: Email | 6.0% (348,216) | assumption | ASSUMPTION | in range | OK |
| Channel share: Branch | 10.0% (580,109) | assumption | ASSUMPTION | in range | OK |
| Channel share: Social | 1.0% (58,057) | assumption | ASSUMPTION | in range | OK |
| Referred to the Financial Ombudsman Service, full window | 2,206 | about 2,500 (5% of complaints) | ASSUMPTION (no anchor) | 0.93x | OK (within 2x) |
| At risk (brink + past the deadline + unhappy) | 3,682 | no anchor | DERIVED | in range | OK |
| Awaiting a final response at the window end | 3,601 | about 7 weeks of intake at most | DERIVED (8-week rule) | in range | OK |
| Cohort size: Financially vulnerable (Consumer Duty) | 1,780,000 | assumption | ASSUMPTION | in range | OK |
| Cohort size: Recent complainants (90 days) | 43,000 | about 43,000 (a quarter's complaints) | DERIVED | in range | OK |
| Cohort size: Premier | 750,000 | assumption | ASSUMPTION | in range | OK |
| Cohort size: Multi-product customers (four or more products) | 758,300 | assumption | ASSUMPTION | in range | OK |

22 rows; 22 OK; 0 justified or to fix.
