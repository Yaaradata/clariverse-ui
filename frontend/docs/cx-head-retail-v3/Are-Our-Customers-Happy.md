# Are our customers happy?

**Screen:** Customer Happiness hub  
**Persona:** Head of CX · Marketplace  
**Question this screen answers:** Are customers happy *right now* — and **where is unhappiness costing ₹**?  
**UI path:** `HubCustomerHappinessScreen` → `CustomerHappinessDashboard`  
**Time windows:** `24H` · `7D` · `30D` (header toggle)  
**Worked examples below use the live 7D baseline** unless noted.

---

## Document map (= UI scroll order)

| # | UI block | This doc |
| --- | --- | --- |
| **00** | Page title + interaction count | Scope of the read |
| **01** | Four headline KPI cards | 5-second health |
| **02** | Segment table + AI Summary Wall | Money + cohort detail |
| **03** | RFM heat + sentiment | Value × behaviour |
| **04** | What’s Failing to the Customer | Root-cause evidence |

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

Whenever a formula appears, every symbol is defined immediately under it:

```
share_s_% = interactions_s / Σ interactions × 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `share_s_%` | … |
| 2 | `interactions_s` | … |
| 3 | `Σ interactions` | … |

---

## A. Locked definitions

| Term | Exact meaning on this screen |
| --- | --- |
| **Interaction / contact** | One customer contact event (voice, chat, email, in-app, social ticket) in the selected window |
| **Segment** | Lifecycle cohort at contact time: Active, Loyal, Occasional, Seasonal, Frequent, Dormant, Reactivated |
| **Share %** | Segment contacts ÷ all segment contacts × 100 |
| **CSAT** | % of scored post-contact surveys marked satisfied |
| **FCR** | % of contacts resolved on first touch (no reopen in defined window) |
| **CPU** | Contacts ÷ fulfilled **units** (not orders) |
| **AOV / ATV** | Average order / transaction value (stored ₹; table uses scaled display) |
| **LTV (`ltv_s`)** | Lifetime-value **score** 0–100 on the segment table — **not** used in Rev at risk |
| **GMV exposed** | Segment GMV at stake, **₹ Cr** |
| **Churn %** | Segment attrition rate in the window |
| **Rev at risk** | `GMV (₹ Cr) × churn %` — **money rank key** (does **not** use LTV) |
| **RFM Avg CLV** | Mean customer CLV in ₹ for an RFM cell — different metric (§03) |
| **Happiness Index** | Weighted 0–100 of delivery, returns, support, product, sentiment |
| **NPS** | %Promoters − %Detractors |
| **Loyalty Index** | Retention / RFM-protect composite 0–100 |
| **Repeat Purchase Rate** | % of buyers with ≥ 2 orders in window |
| **RFM cell** | Recency × Frequency bucket (Top, Strong, Growing, …) |
| **Failure cluster** | Failure theme with volume + affected customers |

### One-universe rule

```
interactionsN = Σ_s interactions_s = share denominator = AI wall contact volumes
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `interactionsN` | Headline contact count shown on the page |
| 2 | `interactions_s` | Contact count for one lifecycle segment `s` |
| 3 | `Σ_s` | Sum across all seven segments on this page |
| 4 | `s` | Segment key (active, loyal, occasional, …) |

### Period math

| Period | Window | Compare | Volume ×7D | Delta ×7D |
| --- | --- | --- | --- | --- |
| `24H` | Last 24h | vs prev day | 0.16 | 0.42 |
| `7D` | This week | WoW | 1.00 | 1.00 |
| `30D` | Last 30d | MoM | 3.70 | 0.88 |

```
count_period  = round(count_7D × volume_scale)
gmv_Cr_period = scaleCr(gmv_7D × volume_scale)
delta_period  = round(delta_7D × delta_scale × 10) / 10
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `count_period` | Any volume metric (contacts, cluster count, …) in the selected period |
| 2 | `count_7D` | Same metric on the 7D baseline |
| 3 | `volume_scale` | Period multiplier: 0.16 / 1.00 / 3.70 |
| 4 | `gmv_Cr_period` | GMV in ₹ Cr after period scaling |
| 5 | `gmv_7D` | GMV in ₹ Cr on the 7D baseline |
| 6 | `scaleCr(...)` | Rounding helper: finer decimals when value &lt; 1 Cr |
| 7 | `delta_period` | Period-over-period % or pt change shown in UI |
| 8 | `delta_7D` | Baseline WoW-style delta before period scaling |
| 9 | `delta_scale` | Period delta multiplier: 0.42 / 1.00 / 0.88 |
| 10 | `round(...×10)/10` | Round to 1 decimal place |

---

## B. Decision contract (Head of CX)

| Step | Look at | Decide |
| --- | --- | --- |
| 1 | **01** Happiness vs target | Healthy this window? |
| 2 | Farthest KPI from target + **pill** | Which cohort to open |
| 3 | **02** Top **Rev at risk** | Where ₹ is exposed |
| 4 | CPU / FCR / CSAT / LTV on those rows | Friction + cohort quality |
| 5 | **02** AI wall | Confirm narrative = numbers |
| 6 | **03** Top / Strong / Priority | High-value behaviour at risk? |
| 7 | **04** Failure cluster | What broke; who owns fix |

**Never:** act on high churn % alone when Rev at risk is small (Dormant trap).

---

# 00 — Page headline

### Definition

Total contacts in the selected period across the seven lifecycle segments on this page.

### How it is useful

- Sets the **scope** of every % and money figure below.  
- Lets Head of CX say: “We’re reading **62.1K** contacts this week.”  
- Catches data bugs: if headline ≠ sum of table contacts, stop trusting the screen.

### Why it happens (why the count moves)

| Up | Down |
| --- | --- |
| Sale / festival load | Quieter demand window |
| ETA / refund failures → repeat contacts | Better first-pass resolve |
| Broader channel intake | Filter / routing changes |

### Formula

```
interactionsN(period) = Σ_s interactions_s(period)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `interactionsN(period)` | Headline number for the selected window (24H / 7D / 30D) |
| 2 | `period` | Active header toggle: `24H`, `7D`, or `30D` |
| 3 | `Σ_s` | Sum over every lifecycle segment on the table |
| 4 | `interactions_s(period)` | Contact count for segment `s` in that same window |
| 5 | `s` | One of: active, occasional, loyal, seasonal, frequent, dormant, reactivated |

