# NatWest · volume validation (HL-18)

Written by `scripts/natwest_pulse/volume_validation.py` from `data/out/natwest_pulse/periods.json` and the seed.
Anchors: `docs/natwest/public_anchors.md`. Full window = 1 Aug to 12 Nov 08:30 (103 days).

Sample kept: 32,000 rows and 5,000 customers; every figure below is a weighted sum of those rows.

Verdict: **OK** = inside the anchor's range, or within 2x of a point anchor. Anything else is fixed or justified in the row.

| Metric | Our figure | Anchor | Source | Ratio | Verdict |
|---|---|---|---|---|---|
| Complaints, full window | 46,857 | about 49,200 (86,498 in H1 x 103/181) | ANCHOR, derived | in range | OK |
| Complaints per week | 3,184 | about 3,345 | ANCHOR, derived | in range | OK |
| Complaints per 1,000 accounts, half-year equivalent | 2.61 | 2.74 | ANCHOR (H1 2026 return) | in range | OK |
| Complaints upheld, of those with a final response | 47% | about 55% | ANCHOR (H1 2026 return) | in range | OK |
| Complaints closed within 3 days | 56% | 48% | ANCHOR (H1 2026 return) | 1.12x | OK (the sample's resolution-time model is the oct13 one; tune once the per-product return lands) |
| Total contacts, full window | 9,000,095 | about 9,000,000 | ASSUMPTION (20m customers x 1.6 a year) | in range | OK |
| Contacts per complaint | 192x | no anchor | DERIVED | in range | OK |
| Negative share of internal contacts | 11.9% | about 12% | HL-19 | in range | OK |
| Negative share of complaints | 85% | mostly negative (85%) | HL-19 | in range | OK |
| Channel share: Calls | 44.0% (3,960,037) | assumption | ASSUMPTION | in range | OK |
| Channel share: Cora | 30.0% (2,700,030) | assumption | ASSUMPTION | in range | OK |
| Channel share: App chat | 9.0% (809,986) | assumption | ASSUMPTION | in range | OK |
| Channel share: Email | 6.0% (540,027) | assumption | ASSUMPTION | in range | OK |
| Channel share: Branch | 10.0% (900,003) | assumption | ASSUMPTION | in range | OK |
| Channel share: Social | 1.0% (90,012) | assumption | ASSUMPTION | in range | OK |
| Referred to the Financial Ombudsman Service, full window | 2,504 | about 2,500 (5% of complaints) | ASSUMPTION (no anchor) | in range | OK |
| At risk (brink + past the deadline + unhappy) | 1,760 | no anchor | DERIVED | in range | OK |
| Awaiting a final response at the window end | 2,722 | about 7 weeks of intake at most | DERIVED (8-week rule) | in range | OK |
| Cohort size: Financially vulnerable (Consumer Duty) | 1,200,000 | assumption | ASSUMPTION | in range | OK |
| Cohort size: Recent complainants (90 days) | 43,000 | about 43,000 (a quarter's complaints) | DERIVED | in range | OK |
| Cohort size: Premier and Private | 800,000 | assumption | ASSUMPTION | in range | OK |
| Cohort size: Multi-product households | 1,442,600 | assumption | ASSUMPTION | in range | OK |

22 rows; 22 OK; 0 justified or to fix.
