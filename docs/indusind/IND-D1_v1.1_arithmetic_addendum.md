# IND-D1 v1.1 addendum: arithmetic rows (derived figures and sensitivities)
3 October 2026 · Internal to YaaraLabs · Safe to commit to the private build repo at `docs/indusind/`.

**What this adds to IND-D1 (2 Oct 2026).** Arithmetic checks for the derived register entries (D01–D11) and the sensitivities (S01–S07) in IND-B3 §2 and §2a.

**Inputs.** Every input is a VERIFIED figure in IND-D1. Nothing new is sourced here.

**Status of every row: DERIVED.** Each is arithmetic on verified primary figures, recomputed 3 Oct 2026.

**Effect.** IND-B3 §2a says no screen may show S03 or S04 until this derivation is in IND-D1. With this addendum, both may be shown, with their caveats.

## Inputs used (all VERIFIED in IND-D1 §1, §4)
- **Deposits (₹ crore):**
  - N01 total deposits 4,14,766 (30 Jun 2026); N02 3,99,931 (31 Mar 2026).
  - N03 current accounts 34,620; N05 35,034.
  - N04 savings 87,440; N06 89,899; N07 91,113 (30 Jun 2025).
- **Costs (Q1 FY27, quarterly average):** N08 cost of deposits 5.95%; N11 cost of savings 4.72%.
- **Loans (₹ crore):**
  - N21 vehicle finance 99,718; N16 micro loans 16,305; N25 loans 3,26,274.
  - Vehicle finance disbursements: N22 10,832 (Q1 FY27); N23 12,665 (Q4 FY26); N24 11,298 (Q1 FY26).

## Derived entries

| ID | Formula | Result | Display | Check |
|---|---|---|---|---|
| D01 | N03 + N04 | ₹1,22,060 crore | ₹1,22,060 crore | OK |
| D02 | N05 + N06 | ₹1,24,933 crore | ₹1,24,933 crore | OK |
| D03 | N01 − D01 | ₹2,92,706 crore | ₹2,92,706 crore ("derived") | OK |
| D04 | N02 − D02 | ₹2,74,998 crore | ₹2,74,998 crore ("derived") | OK |
| D05 | D01 ÷ N01 | 29.4286% | 29.4% | OK; IND-D1 shows 29.43% |
| D06 | D02 ÷ N02 | 31.2386% | 31.2% | OK; IND-D1 shows 31.24% |
| D07 | N01 ÷ N02 − 1 | +3.71% | +3.7% QoQ | OK |
| D08 | N04 ÷ N06 − 1; N04 ÷ N07 − 1 | −2.74%; −4.03% | −2.7% QoQ; −4.0% YoY | OK |
| D09 | (N08 × N01 − N11 × N04) ÷ D03 | 7.021% | ≈7.0% ("approximate") | OK. Applies average costs to period-end balances |
| D10 | (N11 × N04) ÷ D01 | 3.381% | ≈3.4% ("approximate") | OK. Assumes current accounts carry no cost |
| D11 | N22 ÷ N24 − 1; N22 ÷ N23 − 1 | −4.12%; −14.47% | −4% YoY; −14% vs the March quarter | OK; matches IND-D1 §4 |

## Sensitivities

| ID | Formula | Result | Display | Check |
|---|---|---|---|---|
| S01 | N01 × 0.01% | ₹41.48 crore a year | ≈ ₹41.5 crore a year | OK |
| S02 | N01 × 0.10% | ₹414.8 crore a year | ≈ ₹415 crore a year | OK |
| S03 | N01 × (D06 − D05) | ₹7,507 crore | ≈ ₹7,500 crore moved from CASA to term money | OK |
| S03 (alternative) | (D06 × N01 − D01) ÷ (1 − D06) | ₹10,918 crore | ≈ ₹10,900 crore of new CASA needed to restore 31.2% | OK |
| S04 low | S03 × (D09 − N11) = 7,507 × 2.30 pp | ₹173 crore a year | ≈ ₹170–275 crore a year, pre-tax (approximate) | OK |
| S04 high | S03 × (D09 − D10) = 7,507 × 3.64 pp | ₹273 crore a year | (same range) | OK |
| S05 | N21 × 0.10% | ₹99.7 crore a year | ≈ ₹100 crore a year | OK |
| S06 | N16 × 0.10% | ₹16.3 crore a year | ≈ ₹16 crore a year | OK |
| S07 | N25 × 0.01% | ₹32.6 crore a year | ≈ ₹32.6 crore a year | OK |

## Caveats that must travel with S03 and S04 on screen
- **The interest gap is approximate.** D09 and D10 apply Q1 *average* costs to 30 Jun *period-end* balances.
- **The two ends rest on different assumptions.**
  - Low end: the CASA lost was all savings, at the 4.72% cost of savings.
  - High end: the CASA lost was in today's CA:SA mix, at the ≈3.4% blended cost.
- **Pre-tax and annualised.** "Not a forecast. Not additive across cards."
- **Not a statement of what the bank paid.** It is a sensitivity on disclosed figures.

## Still open for IND-D1 (unchanged from v1)
- IndusInd and IDFC First rate tables: these need the manual browser read.
- The IRDAI penalty: secondary only.
- FY26 complaint counts: not found.
- The annual report's RBI-format complaints table: not reached.
