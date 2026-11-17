# Swedbank · public anchors (SW-D09)

Every sizing input of the internal layer (`scripts/swedbank_pulse/scale_v3.py`, `complaint_rules.py`,
`seed_internal_v3.py`), tagged ANCHOR, DERIVED or ASSUMPTION. ANCHOR rows come from the research pack
(`docs/swedbank/research_pack.md`, sections 2, 3, 5 and 6) with the source it names. The figure-by-figure check, per
window, is `docs/swedbank/volume_validation.md` (written by `volume_validation.py`). The tags stay in these two files;
they never reach a screen string. No person is named here or on screen.

Window: 22 Oct 2026 00:00 CEST to the freeze 17 Nov 2026 07:45 CET (26.36 days). Scope: Swedbank Swedish Banking,
private customers.

## Anchors

| Tag | Item | Value | Source |
|---|---|---|---|
| ANCHOR | Private customers, Swedish Banking | about 3.8 million | Swedbank Annual Report 2025 |
| ANCHOR | Branches (kontor) in Sweden | 140 (end 2025) | MarketScreener |
| ANCHOR | Contact-centre volume, 2016 | 700 agents, 3.6 million interactions a year | Nuance press release, April 2016 |
| ANCHOR | Nina at launch | 30,000–40,000 conversations a month; 78% first-contact resolution | Nuance 2016; Diginomica |
| ANCHOR | Konsumenternas Bank- och finansbyrå cases | about 7,500 in 2025 (9,100 in 2024), all banks; most common area payments: fraud and AML account measures | TT press release |
| ANCHOR | Callers citing the money-laundering rules | 25% | E55 |
| ANCHOR | Bank-initiated account closures | 159,000 in three years across the four big banks | Finansinspektionen via Dagens PS |
| ANCHOR | SKI Bank 2026, private customers | Swedbank 60.3; Sparbankerna 75.2; industry 66.0 | SKI via Börskollen, Dagens PS (21 Sep 2026) |
| ANCHOR | NKI target | at least 65 in Sweden | Årsredovisning 2025 |
| ANCHOR | Complaints process | Kundcenter or kontor → Kundombudsman (written appeal) → ARN, Konsumenternas byrån or court | swedbank.se, handling of complaints |
| ANCHOR | ARN | the consumer files in writing after the bank's final decision; 150 kr fee; recommendations not binding | research pack §6 |

## Derived and assumed inputs

| Tag | Item | Value | Where |
|---|---|---|---|
| ASSUMPTION | Contacts a year, now | about 5,000,000 (the 2016 3.6m grown with Nina and the app) | `scale_v3.CONTACTS_PER_YEAR` |
| DERIVED | Contacts in the window | about 361,000 (5m × 26.36/365; the weighted sample lands at 367,423) | `scale_v3.TOTAL_CONTACTS` |
| ASSUMPTION | Channel mix | Calls 38% · Nina 35% · App and internet-bank messages 15% · Branch (kontor) 9% · Email 2% · Social 1% | `scale_v3.CHANNEL_MIX` |
| ASSUMPTION | Internal complaints per external case | ×40 | `scale_v3.INTERNAL_PER_EXTERNAL` |
| DERIVED | Complaints a year | 300,000 (7,500 × 40) | `scale_v3.COMPLAINTS_PER_YEAR` |
| DERIVED | Complaints in the window | about 21,700 (the weighted sample lands at 22,389) | `scale_v3.COMPLAINTS` |
| ASSUMPTION | Complaint mix by product | Payments and Swish 32% · Everyday accounts and app 30% · Cards 14% · Mortgages 10% · Savings and funds 8% · Consumer loans 6% | `scale_v3.COMPLAINT_MIX` |
| ASSUMPTION | Contact mix by product | Payments and Swish 24% · Everyday accounts and app 34% · Cards 14% · Mortgages 12% · Savings and funds 9% · Consumer loans 7% | `scale_v3.PRODUCT_MIX` |
| ASSUMPTION | Negative share of contacts | about 13% (11–16% by product); 85% of complaints | `scale_v3.NEGATIVE_SHARE` |
| ASSUMPTION | Customers in a vulnerable situation | 380,000 (10%) | `scale_v3.LISTS.priority_a` |
| DERIVED | Recent complainants (90 days) | 74,000 (300,000 × 90/365) | `scale_v3.LISTS.priority_b` |
| ASSUMPTION | Premium and Private Banking | 228,000 (6%) | `scale_v3.LISTS.uhni` |
| ASSUMPTION | Account-measure affected (frozen or restricted under AML rules) | 57,000 (1.5%); context: the 159,000 closures above | `scale_v3.LISTS.multi` |
| ASSUMPTION | Share of each list in contact in the window | 5% · 25% · 5% · 20% | `scale_v3.LISTS` |
| ASSUMPTION | Account-measure customers with a named owner | about 70% | `seed_internal_v3.build_customers` |
| ASSUMPTION | First reply to a complaint | 15 business days, every product (bank standard, confirm with the bank; the Payment Services Act's 15 business days for payment services) | `complaint_rules.FIRST_REPLY_DAYS`; register REG-FIRST-REPLY, REG-PSD-15 |
| ASSUMPTION | Complaints settled at first contact | about half, within 3 days | `seed_internal_v3.resolution_hours` |
| ASSUMPTION | Complaints rejected in whole or in part | about 35% of decisions (65% upheld, weighted) | `complaint_rules.REJECT` |
| ASSUMPTION | Kundombudsman appeal watch horizon | 21 days after a rejecting decision (confirm with the bank) | `complaint_rules.APPEAL_OPEN`; REG-KUNDOMBUDSMAN |
| ASSUMPTION | Unhappy with a rejecting decision | 3.5% (partly rejected) · 4.5% (rejected) come back | `complaint_rules.UNHAPPY` |
| ANCHOR (rule) | ARN time limit | filed within one year of the complaint to the bank | `complaint_rules.ARN_WINDOW`; REG-ARN |
| ASSUMPTION | ARN handling | a filed case is open 90 days (the ADR rule: decision within 90 days of a complete file) | `complaint_rules.ARN_OPEN` |
| ASSUMPTION | ARN filing pace | about 10 a week (no public ARN count by bank); on screen as an assumption | `scale_v3.ARN_FILINGS_PER_WEEK`, `complaint_rules.choose_filers` |
| ASSUMPTION | Social-inbox handling | about 65% within 24 hours (NW-D100) | `seed_social_inbox.WITHIN_24H` |
| ASSUMPTION | Theme mix per product | hand-set; Payments and Swish and account measures lead | `seed_internal_v3.HAND_MIX` |
