# Stage 9A — Mock Data Universe — LiSN (Retail/E-commerce CX)

> **Phase 4, stage 1 of 2.** Input: Stage 5 data model + Stage 8 data shapes + run-config. The static business-as-usual world the prototype runs on, sized shallow-but-vivid for a sales demo, with the **comparison basis the methodology scores against** (per-cell auto-adaptive baselines, sale-excluded). Units (the anomalies) are seeded in 9B, not here. All invented figures `[illustrative]`. Brand: LiSN · India primary.

---

## 1. Entity instances (counts + stable IDs + India-correct labels)

**Dark-stores (q-commerce nodes) — 8 instances** `[illustrative]`
| id | label | city / cluster |
|---|---|---|
| DS-BLR-D07 | Koramangala D07 | Bengaluru |
| DS-BLR-D12 | Indiranagar D12 | Bengaluru |
| DS-BLR-D19 | HSR Layout D19 | Bengaluru |
| DS-HYD-D04 | Gachibowli D04 | Hyderabad |
| DS-HYD-D08 | Kondapur D08 | Hyderabad |
| DS-DEL-D02 | Saket D02 | Delhi NCR |
| DS-DEL-D11 | Gurugram D11 | Delhi NCR |
| DS-MUM-D05 | Powai D05 | Mumbai |

**Sellers — 6 instances** `[illustrative]`: SLR-AUDIOMAX (electronics/earbuds), SLR-FRESHFARM (perishables), SLR-KITCHENLY (home), SLR-DERMACO (personal care), SLR-NOVAWEAR (fashion), SLR-MEDIPLUS (pharmacy).

**Categories — 7:** Grocery & Perishables, Electronics/Audio, Home & Kitchen, Personal Care, Fashion, Pharmacy/OTC, Payments (cross-cut).

**Channels — 6:** in-app chat, care call, email, app-store review, marketplace review, social (X/Instagram).

**App-versions — 3:** v8.3.0 (baseline), v8.4.0, **v8.4.1** (recent release — the regression anchor for T2-16/T2-17).

**Intents (for FCR/repeat) — 8:** delivery-delay, missing-item, wrong-substitute, refund-status, payment-deducted, product-quality, app-issue, cancellation.

**ID schemes:** `INT-#####` interactions · `ORD-#######` orders · `SIG-T2-##-###` signals · `GRV-####` grievances · `DS-/SLR-` entities. 9B attaches units to these exact IDs.

---

## 2. Comparison-basis data (the per-cell auto-adaptive baseline — the heart of 9A)

Per the methodology: classify each `(entity × theme × grain)` cell DENSE/BURSTY/SPARSE, **sale-excluded**, from the last 8 valid same-weekday windows. Illustrative basis values:

| Cell | Behaviour | Baseline (sale-excluded) `[illustrative]` |
|---|---|---|
| Dark-store × "missing/spoiled" × day | BURSTY | median 0.9 complaints/1k orders, IQR 0.4–1.5; peer band p50≈1.0 |
| Dark-store × "perishable/expiry" × day | SPARSE | Poisson rate ~0.3/1k orders; any node-concentrated cluster is rare/meaningful |
| Seller × "authenticity/defect" × day | BURSTY | AUDIOMAX neg-review velocity p50 ≈ 3/day, IQR 1–6 |
| Category × "refund-delay" × week | DENSE | p05/p50/p95 = 1.1% / 2.0% / 3.4% of refund contacts |
| Intent "refund-status" × repeat-rate × week | DENSE | p50 repeat-contact 22%, p95 31% |
| Channel × theme × hour (for radar) | DENSE+BURSTY | per-channel min-support floors set so a single-channel blip does not clear the gate |
| Grievance × statutory-clock | SPARSE/event | normal: <2% of grievances within 6h of a deadline |
| Contact-per-order × category × week | DENSE | Electronics p50 ≈ 14 contacts/1k orders (the T2-20 normaliser) |
| Bot containment × intent × day | DENSE | p50 containment 71%, p05 64% (a drop below p05 is the T2-14 trigger) |

**Sale calendar (excluded):** a "Big Saving Days" event spanning two recent days is held in the calendar and **excluded** from every baseline above (so a festival surge cannot read as a failure, and post-sale alerting is not blinded).

---

## 3. Control / corroboration data

- **Peer-store control (T2-2/T2-3):** the other 7 dark-stores hold flat in the same window, so D07's break is provably local, not city-wide.
- **Cross-channel corroboration (T2-1):** the "UPI checkout failure" theme is present in app-store reviews **and** care chat **and** social — three independent channels, clearing the corroboration gate; a decoy "slow delivery" theme appears in only one channel (correctly suppressed).
- **Release-event control (T2-16/T2-17):** v8.4.1 shipped 2 days before the payment-failure cluster; v8.3.0/v8.4.0 windows are clean (the version-correlation discriminator).
- **Order-normalised control (T2-20):** Electronics order volume is **flat-to-up** while ticket volume fell — so the drop is not explained by fewer orders; a support-entry-point change event is logged the same week.
- **Integrity control (T2-5):** AUDIOMAX's negative cluster has organic account/timing spread (not brigading), distinguishing it from a coordinated attack (T2-7 clears it).

---

## 4. Reference data (lookups; India-grounded where possible)

- **Statutory clocks:** CP E-Commerce Rules 2020 (48h acknowledgement, one-month redressal); DPDP Rules 2025 (90-day erasure, Rule 14; 72h breach notice, Rule 7).
- **Named instruments (fact-pattern library):** CCPA Dark Patterns 2023 (13 patterns — drip pricing, basket sneaking, etc.); Legal Metrology (Packaged Commodities) Rules 2011; FSSAI shelf-life/hygiene; BIS IS 19000:2022.
- **Verified live anchors (regulator-facing cards only):** Zepto ₹7 lakh (CCPA order 4 Dec 2025 — drip pricing + basket sneaking; under NCDRC stay since 20 Jan 2026); PhysicsWallah ₹5 lakh (pre-ticked ₹10 box); DPDP ceiling ₹250 crore/violation; NCH e-commerce refund grievances 8,919 / ₹3.69 crore (25 Apr–30 Jun 2025); Zepto Dharavi FSSAI licence suspension (June 2025).
- **Reason codes:** missing-item, spoiled/expired, wrong-substitute, not-as-described, MRP-mismatch, refund-delay, payment-deducted-not-confirmed.

---

## 5. Consistency invariants (the tie-out rules Cursor must preserve)

1. Every ID referenced by 9B exists here (DS-/SLR-/SIG-/GRV-).
2. A cohort's numbers are **identical wherever shown** — D07's "6× baseline" reads the same on the S1 tile, the S2 map, and the MB1 bridge.
3. The basis and current values share units (complaints-per-1k-orders throughout; never raw counts beside normalised ones).
4. Every Tier-3 bridge number ties to its Tier-2 signal's cohort (MB1's GMV-at-risk is the dollarised twin of T2-2's complaint-adjusted cohort).
5. Sale-excluded baselines stay sale-excluded everywhere; the sale calendar is the single source.
6. The audit log only grows on approve; nothing is auto-sent.

**Feeds:** Stage 9B (the basis the units deviate from), Stage 10 (the embedded universe).
