# Where is customer trust breaking — and why?

**Screen:** Trust hub (`hub-trust`)  
**Persona:** Head of CX · Marketplace  
**Question this screen answers:** Where is customer trust breaking *right now* — and **why** (which failure, which stage, which owner)?  
**UI path:** `HubTrustScreen` → `TrustBreakdownIntelligence`  
**Time windows:** `24H` · `7D` · `30D` (header toggle)  
**Worked examples below use the live 7D baseline** unless noted.

---

## Document map (= UI scroll order)

| # | UI block | This doc |
| --- | --- | --- |
| **00** | Page headline | Scope of the question |
| **01** | Stage where trust got broken? | Lifecycle stage pie (S1–S9) |
| **02** | Why trust is breaking? | Cliff + Slope driver lanes + Event Breakdown |
| **03** | Evidence & explainability | AI verdict + channel quotes |

**Rule for every block / metric below:**

```
Definition
→ How it is useful (for Head of CX)
→ Why it happens (what drives the number up/down)
→ Formula
→ What each symbol means (1, 2, 3…)
→ Live example (how the value is derived)
→ Data required
→ What to do
```

### Formula symbol pattern (mandatory)

Whenever a formula appears, every symbol is defined immediately under it — same pattern as the Happiness doc.

---

## A. Locked definitions

| Term | Exact meaning on this screen |
| --- | --- |
| **Trust contact / complaint** | A customer contact tagged to a trust-break theme (damaged, refund, counterfeit, …) |
| **Trust driver** | Named failure theme with volume, severity, owner, and cliff/slope type |
| **Cliff** | Sudden / high-blast trust break — low volume can still lead severity |
| **Slope** | Chronic / building trust leak — usually higher volume, rising WoW |
| **Incident rate** | How often this failure occurs in the measured base (%) |
| **Blast radius** | How damaging each incident is to trust / brand (0–100 scale) |
| **Severity score** | `incidentRate × blastRadius` — **canonical rank key** |
| **Origination stage** | Lifecycle stage where the failure is *caused* (S1–S9) |
| **Manifestation / detection stage** | Where the customer *feels* / *reports* it |
| **Fix owner** | Desk that must act (Payments, Packaging, Seller Ops, …) |
| **Trust Index** | Period composite health of trust (pulse / hub card; target **80**) |
| **High-incidence cliff** | Cliff with `incidentRate ≥ 1.2` — not “rare” |

### One-universe rule

```
TRUST_TOTAL_COMPLAINTS = Σ_d complaints_d
TOP_TRUST_DRIVER       = argmax_d severityScore_d
```

Driver shares, top-breaker share, and evidence volumes must reconcile to the same complaint universe for the selected period (after range scaling).

### Period math

| Period | Window | Compare | Volume ×7D | Delta scale |
| --- | --- | --- | --- | --- |
| `24H` | Last 24h | vs prev day | **0.16** | × **0.42** |
| `7D` | This week | WoW | **1.00** | × **1.00** |
| `30D` | Last 30d | MoM | **3.70** | × **0.88** |

```
count_period = round(count_7D × f)
delta_period = round(delta_7D × delta_scale × 10) / 10
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `f` | `TRUST_RANGES[period].f` volume scale |
| 2 | `count_7D` | Baseline contact/complaint count |
| 3 | `count_period` | Scaled count for 24H / 7D / 30D |
| 4 | `delta_scale` | 0.42 / 1.00 / 0.88 for period deltas |

---

## B. Decision contract (Head of CX)

| Step | Look at | Decide |
| --- | --- | --- |
| 1 | **01** Hottest origination stage | Where the break is *caused* |
| 2 | **02** Top cliff by severity | What to war-room first |
| 3 | **02** Fastest-rising slope (WoW) | What is building under the cliffs |
| 4 | Event Breakdown (seller / segment / PIN / category) | Where to cut surgically |
| 5 | **03** Evidence + channel quotes | Proof for the owner meeting |
| 6 | Fix owner on the driver card | Who must act this window |

**Never:** rank action by complaint volume alone while a low-volume **cliff** leads severity (classic Counterfeit / ATO trap).

---

# 00 — Page headline

### Definition

Fluid headline for the Trust hub.

### UI

```
Where is customer trust breaking — and why?
```

### How it is useful

Locks the screen to **one business question**: location of the break + causal driver + owner — not a generic “trust score report.”

### Why it exists

Head of CX must choose **which failure to escalate today** and **which lifecycle stage owns the root**, not browse every complaint.

### Data required

None beyond navigation (`activeScreen = hub-trust`, `trustRange`).

### What to do

Confirm period (`24H` / `7D` / `30D`), then scroll **01 → 02 → 03**.

---

# 01 — Stage where trust got broken?

### What the UI shows

```
01 · Stage where trust got broken?
    TrustStageLifecyclePie — S1…S9 journey strip + stage detail
