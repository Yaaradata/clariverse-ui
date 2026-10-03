# IndusInd · internal volume validation

Rule: no count shown may imply an annual complaint rate more than 2× off IndusInd's FY25 disclosure (register N31).

## Status: BLOCKED on IND-D1

- N31 (complaints received, FY25) and N32 (pending at year-end) are `null` in `data/public/indusind_register.json`.
  IND-D1 is not in the repo, so the disclosed scale is unknown.
- The check cannot pass or fail. Instead, **no internal count reaches any screen.** Every internal (L3) figure on the
  IndusInd routes is a share, an index (Q1 weekly average = 100) or weeks of intake. The seed's absolute counts stay in
  `data/seed/indusind_v1/` and are never put in a page payload (`scripts/build_indusind.py`).
- Logged as IV-05 and CF-05 (`docs/demo-rebuild/MORNING_DECISIONS.md`, `docs/indusind/build_plan.md`).

## Seed scale (for when N31 lands)

| Item | Seed value |
|---|---|
| Weekly complaint intake | 1,180 a week (about 61,000 a year) |
| Weeks generated | 27, ending at the data freeze (2 Oct 2026, 18:00 IST, provisional) |
| Complaints in the seed | 32,843 |

When IND-D1 gives N31: compare 52 × the Q1 weekly intake with N31. Within 0.5× to 2× passes. Outside that range,
rescale `WEEKLY` in `scripts/seed_indusind.py`, rebuild, and only then allow counts on screen.

## Banker sanity ratios (from the seed, checked by `scripts/check_indusind.py`)

| Ratio | Target | Seed |
|---|---|---|
| Negative share of internal contacts | about 12% | 12.0% (home, last 4 weeks, all businesses) |
| Reject rate, of final replies | 6–10% | 8.1% overall; 6.3–9.3% by week (weekly register) |
| Internal Ombudsman figures | one register | weekly referrals = case-register decisions (check passes) |
| Ombudsman at-risk | a subset of pending | 39.2% of pending (last 4 weeks); each state ≤ at-risk ≤ the sum of states |
| Resolved + open + waiting on customer | = volume | sums to 100% in every window and business (check passes) |
| Pending stock | plausible | 2.2–2.5 weeks of intake; 10–12% of pending over 30 days |
| Lumpy weighted values | none | no source weighting in L3; indices move 85–111 week to week |
