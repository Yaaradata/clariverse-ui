# Swedbank · volume validation (SW-D09)

Written by `scripts/swedbank_pulse/volume_validation.py` from the seed in `data/seed/swedbank_pulse/`. Anchors and
sources: `docs/swedbank/public_anchors.md` (research pack `docs/swedbank/research_pack.md`). Every internal figure on
screen is in this file with its tag; the tags (ANCHOR, DERIVED, ASSUMPTION) never appear on screen.

Window: 22 Oct 2026 00:00 CEST to the freeze 17 Nov 2026 07:45 CET (26.36 days). Sample kept: 32,000 contacts and 5,000 customers; every figure is a weighted sum of those rows (scale_v3.py).

Verdict: **OK** inside the expected range (a point target within 5%); **Justified** outside it with the reason; **FIX** must be fixed; **recorded** has no check.


## 1 · Anchors and inputs

| Figure | Value | Tag | Source | Verdict |
|---|---|---|---|---|
| Private customers, Swedish Banking | 3,800,000 | ANCHOR | Swedbank Annual Report 2025 (research pack §2) | recorded |
| Branches (kontor) in Sweden | 140 | ANCHOR | MarketScreener, end 2025 (research pack §2) | recorded |
| Contacts a year, 2016 | 3,600,000 (700 agents) | ANCHOR | Nuance press release, April 2016 (research pack §3) | recorded |
| Contacts a year, now | 5,000,000 | ASSUMPTION | the 2016 figure grown with Nina and the app (kickoff Step 9) | recorded |
| Nina conversations a month, 2016 | 30,000–40,000; 78% first-contact resolution | ANCHOR | Nuance 2016; Diginomica (research pack §3) | recorded |
| Nina share of contacts | 35% | ASSUMPTION | kickoff Step 9 | recorded |
| External guidance cases, all banks, 2025 | about 7,500 (9,100 in 2024) | ANCHOR | Konsumenternas Bank- och finansbyrå via TT (research pack §5) | recorded |
| Internal complaints per external case | ×40 | ASSUMPTION | kickoff Step 9 (the external cases are the tip) | recorded |
| Complaints a year | 300,000 | DERIVED | 7,500 × 40 | recorded |
| Callers to the guidance bureau citing the AML rules | 25% | ANCHOR | E55 (research pack §5) | recorded |
| Bank-initiated account closures, big four, 3 years | 159,000 | ANCHOR | Finansinspektionen via Dagens PS (research pack §5) | recorded |
| Window length | 26.36 days (22 Oct 00:00 CEST to 17 Nov 07:45 CET) | DERIVED | common.DATA_START, PERIOD_END | recorded |
| ARN filing pace | about 10 a week | ASSUMPTION | no public ARN count by bank (research pack §5); shown on screen as an assumption | recorded |

## 2 · Contacts, complaints and Nina, per window