### Live example — 7D

| Segment | `interactions_s` |
| --- | --- |
| Active | 22,571 |
| Occasional | 11,285 |
| Loyal | 9,673 |
| Frequent | 7,840 |
| Seasonal | 4,837 |
| Dormant | 3,210 |
| Reactivated | 2,687 |
| **`interactionsN` = Σ** | **62,103 → UI “62.1K”** |

```
interactionsN_24H = round(62103 × 0.16) = 9937 → “9.9K”
interactionsN_30D = round(62103 × 3.7)  = 229782 → “230K”
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `62103` | 7D `interactionsN` |
| 2 | `0.16` / `3.7` | `volume_scale` for 24H / 30D |
| 3 | `round(...)` | Nearest integer contact count |

### Data required

| Field | Definition | Source | Grain | Latency |
| --- | --- | --- | --- | --- |
| `contact_id` | Unique contact | CCaaS / chat / email / app / social | Contact | 1–5 min |
| `customer_id` | Resolved shopper | Identity graph | Contact→Customer | 1–5 min |
| `segment_key` | Lifecycle at contact (= `s`) | CDP / CRM | Customer×day | ≤ 60 min |
| `contact_ts` | Event time (IST) | Same feed | Contact | 1–5 min |

### What to do

Confirm period toggle, then trust only numbers that reconcile to this headline.

---

# 01 — Headline KPI cards

### What the UI shows

| # | Card | Unit | Target | Pill |
| --- | --- | --- | --- | --- |
| 01.1 | Happiness Index | /100 | 70 | Active |
| 01.2 | NPS | points | 50 | Occasional |
| 01.3 | Loyalty Index | /100 | 70 | Loyal |
| 01.4 | Repeat Purchase Rate | % | 40 | Frequent |

### Shared card formulas

```
delta = value_now − value_prior
gap   = target − value_now
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `delta` | Period change shown on the card (vs prev day / WoW / MoM) |
| 2 | `value_now` | KPI value in the selected period |
| 3 | `value_prior` | Same KPI in the comparison window |
| 4 | `gap` | Distance from operating target (UI “↓ Target” / “↑ Target”) |
| 5 | `target` | OKR target for that KPI (70 / 50 / 70 / 40) |

---

## 01.1 Happiness Index Score

### Definition

Period composite of five CX drivers (not one survey score).

### How it is useful

- **5-second answer** to “are we happy?”  
- Gap vs 70 = distance from operating target.  
- Pill **Active** = which cohort to open in §02 when the index dips.

### Why it happens

| Driver pressure | Typical cause | Index effect |
| --- | --- | --- |
| Delivery (w=28) | ETA miss, late hub | Large drag |
| Returns & refunds (w=22) | Pickup→credit silence | Large drag |
| Support (w=20) | Soft FCR / reopen | Medium drag |
| Product (w=18) | Defect / quality intents | Medium drag |
| Sentiment (w=12) | Angry transcript mix | Smaller but visible |

### Formula

```
HappinessIndex = Σ_i (w_i × score_i) / 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `HappinessIndex` | Card value 0–100 shown as `/100` |
| 2 | `Σ_i` | Sum across the five drivers |
| 3 | `i` | Driver index: Delivery, Returns, Support, Product, Sentiment |
| 4 | `w_i` | Weight of driver `i` (must satisfy `Σ w_i = 100`) |
| 5 | `score_i` | Period score of driver `i` on 0–100 scale |
| 6 | `/ 100` | Converts weighted sum of (weight×score) into a 0–100 index |

**Fixed weights on this screen**

| `i` (driver) | `w_i` |
| --- | --- |
| Delivery experience | 28 |
| Returns & refunds | 22 |
| Support resolution | 20 |
| Product satisfaction | 18 |
| Overall sentiment | 12 |

### Live example — 7D (UI shows **68**)

| Driver `i` | `w_i` | `score_i` | `w_i × score_i` |
| --- | --- | --- | --- |
| Delivery | 28 | 71 | 1,988 |
| Returns & refunds | 22 | 54 | 1,188 |
| Support | 20 | 72 | 1,440 |
| Product | 18 | 80 | 1,440 |
| Sentiment | 12 | 63 | 756 |
| **Σ** | **100** | | **6,812** |

```
HappinessIndex = 6812 / 100 = 68.12 → UI 68
delta = 68 − 66 = +2
gap   = 70 − 68 = 2   → “2 ↓ Target”
```

| # | Symbol | Meaning in this example |
| --- | --- | --- |
| 1 | `6812` | `Σ (w_i × score_i)` |
| 2 | `68` | Rounded Happiness Index on the card |
| 3 | `66` | Prior-window index (`value_prior`) |
| 4 | `70` | `target` |
| 5 | `gap = 2` | Points below target |

**Why 68 not 70?** Returns `score_i = 54` with `w_i = 22` is the main drag.

### Data required

| Input | Feeds | Source | Latency |
| --- | --- | --- | --- |
| ETA miss / promise vs actual | `score_Delivery` | Logistics + tagged contacts | 5–15 min |
| Pickup→credit lag | `score_Returns` | Returns OMS + payments | 5–15 min |
| FCR / reopen | `score_Support` | CCaaS QM | 5–15 min |
| Product defect intents | `score_Product` | FCI / intent | 5–15 min |
| NLP sentiment | `score_Sentiment` | Transcript NLP | 5–15 min |
| Target 70 | `target` | OKR store | Daily |

### What to do

If index &lt; target → open **Active** in §02; confirm refund/ETA in §04.

---

## 01.2 Net Promoter Score

### Definition

Advocacy after interaction: promoters minus detractors.

### How it is useful

- Separates “satisfied enough” (CSAT) from “will recommend.”  
- Pill **Occasional** = where advocacy dies first when refunds stall.

### Why it happens

| NPS falls when… | Mechanism |
| --- | --- |
| Refund status silent after pickup | More detractors (0–6) |
| Repeat contacts without resolve | Promoters → passives/detractors |
| Occasional next-order window missed | Survey lands in anger |

### Formula

```
S            = { responses in period with valid score 0…10 }
%Promoters   = count(score ≥ 9) / |S| × 100
%Detractors  = count(score ≤ 6) / |S| × 100
NPS          = %Promoters − %Detractors
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `S` | Set of valid NPS responses in the selected period |
| 2 | `score` | One customer’s NPS answer on the 0–10 scale |
| 3 | `count(score ≥ 9)` | Number of promoters in `S` |
| 4 | `count(score ≤ 6)` | Number of detractors in `S` |
| 5 | `|S|` | Total valid responses (size of set `S`) |
| 6 | `%Promoters` | Promoter share of `S` as a percent |
| 7 | `%Detractors` | Detractor share of `S` as a percent |
| 8 | `NPS` | Card value (= promoters% − detractors%) |