```

### Definition

Customer journey stages where trust failures **originate** (and latent stages that must stay visible even without a driver card).

### How it is useful

- Answers **where in the journey** the break is caused — before CX can recover.  
- Selects a stage → categories, pincode, top complaint, GMV, blast/incident, Next Action.  
- Prevents blaming last-mile when the root is listing / pack / payment.

### Why stages light up

Drivers carry `originationStage` (e.g. Counterfeit → S1 Listing). Stage contact load = attributed driver complaints (+ latent contacts for S3/S5/S7).

### Lifecycle stages (S1–S9)

| Stage | Label | Typical fix owner | Trust signal |
| --- | --- | --- | --- |
| **S1** | Listing & Catalogue | Category / Catalogue | Counterfeit, wrong SKU |
| **S2** | Checkout & Pricing | Pricing / Product | Hidden fees |
| **S3** | Payment Capture | Payments / Platform | Debit-without-order anxiety (latent) |
| **S4** | Pack & Fulfilment Centre | Supply Chain / Packaging | Damaged, missing item |
| **S5** | In-transit | Logistics | Delay anxiety (latent) |
| **S6** | Delivery | Last Mile | Never delivered manifestation |
| **S7** | Post-delivery use | CX / Product | Quality regret (latent) |
| **S8** | Returns | CX + Returns | Refund / return detection |
| **S9** | Refund / credit | CX + Payments | Refund not credited |

### Formula — stage contact attribution (conceptual)

```
contacts_stage = Σ_d complaints_d  where originationStage_d maps to stage
               + latentContacts_stage
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `contacts_stage` | Contacts attributed to that lifecycle stage on the pie |
| 2 | `complaints_d` | Trust complaints for driver `d` |
| 3 | `originationStage_d` | Stage where driver `d` is caused |
| 4 | `latentContacts_stage` | Extra watch-band volume (e.g. S3 payment anxiety) not yet a full driver card |

### Live example — 7D

- **Counterfeit** and **Wrong Item** originate at **S1** → S1 often reads as the highest-severity origination node.  
- **Damaged** originates **S4 Pack** → packaging owner, even if customer complains at delivery/returns.  
- **Refund Not Credited** detects at **S8/S9** with Payments owner.

### Data required

| Field | Role | Source | Grain | Latency |
| --- | --- | --- | --- | --- |
| `originationStage` | Stage attribution | Trust / FCI models | Contact | 5–15 min |
| `complaints_d` | Volume into stage | Tagged trust contacts | Driver | 5–15 min |
| Latent payment/transit clusters | S3/S5/S7 watch | Payments / logistics events | Stage | 5–15 min |
| Stage RAG inputs | Load / cliffs / wow | Aggregates | Stage×period | 5–15 min |

### What to do

Open the hottest stage → read **Next Action** → confirm owner → jump to matching cliff/slope in **02**.

---

# 02 — Why trust is breaking?

### What the UI shows

```
02 · Why trust is breaking?
    ┌─ Cliff events lane ─┐  ┌─ Slope events lane ─┐
    │ Driver card         │  │ Driver card         │
    │ Event Breakdown     │  │ Event Breakdown     │
    └─────────────────────┘  └─────────────────────┘
```

### Definition

Trust drivers split into **Cliff** (sudden / high blast) and **Slope** (chronic / rising), ranked by **severity**, with surgical cuts underneath.

### How it is useful

| Need | How §02 helps |
| --- | --- |
| What to war-room | Top cliff by `severityScore` |
| What is building | Fastest WoW slope |
| Who owns the fix | `fixOwner` on the card |
| Where to cut | Sellers, segment 2×2, PIN, category tiles |

### Why cliff vs slope

| Type | Meaning | CX posture |
| --- | --- | --- |
| **Cliff** | Rare-but-brutal or sudden reclassification | Escalate / war-room |
| **Slope** | Chronic leak, often high volume | Fix process / capacity |

