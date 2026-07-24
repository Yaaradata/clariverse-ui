# How is our service delivery?

**Screen:** Service Delivery hub (`hub-service-delivery`)  
**Persona:** Head of CX · Marketplace  
**Question this screen answers:** Are we keeping the promise — and can we reach anxious customers **before** they contact us?  
**UI path:** `HubTrustScreen`-style hub → `HubServiceDeliveryScreen` → `ServiceDeliveryAnxietyDashboard`  
**Time windows:** header `24H` · `7D` · `30D` → anxiety periods `today` · `7d` · `30d`  
**Worked examples below use the live 7D (`7d`) baseline** unless noted.

---

## Document map (= UI scroll order)

| # | UI block | This doc |
| --- | --- | --- |
| **00** | Page headline | Scope of the question |
| **KPI** | Anxiety triad (3 cards) | 5-second health |
| **01** | Escalation Patterns | Top-10 problem statements + contribution + imperfections |
| **02** | Delivery signals | Journey × category matrix (node × category) |
| **03** | Reliability vs Anxiety | Promise × anxiety 2×2 + cliff/slope |
| **04** | Proactive Customer Intervention Queue | Cluster action queue + evidence |

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

Whenever a formula appears, every symbol is defined immediately under it — same pattern as the Happiness / Trust docs.

---

## A. Locked definitions

| Term | Exact meaning on this screen |
| --- | --- |
| **Promise / IPD** | Intended Promise Date — committed delivery / refund / replacement / install window |
| **IPD-met %** | % of units that still meet the committed promise (target **92%**) |
| **Anxiety** | Customer worry / contact pressure **before or without** treating it as a trust break |
| **Anxiety Index** | 0–100 pressure score on high churn-signal customers (higher = worse) |
| **High churn-signal (`high`)** | Customers in the high-anxiety / high-contact-propensity band |
| **Scored customers (`scored`)** | Universe scored for anxiety this period |
| **p(contact)** | Probability a high-band customer contacts support in the window |
| **Contained** | High-band customers reached / calmed before contact escalates |
| **Anxiety-only (ml+mh)** | Promise still met, but anxiety present or absent — **not** a breach |
| **Breach signals (bl+bh)** | Promise slipped — calm (pre-empt) or angry (trust erosion) |
| **TTC** | Avg minutes from signal → first proactive outreach |
| **TT Contact** | Avg minutes from signal → customer-initiated contact |
| **Headroom** | `ttContact − ttc` — minutes left to act before they call |
| **Carve-out** | Within-SLA anxiety cohort — reassure, do **not** treat as trust break |
| **Cliff / Slope** | Sudden high-blast vs chronic building service failures (same language as Trust) |
| **Cluster** | Actionable customer-problem cohort on the intervention queue |

### Core spine (Fluid)

```
Customer signal (tracking gap / delay fear)
  → Anxiety / breach classification
    → Journey node × category hotspot
      → Owner + intervention template
        → Approve outreach / Escalate (before contact window)
```

### One-universe rule

```
negTotal = quad.ml + quad.mh + quad.bl + quad.bh
signalTotal = anxietyOnly + breachSignals
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `negTotal` | All negative / scored promise×anxiety units in the period |
| 2 | `quad.*` | Counts in the four Reliability × Anxiety cells |
| 3 | `anxietyOnly` | `ml + mh` — promise kept |
| 4 | `breachSignals` | `bl + bh` — promise breached |
| 5 | `signalTotal` | Full mix used for breach share / promise-kept % |

Quad sum **must** equal `negTotal` (consistency assert in code).

### Period math

Header range maps to anxiety period:

| Header | Anxiety key | Label | Fresh default |
| --- | --- | --- | --- |
| `24H` | `today` | Today | NRT |
| `7D` | `7d` | 7 days | NRT |
| `30D` | `30d` | 30 days | Daily |

Volume scale for clusters / imperfections uses **Today** as baseline:

```
scale = period.high / ANXIETY_PERIOD_BASELINE.high
units_period = max(1, round(units_today × scale))
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `period.high` | High churn-signal count for selected period |
| 2 | `ANXIETY_PERIOD_BASELINE.high` | Today baseline = **12,400** |
| 3 | `units_today` | Cluster / drill units authored at Today grain |
| 4 | `units_period` | Scaled units shown on queue / matrix |