*(Passives = scores 7–8; they are in `|S|` but do not appear in the NPS subtraction.)*

### Live example — 7D (UI shows **46**)

Assume `|S| = 10,000`:

| Bucket | `score` range | Count | % of `S` |
| --- | --- | --- | --- |
| Promoters | ≥ 9 | 5,200 | 52% |
| Passives | 7–8 | 4,200 | 42% |
| Detractors | ≤ 6 | 600 | 6% |

```
NPS = 52 − 6 = 46
delta = +3
gap   = 50 − 46 = 4
```

| # | Symbol | Meaning in this example |
| --- | --- | --- |
| 1 | `52` | `%Promoters` |
| 2 | `6` | `%Detractors` |
| 3 | `46` | `NPS` on the card |
| 4 | `50` | `target` |
| 5 | `4` | `gap` below target |

### Data required

| Input | Role | Source | Latency |
| --- | --- | --- | --- |
| `score` 0–10 | Builds `S` buckets | Survey | 15–60 min |
| `response_ts` | Defines period membership in `S` | Survey | 15–60 min |
| `customer_id` → segment | Pill story | CRM | 15–60 min |
| Target 50 | `target` | OKR | Daily |

### What to do

NPS soft → open **Occasional**; check refund cluster in §04.

---

## 01.3 Customer Loyalty Index

### Definition

Will high-value behaviour hold? Retention + RFM protect health − rescue pressure.

### How it is useful

- Protects **₹ concentration** (Top/Strong/Loyal), not just volume.  
- Pill **Loyal** = white-glove desk.

### Why it happens

| Index down | Cause |
| --- | --- |
| Retention dip | Lapse / cancel up |
| Top/Strong health down | Return friction on advocates |
| Priority/Risk pressure up | Best buyers going quiet |

### Formula

```
LoyaltyIndex = clip_0_100(
    α × Retention_%
  + β × Health(Top ∪ Strong)
  − γ × Pressure(Priority ∪ Risk)
)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `LoyaltyIndex` | Card value 0–100 |
| 2 | `clip_0_100(...)` | Force result into range 0…100 |
| 3 | `α` | Weight on retention term (CX Analytics published) |
| 4 | `Retention_%` | % of relevant base still retained / active in window |
| 5 | `β` | Weight on protect-cell health |
| 6 | `Health(Top ∪ Strong)` | 0–100 health of RFM protect cells combined |
| 7 | `Top ∪ Strong` | Union of RFM Top and Strong customers |
| 8 | `γ` | Weight on rescue-cell pressure |
| 9 | `Pressure(Priority ∪ Risk)` | 0–100 pressure from RFM Priority and Risk cells |
| 10 | `Priority ∪ Risk` | Union of RFM Priority and Risk customers |

### Live example — 7D (UI shows **71**)

Illustrative weights `α=0.45`, `β=0.35`, `γ=0.20`:

| Term | Raw | Weighted |
| --- | --- | --- |
| `Retention_%` | 91 | 0.45 × 91 = 40.95 |
| `Health(Top ∪ Strong)` | 82 | 0.35 × 82 = 28.70 |
| `Pressure(Priority ∪ Risk)` | 38 | −0.20 × 38 = −7.60 |
| Raw sum | | 62.05 → calibrated to UI **71** |

> Production must publish the calibration curve from raw sum → displayed `LoyaltyIndex`.

### Data required

`Retention_%`, RFM cell membership + rev share (for Health/Pressure), cancel/lapse outcomes, `target = 70`.

### What to do

Loyalty soft or Loyal CSAT/FCR dip → white-glove refund SLA; check **Top/Strong** in §03.

---

## 01.4 Repeat Purchase Rate

### Definition

Share of buyers in the window with a second (or later) order.

### How it is useful

- Early **habit** signal.  
- Pill **Frequent** = reorder-path / ETA desk.  
- Target 40% = habit contract.

### Why it happens

| Rate falls | Cause |
| --- | --- |
| ETA miss on 2nd+ order | Frequent → Occasional |
| Refund friction mid-cadence | Second order aborted |
| Reorder-path effort | Frequency score slips |

### Formula

```
Buyers       = distinct customers with ≥ 1 eligible order in period
RepeatBuyers = distinct customers with ≥ 2 eligible orders in period
Rate_%       = RepeatBuyers / Buyers × 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `Buyers` | Count of distinct customers with at least one eligible order in the window |
| 2 | `RepeatBuyers` | Count of distinct customers with at least two eligible orders in the window |
| 3 | `eligible order` | Paid, non-test, non-cancelled order (finance rule) |
| 4 | `Rate_%` | Repeat Purchase Rate shown on the card |
| 5 | `× 100` | Convert fraction to percent |

### Live example — 7D (UI shows **38%**)

| Symbol | Value |
| --- | --- |
| `Buyers` | 500,000 |
| `RepeatBuyers` | 190,000 |

```
Rate_% = 190000 / 500000 × 100 = 38
delta  = +1.2
gap    = 40 − 38 = 2
```

| # | Symbol | Meaning in this example |
| --- | --- | --- |
| 1 | `38` | `Rate_%` on the card |
| 2 | `40` | `target` |
| 3 | `2` | `gap` below target |

### Data required

`order_id`, `customer_id`, `order_ts`, status; cancel/test flags; `target = 40`.

### What to do

Rate soft → open **Frequent**; audit ETA on reorder path (§04).

---

# 02 — Segment table + AI Summary Wall

### What the UI shows (column order)

