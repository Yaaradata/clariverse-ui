# IndusInd · internal volume validation

Rule: no count shown may imply an annual complaint rate more than 2× off IndusInd's FY25 disclosure (register N31).

## Status: checked against IND-D1 (N31, N32)

IND-D1 verified the BRSR FY25 figures: **80,062 complaints received, 15,811 pending at year-end** (FY24: 42,330 and
2,555). The classification was broadened in FY25, so FY24 and FY25 are not like-for-like and no trend is drawn across
them. Internal (L3) figures stay shares, indices and weeks of intake on screen; no seed count is shown.

| Metric | Our figure | Anchor | Ratio | Verdict |
|---|---|---|---|---|
| Complaints received a year | about 63,700 (Q1 weekly intake of about 1,225 × 52) | N31: 80,062 (FY25) | 0.80× | **Pass** (within 2×) |
| Complaints pending at a period end (stock) | 2.2–2.5 weeks of intake, about 2,700–3,100 complaints | N32: 15,811 at 31 Mar 2025, 10.3 weeks of FY25 intake | 0.18× (5.5× low) | **Justified, flagged** (below) |
| Same, against FY24 (old classification) | 2.2–2.5 weeks of intake | FY24: 2,555 pending on 42,330 received, 3.1 weeks | 0.7–0.8× | Within 2× |

**Why the pending stock is not raised to 10 weeks.** N32 is a single year-end stock under a classification broadened in
FY25 (IND-D1: "not comparable with FY24"; no category split is given), so it likely holds items the seed's case-level
complaints do not. Matching it would mean most pending complaints were over 30 days old, which would inflate every
Ombudsman share (eligible, at risk) on a basis IND-D1 cannot confirm. The seed matches the FY24 ratio (3.1 weeks) and the
FY25 intake (0.8×). The gap is reported to Usha as a figure that could look wrong to someone who knows the bank's BRSR,
and the Conduct and complaints screen shows N31 and N32 with the classification footnote beside the weekly register.

## Banker sanity ratios (from the seed, checked by `scripts/check_indusind.py`)

| Ratio | Target | Seed |
|---|---|---|
| Negative share of internal contacts | about 12% | 12.0% (home, last 4 weeks, all businesses) |
| Reject rate, of final replies | 6–10% | 8.1% overall; 6.3–9.3% by week (weekly register); IO referrals 6.3–10.2% of the week's replies |
| Internal Ombudsman figures | one register | weekly referrals = case-register decisions (check passes) |
| Ombudsman at-risk | a subset of pending | 38.6% of pending (last 4 weeks); each state ≤ at-risk ≤ the sum of states |
| Resolved + open + waiting on customer | = volume | sums to 100% in every window and business (check passes) |
| Pending stock | plausible | 2.2–2.5 weeks of intake; 10–12% of pending over 30 days |
| Lumpy weighted values | none | no source weighting in L3; indices move 85–111 week to week |