**7D scale:** `81400 / 12400 ≈ 6.56`.

Matrix scores also shift by period:

```
anxietyScore' = clamp(0,100, round(anxietyScore + matrixAnxietyOffset))
ipdMet'       = clamp(0,100, round1(ipdMet + matrixIpdOffset))
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `matrixAnxietyOffset` | Period anxiety nudge (−2 on 7D, −4 on 30D) |
| 2 | `matrixIpdOffset` | Period IPD nudge (+0.4 on 7D, +0.8 on 30D) |
| 3 | `round1` | Round to 1 decimal |

---

## B. Decision contract (Head of CX)

| Step | Look at | Decide |
| --- | --- | --- |
| 1 | **KPI** Anxiety Index + IPD vs 92 | Pressure rising? Promise holding? |
| 2 | **KPI** Headroom (`ttContact − ttc`) | Can we still reach before contact? |
| 3 | **01** #1 problem statement + contribution | What language + channel/region/stage to cut |
| 4 | **02** Top journey × category cell | Where delivery signal concentrates |
| 5 | **03** Trust erosion (`bh`) vs Reassure (`mh`) | Breach war-room vs carve-out reassure |
| 6 | **04** Queue — Approve / Escalate | Act inside SLA timer |

**Never:** treat within-SLA anxiety (`mh` / carve clusters) as trust-break apology flows.  
**Never:** ignore Pre-empt (`bl`) — silent IPD slip becomes Trust erosion.

---

# 00 — Page headline

### Definition

Fluid headline for the Service Delivery hub.

### UI

```
How is our service delivery?
```

Purpose copy:

```
Anxiety command triad, containment queue, reliability × anxiety split,
and escalation patterns — contact pressure before breach.
```

### How it is useful

Locks the screen to **promise reliability + pre-contact anxiety**, not generic “ops SLA green/red.”

### Why it exists

Head of CX must decide: **contain anxiety**, **pre-empt silent breach**, or **war-room trust erosion** — before contacts spike.

### Data required

Navigation only (`activeScreen = hub-service-delivery`, `trustRange` → anxiety period).

### What to do

Confirm period, read the triad, then scroll **01 → 04**.

---

# KPI — Anxiety triad (5-second health)

### What the UI shows

Three equal cards (top of page, above §01):

| Card | Ring | Question |
| --- | --- | --- |
| **Customer anxiety load** | Anxiety Index | How hot is contact pressure? |
| **Promise reliability** | IPD-met % | Are we keeping the promise? |
| **Reach before contact** | Reached proactively % | Are we containing in time? |

---

## KPI.1 Customer anxiety load

### Definition

Composite pressure on high churn-signal customers this period.

### How it is useful

5-second answer: is anxiety **building** (`shift` / `break`) or easing? Index rising = contact load coming.

### Why it moves

Missed delivery promise language, stuck-at-hub, refund lag, tracking gaps — especially East last-mile.

### Formula — high-band share & containment

```
highBandShare_% = round(high / scored × 100)
containedRate_% = round(contained / high × 100)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `high` | High churn-signal customers |
| 2 | `scored` | All scored customers |
| 3 | `contained` | Contained of the high band |
| 4 | `highBandShare_%` | % of scored in high band |
| 5 | `containedRate_%` | % of high band already contained |

### Live example — 7D

| Field | Value |
| --- | --- |
| Anxiety Index `index` | **76** |
| State | `shift` |
| Confidence | 88 |
| High churn-signal | **81,400** |
| Scored | **312,000** |
| p(contact) | **0.69** |
| Contained | **22,600** → `22600/81400 ≈ 28%` |
| Index delta | **−3 pts** (easing) |
| Churn-signal share | `81400/312000 ≈ 26%` |

AI insight shape:

```
58% of high-anxiety customers trace to missed delivery promise
and stuck-at-hub in East
Reach them before the ~71 min contact window closes
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `driverPct` | **58** — share of high anxiety on top driver theme |
| 2 | `ttContact` | **71** min — avg time to customer contact |

### Data required

| Field | Role | Source | Latency |
| --- | --- | --- | --- |
| Anxiety score / band | Index + high/scored | CX models | 5–15 min |
| Contact propensity | `p(contact)` | Contact model | 5–15 min |
| Containment flag | Contained count | Outreach outcomes | 5–15 min |
| Driver attribution | `driverPct` | Intent / FCI | 5–15 min |

### What to do

If Index rising or share > 25% → open §01 #1 statement and §04 High-band clusters first.

---

## KPI.2 Promise reliability

### Definition

Whether committed promises (IPD) are held — vs anxiety that is still inside SLA.

### How it is useful

Separates **true breach** from **expectation-gap anxiety**. Weakest category shows where IPD is softest.

### Formula — anxiety vs breach split

```
anxietyOnly   = quad.ml + quad.mh
breachSignals = quad.bl + quad.bh
signalTotal   = anxietyOnly + breachSignals
promiseKept_% = round(anxietyOnly / signalTotal × 100)
breachShare_% = round(breachSignals / signalTotal × 100)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `quad.ml` | Promise met · low anxiety (Healthy) |
| 2 | `quad.mh` | Promise met · high anxiety (Reassure) |
| 3 | `quad.bl` | Promise breached · low anxiety (Pre-empt) |
| 4 | `quad.bh` | Promise breached · high anxiety (Trust erosion) |
| 5 | `promiseKept_%` | Share of mix still inside promise |
| 6 | `breachShare_%` | Share of mix in breach quadrants |

**IPD target**

```
IPD_TARGET = 92
ipdDisplay = round1(ipd)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `IPD_TARGET` | Operating bar **92%** |
| 2 | `ipd` | Period IPD-met % |
| 3 | `ipdDelta` | Period change in IPD (pts) |

### Live example — 7D

```
anxietyOnly   = 28800 + 43200 = 72,000
breachSignals = 15600 + 33800 = 49,400
signalTotal   = 121,400  (= negTotal)
promiseKept_% = round(72000/121400×100) = 59%
breachShare_% = round(49400/121400×100) = 41%
```

| Field | Value |
| --- | --- | --- |
| IPD-met | **92.0%** (on target) |
| IPD delta | **+0.8%** |
| Breach customers (`breachUnits`) | **23,100** |
| Weakest category | **Furniture** (lowest IPD-met after period adjust) |
| Anx. signals | **72,000** |
| Breach signals | **49,400** |

### Data required

| Field | Role | Source | Latency |
| --- | --- | --- | --- |
| Promise date vs actual | IPD-met | OMS / logistics | 5–15 min |
| Sentiment / anxiety band | Quad axis | NLP + models | 5–15 min |
| Category | Weakest IPD | Catalogue | 15–60 min |
| Breach unit flag | `breachUnits` | Promise engine | 5–15 min |

### What to do

If breach share climbing while IPD looks “fine” → silent Pre-empt (`bl`) is filling; jump to §03.  
If a category is weakest → open that column on §02 matrix.

---

## KPI.3 Reach before contact

### Definition

Whether proactive outreach lands **before** the customer initiates contact.

### How it is useful

Time-to-decision for containment ops: headroom minutes + notify coverage + contacts avoided.

### Formula

```
notifyRate_%   = round(funnelNotified / high × 100)
funnelRate_%   = round(funnelAvoided / high × 100)
headroomMin    = ttContact − ttc
coverageRate_% = notifyRate_%   // ring “Reached proactively”
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `funnelNotified` | High-band customers who got proactive outreach |
| 2 | `funnelAvoided` | Preventable contacts avoided after outreach |
| 3 | `ttc` | Avg minutes to first outreach |
| 4 | `ttContact` | Avg minutes to customer contact |
| 5 | `headroomMin` | Minutes left to act |
| 6 | `optOut` | Opt-out % from proactive comms (guardrail **3%**) |