| Figure | Value | Tag | Source | Verdict |
|---|---|---|---|---|
| Morning brief: contacts | 15,789 | DERIVED | 5,000,000 a year × the window's days; weighted sample (scale_v3) | OK |
| Morning brief: complaints received | 1,262 | DERIVED | 7,500 × 40 a year × the window's days | Justified: a single weekday (16 Nov, a Monday): weekday volume runs above the daily average, weekends below |
| Morning brief: Nina conversations | 5,413 | DERIVED | contacts × 35% Nina share | OK |
| Morning brief: negative contacts | 2,590 (16.4%) | ASSUMPTION | about 13% of contacts negative (scale_v3.NEGATIVE_SHARE) | Justified: a single weekday (16 Nov, a Monday): weekday volume runs above the daily average, weekends below |
| Last 7 days: contacts | 102,940 | DERIVED | 5,000,000 a year × the window's days; weighted sample (scale_v3) | OK |
| Last 7 days: complaints received | 6,448 | DERIVED | 7,500 × 40 a year × the window's days | OK |
| Last 7 days: Nina conversations | 36,019 | DERIVED | contacts × 35% Nina share | OK |
| Last 7 days: negative contacts | 14,892 (14.5%) | ASSUMPTION | about 13% of contacts negative (scale_v3.NEGATIVE_SHARE) | OK |
| Last 14 days: contacts | 201,901 | DERIVED | 5,000,000 a year × the window's days; weighted sample (scale_v3) | OK |
| Last 14 days: complaints received | 11,907 | DERIVED | 7,500 × 40 a year × the window's days | OK |
| Last 14 days: Nina conversations | 70,208 | DERIVED | contacts × 35% Nina share | OK |
| Last 14 days: negative contacts | 28,420 (14.1%) | ASSUMPTION | about 13% of contacts negative (scale_v3.NEGATIVE_SHARE) | OK |
| Full window: contacts | 367,339 | DERIVED | 5,000,000 a year × the window's days; weighted sample (scale_v3) | OK |
| Full window: complaints received | 22,414 | DERIVED | 7,500 × 40 a year × the window's days | OK |
| Full window: Nina conversations | 128,550 | DERIVED | contacts × 35% Nina share | OK |
| Full window: negative contacts | 52,125 (14.2%) | ASSUMPTION | about 13% of contacts negative (scale_v3.NEGATIVE_SHARE) | OK |
| Full window: contacts against the target | 367,339 | DERIVED | target 361,000 = 5m × 26.36/365 (whole-number weights round up a little) | OK |
| Full window: complaints against the target | 22,414 | DERIVED | target 21,700 = 300,000 × 26.36/365 | OK |
| Nina conversations a month (full window, per 30 days) | 146,276 | DERIVED | against the 2016 anchor of 30,000–40,000 a month | Justified: 35% of about 5m contacts a year; Nina grew from its 2014 launch volume and now also serves the app |
| Complaints per 1,000 private customers a year | 79 | DERIVED | 300,000 / 3.8m; no published Swedbank complaint figure to compare (research pack §5) | recorded |
| Kontor contacts per branch per business day | 12 | DERIVED | kontor contacts in the full window / 140 branches / 19 business days | OK |
| Full window channel: Calls | 139,506 (38.0%) | ASSUMPTION | channel mix 38% (scale_v3.CHANNEL_MIX) | OK |
| Full window channel: Nina | 128,550 (35.0%) | ASSUMPTION | channel mix 35% (scale_v3.CHANNEL_MIX) | OK |
| Full window channel: App and internet-bank messages | 55,126 (15.0%) | ASSUMPTION | channel mix 15% (scale_v3.CHANNEL_MIX) | OK |
| Full window channel: Email | 7,395 (2.0%) | ASSUMPTION | channel mix 2% (scale_v3.CHANNEL_MIX) | OK |
| Full window channel: Social | 3,750 (1.0%) | ASSUMPTION | channel mix 1% (scale_v3.CHANNEL_MIX) | OK |
| Full window channel: Branch (kontor) | 33,012 (9.0%) | ASSUMPTION | channel mix 9% (scale_v3.CHANNEL_MIX) | OK |
| Full window product: Everyday accounts and app | 125,139 contacts · 7,623 complaints | ASSUMPTION | product mix 34% of contacts, 34% of complaints | recorded |
| Full window product: Payments and Swish | 88,145 contacts · 6,270 complaints | ASSUMPTION | product mix 24% of contacts, 28% of complaints | recorded |
| Full window product: Cards | 51,326 contacts · 3,122 complaints | ASSUMPTION | product mix 14% of contacts, 14% of complaints | recorded |
| Full window product: Mortgages (bolån) | 44,017 contacts · 2,256 complaints | ASSUMPTION | product mix 12% of contacts, 10% of complaints | recorded |
| Full window product: Savings and funds | 33,047 contacts · 1,808 complaints | ASSUMPTION | product mix 9% of contacts, 8% of complaints | recorded |
| Full window product: Consumer loans | 25,665 contacts · 1,335 complaints | ASSUMPTION | product mix 7% of contacts, 6% of complaints | recorded |

## 3 · Cohorts (list sizes)

| Figure | Value | Tag | Source | Verdict |
|---|---|---|---|---|
| Customers in a vulnerable situation | 380,000 | ASSUMPTION | 10% of private customers (kickoff Step 5) | recorded |
| Customers in a vulnerable situation: share in contact in the window | 5% | ASSUMPTION | scale_v3.LISTS | recorded |
| Recent complainants (90 days) | 74,000 | DERIVED | 300,000 complaints a year × 90/365 | recorded |
| Recent complainants (90 days): share in contact in the window | 25% | ASSUMPTION | scale_v3.LISTS | recorded |
| Premium and Private Banking | 228,000 | ASSUMPTION | 6% of private customers (kickoff Step 5) | recorded |
| Premium and Private Banking: share in contact in the window | 5% | ASSUMPTION | scale_v3.LISTS | recorded |
| Account-measure affected | 57,000 | ASSUMPTION | 1.5% of private customers (kickoff Step 5); context: 159,000 bank-initiated closures in 3 years across the big four | recorded |
| Account-measure affected: share in contact in the window | 20% | ASSUMPTION | scale_v3.LISTS | recorded |
| Contacting customers in the window | 144,400 | DERIVED | contacts / 2.5 contacts each (ASSUMPTION) | recorded |

## 3b · Bank response by source (social inbox, Internal on screen)