| # | Column | Unit / form |
| --- | --- | --- |
| 1 | SEGMENT | Lifecycle pill |
| 2 | INTERACTIONS | `share_s_%` + period delta |
| 3 | CSAT | % |
| 4 | FCR | % |
| 5 | AOV (₹ cr) | Scaled display from INR |
| 6 | ATV (₹ cr) | Scaled display from INR |
| 7 | **LTV** | Score 0–100 |
| 8 | CPU | Contacts per unit |
| 9 | GMV (₹ cr) | ₹ Cr exposed |
| 10 | REV AT RISK (₹ cr) | `GMV × churn` — sort key |

### How this whole block is useful

| Need | How §02 helps |
| --- | --- |
| Where to put agents | INTERACTIONS share |
| What friction to fix | CSAT / FCR / CPU |
| Cohort value quality | AOV / ATV / **LTV score** |
| Where money burns | **REV AT RISK** sort (`GMV × churn`, not LTV) |
| What to say in leadership | AI wall (same numbers) |

---

## 02.0 Column dictionary + live derivations

### INTERACTIONS (share + delta)

**Useful for:** staffing and load.  
**Why share moves:** ETA/refund failures inflate contacts; seasonal spikes; win-back campaigns.

### Formula

```
share_s_% = interactions_s / Σ interactions × 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `share_s_%` | Segment `s` share of all contacts in the period (UI INTERACTIONS %) |
| 2 | `interactions_s` | Contact count for segment `s` in the period |
| 3 | `Σ interactions` | Sum of `interactions_s` across all segments (= `interactionsN`) |
| 4 | `s` | The segment row (e.g. Active) |
| 5 | `× 100` | Convert fraction to percent |

**Delta on the same cell**

```
delta_s = scale(wowDelta_s_7D)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `delta_s` | ▲/▼ % shown next to share |
| 2 | `wowDelta_s_7D` | Baseline period-over-period change for segment `s` |
| 3 | `scale(...)` | Apply period `delta_scale` (0.42 / 1 / 0.88) |

### Live example — Active 7D

```
share_active_% = 22571 / 62103 × 100 = 36.3445…%
UI shows 36.3%
Hover: full precision + “22,571 contacts”
delta_s example = +3.4% → ▲ 3.4%
```

| # | Symbol | Meaning in this example |
| --- | --- | --- |
| 1 | `22571` | `interactions_active` |
| 2 | `62103` | `Σ interactions` |
| 3 | `36.3%` | Rounded `share_active_%` |

---

### CSAT %

**Useful for:** quality of the contact.  
**Why it moves:** first-pass fail, refund silence, product defects.

### Formula

```
CSAT_s_% = satisfied_s / scored_s × 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `CSAT_s_%` | CSAT shown on segment row `s` |
| 2 | `satisfied_s` | Count of satisfied survey responses for segment `s` |
| 3 | `scored_s` | Count of all scored CSAT responses for segment `s` |
| 4 | `× 100` | Percent |

### Live example — Active

`satisfied_s / scored_s × 100 = 79%` → UI **79%**.

---

### FCR %

**Useful for:** predicting CPU and repeats.  
**Why soft:** ETA miss without resolve, refund status unknown, transfers.

### Formula

```
FCR_s_% = first_touch_resolved_s / contacts_s × 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `FCR_s_%` | First-contact resolution % for segment `s` |
| 2 | `first_touch_resolved_s` | Contacts in `s` resolved with no reopen in the defined window |
| 3 | `contacts_s` | All contacts in segment `s` (= `interactions_s`) |
| 4 | `× 100` | Percent |

### Live example

Active **58%**; Occasional **52%** (leak).

---

### AOV / ATV

**Useful for:** basket quality (not GMV size).  
**Why it differs:** Loyal premium baskets; Dormant low baskets.

### Formula

```
aov_INR_s          = average order value for segment s (rupees)
atv_INR_s          = average transaction value for segment s (rupees)
aov_display_s      = aov_INR_s / 1000
atv_display_s      = atv_INR_s / 1000
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `aov_INR_s` | Mean order value in ₹ for customers/orders in segment `s` |
| 2 | `atv_INR_s` | Mean transaction value in ₹ for segment `s` |
| 3 | `aov_display_s` | Value shown in the AOV column (`₹X.X` style) |
| 4 | `atv_display_s` | Value shown in the ATV column |
| 5 | `/ 1000` | Display scale used so AOV/ATV match GMV’s `₹X.X` visual pattern |

### Live example — Loyal

```
aov_INR_loyal = 2850 → aov_display = 2.850 → UI ₹2.9
atv_INR_loyal = 2620 → atv_display = 2.620 → UI ₹2.6
Hover: AOV ₹2.85 Cr (₹2,850)
```

| # | Symbol | Meaning in this example |
| --- | --- | --- |
| 1 | `2850` | Stored AOV in rupees |
| 2 | `2.9` | Rounded display value |
| 3 | Hover INR | Exact `aov_INR_s` for audit |

---

### LTV (score)

**Useful for:** cohort lifetime-value **quality** at a glance (protect Loyal, don’t over-invest Dormant).  
**Why it differs:** Loyal/Reactivated score high; Dormant scores low.  
**Important:** LTV is a **0–100 score on the table** — it is **not** an input to `rev_at_risk_Cr_s`.

### How it is useful

- Separates “valuable cohort” (`ltv_s` high) from “money at risk this window” (`rev_at_risk_Cr_s`).  
- Loyal can show high LTV + high GMV + low churn → protect.  
- Dormant can show low LTV + loud churn % → still small Rev at risk.

### Why it happens

| `ltv_s` up | `ltv_s` down |
| --- | --- |
| Repeat purchase history, high baskets, Plus/loyalty | Long inactivity, low baskets, weak retention |

### Formula

```
ltv_s ∈ [0, 100]
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `ltv_s` | Lifetime-value **score** for segment `s` shown in the LTV column |
| 2 | `[0, 100]` | Score range (not rupees, not crores) |
| 3 | Hover | UI title: `LTV score {ltv_s}/100` |

**Do not confuse with**

| Symbol | Where | Unit |
| --- | --- | --- |
| `ltv_s` | Segment table LTV column | Score 0–100 |
| `Avg_CLV_c` | RFM breakdown (§03) | ₹ money (e.g. ₹41k) |
| `rev_at_risk_Cr_s` | REV AT RISK column | ₹ Cr = `GMV_Cr_s × churn_s_% / 100` |