### Live example — 7D

```
notifyRate_% = round(60200/81400×100) = 74%
funnelRate_% = round(44900/81400×100) = 55%
headroomMin  = 71 − 44 = 27 min
optOut       = 2.1%  (within 3% guardrail)
```

AI insight shape:

```
Customer outreach started 27 min before likely contact
Proactive reach: 74% of the churn-signal group
55% of preventable contacts avoided
```

### Data required

| Field | Role | Source | Latency |
| --- | --- | --- | --- |
| Outreach send time | `ttc` | Messaging platform | 1–5 min |
| First contact time | `ttContact` | CCaaS | 1–5 min |
| Notified / avoided flags | Funnel | Campaign + contact join | 5–15 min |
| Opt-out events | Guardrail | Preference / STOP | 1–5 min |

### What to do

If `headroomMin` shrinks or `ttc ≥ ttContact` → approve §04 High clusters immediately; pause low-value over-comms if `optOut ≥ 3`.

---

# 01 — Escalation Patterns

### What the UI shows

```
01 · Escalation Patterns  (Cold plane)
    ┌─ Top-10 problem statements ─┐  ┌─ Contribution analysis ─┐
    │ #1…#10 · share % · state    │  │ Channel | Region | Stage │
    └─────────────────────────────┘  ├─ Emerging imperfections ─┤
                                     └───────────────────────────┘
```

### Definition

Ranked customer **problem language** that drives escalations, with contribution cuts and emerging failure signatures.

### How it is useful

Answers **what customers say** when service delivery fails — not just ops codes. Contribution shows where to cut surgically.

### Formula — top-10 share (period)

```
shares' = normalizeTop10Shares(period.top10Shares)   // sum → 100
statement_i.share_% = shares'[i]
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `top10Shares` | Period share vector for statements 1…10 |
| 2 | `normalizeTop10Shares` | Rescale so shares sum to **100** |
| 3 | `statement_i.share_%` | Displayed % on row `i` |

Contribution bars for the selected statement:

```
contrib[dim][k]_%   // Channel | Region | Stage → cut share
```

Period nudge: `shiftContribBreakdown(contrib, contribShift)` then re-normalize to 100.

### Live example — 7D top statements (shares)

| # | Problem statement | Share | Kind | State |
| --- | --- | --- | --- | --- |
| 1 | Delivery delayed past committed date, no proactive update | **20%** | slope | break |
| 2 | Refund not credited after return picked up | 16% | slope | break |
| 3 | Wrong / again item delivered on replacement | 12% | slope | shift |
| 4 | Installation not scheduled within SLA | 10% | slope | shift |
| 5 | Failed delivery marked without a real attempt | 9% | slope | shift |
| … | … | … | … | … |
| 10 | Counterfeit suspicion on branded item | 6% | **cliff** | break |

**#1 contribution (Channel, after 7D shift):** Voice leads (~58% baseline) — East region, In-transit / Post-delivery stages.

### Emerging imperfections

| Candidate | Evidence pattern |
| --- | --- |
| Jalna in-transit embargo — escalation creep +38% w/w | Escalation count × `negTotal` scale · embargo-tagged |
| Kolkata WH open-box mis-tag | Ticket count × scale · identical WH+SKU+OBD signature |

```
count_period = max(1, round(count_today × negTotal / baseline.negTotal))
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `count_today` | Authored escalation/ticket count |
| 2 | `negTotal` | Period negative universe |
| 3 | `baseline.negTotal` | Today **18,600** |

### Data required

| Field | Role | Source | Latency |
| --- | --- | --- | --- |
| Problem statement cluster | Top-10 labels | Intent / NLP | 5–15 min |
| Channel / region / stage | Contribution | Contact attributes | 5–15 min |
| New failure codes / lanes | Imperfections | Ops + tickets | 15–60 min |

### What to do

Select #1 → read Channel/Region/Stage → Flag / Route imperfections → push matching clusters on §04.

---

# 02 — Delivery signals

### What the UI shows

