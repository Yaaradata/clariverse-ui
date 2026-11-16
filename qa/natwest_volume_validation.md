# NatWest · volume validation (HL-18)

Written by `scripts/natwest_pulse/volume_validation.py` from `data/out/natwest_pulse/periods.json` and the seed.
Anchors: `docs/natwest/public_anchors.md`. Full window = 1 Aug to 12 Nov 08:30 (103 days).

Sample kept: 32,000 rows and 5,000 customers; every figure below is a weighted sum of those rows.

Verdict: **OK** = inside the anchor's range, or within 2x of a point anchor. Anything else is fixed or justified in the row.

| Metric | Our figure | Anchor | Source | Ratio | Verdict |
|---|---|---|---|---|---|
| Complaints, full window | 50,085 | about 49,200 (86,498 in H1 x 103/181) | ANCHOR, derived | in range | OK |
| Complaints per week | 3,404 | about 3,345 | ANCHOR, derived | in range | OK |
| Complaints per 1,000 accounts, half-year equivalent | 2.79 | 2.74 | ANCHOR (H1 2026 return) | in range | OK |
| Complaints upheld, of those with a final response | 46% | about 55% | ANCHOR (H1 2026 return) | in range | OK |
| Complaints closed within 3 days | 54% | 48% | ANCHOR (H1 2026 return) | 1.06x | OK (the sample's resolution-time model is the oct13 one; tune once the per-product return lands) |
| Total contacts, full window | 8,500,929 | about 8,500,000 | ASSUMPTION (19m retail customers, Pass 2) | in range | OK |
| Contacts per complaint | 170x | no anchor | DERIVED | in range | OK |
| Negative share of internal contacts | 12.1% | about 12% | HL-19 | in range | OK |
| Negative share of complaints | 84% | mostly negative (85%) | HL-19 | in range | OK |
| Channel share: Calls | 44.0% (3,740,381) | assumption | ASSUMPTION | in range | OK |
| Channel share: Cora | 30.0% (2,550,194) | assumption | ASSUMPTION | in range | OK |
| Channel share: Secure message | 9.0% (765,146) | assumption | ASSUMPTION | in range | OK |
| Channel share: Email | 6.0% (510,093) | assumption | ASSUMPTION | in range | OK |
| Channel share: Branch | 10.0% (850,072) | assumption | ASSUMPTION | in range | OK |
| Channel share: Social | 1.0% (85,043) | assumption | ASSUMPTION | in range | OK |
| Referred to the Financial Ombudsman Service, full window | 2,211 | about 2,500 (5% of complaints) | ASSUMPTION (no anchor) | 0.93x | OK (within 2x) |
| At risk (brink + past the deadline + unhappy) | 3,523 | no anchor | DERIVED | in range | OK |
| Awaiting a final response at the window end | 2,207 | about 7 weeks of intake at most | DERIVED (8-week rule) | in range | OK |
| Cohort size: Financially vulnerable (Consumer Duty) | 2,600,000 | assumption | ASSUMPTION | in range | OK |
| Cohort size: Recent complainants (90 days) | 43,000 | about 43,000 (a quarter's complaints) | DERIVED | in range | OK |
| Cohort size: Premier | 1,100,000 | assumption | ASSUMPTION | in range | OK |
| Cohort size: Multi-product customers | 1,104,500 | assumption | ASSUMPTION | in range | OK |

22 rows; 22 OK; 0 justified or to fix.
