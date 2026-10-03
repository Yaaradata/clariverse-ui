# IndusInd · anchors, derived figures and assumptions (HL-18)

Every internal (L3) scale the demo relies on, with its anchor, our figure, the ratio and a verdict. Anything more than
2× off an anchor is fixed or justified. While IND-D1 is missing, every public anchor is pending, so no internal count is
shown on screen (shares and indices only; `qa/indusind_volume_validation.md`).

| Metric | Kind | Our figure | Anchor | Ratio | Verdict |
|---|---|---|---|---|---|
| Complaints received a year | ASSUMPTION | about 61,000 (1,180 a week × 52) | N31, FY25 complaints received | pending | Blocked on IND-D1; counts withheld |
| Complaints pending at year-end | DERIVED (stock) | 2.2–2.5 weeks of intake pending at any week end | N32, FY25 pending at year-end (a stock, not a share of intake) | pending | Blocked on IND-D1 |
| Reject rate, of final replies | ASSUMPTION | 8.1% | Peer disclosures 6–10% (HL-19) | in band | Pass |
| Negative share of internal contacts | ASSUMPTION | 12.0% overall; 9.5–15% by product | About 12% overall, 9–16% by product (HL-19) | in band | Pass |
| Social inbox share of internal contacts | ASSUMPTION | 1.0% | About 1% (HL-19) | in band | Pass |
| Ombudsman at risk | DERIVED | about 39% of pending (last 4 weeks) | A believable multiple of actual RBI Ombudsman filings | pending | Filings are not in the register; blocked on a source |
| Contacts per complaint | ASSUMPTION | per `scripts/seed_indusind.py` | None public | — | Shares only on screen |
| Public items (L2) | ANCHOR (real) | counts as collected | The scrape itself (`qa/indusind_l2_profile.md`) | 1.0 | Real counts; never synthetic (HL-15) |
| INDIE listing rating | ANCHOR (real) | 4.5 from 8,17,954 ratings, as of 1 Oct 2026 | IND-B3 LIVE-01 ("4.5 from 8.19 lakh reviews, India listing") | 1.0 on the score | Pass; ratings count dated to the scrape |