---

## 02.0 Severity — the rank key

### Formula

```
severityScore_d = incidentRate_d × blastRadius_d
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `severityScore_d` | Canonical severity for driver `d` (sort key) |
| 2 | `incidentRate_d` | How often the failure occurs (% of measured base) |
| 3 | `blastRadius_d` | How damaging each incident is (0–100 trust blast) |
| 4 | `d` | Trust driver id (damaged, refund, counterfeit, …) |

**Sort**

```
ranked = sort descending by severityScore_d
TOP_TRUST_DRIVER = ranked[0]
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `TOP_TRUST_DRIVER` | Highest-severity driver this baseline |
| 2 | `ranked` | All drivers ordered worst → least |

**High-incidence cliff**

```
highIncidenceCliff_d = (cliffOrSlope_d === "cliff") AND (incidentRate_d ≥ SCATTER_IX)
SCATTER_IX = 1.2
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `highIncidenceCliff_d` | Cliff that is **not** “rare” |
| 2 | `SCATTER_IX` | Incident-rate threshold **1.2%** |
| 3 | `cliffOrSlope_d` | `"cliff"` or `"slope"` |

### Live example — 7D severity rank

| Rank | Driver `d` | Type | `incidentRate_d` | `blastRadius_d` | `severityScore_d` |
| --- | --- | --- | --- | --- | --- |
| 1 | Counterfeit Concern | cliff | 4.2 | 92 | **4.2 × 92 = 386.4** |
| 2 | Refund Not Credited | cliff | 3.8 | 78 | **3.8 × 78 = 296.4** |
| 3 | Damaged Product | slope | 3.1 | 55 | **3.1 × 55 = 170.5** |
| 4 | Wrong Item Received | slope | 2.0 | 42 | 84.0 |
| 5 | Never Delivered | slope | 0.9 | 86 | 77.4 |
| 6 | Hidden Platform Fee | slope | 1.1 | 48 | 52.8 |
| 7 | Item Missing in Order | cliff | 0.3 | 84 | 25.2 |
| 8 | Account Takeover | cliff | 0.06 | 96 | 5.76 |

**Worked line (Counterfeit):**

```
severityScore_counterfeit = 4.2 × 92 = 386.4
→ TOP_TRUST_DRIVER = Counterfeit Concern
→ Fix owner = Category / Seller Ops
```

**Insight:** Counterfeit has only **640** complaints vs Damaged **12,840**, but still ranks #1 on severity — volume alone would mis-prioritise.

### Live cliff count

```
cliffCount = count(d where cliffOrSlope_d === "cliff" AND wow_d > 0)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `cliffCount` | “Cliff events live” |
| 2 | `wow_d` | Week-over-week % change for driver `d` |

**7D:** four cliffs with `wow > 0` → `cliffCount = 4`.

---

## 02.1 Trust drivers catalogue (7D baseline)

| `d` | Label | Type | Complaints | WoW | Owner |
| --- | --- | --- | --- | --- | --- |
| `counterfeit` | Counterfeit Concern | cliff | 640 | +9% | Category / Seller Ops |
| `refund` | Refund Not Credited | cliff | 6,540 | +22% | CX + Payments |
| `damaged` | Damaged Product | slope | 12,840 | +18% | Supply Chain / Packaging |
| `wrong` | Wrong Item Received | slope | 8,120 | +11% | Marketplace / Catalogue |
| `never` | Never Delivered | slope | 3,180 | +14% | Last Mile |
| `hidden` | Hidden Platform Fee | slope | 4,210 | +31% | Pricing / Product |
| `missing` | Item Missing in Order | cliff | 1,120 | +8% | Supply Chain / Dark Store |
| `ato` | Account Takeover | cliff | 210 | +6% | Trust & Safety / Fraud |

```
TRUST_TOTAL_COMPLAINTS = Σ complaints_d = 36,860
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `TRUST_TOTAL_COMPLAINTS` | Sum of all driver complaints (7D) |
| 2 | `complaints_d` | Contacts tagged to driver `d` |

**Share of top breaker**

```
topBreakerShare_% = round(complaints_TOP / TRUST_TOTAL_COMPLAINTS × 100)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `topBreakerShare_%` | % of trust complaints on the #1 severity driver |
| 2 | `complaints_TOP` | Complaints for `TOP_TRUST_DRIVER` |

