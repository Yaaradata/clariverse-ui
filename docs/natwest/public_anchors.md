# NatWest · public anchors (HL-18)

Every sizing input of the illustrative internal layer (`scripts/natwest_pulse/seed_natwest.py`), tagged ANCHOR, DERIVED or
ASSUMPTION. The research pack was not supplied (NW-D01): the ANCHOR rows are the figures the brief quotes from it, to be
re-checked against the pack and its sources when it lands. Validation: `qa/natwest_volume_validation.md`.

| Tag | Item | Value | Basis |
|---|---|---|---|
| ANCHOR | Complaints, H1 2026 | 86,498 | Brief, from the research pack (H1 2026 complaints return) |
| ANCHOR | Complaints per 1,000 accounts, H1 2026 | 2.74 | Brief, same return |
| ANCHOR | Share upheld | about 55% | Brief, same return |
| ANCHOR | Share closed within 3 days | 48% | Brief, same return |
| ANCHOR | Royal Bank of Scotland app vs overall | 66% vs 48% | Brief, CMA August 2026 (measure definition pending) |
| ANCHOR | Group customers | 20 million | Brief Step 3.8 ("scale to a 20-million-customer group") |
| DERIVED | Complaints per week | 3,345 | 86,498 over the 181 days of H1 |
| DERIVED | Accounts | 31.6 million | 86,498 / 2.74 × 1,000 |
| ASSUMPTION | Calls per customer per year | 1.4 | Until discovery |
| ASSUMPTION | Cora conversations per customer per year | 1.2 | Until discovery |
| ASSUMPTION | Branch contacts per customer per year | 0.4 | Until discovery |
| ASSUMPTION | Brand split of customers | NatWest 77.5% · Royal Bank of Scotland 17% · Ulster Bank 5.5% | Until the research pack |
| ASSUMPTION | Segment split | Everyday 50% · mortgage holders 16% · multi-product 24% · financially vulnerable 10% | Primary segment; vulnerability takes precedence |
| ASSUMPTION | Product shape of complaints | Current accounts 34% · payments and fraud 22% · cards 17% · mortgages 10% · loans 8% · savings 7% · Cora 2% | The return's per-product shape is in the research pack |
| ASSUMPTION | Negative share of contacts | about 12–14% | HL-19 |
| ASSUMPTION | Cora marked-resolved and 7-day return rates, by journey | `taxonomy.py` CORA_JOURNEYS | Until discovery |
| ASSUMPTION | Ombudsman referral propensity | 9% of not-upheld, 2% of upheld final responses | No anchor; flagged in the report |
| ASSUMPTION | Push payment scam claims per week | 700 | Until discovery |
| ASSUMPTION | Fraud alerts triaged per week | 41,000 | Until discovery |
| ASSUMPTION | Final responses drafted by AI (from 1 Sep 2026) | 38% | Until discovery |

Stock versus flow: the Ombudsman states (within 8 weeks · final response issued, 6-month clock running · eligible to
refer · referred) are a stock as at the freeze; the window figures (received, final responses, referrals) are flows.
