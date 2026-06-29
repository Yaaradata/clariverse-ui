# Stage 9A Mock-Data Universe — LiSN (Retail / e-commerce)

> Phase 4, stage 1 of 2. Inputs: Stage 5 data model + Stage 8 data shape + run-config. This is the static **business-as-usual world** the prototype runs on and the **comparison basis** the method scores against — built once, consistently, sized shallow-but-vivid (sales-demo). The surfaced units (the deviations) are seeded in **9B, not here**. All invented figures marked `[illustrative]`; brand rules applied. The universe leads the **Fashion** wedge with a **quick-commerce grocery** slice for breadth.

---

## 1. Entity instances (stable IDs; 9B attaches units to these)

**Categories**
| ID | Category | Role |
|---|---|---|
| `CAT-FAS-SHIRT` | Fashion — Men's shirts/apparel | the wedge category (T2-02, T2-12) |
| `CAT-FAS-FOOT` | Fashion — Footwear | promo-quality (T2-19) |
| `CAT-QC-GRO` | Quick-commerce — grocery staples | hidden-demand / stockout (T2-17) |
| `CAT-FEST-AUD` | Electronics — audio (festival) | festival real-vs-failure (T2-28) |

**SKUs** `[illustrative names]`
| ID | SKU | Category | Seller | BAU note |
|---|---|---|---|---|
| `SKU-AURA-SHIRT` | "Aura" slim-fit shirt run | CAT-FAS-SHIRT | SELL-TF | the T2-02 hero (fixable sizing) |
| `SKU-NOVA-KURTA` | "Nova" printed kurta | CAT-FAS-SHIRT | SELL-TF | the T2-12 aspect-cliff hero (colour/shade) |
| `SKU-STRIDE-SHOE` | "Stride" running shoe | CAT-FAS-FOOT | SELL-QS | the T2-19 promo do-not-promote |
| `SKU-DENIM-CLASSIC` | "Classic" denim | CAT-FAS-SHIRT | SELL-FW | **control SKU** (returns within band) |
| `SKU-QC-ATTA` | 5 kg atta | CAT-QC-GRO | platform-fulfilled | the T2-17 hidden-demand staple |
| `SKU-FEST-BUDS` | "Pulse" wireless earbuds | CAT-FEST-AUD | SELL-QS | the T2-28 festival hero (3× spike) |
| `SKU-FEST-TEE` | festival graphic tee | CAT-FAS-SHIRT | SELL-FW | **the suppressed near-miss** (4×, real demand) |

**Sellers**
| ID | Seller | Tier | GMV concentration (vs FDI 25% cap) | BAU note |
|---|---|---|---|---|
| `SELL-TF` | TrendFab | mid | 11% | fixable-sizing seller (T2-02) |
| `SELL-QS` | QuickStyle | large | **23%** (near the cap) | top-of-board (T2-07); promo shoe + festival buds |
| `SELL-FW` | FootWorld | mid | 7% | **control seller** (healthy) |

**Lanes / pin-code clusters**
| ID | Lane | BAU RTO band (p50 / p95) | BAU note |
|---|---|---|---|
| `LANE-DEL-NCR-O` | Delhi-NCR outer cluster | 18% / 21% | the T2-26 arbitration lane |
| `LANE-BLR-C` | Bengaluru central | 17% / 19% | **control lane** (within band) |
| `LANE-T2-IND` | a tier-2 cluster (Indore-class) | sparse | **advisory / hierarchy-fallback** case |

**Dark-stores (quick-commerce):** `DS-HYD-01`, `DS-BLR-03`. **Promos/campaigns:** `PROMO-FEST` (Big-Billion-class sale window), `PROMO-SHOE-PUSH` (the spend scaling on SKU-STRIDE-SHOE). **Cohort buckets:** `COH-<category>-<lane>-<weektype>` (e.g. `COH-FAS-DELNCR-NORMAL`).

**Reason codes** (returns): `RC-SIZE` size/fit · `RC-QUAL` quality/defective · `RC-NAD` not-as-described · `RC-DMG` damaged-in-transit · `RC-WRONG` wrong-item-shipped · `RC-DELAY` delivery-delay · `RC-REMORSE` no-longer-needed/buyer-remorse.

---

## 2. Comparison-basis data (the BAU "normal" each Stage-5 unit scores against)

Per the methodology (sale-excluded 8-same-weekday window; category-relative bands; sale-scaled inside a sale window). Grain `cohort × category × SKU × seller × lane × week-type`. These are the **basis** values; 9B plants the deviations.