**Live:** `round(640 / 36860 × 100) = 2%` — low share, highest severity.

---

## 02.2 Driver card fields (what Head of CX reads)

| Field | Meaning | Useful because |
| --- | --- | --- |
| Label + cliff/slope | What broke / how it behaves | Posture (escalate vs process fix) |
| Complaints + WoW | Volume + momentum | Capacity vs urgency |
| Incident rate × blast | Severity ingredients | Explains rank |
| Stages (origin → detect) | Journey path | Don’t mis-blame last mile |
| Fix owner | Desk | Meeting invite |
| PnL metric / value | Commercial sting | Finance co-brief |
| CPU / repeat | Friction | Queue load |
| **How to Deal?** (3 points) | Immediate playbook | Act without another deck |

### Period scaling on volumes

```
complaints_period = round(complaints_7D × f)
wow_period        = scaleTrustDelta(wow_7D)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `complaints_period` | Driver volume in selected window |
| 2 | `f` | Range scale 0.16 / 1 / 3.7 |
| 3 | `wow_period` | Period-scaled % change |

---

## 02.3 Event Breakdown (cuts under the selected driver)

### Definition

Surgical slices that explain **where** the selected cliff/slope concentrates.

### How it is useful

Turns “Counterfeit is #1” into “**which sellers / categories / PINs / value segments**” to act on.

### Cut tiles (UI)

| Tile | Shows | Symbol pattern |
| --- | --- | --- |
| Flagged sellers | Seller name, category, share % | `share_seller_%` |
| Customer segment + seller type | Marketplace vs Flipkart-fulfilled; HVHF/HVLF/LVHF/LVLF | `share_segment_%` |
| By region · pincode | Ranked PIN share | `share_pin_%` |
| By category | Contacts, WoW, neg sentiment, share | `share_cat_%` |

### Formula — cut share

```
share_cut_% = complaints_cut / complaints_d × 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `share_cut_%` | % of this driver’s complaints in that cut row |
| 2 | `complaints_cut` | Complaints in seller / PIN / category / segment slice |
| 3 | `complaints_d` | All complaints for the selected driver |

### Live idea (Counterfeit)

Top sellers by `share_cut_%` → push to Category / Seller Ops with evidence pack; HVHF cell over-index → protect high-value frequent buyers first.

### Data required

| Field | Role | Source | Latency |
| --- | --- | --- | --- |
| Seller id / name | Flagged sellers | Seller graph | 15–60 min |
| Category | Category cut | Catalogue | 15–60 min |
| Pincode | Region cut | Address / logistics | 15–60 min |
| Value×frequency segment | HVHF…LVLF | RFM / value rules | Daily |
| Marketplace vs owned fulfilment | Split bar | Fulfilment flag | 15–60 min |
| Neg sentiment on cut | Heat | NLP | 5–15 min |

### What to do

On the top cliff: open Event Breakdown → pick top seller + PIN + category → assign `fixOwner` with the three **How to Deal?** points.

---

# 03 — Evidence & explainability

### What the UI shows

```
03 · Evidence & explainability
    AI summary (verdict + primary drivers + repeated language)
    By channel — Chat / Voice / Email / LinkedIn / X (quotes)
```

### Definition

Proof layer: derived verdict text + customer language by channel for the selected cliff/slope.

### How it is useful

- Gives Head of CX a **one-paragraph brief** that cannot claim “no cliff” while cliffs are live.  
- Channel quotes = evidence for the owner meeting.  
- Ties selected cliff/slope from §02 into language customers actually use.

### Why the verdict is derived (not hand-authored)

```
verdict = deriveTrustVerdict(drivers)
```

Uses:

1. Top driver by `severityScore`  
2. Fastest-rising driver by `wow`  
3. Live cliff list (`cliff && wow > 0`)  
4. Top driver’s `fixOwner`

### Live example — 7D verdict shape

```
Counterfeit Concern leads on severity (386 = 4.2% × blast 92).
Hidden Platform Fee is rising fastest (+31% WoW).
4 live cliff events — Refund Not Credited, Counterfeit Concern, Item Missing in Order, Account Takeover.
Push the top breaker to Category / Seller Ops.
```

| # | Symbol / clause | Meaning |
| --- | --- | --- |
| 1 | `386` | Rounded `severityScore_counterfeit` |
| 2 | `4.2% × blast 92` | Ingredients of severity |
| 3 | `+31% WoW` | Fastest `wow_d` (Hidden fees) |
| 4 | `4 live cliff events` | `cliffCount` |
| 5 | `Category / Seller Ops` | `fixOwner` of TOP driver |

