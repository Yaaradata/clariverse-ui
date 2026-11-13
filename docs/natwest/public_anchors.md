# NatWest · public anchors (HL-18)

Every sizing input of the illustrative internal layer (`scripts/natwest_pulse/`, the `oct13` pipeline re-parameterised),
tagged ANCHOR, DERIVED or ASSUMPTION. The research pack was not supplied (NW-D01): the ANCHOR rows are the figures the
brief quotes from it, to be re-checked against the pack when it lands. Validation: `qa/natwest_volume_validation.md`.
Window: 1 Aug to 12 Nov 2026 08:30 GMT (103 days of data).

| Tag | Item | Value | Where |
|---|---|---|---|
| ANCHOR | Complaints, H1 2026 | 86,498 | brief (H1 2026 complaints return) |
| ANCHOR | Complaints per 1,000 accounts, H1 2026 | 2.74 | brief |
| ANCHOR | Share upheld | about 55% | brief; `complaint_rules.REJECT` |
| ANCHOR | Share closed within 3 days | 48% | brief; `seed_internal_v3.resolution_hours` |
| ANCHOR | Royal Bank of Scotland app vs overall | 66% vs 48% (CMA, August 2026) | brief; register `REG-CMA-RBS-APP` |
| ANCHOR | Group customers | 20 million | brief Step 3.8 |
| DERIVED | Complaints in the window | about 49,200 (86,498 × 103 / 181) | `scale_v3.COMPLAINTS` |
| DERIVED | Recent complainants (90 days) | about 43,000 | `scale_v3.LISTS.priority_b` |
| ASSUMPTION | Contacts in the window | 9,000,000 (1.6 contacts a customer a year) | `scale_v3.TOTAL_CONTACTS` |
| ASSUMPTION | Channel mix | Calls 44% · Cora 30% · Branch 10% · App chat 9% · Email 6% · Social 1% | `scale_v3.CHANNEL_MIX` |
| ASSUMPTION | Complaint shape by product | Current accounts 30% · Payments and fraud 20% · Credit cards 17% · Mortgages 10% · Savings 7% · Personal loans 6% · Overdrafts 5% · Cora 5% | `scale_v3.COMPLAINT_MIX` (the return's per-product shape is in the research pack) |
| ASSUMPTION | Negative share of contacts | about 12% | HL-19 |
| ASSUMPTION | Financially vulnerable (flag in records) | 1,200,000 | `scale_v3.LISTS.priority_a` |
| ASSUMPTION | Premier and Private | 800,000 | `scale_v3.LISTS.uhni` |
| ASSUMPTION | Referred to the Financial Ombudsman Service | about 2,500 in the window (about 5% of complaints) | `scale_v3.ESCALATION` |
| ASSUMPTION | Referral behaviour | 45% of those unhappy with the final response, 20% of those past the deadline | `complaint_rules.referred_at` |
| ASSUMPTION | Theme mix per product | hand-set (public pull not loaded) | `seed_internal_v3.HAND_MIX` |

Rules (register): final response within 8 weeks (`REG-DISP-8W`); 15 business days for payment services (`REG-PSD-15`);
6 months to refer (`REG-FOS-6M`); push payment scam reimbursement 5 business days (`REG-PSR-APP`); Faster Payments
same day (`REG-FPS-SAMEDAY`). Stock versus flow: Ombudsman states are a stock at each period end; intake is a flow.