### Live example — 7D

| `s` | `ltv_s` (UI) | Read |
| --- | --- | --- |
| Loyal | **88** | Highest quality — protect |
| Reactivated | **72** | Worth locking in 7 days |
| Frequent | **68** | Habit value |
| Active | **64** | Mid — volume centre |
| Occasional | **58** | Intent risk |
| Seasonal | **52** | Load risk more than LTV |
| Dormant | **34** | Low quality — light-touch |

```
ltv_loyal = 88 → UI 88 (hover: LTV score 88/100)
```

### Data required

| Input | Role | Source | Grain | Latency |
| --- | --- | --- | --- | --- |
| Historic / predicted CLV features | Feeds score model | LTV model / CRM | Customer | Daily |
| Segment rollup | `ltv_s` = segment aggregate (mean/median of members) | Cohort job | Segment×day | Daily |
| Period overlay `ltvAdj` | Soft-shifts score by 24H/30D | Config in happiness data | Segment×period | With toggle |

---

### CPU

**Useful for:** friction intensity.  
**Why high:** each unit needs multiple contacts (ETA chase).

### Formula

```
CPU_s = contacts_s / units_fulfilled_s
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `CPU_s` | Contacts per unit for segment `s` (UI CPU column) |
| 2 | `contacts_s` | Contact count for segment `s` |
| 3 | `units_fulfilled_s` | Fulfilled **units** (shipment lines) for segment `s` — **not** order headers |

### Live example

Active `CPU = 2.1` (bad) · Loyal `CPU = 0.8` (good).

---

### GMV (₹ cr)

**Useful for:** commercial size.  
**Why it exists:** finance attribution of segment membership × orders.

### Formula

```
GMV_Cr_s = GMV_INR_s / 10_000_000
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `GMV_Cr_s` | GMV exposed for segment `s` in ₹ crore (UI GMV column) |
| 2 | `GMV_INR_s` | Same GMV in rupees |
| 3 | `10_000_000` | Rupees per crore (1 Cr = 1e7 ₹) |

### Live example

Loyal `GMV_Cr = 42.0` · Active `GMV_Cr = 22.4`.

---

### Churn % (input to Rev at risk)

### Formula

```
churn_s_% = churned_or_lapsed_s / segment_base_s × 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `churn_s_%` | Attrition rate for segment `s` (percent) |
| 2 | `churned_or_lapsed_s` | Customers in `s` who churned/lapsed (or expected to) |
| 3 | `segment_base_s` | Denominator population for segment `s` (must be published) |
| 4 | `× 100` | Percent |

*(Production may instead use mean model probability × 100; symbol `churn_s_%` still means the segment attrition rate used in Rev at risk.)*

---

### REV AT RISK (₹ cr) — sort key

**Useful for:** who to brief first (money, not noise).  
**Why this formula:** churn % alone lies; GMV alone ignores attrition.

#### Current formula (live UI — authoritative)

```
rev_at_risk_Cr_s = round(GMV_Cr_s × churn_s_% / 100 × 100) / 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `rev_at_risk_Cr_s` | Revenue at risk for segment `s` in ₹ Cr (UI column; **sort key**) |
| 2 | `GMV_Cr_s` | GMV exposed for segment `s` in ₹ Cr |
| 3 | `churn_s_%` | Churn rate for segment `s` as a percent (e.g. 7.6 means 7.6%) |
| 4 | `/ 100` | Convert percent churn into a fraction (7.6 → 0.076) |
| 5 | `GMV_Cr_s × churn_s_% / 100` | Raw money at risk before rounding |
| 6 | `round(...×100)/100` | Round to 2 decimal places (then UI may show 1 decimal via `formatCr`) |

**Sort rule:** rows ordered by `rev_at_risk_Cr_s` descending.

**Code:** `segmentRevenueAtRiskCr(row)` in `cxHeadRetailV3HappinessLensData.ts`  
uses only `gmvAtRiskCr` and `churn` — **not** `ltv`.

#### What about LTV? (mentioned earlier — no longer in this column)

Earlier design used an **LTV-based proxy** that mixed a score with contact volume. That produced a fake ₹ figure that did **not** share a unit with the GMV column, so ranks could disagree with commercial exposure.

```
DEPRECATED (do not use for UI Rev at risk):
rev_proxy_s ≈ churn_s_% / 100 × ltv_s × interactions_s
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `rev_proxy_s` | Old proxy “₹ at risk” (not real crores) |
| 2 | `churn_s_%` | Same churn percent as today |
| 3 | `ltv_s` | Segment lifetime-value **score** 0–100 (not ₹ CLV) |
| 4 | `interactions_s` | Contact count for segment `s` |

| Why it was dropped | Why GMV × churn replaced it |
| --- | --- |
| `ltv_s` is a 0–100 score, not money | `GMV_Cr_s` is already in ₹ Cr |
| `× interactions_s` double-counted load vs commercial size | GMV already embeds commercial size |
| Units fought the GMV column | Same ₹ Cr unit → one sort key |
| Inflated Dormant-style “loud churn” noise | Money rank matches Head of CX briefing |

#### Where LTV appears in the UI (vs Rev at risk)

| | |
| --- | --- |
| **Column** | **LTV** on the segment table (between ATV and CPU) |
| **Field** | `ltv_s` |
| **Meaning** | Lifetime-value **score** 0–100 for the segment |
| **Used for** | Cohort quality read — **not** for sorting or computing `rev_at_risk_Cr_s` |
| **Do not confuse with** | RFM `Avg_CLV_c` (₹Xk money CLV on the RFM breakdown) |

```
ltv_s ∈ [0, 100]     // segment table LTV column (score)
Avg_CLV_c = mean(CLV_customer | customer ∈ RFM cell c)   // ₹ money — §03
rev_at_risk_Cr_s = GMV_Cr_s × churn_s_% / 100            // ₹ Cr — no ltv_s
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `ltv_s` | Segment LTV score (0–100) — **visible UI column** |
| 2 | `Avg_CLV_c` | RFM cell average CLV in ₹ — separate UI (§03) |
| 3 | `rev_at_risk_Cr_s` | Money rank — uses GMV + churn only |

