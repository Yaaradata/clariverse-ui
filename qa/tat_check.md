# TAT check (follow-up fix 3)

**D-11 not available.** A search of the whole repo finds D-11 only as a reference: `docs/demo-rebuild/B7_Build_Brief_V3.md:4` ("Inherits … D-11 (TATs)") and `:95` ("D-11 TATs in the deliverables ledger"). The document itself is not in the repo, so no TAT could be checked against it.

What was done, per the instruction for this case:
- No TAT was invented or web-searched.
- Every TAT that is not an RBI timeline now shows **"Bank TAT: confirm in discovery"** instead of a number.
- The six RBI rows keep their number and their cited RBI instrument, **but none is verified against D-11**. Their only in-repo sources are listed below. Ranjith should check them against D-11 before the sponsor review.

Source of every TAT shown on D1 (deliverables ledger) and the Cards view: `scripts/hdfc_v3/common.py` (`DELIVERABLES`), written into `data/seed/internal_v3/aggregates.json` → `deliverables[].tat_label`. D1, the Cards module's issue table, the business views' deliverables table and the D1 lower half all read `tat_label`; none holds its own TAT.

## RBI rows (number shown; not verified against D-11)

| Deliverable | Shown | Source line | Other in-repo support | Status |
|---|---|---|---|---|
| Failed transaction reversal | T+1 (UPI, card-to-card); T+5 (ATM); ₹100 per day | `common.py:57`, note `:59` "RBI, harmonised TAT for failed transactions (20 Sep 2019)" | `B2_Experience_and_Language_Brief.md:256` "Failed-transaction TAT and compensation framework · Verify on rbi.org.in"; B7:70 "(T+1, T+5)" | Unverified |
| Credit card closure | 7 working days; ₹500 per day | `common.py:65`, note `:67` "RBI Master Direction on credit and debit cards (2022)" | `B2…:254` "Confirmed in multiple secondary sources. Check the current instrument on rbi.org.in" (may be re-issued as 2025 Directions) | Unverified; B2 flags a possible re-issue |
| Unauthorised transaction: shadow credit | 10 working days | `common.py:73`, note `:75` "RBI, limiting customer liability … (2017)" | none | Unverified |
| Credit information correction | 30 calendar days (21 bank + 9 bureau); ₹100 per day | `common.py:82`, note `:84` | `B2…:255` "Secondary source; verify the RBI circular" | Unverified |
| Property documents after loan closure | 30 calendar days; ₹5,000 per day | `common.py:91`, note `:93` | none | Unverified |
| Complaint resolution before ombudsman eligibility | 30 calendar days | `common.py:100`, note `:102` "RBI Integrated Ombudsman Scheme (2021)" | `B2…:258` "RB-IOS 2021, CMS portal · Verify" | Unverified |

The Cards module's closure row also carries a fixed note, `frontend/components/hdfc-v3/ModuleView.tsx:321` "7 working days (RBI); ₹500 per day of delay". It matches `common.py:65` and has the same status.

## Bank rows (now "Bank TAT: confirm in discovery")

Before this fix each row showed a working assumption as a number. The numbers remain only as sample-generator parameters (`tat_days`) and are never displayed.

| Deliverable | Was shown | Now | Source line |
|---|---|---|---|
| Card dispatch and delivery | 7 working days (working assumption) | Bank TAT: confirm in discovery | `common.py:108` |
| Card dispute and chargeback | 30 calendar days (working assumption; network timelines apply) | Bank TAT: confirm in discovery | `common.py:116` |
| Merchant refund credited | 7 working days (working assumption) | Bank TAT: confirm in discovery | `common.py:123` |
| Service request (KYC, account changes, card requests) | 3 working days (working assumption) | Bank TAT: confirm in discovery | `common.py:130` |
| Debit freeze review | 3 working days (working assumption) | Bank TAT: confirm in discovery | `common.py:137` |
| Loan sanction and disbursal | 5 working days (working assumption) | Bank TAT: confirm in discovery | `common.py:144` |
| First response to a query or complaint | 1 day (working assumption) | Bank TAT: confirm in discovery | `common.py:151` |

Also changed: the escalation email L2-09 (A1), `scripts/hdfc_v3/personas.py:503`. It read "the bank TAT of 3 working days ends 30 Sep (tomorrow)" and now reads "no decision yet. Bank TAT: confirm in discovery."

**Still measured:** met, outside and open-too-long on bank rows are still computed in the illustrative sample against the unshown placeholder. The D1 footnote says so.

## Mismatches

None found between screens: every screen reads the same `tat_label`. The action-queue emails L2-06 (card closure, 7 working days, ₹500 a day), L2-07 (shadow credit, 10 working days) and L2-08 (property documents, 30 calendar days), at `personas.py:467, 479, 491`, match the RBI rows above.

## Not TATs (left as they are)

- **"No bank reply after 48 hours"** (outside dials). LisN's own definition of a public item open too long, not a bank TAT.
- **"First response in 5 hours, closure in 24"** (E2/E3, `PriorityView.tsx:644, 750`). Vidya's stated target for priority customers, shown as "Working priority target, to confirm with the bank" (MORNING_DECISIONS D11).
- **Cohort columns "open over 5 hours / over 24 hours"**. Age bands, not TATs.

A reconcile check (`bank TATs read 'Bank TAT: confirm in discovery'`) fails if any non-RBI row carries anything else. Its fixture is "bank TAT as a number" in `scripts/test_checks.py`.