| Figure | Value | Tag | Source | Verdict |
|---|---|---|---|---|
| App Store: handled, full window | 1 of 2 | ASSUMPTION | target share 55% of the source's on-topic items (SW-D17: stores higher, X and Reddit lower, Trustpilot between); m = on-topic count in the window | OK |
| Google Play: handled, full window | 12 of 23 | ASSUMPTION | target share 50% of the source's on-topic items (SW-D17: stores higher, X and Reddit lower, Trustpilot between); m = on-topic count in the window; includes the 4 real bank replies in the crawl | OK |
| X: handled, full window | 5 of 18 | ASSUMPTION | target share 25% of the source's on-topic items (SW-D17: stores higher, X and Reddit lower, Trustpilot between); m = on-topic count in the window | OK |
| Reddit: handled, full window | 5 of 21 | ASSUMPTION | target share 22% of the source's on-topic items (SW-D17: stores higher, X and Reddit lower, Trustpilot between); m = on-topic count in the window | OK |
| Trustpilot: handled, full window | 5 of 13 | ASSUMPTION | target share 40% of the source's on-topic items (SW-D17: stores higher, X and Reddit lower, Trustpilot between); m = on-topic count in the window | OK |

## 4 · ARN watch (complaint register, as of the freeze)

| Figure | Value | Tag | Source | Verdict |
|---|---|---|---|---|
| Complaints received in the window (tile base) | 22,414 | DERIVED | the steady register (complaint_rules.steady_register): the same complaints as section 2 | OK |
| First reply overdue (past 15 business days) | 1,303 | DERIVED | 15 business days, bank standard (confirm with the bank); reply-time model ASSUMPTION (seed_internal_v3) | recorded |
| Final decision issued, Kundombudsman appeal open | 5,450 | DERIVED | rejecting decisions in the last 21 days (watch horizon ASSUMPTION); reject share ASSUMPTION (complaint_rules.REJECT) | recorded |
| Unhappy with the final decision (ARN eligible) | 1,368 | DERIVED | came back after a rejecting decision (complaint_rules.UNHAPPY, ASSUMPTION), within ARN's one year of the complaint | recorded |
| Filed with ARN (open at ARN) | 180 | DERIVED | about 10 filings a week (ASSUMPTION) × 90 days open at ARN (ADR rule) | OK |
| Filed ≤ appeal open + unhappy | 180 ≤ 6,818 | DERIVED | zero-defect gate point 1 | OK |
| At risk (overdue + appeal open + unhappy, each once) | 8,121 | DERIVED | the register | recorded |
| Open (no reply yet) | 5,964 | DERIVED | the register | recorded |
| ARN filings in the window (ladder rung) | 50 (13.3 a week) | ASSUMPTION | about 10 a week | OK |
| Ladder, full window: Complaints team | 8,110 | DERIVED | flows in the window from the register | recorded |
| Ladder, full window: Bank's final decision | 7,850 | DERIVED | flows in the window from the register | recorded |
| At risk by product: Everyday accounts and app | 2,408 (overdue 417 · appeal 1,877 · unhappy 114) | DERIVED | the register, by product | recorded |
| At risk by product: Payments and Swish | 2,595 (overdue 398 · appeal 1,604 · unhappy 593) | DERIVED | the register, by product | recorded |
| At risk by product: Cards | 847 (overdue 187 · appeal 660 · unhappy 0) | DERIVED | the register, by product | recorded |
| At risk by product: Mortgages (bolån) | 825 (overdue 87 · appeal 503 · unhappy 235) | DERIVED | the register, by product | recorded |
| At risk by product: Savings and funds | 901 (overdue 135 · appeal 477 · unhappy 289) | DERIVED | the register, by product | recorded |
| At risk by product: Consumer loans | 545 (overdue 79 · appeal 329 · unhappy 137) | DERIVED | the register, by product | recorded |
| Complaints upheld, of those with a decision | 65% | ASSUMPTION | no published Swedbank figure; complaint_rules.REJECT | OK |

## 5 · Social inbox handling (shown with the Internal tag)

| Figure | Value | Tag | Source | Verdict |
|---|---|---|---|---|
| High-impact X and Reddit posts: handled within 24 hours | 2 of 4 (50%) | ASSUMPTION | about 65% within 24 hours (NW-D100) | recorded |
| High-priority mentions: handled within 24 hours | 818 of 1,247 (66%) | ASSUMPTION | about 65% within 24 hours (NW-D100) | OK |

## 6 · Cross-check with the built payload

| Figure | Value | Tag | Source | Verdict |
|---|---|---|---|---|
| Morning brief: internal volume in periods.json = this file | 15,737 vs 15,789 | DERIVED | periods_v3 | OK |
| Last 7 days: internal volume in periods.json = this file | 102,980 vs 102,940 | DERIVED | periods_v3 | OK |
| Last 14 days: internal volume in periods.json = this file | 203,080 vs 201,901 | DERIVED | periods_v3 | OK |
| Full window: internal volume in periods.json = this file | 367,342 vs 367,339 | DERIVED | periods_v3 | OK |
| Full window: ARN at risk in periods.json = this file | 8,539 vs 8,121 | DERIVED | periods_v3 / ombudsman_v3 | Justified: periods.json is from an earlier seed run; re-run periods_v3 |

85 rows; 0 to fix; 4 justified.