```
02 · Delivery signals
    Journey node (rows) × Category (cols) heat matrix
    Cell: Signal index · HIGH/MEDIUM/LOW · Units · IPD-met %
    AI · Delivery hotspot on selection
```

### Definition

Where anxiety **units** concentrate across fulfilment nodes and categories — weighted by IPD stress.

### How it is useful

Finds the **hottest intersection** (e.g. Last-mile × Large Appliances) for containment and IPD recovery — not a decorative heat map.

### Nodes (row split of high band)

| Node | Prop of `high` |
| --- | --- |
| Last-mile | 0.55 |
| In-transit | 0.25 |
| Returns | 0.125 |
| Installation | 0.075 |

```
totalUnits_node = round(high × prop_node)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `prop_node` | Share of high band attributed to that journey node |
| 2 | `totalUnits_node` | Node roll-up volume |

### Formula — cell risk (canonical rank)

```
ipdGap            = max(0, IPD_TARGET − ipdMet)
reliabilityStress = 0.55 + ipdGap / 16
riskScore         = (anxietyScore / 100) × reliabilityStress
riskIndex         = round(riskScore × 100)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `anxietyScore` | 0–100 anxiety on that node×category cell |
| 2 | `ipdMet` | Category IPD-met % (period-adjusted) |
| 3 | `ipdGap` | Points below **92** target |
| 4 | `reliabilityStress` | Amplifies risk when IPD is soft |
| 5 | `riskScore` | Continuous exposure score |
| 6 | `riskIndex` | Displayed cell “Signal” number |

**Tier (HIGH / MEDIUM / LOW)** — high if e.g. `anxietyScore ≥ 85` or `riskScore ≥ 0.84` (full rules in `riskTier`).

**Top hotspot**

```
TOP_CELL = argmax (units × riskScore)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `TOP_CELL` | Legend “Top intersection” |
| 2 | `units` | Scaled anxious units in the cell |

### Live example — cell ingredients

Category IPD baselines (before offset): Furniture **82.7%**, Large Appliances **86.4%**, Fashion **95.2%**, …  
Drill cell example (Last-mile × Large Appliances): high units + high anxietyScore → typically leads TOP_CELL.

On select, AI insight uses units, `riskIndex`, IPD gap, and node-specific action (re-promise / lane status / return restart / install lock).

### Data required

| Field | Role | Source | Latency |
| --- | --- | --- | --- |
| Journey node | Row | Shipment state | 5–15 min |
| Category | Column | Catalogue | 15–60 min |
| Anxious units | Cell volume | Anxiety model | 5–15 min |
| Category IPD-met | Reliability stress | Promise engine | 5–15 min |
| PIN / market drill | Under node | Address + 1P/3P | 15–60 min |

### What to do

Open TOP_CELL → copy AI hotspot into §04 outreach brief → assign Last-mile / In-transit / Returns / Installation owner.

---

# 03 — Reliability vs Anxiety

### What the UI shows

```
03 · Reliability vs Anxiety
    Promise breached | Promise met
      Pre-empt (bl) · Trust erosion (bh)
      Healthy (ml)  · Reassure (mh)
    Drivers + AI Summary Wall / Details
    Cliff vs Slope pies (event mix)
```

### Definition

2×2 of **promise state × anxiety** — the operating taxonomy for this screen.

### How it is useful

| Cell | Posture |
| --- | --- |
| **bh Trust erosion** | War-room — promise broken + high anxiety |
| **bl Pre-empt** | Honest re-promise before they notice |
| **mh Reassure** | Carve out of trust — progress updates, no compensation theatre |
| **ml Healthy** | Hold — do not pull CX capacity |

### Formula — cell share

```
share_cell_% = round(quad[cell] / negTotal × 100)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `quad[cell]` | Count in `ml` / `mh` / `bl` / `bh` |
| 2 | `negTotal` | Full universe (**121,400** on 7D) |
| 3 | `share_cell_%` | Cell share of the mix |

### Live example — 7D quad

