# Swedbank pulse · internal layer notes (SW-D05, SW-D06, SW-D08, SW-D09)

Scripts: `scripts/swedbank_pulse/{scale_v3,seed_internal_v3,seed_complaints_v3,complaint_rules,ombudsman_v3,
seed_social_inbox,personas,volume_validation,v4_blocks}.py`. Run order: `seed_internal_v3.py` (calls scale_v3) →
`seed_complaints_v3.py` → `seed_social_inbox.py` → (periods_v3) → `volume_validation.py`. Figures and tags:
`docs/swedbank/public_anchors.md`, `docs/swedbank/volume_validation.md`.

## Cohorts (ids kept; the screens key on them)

| id | Label | Size | Sample |
|---|---|---|---|
| priority_a | Customers in a vulnerable situation | 380,000 | 500 customers, every segment |
| priority_b | Recent complainants (90 days) | 74,000 | 120; and any customer with a complaint in the last 90 days (ombudsman_v3.lists_at) |
| uhni | Premium and Private Banking | 228,000 | every Premium or Private Banking customer (segments Bas · Premium · Private Banking) |
| multi | Account-measure affected (frozen or restricted under AML rules) | 57,000 | 220 Bas customers, apart from the other lists; about 70% have an owner (Account-measure review team) |

Account-measure customers hold most account-freeze contacts (themes swapped inside the product, quotas unchanged).

## ARN watch (one register, same payload keys)

| key | Tile | Starts | Ends |
|---|---|---|---|
| brink | First reply overdue | 15 business days after the complaint with no reply from the bank | the bank's reply, or filing with ARN |
| eligible | Final decision issued, Kundombudsman appeal open | a rejecting decision (rejected or partly rejected) | 21 days later, or the customer comes back (→ unhappy) |
| unhappy | Unhappy with the final decision (ARN eligible) | the customer comes back after a rejecting decision (reopened, or contacted again) | one year after the complaint (ARN's limit), or filing |
| awaiting_io | Filed with ARN | filing: 3–30 days after coming back unhappy, within the year | 90 days after filing |

`open` = no reply yet and not filed; `at_risk` = brink or eligible or unhappy, each once; `buckets` = days left before the
15-business-day deadline for open complaints not yet overdue (countdown, not a tile). Upheld complaints have nothing to
appeal (UNHAPPY resolved = 0). Filers: `complaint_rules.choose_filers` picks n of the unhappy rejecting complaints (n =
38 filings a window / mean complaint weight; 5 in the sample) and marks them `arn_filer` on the contact. Filed ≤ tile 2 +
tile 3 by construction of the route and by size (122 against 6,969 at the freeze).

The register is read as a steady state: 7 copies of each complaint at −9…+9 days, 14 copies shifted back by whole window
lengths (a year, ARN's limit) and one forward, so the stocks are level from 22 Oct (at risk 7,800–8,200 every day).

## Service standards (common.DELIVERABLES)

Seed deadlines: Swish payment delivered is calendar (one day in the generator); the others are business days (weekends and
Swedish public holidays skipped), card dispute is 30 calendar days. Mortgage offer applies to mortgages only; a consumer-
loan document request is a service request.

## Open points

- Lint words that remain as payload keys only: `cora` (aggregates block), `fca` (open-too-long basis id), status
  `moved_to_secure_message`, escalation value `rbi_ombudsman`. Renaming needs the screens and the reconcile in step.
- Public reach (`periods_v3.reach`) uses NatWest thresholds: 4 high-impact posts in the Swedish data.