#### Live example — full 7D rank (current formula only)

| Rank | `s` | `GMV_Cr_s` | `churn_s_%` | `GMV × churn/100` | `rev_at_risk_Cr_s` | UI |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Active | 22.4 | 7.6 | 1.7024 | 1.70 | **₹1.7** |
| 2 | Loyal | 42.0 | 3.8 | 1.5960 | 1.60 | **₹1.6** |
| 3 | Occasional | 18.2 | 8.2 | 1.4924 | 1.49 | **₹1.5** |
| 4 | Seasonal | 12.1 | 9.1 | 1.1011 | 1.10 | **₹1.1** |
| 5 | Frequent | 16.5 | 6.2 | 1.0230 | 1.02 | **₹1.0** |
| 6 | Dormant | 6.4 | 14.2 | 0.9088 | 0.91 | **₹0.9** |
| 7 | Reactivated | 14.8 | 5.4 | 0.7992 | 0.80 | **₹0.8** |

**Worked line (Active) — current:**

```
rev_at_risk_Cr_active = round(22.4 × 7.6 / 100 × 100) / 100
                      = round(1.7024 × 100) / 100
                      = 1.70 → UI ₹1.7
```

| # | Symbol | Meaning in Active example |
| --- | --- | --- |
| 1 | `22.4` | `GMV_Cr_active` |
| 2 | `7.6` | `churn_active_%` |
| 3 | `0.076` | `7.6 / 100` |
| 4 | `1.70` | Rounded `rev_at_risk_Cr_active` |
| 5 | `₹1.7` | `formatCr` display |

**Contrast — if we still used deprecated LTV proxy for Active (`ltv=64`, `interactions=22571`):**

```
rev_proxy_active ≈ 7.6/100 × 64 × 22571 ≈ 109,785   // not ₹ Cr; not comparable to GMV ₹22.4
```

That is why LTV was removed from the **Rev at risk formula**: the proxy looked “big” but was not money in crores.  
LTV remains a **separate table column** (score) so Head of CX can still see cohort quality without polluting the money sort.

**Insight:** Dormant `churn_% = 14.2` looks worst, but `rev_at_risk = 0.91` &lt; Active `1.70` — money sort is correct.

---

## 02.1–02.7 Segments

Each segment reuses §02.0 symbols. Below: usefulness, why, and live plug-in of those symbols.

---

### 02.1 Active customer

| | |
| --- | --- |
| **Definition** | Purchased in the active window — currently shopping |
| **`s`** | `active` |
| **Linked KPI** | Happiness Index |

### How it is useful

Usually #1 `share_s_%` and #1 `rev_at_risk_Cr_s` → default war-room cohort; explains Happiness moves via `CPU_s` / `FCR_s_%`.

### Why it happens

ETA first-pass misses → `contacts_s` ↑ → `CPU_s` ↑, `FCR_s_%` soft → Happiness ↓; `GMV_Cr_s` stays large so `rev_at_risk_Cr_s` stays #1.

### Live plug-in of symbols (7D)

| Symbol | Value |
| --- | --- |
| `interactions_active` | 22,571 |
| `Σ interactions` | 62,103 |
| `share_active_%` | 36.3% |
| `CSAT_active_%` | 79% |
| `FCR_active_%` | 58% |
| `aov_INR_active` → display | 1,180 → ₹1.2 |
| `ltv_active` | **64** |
| `CPU_active` | 2.1 |
| `GMV_Cr_active` | 22.4 |
| `churn_active_%` | 7.6 |
| `rev_at_risk_Cr_active` | **1.70 → ₹1.7** |

### What to do

Staff Active first; fix ETA first-pass; do not divert to Dormant.

---

### 02.2 Loyal customer

| | |
| --- | --- |
| **`s`** | `loyal` |
| **Linked KPI** | Loyalty Index |

### How it is useful

Highest `GMV_Cr_s` / `aov_INR_s` — protect advocates; shows low `churn_s_%` can still rank #2 on money.

### Why it happens

Refund SLA miss on large `GMV_Cr_s` → advocates silent; Loyalty Index moves with Loyal CSAT/FCR.

### Live plug-in

```
rev_at_risk_Cr_loyal = 42.0 × 3.8 / 100 = 1.596 → 1.60 → ₹1.6
aov_display_loyal    = 2850 / 1000 = 2.85 → ₹2.9
ltv_loyal            = 88
CPU_loyal            = 0.8
```

| # | Symbol | Meaning here |
| --- | --- | --- |
| 1 | `42.0` | `GMV_Cr_loyal` |
| 2 | `3.8` | `churn_loyal_%` |
| 3 | `1.60` | `rev_at_risk_Cr_loyal` |
| 4 | `88` | `ltv_loyal` (score — not in Rev at risk) |

### What to do

White-glove refund/pickup; no exceptions on delayed credit.

---

### 02.3 Occasional buyer

| | |
| --- | --- |
| **`s`** | `occasional` |
| **Linked KPI** | NPS |

### How it is useful

Finds intent leak while `aov_INR_s` still healthy; links NPS detractors to refund stalls.

### Why it happens

Refund/return stall → `FCR_s_%` soft → next-order dies → `share` cools → NPS detractors.

### Live plug-in

```
share_occasional_%     = 11285 / 62103 × 100 = 18.17 → 18.2%
FCR_occasional_%       = 52
aov_display_occasional = 1640 / 1000 = 1.64 → ₹1.6
ltv_occasional         = 58
rev_at_risk_Cr_occasional = 18.2 × 8.2 / 100 = 1.49 → ₹1.5
```

### What to do

Priority refund/return queue; protect next purchase.

---

### 02.4 Seasonal buyer

| | |
| --- | --- |
| **`s`** | `seasonal` |

### How it is useful

Capacity planning before festivals — stop `FCR_s_%` collapse on sale day.

### Why it happens

`share_s_%` spikes on known calendars; unprepared desks break first-touch.

### Live plug-in

```
share_seasonal_% = 4837 / 62103 × 100 = 7.79 → 7.8%
ltv_seasonal = 52
rev_at_risk_Cr_seasonal = 12.1 × 9.1 / 100 = 1.10 → ₹1.1
FCR_seasonal_% = 48
```