| Cell | Name | Count | ~Share |
| --- | --- | --- | --- |
| `mh` | Reassure | 43,200 | 36% |
| `bh` | Trust erosion | 33,800 | 28% |
| `ml` | Healthy | 28,800 | 24% |
| `bl` | Pre-empt | 15,600 | 13% |

**bh drivers (baseline):** IPD miss + stuck-at-hub **46%** · Failed attempt, no re-attempt **29%** · Refund not credited **25%**.

Owner / time-to-act (Details tab):

| Cell | Owner | Time to act | Priority |
| --- | --- | --- | --- |
| bh | CX Ops · Last-mile | Immediate · before contact window | P1 |
| bl | CX Ops · Promise desk | Same day | P2 |
| mh | CX · Proactive messaging | Within service window | P3 |
| ml | CX Head · Monitor only | None | P4 |

### Cliff vs slope (event layer)

Slope (chronic): Delivery delayed, Refund not credited, Wrong replacement, Damaged, Hidden fee.  
Cliff (sudden): Item missing, Counterfeit suspicion, Account takeover.

Same decision rule as Trust: **volume ≠ priority** for cliffs.

### Data required

| Field | Role | Source | Latency |
| --- | --- | --- | --- |
| Promise breached flag | Vertical axis | Promise engine | 5–15 min |
| Anxiety band | Horizontal axis | Models / NLP | 5–15 min |
| Driver shares | Cell drivers | FCI / intent | 5–15 min |
| Cliff/slope tags | Pies | Failure taxonomy | 5–15 min |

### What to do

Default select **bh** → approve revised-ETA + escalate no-reattempt → then clear **bl** silent slips before they tip into bh.

---

# 04 — Proactive Customer Intervention Queue

### What the UI shows

```
04 · Proactive Customer Intervention Queue
    Customer problem | Journey stage | Cust. affected | Cust. signal
    Service status | Recommended intervention | Time to act | Actions
    Expand → Evidence · Outreach preview
```

### Definition

Action queue of **customer-problem clusters** — approve outreach or escalate with SLA countdown.

### How it is useful

Closes the Fluid loop: signal → evidence → owner action. Timer = minutes left to act.

### Formula — period scaling

```
units_period = scaleAnxietyUnits(units_today, period.high)
sla_period   = round(sla_today × clusterSlaScale)
```

| # | Symbol | Meaning |
| --- | --- | --- |
| 1 | `units_today` | Baseline customers affected |
| 2 | `units_period` | Scaled for period |
| 3 | `sla_today` | Seconds left to act (Today grain) |
| 4 | `clusterSlaScale` | 1.00 / **1.12** / 1.28 by period |
| 5 | `sla_period` | Displayed timer input |

### Service status (row tag)

| Status | Meaning | Outreach tone |
| --- | --- | --- |
| **Promise breached** | Committed date/SLA missed | Apology + revised ETA |
| **Service breached** | Post-delivery service miss (refund / return / install) | Fix + credit/slot ETA |
| **Within service window** | Carve-out — still inside promise | Reassure · keep out of trust flows |

`carve: true` rows highlight as within-window anxiety (yellow tint).

### Live catalogue (Today units — scale on period)

| ID | Problem | Node | Units | Band | Status |
| --- | --- | --- | --- | --- | --- |
| CL-2207 | Delivery promise missed — stuck at hub | Last-mile | 2,140 | High | Promise breached |
| CL-2213 | Failed delivery marked without attempt | Last-mile | 980 | High | Promise breached |
| CL-2219 | Shipment delayed in transit | In transit | 1,760 | Building | Within window (carve) |
| CL-2224 | Return pickup could not be scheduled | Returns | 540 | High | Service breached |
| CL-2231 | Installation pending beyond 48h | Installation | 410 | Building | Within window (carve) |
| CL-2251 | Refund delayed after initiation | Post-delivery | 890 | High | Service breached |
| … | … | … | … | … | … |

**7D units example (CL-2207):** `round(2140 × 81400/12400) ≈ 14,043` customers affected.

Actions: **Approve outreach** (fires `tmpl`) · **Escalate** to customer operations.