| Unit | Behaviour | BAU basis (what "normal" looks like) | Min-sample gate |
|---|---|---|---|
| **T2-02 / T2-05** return rate `SKU-AURA-SHIRT` | DENSE | return band p50 **20%**, p95 **22%** (category-relative); fault-mix BAU ~60% `RC-REMORSE`, rest spread | ≥ 40 returns/wk on the cell |
| **T2-12** aspect share `SKU-NOVA-KURTA` | DENSE + change-point | "colour/shade" negative-mention share trailing mix **6%**, band to **9%**; star average steady **4.0★** | ≥ N recent aspect-bearing reviews |
| **T2-19** promo composite `SKU-STRIDE-SHOE` | DENSE gate | return band **18%**; sentiment slope flat; availability normal; seller health OK; ROAS **4.2** | each input's own gate |
| **T2-26** lane RTO `LANE-DEL-NCR-O` | DENSE + voice | RTO band p50 **18%**, p95 **21%**; lane voice-theme BAU mostly product-theme/neutral | lane cohort gate |
| **T2-28** festival spike `SKU-FEST-BUDS` | sale-scaled DENSE + SPARSE failure-voice | normal order-rate baseline × **sale multiplier** (buffered p05×mult×0.8 / p95×mult×1.2); failure-voice baseline ≈ 0 | festival-scale gate |
| **T2-15** defect wave (a model) | BURSTY | return-initiation baseline calm; care defect-theme baseline ≈ 0 | real-time tier gate |
| **T2-17** hidden demand `SKU-QC-ATTA` | DENSE availability + BURSTY switching-voice | availability/fill normal; switching-intent voice baseline ≈ 0 | dark-store cohort gate |

---

## 3. Control / corroboration data (so each drill can rule out causes)

- **Control SKU `SKU-DENIM-CLASSIC`** — returns **21%** (within its 22% band), fault-mix normal → proves the Aura spike is SKU-specific, not a category-wide fashion lift.
- **Control lane `LANE-BLR-C`** — RTO **19%** (within band), neutral voice → proves the Delhi-NCR breach is lane-specific, not a network-wide logistics event.
- **Control seller `SELL-FW`** — SLA/ODR healthy, no complaint clusters → anchors the seller board so QuickStyle's rank is relative, not absolute.
- **The non-failure sale spike `SKU-FEST-TEE`** — a 4× sale-window spike with **no** failure voice → corroborates that the festival detector fires on *failure*, not on volume (this is also the 9B suppressed near-miss).
- **Prior-cycle / matched-cohort series** — trailing 8 same-weekday points per cell (sale-excluded) so each band is defensible; the prior sale's multiplier for SKU-FEST-BUDS so the festival baseline scales from real history.

---

## 4. Reference data (lookups screens need; grounded in the domain anchors)

- **Reason-code list** (above), **categories**, **lanes/geographies**, **seller tiers**.
- **FDI single-vendor concentration cap = 25%** (Press Note 2 of 2018) — the band the seller board checks.
- **Regulatory anchors** for the conduct sub-flag (Tile-3): Dark Patterns Guidelines 2023; Consumer Protection (E-Commerce) Rules 2020; DPDP Act 2023 + Rules 2025; Legal Metrology (Packaged Commodities) Rules; GST TCS s.52 / GSTR-8 (net-of-returns). `[reconcile flags from RunConfig carried — DPDP Rules date; return-rate band; 2021 E-Com amendment status]`.
- All rupee magnitudes in §2/§3 and in 9B are `[illustrative]`.

---

## 5. Consistency invariants (the tie-out rules the build must preserve)

1. **Every ID referenced by 9B exists here** (SKUs, sellers, lanes, cohorts, reason codes).
2. **A cohort's numbers are identical wherever shown** — `SKU-AURA-SHIRT` return rate is **31%** on the S1 rail, the S2 hero card, and the S2 stats box; one source of truth in `AppState.signals`.
3. **Basis and current share units** — return rate in %, contribution in ₹, RTO in %; a band and its current value are always the same unit.
4. **Arithmetic ties** — recoverable margin = fixable-share × excess-returns × order-contribution (so ₹6.0L on T2-02 is reconstructable from the parts shown).
5. **Margin vs top-line are not double-counted** — the S1 "**contribution down ₹18L this week**" `[illustrative]` aggregates the **margin-side** items (T2-02 recoverable ₹6.0L + T2-19 redirectable ₹3.4L + T2-26 lane contribution-at-risk ₹4.2L + residual); the seller board's "**₹52L GMV at risk**" is **top-line exposure**, shown as a distinct figure, never added into the contribution gap.
6. **Controls stay within band** — `SKU-DENIM-CLASSIC`, `LANE-BLR-C`, `SELL-FW` never surface, so the demo is not all-red.

---
*Feeds: Stage 9B (the basis the units deviate from), Stage 10 (the embedded universe). Brand rules applied.*