### Channel evidence

```
For selected driver d and channel ch:
  show share_ch_%, complaints_ch, messages[1…5]
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `ch` | Chat / Voice / Email / LinkedIn / X |
| 2 | `share_ch_%` | % of driver `d` contacts on that channel |
| 3 | `complaints_ch` | Scaled contact count on that channel |
| 4 | `messages[1…5]` | Five customer quotes for explainability |

### Data required

| Field | Role | Source | Latency |
| --- | --- | --- | --- |
| Channel of contact | Tabs | CCaaS / social | 1–5 min |
| Transcript / message text | Quotes | Contact body | 5–15 min |
| Driver tag | Join to selected cliff/slope | Intent / FCI | 5–15 min |
| Period scale | Volume on tiles | `scaleTrustDriverCut` | With toggle |

### What to do

Copy verdict + top channel quotes into the owner brief; do not debate severity without opening the matching §02 card.

---

# Related: Trust pulse (hub / KPI strip)

> `TrustPulseKpiCards` exists in code and powers hub-card / pulse reads. It is **not mounted** on `HubTrustScreen` today — document it so Trust Index / target stay defined.

### Trust Index

```
gap = TRUST_TARGET − trustIndex
TRUST_TARGET = 80
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `trustIndex` | Period trust health 0–100 |
| 2 | `TRUST_TARGET` | Operating target **80** |
| 3 | `gap` | Points below/above target |

**7D live:** `trustIndex = 72`, `trustDelta = −4`, `gap = 8` (RAG **Elevated / high**).

### Customers impacted

```
customersImpacted ≈ TRUST_TOTAL_COMPLAINTS / weighted_repeat
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `customersImpacted` | Unique customers hit by trust contacts |
| 2 | `weighted_repeat` | Complaint-weighted average repeat factor |

**7D:** ~**17.7K** customers impacted · **36.9K** trust contacts.

### How pulse is useful

5-second health when used on overview/hub: Index vs 80, cliff count, top breaker share, outcome signals (sentiment / resolution / CSAT / repeat).

---

# C. Acceptance (pass/fail)

| Check | Pass |
| --- | --- |
| Severity rank | `severityScore = incidentRate × blastRadius`; Counterfeit **386.4** leads 7D |
| Volume ≠ priority | Low-complaint cliffs can outrank high-volume slopes |
| Cliffs live | `cliffCount` matches cliffs with `wow > 0` |
| Stage honesty | Origination stage matches driver (e.g. Counterfeit → S1) |
| Period scale | Counts use `f`; deltas use delta scale |
| Evidence | Verdict names TOP driver + owner; channel quotes exist for selected driver |
| Spine | Stage → Driver → Cut → Owner → Action |

---

# D. Code map

| UI | Code |
| --- | --- |
| 00 Headline | `HubTrustScreen.tsx`, `HubFluidHeadline` (`variant="trust"`) |
| 01–03 | `TrustBreakdownIntelligence.tsx` |
| Stage pie | `TrustStageLifecyclePie.tsx` |
| Drivers / cuts / pulse / ranges | `cxHeadRetailV3TrustBreakdownData.ts` |
| Period toggle | `Header.tsx` + `NavigationContext.trustRange` |
| Hub card copy | `cxHeadRetailV3HubCards.ts` (`id: "trust"`) |
| Pulse KPI strip (unused on screen) | `TrustPulseKpiCards.tsx` |
| Lifecycle matrix (unused on screen) | `TrustLifecycleMatrix.tsx` |

---

# E. End-to-end loop (mirrors UI scroll)

```
00  Confirm question + period
01  Hottest origination stage (where caused)
02  Top cliff by severity + rising slope + Event Breakdown cuts
03  Verdict + channel quotes → assign fixOwner + SLA
```

### Hard rejects

- Acting on complaint volume while ignoring `severityScore`  
- Blaming delivery when `originationStage` is S1/S4  
- Claiming “no cliff breach” while `cliffCount > 0`  
- Owner meeting without seller/PIN/category cut + quote evidence  

---

*Living reflection of the Trust hub UI. When drivers, stages, or mounting of pulse/matrix change, update the matching `0X` section — keep symbol tables with every formula.*