### Data required

| Field | Role | Source | Latency |
| --- | --- | --- | --- |
| Cluster label + evidence | Problem + proof | Ops events + contacts | 5–15 min |
| Journey node | Stage column | Shipment state | 5–15 min |
| Units / band | Affected + signal | Anxiety model | 5–15 min |
| Service status | Tag | Promise / service SLA | 5–15 min |
| Template + SLA timer | Intervention | Playbook + clock | Real-time |

### What to do

Sort attention: High + Promise/Service breached first → Approve within timer → Escalations when ops unblock needed → carve rows get reassure-only templates.

---

# Related: older Service Delivery intelligence (not mounted)

> `ServiceDeliveryIntelligence`, `TrustPulse`-style reliability/anxiety heroes in `cxHeadRetailV3ServiceDeliveryData.ts` exist but are **not** mounted on `HubServiceDeliveryScreen` today. Live screen = **Anxiety dashboard** only. Keep that file for hub-card sparks / future revive — do not treat those KPIs as current UI truth.

---

# C. Acceptance (pass/fail)

| Check | Pass |
| --- | --- |
| Quad identity | `ml+mh+bl+bh = negTotal` |
| Anxiety ≠ breach | Within-SLA anxiety carved out of trust apology flows |
| IPD target | Bar = **92%**; weakest category visible |
| Headroom | `headroomMin = ttContact − ttc`; outreach before contact |
| Top-10 shares | Sum to **100** after normalize |
| Matrix rank | Cell uses `riskScore = (anxiety/100) × reliabilityStress` |
| Queue scale | Units/SLA scale with period; carve rows tagged Within window |
| Spine | Signal → stage/category → owner → Approve/Escalate |

---

# D. Code map

| UI | Code |
| --- | --- |
| 00 Headline | `HubServiceDeliveryScreen.tsx`, `HubFluidHeadline` (`variant="service-delivery"`) |
| Period map | `anxietyPeriodFromTrustRange` · `NavigationContext.trustRange` |
| KPI triad | `AnxietyTriadKpiCards.tsx` · `getAnxietyPeriodMetrics` |
| 01–04 shell | `ServiceDeliveryAnxietyDashboard.tsx` |
| 01 Escalation | `getEscalationTop10` · `ANXIETY_TOP10` · `ANXIETY_IMPERFECTIONS` |
| 02 Matrix | `AnxietyJourneyPromisePanel.tsx` · `ANXIETY_NODE_DRILL` |
| 03 Quad + cliff/slope | `ReliabilityVsAnxietyPanel.tsx` · `ANXIETY_QUAD_CELLS` |
| 04 Queue | `ContainmentQueueScreen` · `ANXIETY_CLUSTERS` |
| Period data | `cxHeadRetailV3AnxietyData.ts` · `cxHeadRetailV3AnxietyMetrics.ts` |
| Hub purpose / card | `cxHeadRetailV3HubCards.ts` (`id: "service-delivery"`) |
| Unused alternate | `ServiceDeliveryIntelligence.tsx` · `cxHeadRetailV3ServiceDeliveryData.ts` |

---

# E. End-to-end loop (mirrors UI scroll)

```
00  Confirm question + period (24H / 7D / 30D)
KPI Anxiety load · IPD vs 92 · Headroom before contact
01  #1 escalation statement + contribution cuts + imperfections
02  Hottest journey × category cell
03  Trust erosion vs Reassure vs Pre-empt posture
04  Approve outreach / Escalate inside SLA timer
```

### Hard rejects

- Calling within-SLA anxiety a “trust break”  
- Ranking matrix cells by units alone (ignore `riskScore` / IPD gap)  
- Ignoring Pre-empt (`bl`) silent IPD slip  
- Outreach after `ttc ≥ ttContact` with no queue action  
- Opt-out ignored above **3%** while blasting notify rate  

---

*Living reflection of the Service Delivery hub UI (`ServiceDeliveryAnxietyDashboard`). When triad metrics, matrix risk rules, or queue clusters change, update the matching section — keep symbol tables with every formula.*
