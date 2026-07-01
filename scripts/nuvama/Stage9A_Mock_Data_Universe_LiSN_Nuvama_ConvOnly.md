# Stage 9A — Mock-Data Universe (CONVERSATION-ONLY) — LiSN / Fluid CX · Nuvama
**`Stage9A_Mock_Data_Universe_LiSN_Nuvama_ConvOnly.md`** — replaces the book-based Stage 9A.

> **Inputs.** Stage 5 (conversation-only model) + Stage 8 (state shape). The business-as-usual **conversation** world + the comparison basis the method scores against (DENSE percentile bands / BURSTY median+IQR / SPARSE Poisson, **event-excluded**). **No anomalies seeded here** (that is 9B). **No book/₹ data** — cohorts sized by client/interaction counts, never AUM. All figures `[illustrative]`.

---

## Entity instances (conversation-only)
**OrgUnits:** 4 regions / 8 branches — REG-W (Vivek Jain) BR-W1 Mumbai/BR-W2 Pune/BR-W3 Ahmedabad · REG-N (Amit Saxena) BR-N1 Delhi/BR-N2 Gurugram · REG-S (Sandeep Chakraborti) BR-S1 Bengaluru/BR-S2 Chennai · REG-E (Priyanshu Gaurav) BR-E1 Kolkata. *(People real; regional labels `[illustrative]`.)*
**People:** `RM-001…RM-030` (30 RMs) · `EWM-001…EWM-015` (15 EWMs; partner-voice coverage caveat).
**Cohorts `CH-01…CH-12`** — keyed by conversation metadata only: `{segment(Emerging/Core/Senior HNI), region, branch, rmEwmId, channel, tenureBand, clientCount, interactionCount}`. **No AUM.**

| Cohort | Segment | Region | Channel | Tenure | Clients | Interactions/mo `[illus]` |
|---|---|---|---|---|---|---|
| CH-01 | Core HNI | West | RM-direct | 3–7y | 480 | 1,200 |
| CH-04 | Core HNI | North | RM-direct | 3–7y | 430 | 1,050 |
| CH-06 | Core HNI | North | EWM | 3–7y | 540 | 760 |
| CH-07 | Core HNI | South | RM-direct | 3–7y | 510 | 1,300 |
| CH-08 | Senior HNI | South | RM-direct | 7y+ | 190 | 640 |
| CH-09 | Emerging HNI | South | Digital+RM | <3y | 820 | 1,500 |
| … | (CH-02/03/05/10/11/12 follow the same shape) | | | | | |

**Interaction corpus — monthly volumes `[illustrative]`:** RM calls ~9,000 (~92% transcribed) · WhatsApp ~22,000 · service ~6,500 (~90%) · app/portal ~14,000 · email ~11,000.
**Voice-of-client:** NPS monthly telephonic — **Wealth ~85** (Senior-HNI ~83, Emerging-HNI ~80); 21 CSAT touchpoints; complaints ~140/mo; SCORES 2.0 ATR 21 days.
**Service promises:** baseline adherence ~88% kept `[illustrative]`.

---

## Comparison-basis data (conversation metrics; event-excluded)
Per cohort, trailing 8 same-periods, market-event-excluded:
- **Attrition-risk-language prevalence** — DENSE p05/p50/p95. *CH-07 illus:* p50 ≈ 1.2% of clients using exit/liquidity language.
- **Complaint-theme rate** — BURSTY median+IQR per `branch × theme`.
- **Suitability-language-present rate** — SPARSE; baseline ~99.3% present (missing ≈ 0–1 per 1,000 advised).
- **Service-promise adherence %** — baseline ~88% kept; overdue baseline low.
- **NPS/CSAT** — segment baselines (Wealth ~85); theme-prevalence baselines.

---

## Control / corroboration data
Peer-cohort controls (CH-01/CH-04/CH-07 same segment — distinguish market-wide tone from cohort-specific) · prior-cycle baselines · shared **market-event calendar** `[illustrative]` (a volatility week that lifts anxiety language across all cohorts; financial-year-end; tax season) so a tone spike can be ruled market-wide.

## Reference data
Regions/branches; channels (RM-direct/EWM/Digital/Service); **complaint theme taxonomy** `[illustrative]` (delayed reporting, fee/charges clarity, performance concern, mis-set expectation, service responsiveness, statement/access); risk-band scale (Conservative/Moderate/Aggressive — used only to *say* whether disclosure language was present, not to read holdings); SCORES 2.0 21-day ATR / SMART ODR; platforms referenced (Nuvama One, WhatsApp bot, grievance/SCORES registry).

## Consistency invariants
Complaint/NPS/promise totals tie out; a cohort's conversation numbers identical wherever shown; basis and current share units (% / counts); every id 9B references exists here; one shared event calendar; NPS figures consistent across screens. **No anomalies seeded here; no book/₹ figure anywhere.**

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" (never a "chargeback").