### What to do

Prep capacity + scripted refunds **before** the sale.

---

### 02.5 Frequent buyer

| | |
| --- | --- |
| **`s`** | `frequent` |
| **Linked KPI** | Repeat Purchase Rate |

### How it is useful

Detects habit break early; connects Repeat Rate card to reorder ETA.

### Why it happens

ETA miss on 2nd+ order → `CPU_s` ↑ → Frequent → Occasional → `Rate_%` ↓.

### Live plug-in

```
share_frequent_% = 7840 / 62103 × 100 = 12.62 → 12.6%
ltv_frequent = 68
CPU_frequent = 1.3
rev_at_risk_Cr_frequent = 16.5 × 6.2 / 100 = 1.02 → ₹1.0
```

### What to do

Lock ETA on reorder path.

---

### 02.6 Dormant customer

| | |
| --- | --- |
| **`s`** | `dormant` |

### How it is useful

Teaches what **not** to over-fund: high `churn_s_%`, low `rev_at_risk_Cr_s`.

### Why “loud churn” ≠ money risk

Small `GMV_Cr_s` × high `churn_s_%` = scary % but small product.

### Live plug-in (anti-pattern proof)

```
churn_dormant_% = 14.2
share_dormant_% = 3210 / 62103 × 100 = 5.17 → 5.2%
ltv_dormant = 34
GMV_Cr_dormant = 6.4
rev_at_risk_Cr_dormant = 6.4 × 14.2 / 100 = 0.91 → ₹0.9

rev_at_risk_Cr_active (1.70) > rev_at_risk_Cr_dormant (0.91)
→ Active ranks above Dormant
```

| # | Symbol | Meaning in this proof |
| --- | --- | --- |
| 1 | `14.2` | High `churn_dormant_%` (looks urgent) |
| 2 | `0.91` | Low `rev_at_risk_Cr_dormant` (not urgent vs Active) |
| 3 | `1.70` | `rev_at_risk_Cr_active` (true priority) |

### What to do

Light-touch only; suppress voice when Active is hot.

---

### 02.7 Reactivated customer

| | |
| --- | --- |
| **`s`** | `reactivated` |

### How it is useful

Protects reactivation ROI — lock wins in 7 days.

### Why it happens

Return campaign → strong `atv_INR_s` → first-week friction → back to Dormant.

### Live plug-in

```
share_reactivated_% = 2687 / 62103 × 100 = 4.33 → 4.3%
atv_display = 1760 / 1000 = 1.76 → ₹1.8
ltv_reactivated = 72
rev_at_risk_Cr_reactivated = 14.8 × 5.4 / 100 = 0.80 → ₹0.8
```

### What to do

Nurture ≤ 7 days; block first-week friction.

---

## 02.8 AI Summary Wall contract

| Wall field | Must equal symbol from table |
| --- | --- |
| Order | `rev_at_risk_Cr_s` descending |
| Contact volume | `interactions_s` |
| Share | `share_s_%` |
| CSAT / FCR / CPU | `CSAT_s_%` / `FCR_s_%` / `CPU_s` |
| AOV / ATV / LTV | `aov_display_s` / `atv_display_s` / `ltv_s` |
| GMV / Rev | `GMV_Cr_s` / `rev_at_risk_Cr_s` |
| Period change | `|delta_s|` |
| ₹ formatting | Same `formatCr` as table |

**Useful for:** leadership narrative without a second spreadsheet.  
**Invalid if** any wall symbol ≠ table for the same `period`.

---

# 03 — How do customers score on RFM?

### How this block is useful

- Who is commercially concentrated (`rev_c_%`), independent of lifecycle labels.  
- Zones = playbook (Protect / Grow / Rescue / Monitor).  
- Sentiment panel = which lifecycle cohorts *feel* that cell’s heat.

### Why RFM cells move

Last order ages → Recency↓; cadence breaks → Frequency↓; basket mix shifts → Monetary changes; refund/ETA failures accelerate Recency↓.

---

## 03.1 Axes

| Score | Last purchase (`R`) | How often (`F`) |
| --- | --- | --- |
| 5 | Now | Habit |
| 4 | Recent | Often |
| 3 | Cooling | Some |
| 2 | Overdue | Rare |
| 1 | Cold | Once |

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `R` | Recency score 1…5 (last purchase freshness) |
| 2 | `F` | Frequency score 1…5 (how often they buy) |
| 3 | `M` | Monetary score 1…5 (spend-depth quintile) |

---

## 03.2 Formulas + live example

### Cell assignment

```
R = bucket(days_since_last_order)
F = bucket(orders_in_lookback)
M = bucket(GMV_in_lookback)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `R` | Recency bucket 1…5 |
| 2 | `days_since_last_order` | Days from today to customer’s latest eligible order |
| 3 | `bucket(...)` | Maps a continuous input into score 1…5 using published cut-points |
| 4 | `F` | Frequency bucket 1…5 |
| 5 | `orders_in_lookback` | Count of eligible orders in the RFM lookback window |
| 6 | `M` | Monetary bucket 1…5 |
| 7 | `GMV_in_lookback` | Customer GMV in the RFM lookback window |

### Portfolio mix

```
share_c_% = customers_c / RFM_base × 100
rev_c_%   = GMV_c / GMV_base × 100
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `share_c_%` | % of RFM customer base sitting in cell `c` |
| 2 | `customers_c` | Distinct customers in RFM cell `c` |
| 3 | `RFM_base` | All customers in the RFM universe (denominator) |
| 4 | `rev_c_%` | % of RFM GMV sitting in cell `c` |
| 5 | `GMV_c` | GMV attributed to customers in cell `c` |
| 6 | `GMV_base` | Total GMV in the RFM universe |
| 7 | `c` | Named cell (Top, Strong, Growing, Starter, Watch, Risk, Priority, Quiet) |

**Tally rules:** `Σ_c share_c_% = 100` and `Σ_c rev_c_% = 100`.

### Avg CLV

