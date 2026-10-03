# IndusInd · anchors, derived figures and assumptions (HL-18)

Every internal (L3) scale the demo relies on, with its anchor, our figure, the ratio and a verdict. Anything more than
2× off an anchor is fixed or justified. Anchors come from IND-D1 (2 Oct 2026). Internal counts stay off screen (shares, indices, weeks of intake).

| Metric | Kind | Our figure | Anchor | Ratio | Verdict |
|---|---|---|---|---|---|
| Complaints received a year | ASSUMPTION | about 63,700 (Q1 weekly intake × 52) | N31: 80,062 (FY25) | 0.80× | Pass |
| Complaints pending at year-end | DERIVED (stock) | 2.2–2.5 weeks of intake pending at any week end | N32: 15,811 (10.3 weeks of FY25 intake; broadened classification) | 0.18× | Justified (volume validation); FY24 basis 0.7–0.8× |
| Reject rate, of final replies | ASSUMPTION | 8.1% | Peer disclosures 6–10% (HL-19) | in band | Pass |
| Negative share of internal contacts | ASSUMPTION | 12.0% overall; 9.5–15% by product | About 12% overall, 9–16% by product (HL-19) | in band | Pass |
| Social inbox share of internal contacts | ASSUMPTION | 1.0% | About 1% (HL-19) | in band | Pass |
| Ombudsman at risk | DERIVED | about 39% of pending (last 4 weeks) | A believable multiple of actual RBI Ombudsman filings | pending | Filings are not in the register; blocked on a source |
| Contacts per complaint | ASSUMPTION | per `scripts/seed_indusind.py` | None public | — | Shares only on screen |
| Public items (L2) | ANCHOR (real) | counts as collected | The scrape itself (`qa/indusind_l2_profile.md`) | 1.0 | Real counts; never synthetic (HL-15) |
| INDIE listing rating | ANCHOR (real) | 4.5 from 8.19 lakh reviews, India listing, as of 2 Oct 2026 | IND-D1 LIVE-01 | 1.0 | Pass |