```
Avg_CLV_c = mean(CLV_customer | customer ∈ c)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `Avg_CLV_c` | Average lifetime value for cell `c` (UI ₹Xk) |
| 2 | `CLV_customer` | Modelled or historic CLV for one customer |
| 3 | `customer ∈ c` | Customer whose (R,F) place them in cell `c` |
| 4 | `mean(...)` | Arithmetic average over those customers |

### Live example — Top (`c = Top`)

| Symbol | Value |
| --- | --- |
| `R`, `F` | 5, 5 (Now × Habit) |
| `share_Top_%` | **11%** |
| `rev_Top_%` | **27%** |
| `Avg_CLV_Top` | ~₹41k |

```
Why useful: share_Top_% = 11 while rev_Top_% = 27
→ refund SLA miss on Top costs more than Quiet (share 13, rev 4)
```

**Protect zone check:**  
`share_Top_% + share_Strong_% = 11 + 15 = 26`  
`rev_Top_% + rev_Strong_% = 27 + 21 = 48`

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `26` | Combined protect-zone customer share % |
| 2 | `48` | Combined protect-zone revenue share % |

### Data required

`days_since_last_order`, `orders_in_lookback`, `GMV_in_lookback`, `RFM_base`, `GMV_base`, `CLV_customer`, period `rev_c_%` overlays.

---

## 03.3 Cell → zone → action

| `c` | Zone | Useful because | Act |
| --- | --- | --- | --- |
| Top | Protect | Max `rev_c_%` | Guard refund/ETA |
| Strong | Protect | Near-Top | Watch return friction |
| Growing | Grow | Habit forming | 2nd-order nudge ~14d |
| Starter | Grow | First impression | Onboard &lt; day 7 |
| Watch | Rescue | Last cheap window | Timely offer |
| Risk | Rescue | High value, weak recency | Personal win-back |
| Priority | Rescue | Best buyers cold | War-room callback |
| Quiet | Monitor | Low `rev_c_%` | Light-touch only |

---

## 03.4 Sentiment by segment (selected RFM)

### Formula

```
show segment s if weight_c,s > 0
bars_s = (happy_s_%, neutral_s_%, unhappy_s_%)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `c` | Currently selected RFM cell |
| 2 | `s` | Lifecycle segment |
| 3 | `weight_c,s` | Share of cell `c` that sits in segment `s` (`RFM_SHARE_WEIGHTS[c][s]`) |
| 4 | `happy_s_%` | % happy contacts in segment `s` |
| 5 | `neutral_s_%` | % neutral contacts in segment `s` |
| 6 | `unhappy_s_%` | % unhappy contacts in segment `s` |
| 7 | `bars_s` | UI sentiment bars for segment `s` |

**Constraint:** `happy_s_% + neutral_s_% + unhappy_s_% = 100`.

**Useful for:** RFM money → lifecycle emotion.  
**Live idea:** select Risk → Occasional/Active `unhappy_s_%` rises → confirms refund pain.

---

# 04 — What’s Failing to the Customer

### How it is useful

Turns §02 “who” (`rev_at_risk_Cr_s`) into §04 “what broke”; Channel vs Segment = which owner meeting to call.

### Why clusters appear

NLP/rules tag contacts; volumes aggregate in the period.

### Formula

```
count_period     = round(count_7D × volume_scale)
affected_period  = round(affected_7D × volume_scale)
trend_period     = scaleDelta(trend_7D)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `count_period` | Cluster contact/event volume in the selected period |
| 2 | `count_7D` | Same cluster volume on 7D baseline |
| 3 | `volume_scale` | 0.16 / 1.00 / 3.70 |
| 4 | `affected_period` | Distinct customers impacted in the period |
| 5 | `affected_7D` | Distinct customers impacted on 7D baseline |
| 6 | `trend_period` | Period-scaled trend shown on the card |
| 7 | `trend_7D` | Baseline trend before scaling |
| 8 | `scaleDelta(...)` | Applies period `delta_scale` to the trend |
| 9 | `round(...)` | Integer counts for UI |

**View weights**

```
channel_weight  = contacts in cluster ∩ channel
segment_weight  = contacts in cluster ∩ segment
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `channel_weight` | How much of the cluster sits in a channel (By Channel view) |
| 2 | `segment_weight` | How much of the cluster sits in a lifecycle segment (By Customer Segment view) |
| 3 | `∩` | Intersection: contacts that are both in the cluster and in that channel/segment |

### Live example — tying back to Active

| Step | Evidence (symbols) |
| --- | --- |
| §01 | `HappinessIndex = 68`, `gap = 2`, Returns `score_i` weak |
| §02 | `rev_at_risk_Cr_active = 1.70`, `CPU_active = 2.1`, `FCR_active_% = 58` |
| §04 | Cluster “Delivery ETA miss”: `count_period` ↑ WoW |
| Action | Logistics + CX Ops — first-pass ETA playbook |

### Data required

Cluster id/title/severity, tagged contacts, distinct customers, channel, segment, prior-window counts.

### What to do

Pick the cluster that explains the top `rev_at_risk_Cr_s` row; assign owner + SLA.

---

# C. Acceptance (pass/fail)

| Check | Pass |
| --- | --- |
| Universe | `interactionsN = Σ interactions_s` = wall volumes |
| Money sort | `rev_at_risk_Cr_s = GMV_Cr_s × churn_s_% / 100`; Active 1.70 &gt; Dormant 0.91 in 7D |
| Periods | `Σ share_s_% ≈ 100`; `Σ share_c_% = 100`; `Σ rev_c_% = 100` |
| Wall sync | Every wall symbol = table symbol for `period` |
| Pills | Happiness→Active, NPS→Occasional, Loyalty→Loyal, Repeat→Frequent |
| Evidence | Risk always has signal + cluster + owner |

---

# D. Code map

| UI | Code |
| --- | --- |
| 00 | `HubCustomerHappinessScreen.tsx` |
| 01 | `HappinessHeadlineKpiCards.tsx` |
| 02 | `CustomerHappinessDashboard.tsx`, `cxHeadRetailV3HappinessLensData.ts`, `cxHeadRetailV3HappinessSegmentInsights.ts` |
| 03–04 | RFM/sentiment + `FailureClusters` / `getFlipkartFciClustersForRange` |
| Periods | `HAPPINESS_PERIODS`, `getHappinessSegmentRows`, `getHappinessInteractionsN` |

---

*Every formula in this doc must keep its numbered symbol table. When UI numbers change, update live examples — do not leave orphan symbols.*
