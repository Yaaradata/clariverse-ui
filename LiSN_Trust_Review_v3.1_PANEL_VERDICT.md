# LiSN for Retail — TRUST JOURNEY REVIEW (v3.1)
## Six-person panel · scored against `LiSN_Retail_Trust_Spec_and_Rubric_v2_CONSOLIDATED.md` (163 pts, 23 blockers)

**Artefacts reviewed:** the Trust tile (home), the trust-related alert cards (AI Risk Spike Monitor row), the Trust detail view, and the journey between them.
**Sources:** the two screenshots + the full source tree from Drive (`lib/`, `components/hub/`, `components/screens/`, `components/common/`). Every file listed as Tier 1 and Tier 2 was read. Nothing is marked "cannot verify".

---

# A. CODE AUDIT

*(AI/Data Architect and Frontend Engineer report first, as instructed. The findings below change how the pixels are scored.)*

---

## Q1 — THE RANKING QUESTION (A3). The most important finding in this review.

**There is no sort.** Not a volume sort — *no sort at all*.

`components/hub/TrustBreakdownIntelligence.tsx`:

```tsx
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
  {TRUST_DRIVERS.map((d) => {
    const q = QUAD_META[classify(d)];
    const active = d.id === selected;
    const Icon = d.icon;
```

The eight driver cards render in the **literal declaration order of the `TRUST_DRIVERS` array** in `lib/cxHeadRetailV3TrustBreakdownData.ts`. That order happens to approximate volume (12,840 · 6,540 · 8,120 · 4,210 · 3,180 · 640 · 210 · 1,120), which is why it reads as volume-ordered on screen and why it is not strictly monotonic. Counterfeit sits at position six and Account Takeover at seven **because a developer typed them there.**

The one place a sort *does* exist is the Top Trust Breaker KPI:

```ts
const TOP_TRUST_DRIVER = [...TRUST_DRIVERS].sort((a, b) => b.complaints - a.complaints)[0];
```

Explicit volume sort. This is what puts "Damaged Product · 35%" at the top of the drill.

**And yet the severity model was built.** Same file:

```tsx
function classify(d: TrustDriver): TrustQuadKind {
  if (d.blast >= SCATTER_BY && d.incident < SCATTER_IX) return "cliff";
  if (d.blast >= SCATTER_BY && d.incident >= SCATTER_IX) return "hotspot";
  if (d.blast < SCATTER_BY && d.incident >= SCATTER_IX) return "ops";
  return "monitor";
}

const QUAD_META: Record<TrustQuadKind, {...}> = {
  cliff:   { label: "Cliff risk",                note: "Rare · high blast radius" },
  hotspot: { label: "Trust breakdown hotspot",   note: "Frequent · high blast radius" },
  ops:     { label: "Operational issue",         note: "Frequent · lower blast radius" },
  monitor: { label: "Monitor",                   note: "Rare · lower blast radius" },
};
```

`classify()` is called on every card. `QUAD_META[classify(d)]` is assigned to `q`. **`q` is then used for exactly one thing — `q.color` on the 18px lucide icon.** `q.label` and `q.note` are computed and thrown away. The `hotspot` quadrant *is* the spec's high-incidence-cliff cell (§2.4) and it is never named on screen.

> **AI/Data Architect:** "This is worse than a missing model. The team built the classifier, wired it into the render loop, and then piped it into an icon tint. A four-line change — `q.label` into a badge, `classify` into the sort comparator — and A2, A3, A4 and A5 all move. The intellectual work is done. The last four lines were never written."

**And `CliffSlopePieCharts.tsx` is not the trust model at all.** It imports from a completely different subsystem:

```tsx
import { ANXIETY_CLIFF_EVENTS, ANXIETY_SLOPE_EVENTS, scaleAnxietyNegUnits }
  from "../../lib/cxHeadRetailV3AnxietyData";
```

It is not imported by `TrustBreakdownIntelligence.tsx`. **It does not render on the Trust screen.** It is a Plotly donut on the Service Delivery / Anxiety canvas, drawing on a *second, unrelated* cliff/slope event list. So there are now **two cliff/slope models in the codebase that do not know about each other**, and the one that renders is on the wrong screen.

### The finding that changes the fix

**Fixing the sort key alone does not fix the screen.** Applying the spec's own formula to the shipped mock data:

| Driver | `incident` | `blast` | `incident × blast` | Rendered position |
|---|---|---|---|---|
| Damaged Product | 3.1 | 55 | **170.5** | 1 |
| Refund Not Credited | 1.6 | 78 | **124.8** | 2 |
| Wrong Item | 2.0 | 42 | **84.0** | 3 |
| Never Delivered | 0.9 | 70 | **63.0** | 5 |
| Hidden Platform Fee | 1.1 | 48 | **52.8** | 4 |
| Item Missing | 0.3 | 84 | **25.2** | 8 |
| **Counterfeit Concern** | **0.18** | **92** | **16.6** | **6** |
| **Account Takeover** | **0.06** | **96** | **5.8** | **7** |

Sort by `incident × blast` and **counterfeit still lands seventh.** The mock `incident` values were authored from the *classic rare-cliff* framing (§2.2, Vinodh's ~0.05%) and ignore §2.4 — the three-engine finding that in India counterfeit (~20% receipt rate, LocalCircles) and refund-not-credited (largest NCH category, ~28%) are **high-incidence cliffs**. The data contradicts the specification it is supposed to implement.

**Verdict Q1: A3 = 0. STRUCTURAL. Two fixes required, in order — (i) recalibrate `incident` and `blast` per §2.4, (ii) make `severityScore` the sort comparator. Doing (ii) without (i) leaves counterfeit buried and looks like a fix.**

---

## Q2 — THE DATA-MODEL QUESTION (I1–I3, G1, G2)

`lib/cxHeadRetailV3TrustBreakdownData.ts`, the trust-event interface, enumerated in full:

```ts
export interface TrustDriver {
  id: TrustDriverId;
  label: string;
  icon: LucideIcon;
  complaints: number;
  wow: number;
  sentNeg: number;
  conf: number;          // ✅ confidence — exists, never rendered on the card
  repeat: number;
  type: TrustDriverType; // ✅ "slope" | "cliff" — exists, never rendered anywhere
  incident: number;      // ✅ exists
  blast: number;         // ✅ blast radius — exists, never rendered anywhere
  meaning: string;
  next: string;
  dealPoints: readonly [string, string, string];
}
```

**Present but invisible:** `type`, `blast`, `incident`, `conf`.
**Absent entirely:** `originationStage`, `manifestationStage`, `detectionStage`, `fixOwner`, `sku`, `category`, `seller`, `pincode`, `channel`, `marketplaceVsOwned`, any P&L field, `anxietyWindowState`, `chronicity`.

### Two classification systems that disagree with each other

The hand-authored `type` field and the computed `classify()` produce different answers on the same data:

| Driver | `type` (authored) | `classify()` (computed) | Spec §2.1 says |
|---|---|---|---|
| Refund Not Credited | `"slope"` | `hotspot` | **CLIFF** (canonical) |
| Never Delivered | `"slope"` | `cliff` | SLOPE (canonical) |
| Counterfeit | `"cliff"` | `cliff` | CLIFF ✅ |
| Account Takeover | `"cliff"` | `cliff` | CLIFF ✅ |
| Item Missing | `"cliff"` | `cliff` | CLIFF ✅ |
| Damaged | `"slope"` | `ops` | SLOPE ✅ |

**Refund-not-credited — the fastest-rising event on the page (+22% WoW), the one Vinodh's own framing calls the fastest trust eroder, the largest NCH complaint category in the research — is hand-coded `"slope"`.** That is the mis-classification. It is not counterfeit; counterfeit is typed correctly and simply never shown.

### The "No active cliff breach" sentence is a hard-coded string

```ts
verdict: "Trust is eroding on a steep slope — damaged product leads at 35% of trust complaints
(+18% WoW), with refund-not-credited rising fastest (+22%). No active cliff breach, but counterfeit
signals in consumables need a compliance pass now.",
```

`TRUST_PULSE.verdict` is a literal. Three drivers on the page carry `type: "cliff"` (counterfeit, ATO, item-missing) and are live. **The AI summary asserts a fact its own data contradicts, in the same paragraph in which it tells you counterfeit needs a compliance pass now.** This is not a classification bug. It is a narrative that was never wired to the model.

> **Senior Product Leader, Retail:** "Put this in front of Suresh and the first question is 'you just told me there's no cliff breach and then told me to act on counterfeit — which is it?' There is no recovering the room from that. This one sentence does more damage than the missing badge."

### Owner

`TrustAction` carries `team: string`, hard-coded across six rows of section 05. The owner also lives in prose inside `TrustDriver.next` — *"→ Supply Chain"*, *"→ Payments"*, *"→ Marketplace"*, *"→ Trust & Safety"*, *"→ Fraud / Security"*, *"→ Ops"*. So the **information exists**; the **field does not**, and nothing derives it from an origination stage.

**Verdict Q2: I1 = 0, I2 = 0, I3 = 0, G1 = 1, G2 = 1. All STRUCTURAL. The owner data is already known, so `fixOwner` is a cheap populate once the field exists — but it is still a schema change and must be sequenced first.**

---

## Q3 — THE ACTION QUESTION (E3, E4)

The Route / Escalate / Act-now controls in section 05 are **not buttons**:

```tsx
<span style={{ display: "inline-flex", alignItems: "center", gap: 5,
               border: `1px solid ${btnColor}55`, background: `${btnColor}14`,
               color: btnColor, ... }}>
  {a.kind} <ArrowRight size={13} strokeWidth={2.6} />
</span>
```

A `<span>`. No `onClick`. No handler. They fire nothing, draft nothing, queue nothing.

The "How to Deal?" bullets are likewise display-only — `DriverAiHowToDeal` renders `dealPoints` as `<div>`/`<span>` text.

**So nothing on the Trust canvas executes an enforcement action. E3's *executable-control* clause is not breached.** But §5.3 bars **phrasing** as well as buttons:

> *"No button, CTA or phrasing on the CX canvas may imply enforcement."*

And the phrasing does:
- *"QA-hold repeat-damage sellers"* (damaged)
- *"Trust & Safety hold on flagged sellers"* (counterfeit)
- *"Lock wallet + force step-up auth"* (ATO)
- *"Instant credit on verified missing items"* (missing)
- *"Pull evidence on exposed listings"* (counterfeit)
- Tile: *"Act now with a packaging audit on top pincodes"*

The CX head cannot place a QA hold, cannot place a T&S hold, cannot lock a wallet and does not run packaging audits. Every one of these is a **push-to-owner**, phrased as a do.

> **Flipkart Operations Leader:** "Show me this and I will tell you, politely, that you have misunderstood my job. I do not hold sellers. I raise it with the people who do, and then I chase them. Change the verb and the card is correct. Leave the verb and you have told me, in my own domain, that I have powers I do not have. That is the demo-killing moment."

**`DraftActionFooter.tsx` exists and is a genuine draft-and-approve primitive** — approve button, `approveDraft()`, an audit log, and an *"Accepted by {last.acceptedBy} on {last.acceptedAt}"* trail. **`TrustBreakdownIntelligence.tsx` never imports it.**

**Verdict Q3: E3 = 1 (phrasing breaches the boundary). E4 = 0 (the draft-and-approve primitive exists and is unused on the Trust journey — this is a wiring job, not a build).**

---

## Q4 — THE COMPONENT-IDENTITY QUESTION (F4, B4)

**The tile and the drill read from two unrelated data objects.**

Tile — `lib/cxHeadRetailV3HubCards.ts`:

```ts
{
  id: "brand-risk",
  title: "Where is customer trust breaking — and why?",
  targetScreen: "hub-brand-risk",
  timeline: [ ... {
    label: "D6",
    heroValue: 72,
    rightPanel: {
      kind: "channels",
      channels: [
        { name: "Sentiment",  v: 0.55 },
        { name: "Resolution", v: 0.74 },
        { name: "CSAT",       v: 0.78 },   // ← hand-authored
        { name: "Fulfilment", v: 0.48 },
        { name: "Payments",   v: 0.52 },
      ],
    },
  }],
  drill: BRAND_RISK_DRILL,
}
```

Drill — `lib/cxHeadRetailV3TrustBreakdownData.ts`:

```ts
export const TRUST_PULSE = {
  trustIndex: 72,
  sentimentScore: 0.55,
  resolutionScore: 0.74,
  csatScore: 3.9,        // ← hand-authored, different scale
  ...
};
```

**CSAT 0.78 and CSAT 3.9 are not the same number formatted differently. They are two separately typed literals in two files.** Nothing reconciles them. The same is true of Fulfilment (0.48) and Payments (0.52), which exist only on the tile and appear nowhere in the drill, and of Repeat-contact Rate (2.1×), which exists only in the drill.

Worse: the tile renders CSAT, Fulfilment and Payments through `HubChannelSpec { name, v }` — a type built for **channel mix**. Outcome signals are being carried in a channel container.

**What *does* reconcile — and should be protected.** `hubHeroDelta()` computes `72 − 76 = −4` from `timeline[0].heroValue`. The −4 on the tile and the "−4 vs prior (76)" on the drill are the same derived number. Credit this: it is the only value on the journey that is computed rather than typed.

**The confidence chip — three implementations.**

1. `components/common/ConfidenceBand.tsx` (the shared primitive):

```tsx
const tone =
  band === "High" ? cssVar("positive")
  : band === "Low" ? cssVar("text-muted")
  : cssVar("severity-med");   // ← AMBER
```

**The shared confidence primitive renders "Med confidence" in amber.** This is a direct violation of B2 and of the call: *"amber red should never come."* It is not used on the Trust screen — which is the only reason B2 does not fail today. **It is a landmine: the first developer who "reuses the shared chip" on a trust card breaks a blocker.**

2. `InferredChip` — defined locally inside `TrustBreakdownIntelligence.tsx`, always accent purple, correct.
3. An "AI Confidence" chip inside `CliffSlopePieCharts.tsx`, correct.

**Verdict Q4: F4 = 1 (two data objects, not one source). B4 = 1 (three chips; the shared one is wrong).**

---

## Q5 — THE CONFIGURABILITY QUESTION (G3)

`components/screens/CXOverviewScreen.tsx` is fixed JSX:

```tsx
<div>{/* Executive Pulse */}</div>

<div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
  {HUB_JOURNEY_CARDS.map((card) => (
    <HubJourneyCard key={card.id} card={card} onClick={() => navigate(card.targetScreen)} />
  ))}
</div>

<div><AIRiskSpikeMonitor spikes={CX_HEAD_V3_RISK_SPIKES} ... /></div>
```

The three hub tiles are array-driven (reorder the array, reorder the tiles). **The three regions themselves are hard-coded**, and inside the drill `TrustBreakdownIntelligence` hard-codes `<section>` S1…S6 in fixed order. No registry, no widget config, no persistence, no reorder affordance.

Vinodh: *"don't lock in any of these views... everything is widgetized."*

**Verdict Q5: G3 = 1. BLOCKER FAIL. Partly structural (needs a section registry), and the array-driven hub row is the pattern to copy.**

---

## Q6 — THE GATING QUESTION (F1, J1)

```tsx
const [selected, setSelected] = useState<TrustDriverId>("damaged");
...
<section ref={deepRef} style={{ scrollMarginTop: 24 }}>   {/* always rendered */}
```

Section 02 is **always-on**, pre-seeded to `"damaged"`. Clicking a driver card calls `pickDriver()`, which sets state and `scrollIntoView`s.

The interaction is actually good — one click, in-place, ≤2 levels, no route change. **Credit F1 for the mechanic.** The problem is not depth, it is **altitude**: the always-on deep-dive puts a five-tile chart grid, a four-quadrant HVHF/HVLF/LVHF/LVLF matrix and twenty channel quotes permanently on a head's canvas, below an eight-card wall, above a six-row ops table.

> **Product Designer:** "Six full scroll-screens. A head reads the top band and one card. Everything from section 02 down is an analyst's workbench that happens to live on the boss's page."

**Verdict Q6: F1 = 2 (mechanic is right, density is wrong). J1 = 1. BLOCKER FAIL.**

---

## Q7 (unprompted, but decisive) — THE NAMING QUESTION IS A MODEL QUESTION (A1)

The UI title was fixed. **Nothing underneath was.**

| Layer | Value |
|---|---|
| Component | `HubBrandRiskScreen.tsx` |
| Headline variant prop | `<HubFluidHeadline variant="brand-risk" />` |
| Card id | `id: "brand-risk"` |
| Route | `targetScreen: "hub-brand-risk"` |
| Drill type | `drill: BrandRiskDrill` |
| Tile summary type | `BrandRiskTop { severity: "Critical" \| "Rising" \| "Stable" }` |

And `BRAND_RISK_DRILL` is still a **fully populated brand model**: competitor buzz (Amazon / Meesho / Myntra with comparative-buzz scores), an influencer watchlist, feature requests, a viral spread-map with rings `internal → reviews → social → viral`, and a `quality` list that says *"Counterfeit suspected: 156"* while the trust model says counterfeit is 640.

`HubBrandRiskScreen` renders `TrustBreakdownIntelligence`, so `BRAND_RISK_DRILL` is dead on the trust path — but it is still the declared type of the card's `drill` property, and it still holds a second, contradictory counterfeit number.

**This is not a filename nit. The product still has a brand-risk model with a trust label painted over the top, and a marketing data structure hanging off the trust card.** Spec §1.1: brand perception is price/value/selection/reach — *a marketing problem*. Competitor buzz and influencer watchlists have no business on a CX trust canvas.

**Verdict Q7: A1 = 1. BLOCKER FAIL. STRUCTURAL.**

---

## Q8 — FCI: LABEL PROBLEM OR TAXONOMY PROBLEM? (A7)

**Taxonomy problem.** Not just filenames.

`TrustBreakdownIntelligence.tsx` — the Trust screen itself — imports from the FCI module:

```tsx
import { WHATS_FAILING_CHANNEL_COLORS, WHATS_FAILING_SEGMENT_COLORS }
  from "../../lib/cxHeadRetailV3CustomerFciData";
```

Colour tokens only, so no FCI *metric* renders on the Trust screen — that much is fair. But the shared segment model is measured in FCI:

```ts
export type CallerSegmentRow = {
  key: CallerSegmentKey;
  interactions: number;
  sentiment: number;
  fciRate: number;      // ← the banking construct, as a first-class field
  ...
};
```

`fciRate` — not CPU, not resolution rate, not EPLU, not OCR. The retail spine (§Key vocabulary) is **absent from the model entirely**: there is no `cpu`, no `eplu`, no `ocr`, no `relationalNps` field anywhere in the trust or hub data. The Trust screen has invented its own metric (`repeat`, `sentNeg`) rather than measuring the retail construct.

Vinodh: *"in retail, we do not have it as a failed call — we actually say resolution."*

`EcommerceFciIntentHeatmap.tsx` exists but is **not** imported by `CXOverviewScreen` or `TrustBreakdownIntelligence`. **It does not render on the Trust journey. F1's no-heat-map rule is not breached — credit this.**

**Verdict Q8: A7 = 1. BLOCKER FAIL. STRUCTURAL — the metric spine must be built, not renamed.**

---

# B. VERDICT LINES

```
Artefact: Trust tile     · Persona: CX Head · Score: 53/163 (journey) · Blockers failed: 13 · Verdict: NOT-READY
Artefact: Trust detail   · Persona: CX Head · Score: 53/163 (journey) · Blockers failed: 17 · Verdict: NOT-READY
Artefact: Trust journey  · Persona: CX Head · Score: 53/163 (32%)     · Blockers failed: 18/23 · Verdict: NOT-READY
```

**Pass condition:** ≥139/163 **and** zero blockers below 2. The journey fails both, by a distance.

**Dimension breakdown**

| Dim | Score | Notes |
|---|---|---|
| **A** Framing & classification | **4 / 25** | The model exists in code and reaches nothing. |
| **B** Knowledge vs inference | **11 / 18** | The strongest dimension. Section 04 is real. |
| **C** Priority & 5-second read | **8 / 15** | The tile works. The drill leads with eight equal cards. |
| **D** The "why" layer | **8 / 15** | Cause cards exist — the confirmed v1 gap is closed. |
| **E** Actionability & authority | **3 / 15** | Weakest. Nothing drafts; the verbs breach the boundary. |
| **F** Drill-down | **4 / 12** | Good mechanic, no seller/SKU, tile↔drill does not reconcile. |
| **G** Data contract & flexibility | **8 / 18** | Per-channel discipline is excellent (G6 = 3). |
| **H** Exclusions | **5 / 9** | Counterfeit-compliance restraint is correct (H1 = 3). |
| **I** Order-stage model | **1 / 24** | Not built. Not partially built — not built. |
| **J** Persona portability | **1 / 12** | No tags ⇒ no field flip ⇒ no Phase 2. |

**Where the panel disagrees:** the Architect scores this higher than the Ops Leader.

> **AI/Data Architect:** "53 understates it. `type`, `blast`, `incident`, `conf`, `classify()`, `DraftActionFooter`, the per-driver cuts, the evidence contract — the substrate is *there*. This is a two-week wiring job, not a rebuild. I would tell the founder this is closer than the score implies."
>
> **Flipkart Operations Leader:** "53 overstates it. I cannot act within the hour from this screen. It does not tell me whose desk anything belongs on. It tells me to hold sellers I cannot hold, and it tells me there is no cliff while counterfeit is live. In a code-red stand-up I would be laughed out. What is 'there' in the repo is irrelevant to me — the screen is what I use."
>
> **Chair:** Both are right, and the disagreement *is* the instruction. The score reflects the screen (the Ops Leader's view). The **sequencing** reflects the repo (the Architect's view). Nine of the eighteen failed blockers are wiring, not building. Fix those nine first and the score roughly doubles inside a sprint.

---

# C. BLOCKING DEFECTS

| ID | Artefact | What is wrong | Why it fails | Type | Sev |
|---|---|---|---|---|---|
| **A3** | Drill | `TRUST_DRIVERS.map()` — no sort. Cards render in array order. `TOP_TRUST_DRIVER` sorts by `b.complaints - a.complaints`. And applying `incident × blast` to the shipped mocks *still* leaves counterfeit 7th. | §2.2 "Rank by the product, never by raw volume." §2.4 high-incidence cliffs. Test 6. | **STRUCTURAL** (data + comparator) | **P0** |
| **A2** | Tile + Drill | `type: "cliff" \| "slope"` exists on every driver and renders nowhere. `classify()` runs on every card; `q.label` is discarded. | §2.1 "must be visible on the card face, not buried in a model." | **COSMETIC** to render / **STRUCTURAL** to trust (refund is mis-typed) | **P0** |
| **A1** | Tile + Drill | `HubBrandRiskScreen`, `variant="brand-risk"`, `id: "brand-risk"`, route `hub-brand-risk`, `BrandRiskDrill`, and a live competitor/influencer/spread-map data structure hanging off the trust card. | §1.1 brand ≠ trust; brand is a marketing problem. | **STRUCTURAL** | **P0** |
| **A7** | Both | `fciRate` is a first-class field on the shared segment model. No `cpu`, `eplu`, `ocr` or `relationalNps` field exists anywhere. | §1.4 / Key vocabulary. "In retail we say resolution." | **STRUCTURAL** | **P0** |
| **I1** | Both | No `originationStage`. | §3.2 "the origination tag *is* the accountability routing." | **STRUCTURAL** | **P0** |
| **I2** | Both | No stage triad. | §3.2 | **STRUCTURAL** | **P0** |
| **I3** | Both | No `fixOwner` on the event. Owner exists only as `team` on six hard-coded `TRUST_ACTIONS` rows and as prose inside `next`. Does not propagate to the driver cards. | §3.2, §5.2(5). Test 7. | **STRUCTURAL** field / trivial populate | **P0** |
| **G1** | Both | No dimensional join tags on the event. `TRUST_EVIDENCE.tag` is a display string. The cuts are a side-table keyed by driver id, not tags. No `stage`. | §6.3 "day one… so Phase 2 is a field flip." | **STRUCTURAL** | **P0** |
| **J4** | Both | Consequence of G1: a Category lens would require a new data model. | §7.1. Test 8. | **STRUCTURAL** | **P0** |
| **E4** | Drill | Route / Escalate / Act-now are inert `<span>`s. `DraftActionFooter.tsx` exists, works, and is not imported. | §5.5 "LiSN drafts; a human approves." | **COSMETIC** (wiring) | **P1** |
| **E3** | Both | Enforcement verbs on a CX canvas: *QA-hold*, *Trust & Safety hold*, *Lock wallet + force step-up auth*, *Instant credit*, *Act now with a packaging audit*. | §5.3 "no button, CTA **or phrasing**… may imply enforcement." | **COSMETIC** (copy) | **P1** |
| **E2** | Both | Same. The action set exceeds the boundary. | §5.2 | **COSMETIC** | **P1** |
| **E1** | Drill | Six deep-dive tiles (category, seller-type, region, path, segment, channel), the four outcome sparklines and "Gap to target 8 pts" name no action. | §5.1 "A widget that reports and names no next step does not pass." | **COSMETIC** | **P1** |
| **B1** | **Tile** | No confidence marker anywhere on the tile, although Sentiment 0.55 is inferred and the Conversation AI block is pure inference. | §2.6 / B1. Test 4. | **COSMETIC** (`conf` exists) | **P1** |
| **B1** | Drill | Chips on Trust Index, Top Breaker and AI summary — but **not on the eight driver cards** (which carry `conf: 92/90/89/85/91/94/96/93`) and **not on the four segment cards** (which carry `conf: 87/86/88/85`). | §2.6 | **COSMETIC** | **P1** |
| **C1** | Drill | Eight equal-weight, unranked cards. The "3–4 critical areas to action" do not exist as a concept. | §4.2 — the screen's reason to exist. | **COSMETIC** once A3 lands | **P1** |
| **C4** | Drill | Top band: "Gap to target 8 pts", "Trust contacts 36,860", four outcome sparklines — no action on any. | §4 priority principle: the first 4–5 widgets must be actionable. | **COSMETIC** | **P1** |
| **F2** | Drill | Category ✅ pincode ✅ marketplace-vs-owned ✅ (`SplitBar` 68/32) — **seller identity and SKU absent entirely.** The counterfeit card cannot name the seller it wants held. | §6.1 "needed to make counterfeit and quality cards actionable." Test 2. | **STRUCTURAL** | **P1** |
| **G3** | Both | Fixed JSX regions on the home screen; hard-coded `<section>` S1–S6 in the drill. | §8.1 "don't lock in any of these views." | **STRUCTURAL** (registry) | **P2** |
| **J1** | Drill | Head canvas carries an HVHF/HVLF/LVHF/LVLF quadrant, a five-tile chart grid, twenty channel quotes and a six-row ops table. | §7.1 one persona per canvas. | Layout | **P2** |

### Non-blocking defects that will embarrass the demo

| ID | What | Fix |
|---|---|---|
| — | **`TRUST_PULSE.verdict` asserts "No active cliff breach"** while three drivers carry `type: "cliff"` and are live, in the same sentence that says counterfeit needs a compliance pass now. | Derive the verdict from the data. Never hand-author it. |
| **B2 latent** | `ConfidenceBand.tsx` renders `Med` as `severity-med` (**amber**). Unused on Trust today. | Fix the primitive before anyone reuses it. *"Amber red should never come."* |
| **H2** | `HVHF / HVLF / LVHF / LVLF` unexpanded; `Cx` as a column header; `POD`, `ND cohort`, `OFD loops`, `3PL` in user-facing strings. | Expand or remove. §9.5. |
| **H3** | `sentimentSpark: [0.61, 0.6, 0.59, 0.58, 0.57, 0.56, 0.55]` — a hand-authored monotone series, unchanged when the user switches 24H / 7D / 30D. Fabricated trend lines. §9.6. | Real series or no series. |
| **A9** | `TRUST_RAG.high.label = "Elevated"`; alert badges CRITICAL / HIGH; `BrandRiskTop.severity: "Rising"`. | Neutral labels; colour and the cliff/slope badge carry the state. §1.2. |
| **B6** | `severity: "moderate"` in `CX_HEAD_V3_RISK_SPIKES` renders as **HIGH** on screen. Severity is being inflated by the renderer. | Map honestly, or drop severity for cliff/slope. |
| **Exec Pulse** | *"Payment failures at checkout — 18.4K shoppers affected today"* is an **S3 trust event** (payment-debited-no-order). It appears in no trust driver, in no trust ranking and in no trust total. | Either it is a trust event and belongs in `TRUST_DRIVERS`, or the Executive Pulse is contradicting the tile beneath it. |

---

# D. DATA-MODEL DIFF — the highest-leverage output in this document

`lib/cxHeadRetailV3TrustBreakdownData.ts` → `interface TrustDriver`

| Field | In spec | In code today | Action |
|---|---|---|---|
| `cliffOrSlope` | required (A2, §2.1) | ✅ as `type` — **never rendered**; **refund mis-typed `"slope"`** | **RENDER + correct refund → `"cliff"`** |
| `blastRadius` | required (A4, §2.3) | ✅ as `blast` — **never rendered** | **RENDER + recalibrate** |
| `incidentRate` | required (A3, §2.2) | ✅ as `incident` — **never rendered** | **RENDER + recalibrate per §2.4** |
| `severityScore` | required (A3) — the sort key | ❌ | **ADD** — `incidentRate × blastRadius`, computed, asserted by a unit test |
| `highIncidenceCliff` | required (A5, §2.4) | ⚠️ `classify()` computes a `hotspot` quadrant and discards the label | **SURFACE** as a named badge |
| `originationStage` | required (I1, §3.2) | ❌ | **ADD + populate** |
| `manifestationStage` | required (I2) | ❌ | **ADD + populate** |
| `detectionStage` | required (I2) | ❌ | **ADD + populate** |
| `fixOwner` | required (I3) | ❌ (prose in `next`; `team` on 6 action rows) | **ADD + populate** — derive from `originationStage` |
| `tags.sku` | required (G1) | ❌ | **ADD** |
| `tags.category` | required (G1) | ⚠️ in `TRUST_DRIVER_CUTS` side-table only | **PROMOTE to the event** |
| `tags.seller` | required (G1) | ❌ (only marketplace-vs-owned *split*, no seller identity) | **ADD** |
| `tags.pincode` | required (G1) | ⚠️ cuts side-table only | **PROMOTE** |
| `tags.channel` | required (G1) | ⚠️ cuts side-table only | **PROMOTE** |
| `tags.time` | required (G1) | ❌ | **ADD** |
| `tags.stage` | required (G1) | ❌ | **ADD** |
| `tags.marketplaceVsOwned` | required (G1) | ⚠️ cuts side-table only | **PROMOTE** |
| `pnlMetric` + `pnlValue` | required (G2, §6.3) | ❌ (one prose mention of "18% of at-risk GMV" inside a segment string) | **ADD + populate** |
| `cpu` / `eplu` / `ocr` | required (§1.4, A7) | ❌ — `fciRate` exists instead | **ADD; delete `fciRate`** |
| `confidence` | required on every inferred value (B1) | ✅ as `conf` — **not rendered on driver or segment cards** | **RENDER** |
| `anxietyWindowState` | required (I7, §3.4) | ❌ (one prose row in `TRUST_ACTIONS`) | **ADD + populate** |
| `chronicity` (`chronic` / `acute` / `emergent`) | required (Test 5) | ❌ | **ADD** |

> **Every "ADD" in this table is a schema change. Schema changes must be sequenced *before* the UI work that consumes them.** Building the cliff/slope badge before `cliffOrSlope` is corrected on refund ships a badge that lies. Building the sort before `incidentRate` is recalibrated ships a ranking that still buries counterfeit and looks fixed.

### Named mock-data values — drop-in replacement for `TRUST_DRIVERS`

Recalibrated per §2.4 (counterfeit ~20% receipt rate; refund-not-credited the largest NCH category). `incidentRate` = % of orders in period; `blastRadius` = 0–100 network index.

| id | cliffOrSlope | incidentRate | blastRadius | **severityScore** | originationStage | manifestationStage | detectionStage | fixOwner | anxietyWindowState | chronicity | cpu | eplu | pnlMetric | pnlValue |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `counterfeit` | **cliff** | **4.2** | **92** | **386** | S1 Listing | S7 Usage | S8 Returns | Category / Seller Ops | contacting | chronic | 0.08 | 210 | GMV at risk + firm-level regulatory exposure | ₹0.9 Cr |
| `refund` | **cliff** *(was `slope`)* | **3.8** | **78** | **296** | S8 Refunds | S8 | S8 | **CX + Payments** *(the only one inside CX's own authority)* | contacting | chronic | 0.21 | 96 | Refund leakage + contact cost | ₹2.8 Cr |
| `damaged` | slope | 3.1 | 55 | 170.5 | S4 Pack | S6 Delivery | S8 | Supply Chain / Packaging | contacting | chronic | 0.34 | 118 | Reverse logistics + replacement | ₹4.1 Cr |
| `wrong` | slope | 2.0 | 42 | 84.0 | **S1 Catalogue** *(root cause is SKU mapping, not picking — this is why origination must be a field, not a constant)* | S6 | S8 | Marketplace / Catalogue | contacting | acute | 0.26 | 74 | Replacement + reverse logistics | ₹2.2 Cr |
| `never` | slope | 0.9 | **86** *(was 70 — see below)* | 77.4 | S6 Last Mile | S6 | S8 | Last Mile | **pre-contact** | acute | 0.41 | 142 | Refund + re-ship + GMV at risk | ₹1.9 Cr |
| `hidden` | slope | 1.1 | 48 | 52.8 | S2 Checkout | S2 | S8 | Pricing / Product | contacting | chronic | 0.12 | 31 | Checkout drop-off / GMV at risk | ₹1.6 Cr |
| `missing` | cliff | 0.3 | 84 | 25.2 | S4 Picking | S6 | S8 | Supply Chain / Dark Store | contacting | acute | 0.18 | 158 | Instant credit + contact cost | ₹0.7 Cr |
| `ato` | cliff | 0.06 | 96 | 5.8 | S9 Account | S9 | S8 | Trust & Safety / Fraud | **escalated** | acute | 0.05 | 268 | Wallet write-off + fraud loss | ₹0.4 Cr |

**Sorted by `severityScore` the eight cards now read: Counterfeit · Refund · Damaged · Wrong Item · Never Delivered · Hidden Fee · Item Missing · Account Takeover.**

**Test 6 passes.** Counterfeit leads. Damaged drops to third. The high-incidence-cliff cell (§2.4) is occupied by exactly the two events the research said would occupy it.

**`never.blastRadius` should be computed, not typed.** `CX_HEAD_V3_RISK_SPIKES` already carries the input — `#NeverDelivered`, mentions `620 → 1,588`, `+214%`. That is the only true network-effect signal in the product and it is stranded in an alert card. Wire it: `blastRadius = f(publicMentions, reach, hashtagVelocity)`, **per channel, never aggregated** (§2.3, G6).

### Panel disagreement on the sort — surfaced, not resolved away

> **Architect:** Pure `severityScore`. It is honest, it is testable, and with the corrected data it produces the right answer. ATO lands eighth because ATO genuinely is rare.
>
> **Ops Leader:** ATO eighth is wrong at 95% negative sentiment and a wallet being drained. Pin every `cliff` above every `slope`.
>
> **Chair — ruling:** **The sort key is `severityScore`** (a `cliff` group-pin is a layout decision masquerading as a model, and it lets bad data hide). **The layout compensates**: section 01 renders a **Cliff row** and a **Slope row**, each internally sorted by `severityScore`. Rare cliffs are never below the fold; the arithmetic stays honest. The unit test asserts `counterfeit.severityScore > damaged.severityScore`.

---

# E. COMPONENT-BY-COMPONENT

## E1 — THE TRUST TILE (`HubJourneyCard` + `HUB_JOURNEY_CARDS["brand-risk"]`)

### PRESERVE — be specific; the developer must know what to protect

1. **The title.** *"Where is customer trust breaking — and why?"* The screen is titled as the question. Not "brand". Not "at risk". This is A1's visible half, done exactly right. **Do not let the rename of the component break this string.**
2. **`hubHeroDelta()`.** The only derived number on the journey. `72 − 76 = −4`, computed from `timeline[0].heroValue`. Delta adjacent to the number, never stranded (C2 = 3). **This is the pattern; copy it everywhere else.**
3. **The narrative reconciles with the drill.** *"top breaker is damaged product… refund-not-credited up 22% WoW"* is true of `TRUST_DRIVERS` today. Credit it, and keep it true by deriving it.
4. **`HubJourneyCard` is one shared component across all three tiles.** The tile layer is not the drift risk. The *data* layer is.

### REMOVE

| Remove | Replaced by |
|---|---|
| `rightPanel: { kind: "channels", channels: [...] }` on the trust card — outcome signals carried in a channel container, with a hand-authored CSAT on the wrong scale | `rightPanel: { kind: "outcomeSignals" }` reading **directly from `TRUST_PULSE`** |
| `BrandRiskTop { severity: "Critical" \| "Rising" \| "Stable" }` | `TrustTopLine { topCliff, cliffCount, severityLeader }` |
| `drill: BRAND_RISK_DRILL` — competitor buzz, influencer watchlist, feature requests, viral spread-map, a second contradictory counterfeit count | Delete. §1.1: brand perception is a marketing problem and does not belong on this canvas. |
| Tile action copy *"Act now with a packaging audit on top pincodes"* | *"Route packaging audit to Supply Chain · top 5 pincodes"* |

### CHANGE

| Component | Exact change | Acceptance criterion |
|---|---|---|
| `HubJourneyCard` (trust variant) | Add `<ConfidenceChip conf={TRUST_PULSE.modelConfidence} />` to the Conversation AI block | The tile renders a confidence marker; it is never amber or red |
| `HubJourneyCard` (trust variant) | Add `<TrustSeverityBadge>` under the hero: `Cliff · 4 live` + top cliff name | The tile names the top cliff without a click |
| `cxHeadRetailV3HubCards.ts` | `id: "brand-risk"` → `"trust"`; `targetScreen: "hub-brand-risk"` → `"hub-trust"`; `variant="brand-risk"` → `"trust"` | `grep -ri "brand-risk\|brandRisk\|BrandRisk" components/role-based-dashboard/cx-head-retail-v3/` returns zero hits |
| `HubBrandRiskScreen.tsx` | Rename → `HubTrustScreen.tsx` | ditto |
| Outcome signals | CSAT must render on **one** scale, from **one** source | See §G |

### ADD

| Component | Data source | Encoded dims | Action | Position |
|---|---|---|---|---|
| `TrustSeverityBadge` | `TRUST_DRIVERS[].cliffOrSlope`, `.blastRadius` | 2 | opens the drill, cliff-filtered | under the hero number |
| `ConfidenceChip` (shared, fixed) | `TRUST_PULSE.modelConfidence` | 1 | none | Conversation AI header |

---

## E2 — THE TRUST-RELATED ALERT CARDS (`AIRiskSpikeMonitor` + `CX_HEAD_V3_RISK_SPIKES`)

**First task, as instructed: which of these are trust events?**

| Card | Stage | Trust event? |
|---|---|---|
| Checkout Failure Spike | **S3 payment** — debited-but-no-order | **YES** |
| Social Complaint Trending (#NeverDelivered) | **S6 last mile** | **YES** |
| Refund Request Surge | **S8 refunds** | **YES** |
| Platinum Churn Risk | — retention signal | **NO** |
| App Experience Drop | — iOS cart-sync bug | **NO** |

**Three of five are trust events. The screen gives a CX head no way to tell.** The `RiskSpike` type has no trust flag, no `cliffOrSlope`, no `originationStage`, no `fixOwner`. The owner is buried in prose (*"escalate to platform team"*). The three trust alerts appear in no trust total, feed no trust ranking, and are not reachable from the Trust tile.

**Score it, as the prompt directs: this is a finding in itself. A9 = 1, B6 = 2, G5 = 2, A4 = 0.**

### The single worst waste on the page

**Social Complaint Trending carries `#NeverDelivered · mentions 620 → 1,588 · +156% · hashtag +214%`.**

That is a **live, moving, real blast-radius measurement** — the exact quantity §2.3 calls *"the mechanism by which trust dies"* and the exact quantity the trust model fakes with a hard-coded `blast: 70`. It sits in an alert card, in a different data file, feeding nothing.

> **Data-Visualisation Specialist:** "You have built the network-effect signal. You are rendering it as a spike badge. Then, forty pixels above, you are ranking trust events by a blast-radius constant somebody typed. Connect the two and A4 stops being a gap."

### REMOVE / CHANGE / ADD

| Action | Detail | Acceptance |
|---|---|---|
| **ADD** field | `isTrustEvent: boolean` + `originationStage` + `fixOwner` on `RiskSpike` | Every trust alert renders a Trust pip; every alert names an owner |
| **ADD** component | `TrustAlertPip` — shield glyph on trust alerts only | A CX head can sort trust from non-trust in under 2 seconds |
| **CHANGE** | `severity: "critical" \| "moderate"` renders as CRITICAL / **HIGH** — inflation | Severity renders as authored, or is replaced by the cliff/slope badge |
| **CHANGE** | Rename `AIRiskSpikeMonitor` → **`AnomalySpikeMonitor`**. The subtitle already says *"Live detection of sudden … shocks"* — detection, not prediction. Make the name match the subtitle. | No component name claims a capability LiSN lacks (B6, §9.4) |
| **CHANGE** | Badges CRITICAL / HIGH | Neutral label + colour + cliff/slope badge (A9) |
| **WIRE** | `#NeverDelivered` mentions/velocity → `TrustDriver.blastRadius` for `never`, **per channel** | `never.blastRadius` moves when the hashtag moves. Never aggregated across channels (G6). |

---

## E3 — THE TRUST DETAIL VIEW (`TrustBreakdownIntelligence.tsx`)

### PRESERVE — and be generous, because this is earned

1. **Section 04, "Evidence & explainability", is the best thing in the product.** *Signal type: **Inference*** · *Sources used: Chat · Email · Voice · Tickets · X* · *Missing validation: **CSAT & Relational NPS***.

   That last line is remarkable. The screen **volunteers what would falsify it**. It is the literal answer to Test 4 — *"my CSAT says trust is improving, validate what you're saying"* — printed on the screen before the buyer asks. It is also the exact enrichment pitch from §2.6: *"a base layer of knowledge you can query; enrich it with your survey data and we cross-validate."*

   > **Senior Product Leader:** "I have not seen a vendor screen do this. Most hide the inference. This one names it, names its sources, and names its own blind spot. **Do not let a single line of the rebuild touch section 04.** If anything, promote it."

2. **"Relational NPS"** — correct retail vocabulary, correctly distinguished from transactional CSAT (per Vinodh). Keep the term exactly.
3. **Marketplace vs Flipkart-fulfilled** (`SplitBar`, 68/32). Asked whether the CX head wants this: *"Everything. They will want to know."* Present. (F2, partially.)
4. **Per-channel discipline.** `TrustChannelCutRow` keeps quotes and shares **per channel** with tabs. Nothing is aggregated into one cross-channel virality number. **This is G6 = 3, the only clean 3 on the board, and it is the one banking rule §2.3 says survives into retail. Protect it explicitly — a future "total social buzz" tile would break it.**
5. **`DriverAiHowToDeal`** — every driver card names three next steps. §5.1's test ("a widget that names no next step does not pass") is passed by the driver cards. The verbs are wrong; the *structure* is right.
6. **Section 05's Owner Team column, and the `"CX — owned lever"` tag.** The beginnings of the authority-boundary model, and the beginnings of the Phase-2 bridge. It just needs to move **up**, onto the card.
7. **`TrustDriverCut`** — the operational↔voice join actually exists per driver: category × seller-type × pincode × fulfilment path (operational) joined to channel quotes (voice), at cohort level, never identity level. That is §6.2's moat, built.
8. **Evidence tags** — *"Damaged product · Mobiles · High-frequency"*, *"Reach ≈ 24k impressions"*. These are the **shape** of the G1 join tags. They are strings, not fields — but the developer already knows what the tags are.
9. **The `never` action row** — *"contact not yet raised · Fire proactive re-promise notifications before contact"* — is precisely the anxiety-window concept (I7, §3.4), and it is CX's highest-value owned lever. It is a one-off string in a table. **Make it a field.**
10. **Section 04 restraint on counterfeit.** *"High severity + regulatory exposure"* → **Trust & Safety / Compliance**. Firm-level. No per-transaction regulatory label. No regulator as an actor. §9.1 honoured exactly. **H1 = 3.**

### REMOVE

| Remove | Why | Replaced by |
|---|---|---|
| `"Gap to target 8 pts"` KPI | Names no action (C4). A gap is not a lever. | **`Cliff events live: 4`** — clickable, filters section 01 to cliffs |
| `"Risk Level: Elevated"` + `TRUST_RAG {watch/high/crit}` | Judgmental label (A9, §1.2) | Cliff/slope badge + colour. Colour carries state; words do not pre-judge. |
| `sentimentSpark` / `resolutionSpark` / `csatSpark` / `repeatContactSpark` | Hand-authored monotone 7-point series that do not change when the 24H/7D/30D selector changes. Fabricated trend lines (§9.6, H3). | Real series, or no series. |
| `SegmentMatrixViz` with raw `HVHF / HVLF / LVHF / LVLF` | Internal shorthand on a head canvas (§9.5, H2). Also a 2×2 matrix on a head screen. | Two labelled bars: **High-value** and **High-frequency**, expanded in words |
| `Cx` column header in `DonutChart` | Backend shorthand | `Contacts` |
| `dealPoints` verbs: *QA-hold*, *Trust & Safety hold*, *Lock wallet + force step-up auth*, *Instant credit*, *Pull evidence* | §5.3 — phrasing implies enforcement CX does not have | See CHANGE, below |
| `TRUST_PULSE.verdict` as a literal string | Asserts "No active cliff breach" while three `type: "cliff"` drivers are live | Derived verdict (see CHANGE) |
| `BRAND_RISK_DRILL` (competitor buzz, influencers, feature requests, spread-map, second counterfeit count) | §1.1 — a marketing model on a CX trust canvas | Delete |

### CHANGE

| # | Component | Exact change | Acceptance criterion |
|---|---|---|---|
| 1 | `TrustBreakdownIntelligence` §01 | `TRUST_DRIVERS.map(...)` → `[...TRUST_DRIVERS].sort((a,b) => b.severityScore - a.severityScore).map(...)` | A unit test asserts `drivers[0].id === "counterfeit"` and `counterfeit.severityScore > damaged.severityScore` |
| 2 | Driver card face | Render `q.label` — the value `classify()` already computes — as a badge, next to `blastRadius` | Every one of the eight cards renders a Cliff/Slope badge and a blast-radius figure on the card face, with no click |
| 3 | Driver card face | Render `<StageOwnerTag origination={d.originationStage} owner={d.fixOwner} />` | Every card names an origination stage and a named fix owner |
| 4 | Driver card face | Render `<ConfidenceChip conf={d.conf} />` — the field already exists (92/90/89/85/91/94/96/93) | Every inferred value on the card carries a confidence marker; none is amber or red |
| 5 | Driver card face | Render `<AnxietyWindowChip state={d.anxietyWindowState} />` | Every card shows: *detected, contact not yet received* / *customers contacting* / *escalated* |
| 6 | `dealPoints` copy | *"QA-hold repeat-damage sellers"* → **"Push to Seller Ops: QA hold on repeat-damage sellers"**. *"Trust & Safety hold on flagged sellers"* → **"Push to Trust & Safety: hold request on flagged sellers"**. *"Lock wallet + force step-up auth"* → **"Escalate to Fraud: wallet lock + step-up auth"**. *"Instant credit on verified missing items"* → **"Service: instant credit, SOP-driven"**. Tile: *"Act now with a packaging audit"* → **"Route packaging audit to Supply Chain"**. | No string on the CX canvas contains an enforcement verb in the imperative. Every out-of-boundary action is phrased **push-to-owner** with the owner named. |
| 7 | Section 05 action cells | `<span>{a.kind}</span>` → `<DraftActionFooter draftText={a.action} draftKind={...} />` — **the component already exists** | Clicking Route / Escalate / Act-now opens a draft for human approval and writes an audit-log entry. Nothing auto-fires. |
| 8 | `TRUST_PULSE.verdict` | Derive from the data: `cliffCount = TRUST_DRIVERS.filter(d => d.cliffOrSlope === "cliff" && d.wow > 0).length` | The verdict never asserts "no cliff breach" while a live cliff exists. A unit test asserts this. |
| 9 | `refund.type` | `"slope"` → `"cliff"` | §2.1 canonical cliff list is honoured by the data |
| 10 | `ConfidenceBand.tsx` | `band === "Med" ? cssVar("severity-med")` (**amber**) → accent | *"Amber red should never come."* The shared primitive can never render confidence in amber or red. |
| 11 | All chips | Delete the local `InferredChip` in `TrustBreakdownIntelligence`; delete the local chip in `CliffSlopePieCharts`; use the fixed `ConfidenceBand` everywhere | Exactly one confidence component exists in the codebase. `grep -c "Confidence" components/` finds one implementation. |
| 12 | `<section>` S1–S6 | Hard-coded JSX → `SECTION_REGISTRY: SectionSpec[]` and `.map()`, mirroring the pattern `HUB_JOURNEY_CARDS` already uses on the home screen | Reordering the registry array reorders the drill. Nothing is locked. |
| 13 | Six deep-dive `CutTile`s | Every tile gets a footer action | No widget on the screen reports without naming a next step |

### ADD

| Component | Data source | ≤2 dims | Action | Position |
|---|---|---|---|---|
| **`SellerSkuCutTile`** | `TrustDriverCut.sellerSku` — **new** | seller × complaints | *"Push seller to Category / Seller Ops"* | Section 02, tile 1. **Without this, the counterfeit card cannot name the seller it wants held — Test 2 fails.** Mock: `SLR-88213 · NutriBaby Store · 91% of counterfeit · Baby & food` |
| **`CorrelatedDefectTile`** | join on `orderId` across drivers | delay × damage | *"Route the correlated lane to Supply Chain"* | Section 02, tile 6. §6.1: *"whenever there is a delivery delay, is there also quality damage?"* (F3 = 0 today) |
| **`TrustStageJourneyStrip`** | `TrustDriver.originationStage` | stage × contacts | click → filter section 01 to that stage | **Directly under the KPI band.** The one legitimate funnel (§3.7.2). Answers "where in the order lifecycle is trust leaking this week" before any card is read. |
| **`CostIndexByStage`** | `pnlValue` grouped by `originationStage` | stage × ₹ | *"Export to steer-co"* | Section 02. §3.3: *"the number that makes a Category head move."* (I6 = 0 today) |
| **`NewImperfectionDetector`** — the Jalna card | escalation clusters **not matching any tracked `TrustDriverId`**, trending WoW | cluster × velocity | *"Promote to tracked imperfection"* | **Section 01, first row, full width.** Ranked #1 white space by all three research engines. Structurally impossible for a BI tool. **This is LiSN's strongest claim and it does not exist.** Mock: `"Delivery delay — weather/flood cited" · 112 → 486 escalations · +334% WoW · not a tracked imperfection · candidate for promotion` |
| **`MultiImperfectionCohortCard`** | orders carrying ≥2 imperfections across stages | orders × imperfection count | *"White-glove recovery"* | Section 03. §3.5: three slopes in one order is a cliff. No volume dashboard surfaces this. Mock: `2,140 orders carrying ≥2 imperfections · S5 delay → S6 damage → S8 refund friction · 3.1× churn rate` |
| **`SteeringCommitteeExport`** | top 10 by `severityScore`, grouped by `fixOwner` | — | one click → the top-10-to-fix artefact | Header, beside the range selector. §7.4 — *"the most politically valuable output the product can produce."* (G4 = 0, Test 3 fails) |
| **`BridgeCardExport`** | `originationStage` + `fixOwner` + CX evidence + `pnlValue` + **the champion's name** | — | *"Send to Category head"* | On every card whose `fixOwner` is a pre-order team. §7.3 — *"the card travels as 'flagged by CX — [champion]'s team'."* This is how LiSN gets **pulled** into Phase 2 rather than having to sell upward. |

---

# F. LAYOUT INSTRUCTION

## The tile — what must survive the 5-second read

```
┌────────────────────────────────────────────────────────┐
│ 🛡  Where is customer trust breaking — and why?        │
│    Trust Index · Cliff events · Top breaker            │
│                                                        │
│    72   −4 pts        ◤ CLIFF · 4 LIVE                 │  ← delta adjacent (keep)
│    ▁▂▃▅▆  sparkline   Counterfeit leads · blast 92     │  ← NEW, replaces the 5-bar
│                                                        │     outcome-signal stack
│  ✨ CONVERSATION AI                 [Confidence 91%]   │  ← NEW chip
│  Counterfeit is the highest-severity live cliff        │
│  (0.18% incidence × 92 blast). Refund-not-credited     │
│  is the fastest riser (+22%).                          │
│  → Push seller compliance review to Trust & Safety     │  ← push, not "act now"
└────────────────────────────────────────────────────────┘
```

Five outcome-signal bars (Sentiment/Resolution/CSAT/Fulfilment/Payments) are **five numbers no one can act on** in the space where the cliff count belongs. Move them into the drill, on one scale, from one source. The tile answers *"is trust eroding, and what is the worst thing?"* — nothing else.

## The drill — above the fold

| Row | Content |
|---|---|
| **1** | Trust Index `72 −4` · **Cliff events live: 4** · Top severity: Counterfeit · Trust contacts 36,860 · `[Export to steer-co]` |
| **2** | **`TrustStageJourneyStrip`** — where trust is leaking across S1…S9 this week. Clickable. |
| **3** | **`NewImperfectionDetector`** (full width) + **the top 3–4 cards only**, sorted by `severityScore`, in a **Cliff row** and a **Slope row** |

**Below the fold:** the remaining drivers · section 02 deep-dive (**gated — renders only after a card is selected**) · segments · evidence · actions.

Section 02's five-tile chart grid, the segment quadrant and the twenty channel quotes are analyst-altitude. Gate them behind an explicit click and the head's canvas is a head's canvas (J1).

> **Product Designer:** "The tile passes the 5-second test today, and that is not nothing. The drill fails the 2-minute test — six scroll-screens, ten-pixel type on a dark ground, `Cx` as a column header, `LVLF` as a label. Check contrast at HD share resolution before this goes on a projector in a steer-co."
>
> **Data-Visualisation Specialist, dissenting on the theme:** "The dark theme is not the problem. The problem is a donut, a split bar, a bar chart, a flow bar, a 2×2 quadrant and a tabbed quote list all on one row of one screen. That is six chart idioms competing for one decision. Cut to two."
>
> **Chair:** Dark theme is permitted for a polished exec demo with verified contrast. **Verify the contrast at 1080p share.** The chart-wall objection is upheld — gate section 02.

---

# G. TILE ↔ DRILL CONTRACT

**One source of truth: `TRUST_PULSE` and `TRUST_DRIVERS`. The tile reads from them. It does not restate them.**

| Value | Tile today | Drill today | Contract |
|---|---|---|---|
| **CSAT** | **0.78** (`HubChannelSpec.v`) | **3.9** (`TRUST_PULSE.csatScore`) | **One field, one scale.** `csatScore: 3.9` on a 5-point scale. The tile renders `TRUST_PULSE.csatScore`. `0.78` is deleted. |
| Trust Index | 72 | 72 | ✅ **Already reconciles. Protect it.** |
| Delta | −4 (derived) | −4 vs prior (76) | ✅ **Derived from `timeline[0]`. This is the pattern to copy.** |
| Sentiment | 0.55 | 0.55 | Both read `TRUST_PULSE.sentimentScore` |
| Resolution | 0.74 | 0.74 | Both read `TRUST_PULSE.resolutionScore` |
| **Fulfilment** | **0.48** | **absent** | Exists only on the tile. Either promote it into `TRUST_PULSE` or delete it. |
| **Payments** | **0.52** | **absent** | Same. |
| **Repeat-contact** | **absent** | **2.1×** (derived) | Promote to the tile — it is the only *derived* outcome signal there is. |
| Top breaker | "damaged product" (narrative) | Damaged Product 35% | Both must read `drivers[0]` **after the severity sort** — i.e. both become **Counterfeit**. |
| Trust contacts | absent | 36,860 | Add to tile, or accept the asymmetry deliberately and document it |
| Cliff count | absent | absent | **Add to both.** It is the headline. |
| Executive Pulse | *"Payment failures at checkout — 18.4K shoppers"* (an **S3 trust event**) | absent from every trust total | Either add `payment-failure` to `TRUST_DRIVERS`, or the Executive Pulse is contradicting the tile directly beneath it. |

**Acceptance:** delete the `channels` array from the trust hub card entirely. The tile imports `TRUST_PULSE`. A test asserts every numeric on the tile has a `TRUST_PULSE` or `TRUST_DRIVERS` provenance.

---

# H. ACCEPTANCE CRITERIA — numbered, objectively testable

**Schema (must land first)**
1. `TrustDriver` carries: `cliffOrSlope`, `incidentRate`, `blastRadius`, `severityScore`, `originationStage`, `manifestationStage`, `detectionStage`, `fixOwner`, `anxietyWindowState`, `chronicity`, `confidence`, `pnlMetric`, `pnlValue`, `cpu`, `eplu`, and a `tags` object with `sku`, `category`, `seller`, `pincode`, `channel`, `time`, `stage`, `marketplaceVsOwned`.
2. `TRUST_DRIVERS[6].cliffOrSlope === "cliff"` for `refund` (was `"slope"`).
3. `severityScore === incidentRate * blastRadius` for all eight drivers, asserted by a unit test.
4. `fciRate` does not exist anywhere in the repo. `cpu`, `eplu`, `ocr` do. `grep -ri "fci" lib/ components/` returns zero hits inside the CX-head-retail-v3 tree.
5. `grep -ri "brand-risk\|brandRisk\|BrandRisk" components/role-based-dashboard/cx-head-retail-v3/` returns zero hits.

**Ranking**
6. The driver-card sort key is `severityScore`, descending, asserted by a unit test.
7. That test asserts `drivers[0].id === "counterfeit"` and `counterfeit.severityScore > damaged.severityScore`.
8. Section 01 renders a **Cliff row** and a **Slope row**; every `cliffOrSlope === "cliff"` event renders above the fold regardless of score.

**Card face**
9. Every one of the eight driver cards renders a **Cliff/Slope badge** and a **numeric blast radius**, with no click.
10. Every driver card renders an **origination-stage tag** and a **named fix owner**.
11. Every driver card renders an **anxiety-window state**: *detected, contact not yet received* / *customers contacting* / *escalated*.
12. Every driver card and every segment card renders a **confidence marker**.
13. Every card renders a **named P&L destination metric** with a value.

**Confidence**
14. Exactly one confidence component exists in the codebase.
15. That component **cannot** render amber or red for any band. A unit test asserts `tone !== severityMed && tone !== severityHigh` for every input.
16. The Trust **tile** renders a confidence marker.

**Actions**
17. No string on the CX canvas contains an enforcement verb in the imperative. Every out-of-boundary action is phrased *"Push to {owner}"* or *"Escalate to {owner}"* with the owner named.
18. Clicking Route / Escalate / Act-now renders `DraftActionFooter`, opens a draft for human approval, and writes an audit-log entry. **Nothing auto-fires.**
19. Every widget on the screen names an action. Zero widgets report without a next step.

**Consistency**
20. CSAT renders on the same scale on the tile and the drill, from one field.
21. Every numeric on the Trust tile has a provenance in `TRUST_PULSE` or `TRUST_DRIVERS`.
22. `TRUST_PULSE.verdict` is derived, not authored. A unit test asserts it never contains *"no active cliff breach"* while a live cliff exists.

**Drill**
23. A `SellerSkuCutTile` renders seller identity and SKU for the selected driver.
24. A `CorrelatedDefectTile` renders delivery-delay ↔ damage correlation.
25. Section 02 renders **only after** a driver card is selected.

**Flexibility & the bridge**
26. The drill's section order is driven by `SECTION_REGISTRY`; reordering the array reorders the screen.
27. One click produces the **top-10-to-fix** export: problem statement + underlying pattern + accountable owner per item, usable without editing.
28. Every card whose `fixOwner` is a pre-order team exposes a **bridge card** carrying origination stage, fix owner, CX evidence, P&L metric **and the CX champion's name**.

**Alerts**
29. Every trust-carrying alert in the spike row renders a Trust pip and a named owner.
30. `never.blastRadius` is computed from `#NeverDelivered` mention velocity, **per channel**, never aggregated.

**Copy**
31. No user-facing string contains `HVHF`, `HVLF`, `LVHF`, `LVLF`, `Cx`, `POD`, `ND`, `OFD` or `3PL`.
32. No label pre-judges. "Elevated", "Critical", "Rising" are replaced by colour + the cliff/slope badge.

---

# I. FAST PRE-DEMO PASS (the 8 checks)

| # | Check | Result |
|---|---|---|
| 1 | Does the **tile** answer "is trust eroding?" in 5 seconds? | ✅ **PASS.** 72, −4, adjacent, largest, titled as the question. The one clean pass. |
| 2 | Do the **3–4 critical trust areas** lead the detail view? | ❌ Eight equal cards, unranked. |
| 3 | Cliff/Slope badge + blast radius on the card face? | ❌ Both fields exist. Neither renders. |
| 4 | Ranked `incident × network`, not volume? | ❌ **No sort at all.** |
| 5 | Confidence on every inferred value, tile **and** drill, none amber/red? | ❌ Absent on the tile; absent on the eight driver cards and four segment cards. The shared primitive renders Med in **amber**. |
| 6 | Every widget names an action, all inside the CX boundary? | ❌ Six cut-tiles and four outcome sparklines name none. Five actions imply enforcement. |
| 7 | Origination stage + fix owner on every card? | ❌ Neither field exists. |
| 8 | No matrix/heat-map, no locked views, no over-claiming names, no judgmental labels? | ❌ HVHF/HVLF/LVHF/LVLF quadrant on a head canvas. Locked views. "Risk Level: Elevated". *(Heat-map: the FCI heat-map exists but does **not** render on this journey — credit.)* |

**1 of 8. Fix before showing leadership.**

---

# J. STAKEHOLDER TESTS

| Test | Prediction | Why |
|---|---|---|
| **1 — 5-second read** | Tile: **PASS.** Drill: **FAIL.** | Shown the drill cold, the reader names Damaged Product because it is first and biggest. That is the volume answer. The `incident × network` answer is Counterfeit, at position six. |
| **6 — Blast-radius sanity** *(the cleanest test of whether the model reached the UI)* | **FAIL.** | Counterfeit and delivery delay both at 100: the screen makes you act on **damage**, because damage is card one and counterfeit is card six with a smaller number. Blast radius (92 vs 55) is in the data and on no pixel. |
| **7 — Stage attribution** *("counterfeit is up — whose desk?")* | **FAIL from the card. PASS from row four of a table below the fold.** | The counterfeit **card** says only that counterfeit is rising. The *answer* — Trust & Safety / Compliance — is in section 05, four scroll-screens down, hard-coded, and does not propagate up. This is a reporting product, not an accountability product. |
| **4 — The scrutiny test** *("my CSAT says trust is improving")* | **PASS — and comfortably.** | Section 04 answers unaided: *Signal type: Inference · Sources used: Chat · Email · Voice · Tickets · X · Missing validation: CSAT & Relational NPS*. The presenter says nothing. **The one test this screen wins outright.** ⚠️ *But CSAT reads 0.78 on the tile and 3.9 on the drill — if the buyer notices that during this exact test, the strongest moment on the page becomes the weakest.* |
| **2 — Time to first action** *(target <2 min)* | **FAIL.** | *"Counterfeit is rising — what do I do in the next hour?"* The card says *"Trust & Safety hold on flagged sellers"* — an action he cannot take — and **cannot name the seller**, because seller identity is not in the drill (F2). He would have to ask LiSN for the data. |
| **3 — Steering-committee export** | **FAIL.** | No export exists. He rebuilds it in a slide. §7.4 calls this the most politically valuable output the product can produce; it is the cheapest of all the gaps to close, because `fixOwner` + `severityScore` + `pnlValue` *is* the export. |
| **5 — Chronic vs acute vs emergent** | **FAIL.** | No `chronicity` field. No new-imperfection detector. The emergent bucket — the Jalna mechanism, ranked #1 white space by all three engines — does not exist. |
| **8 / 9 — Persona flip & bridge card** | **FAIL.** | No dimensional tags ⇒ the Category lens needs a new data model ⇒ the flip is a rebuild, not a field flip. No champion's name on any card. |
| **10 — Compounding** | **FAIL.** | No multi-imperfection order cohort. |

**Passing: Test 4, and half of Test 1.**

---

# K. CURSOR-READY FIX BLOCK — sequenced

> **Schema first. Then the components that consume it. Then layout. Do not reorder these phases — every phase-2 item reads a field that phase 1 creates.**

### PHASE 1 — SCHEMA (no UI changes; nothing visibly moves)

```
1.1  lib/cxHeadRetailV3TrustBreakdownData.ts — extend `TrustDriver`:
       cliffOrSlope · incidentRate · blastRadius · severityScore
       originationStage · manifestationStage · detectionStage · fixOwner
       anxietyWindowState · chronicity · confidence
       pnlMetric · pnlValue · cpu · eplu
       tags: { sku, category, seller, pincode, channel, time, stage, marketplaceVsOwned }
1.2  Populate all eight drivers from the mock table in §D of this document.
     ⚠ refund.cliffOrSlope = "cliff"  (was "slope")
     ⚠ counterfeit.incidentRate = 4.2 (was 0.18) — §2.4, LocalCircles ~20% receipt rate
     ⚠ refund.incidentRate = 3.8 (was 1.6) — largest NCH category
1.3  severityScore = incidentRate * blastRadius. Unit test:
       expect(sortBySeverity(TRUST_DRIVERS)[0].id).toBe("counterfeit")
       expect(counterfeit.severityScore).toBeGreaterThan(damaged.severityScore)
1.4  DELETE `fciRate` from CallerSegmentRow. ADD cpu, eplu, ocr, relationalNps.
1.5  Extend RiskSpike: isTrustEvent · originationStage · fixOwner.
1.6  DELETE BRAND_RISK_DRILL and the BrandRiskTop type.
1.7  Rename: HubBrandRiskScreen → HubTrustScreen · id "brand-risk" → "trust"
     · route "hub-brand-risk" → "hub-trust" · variant "brand-risk" → "trust".
1.8  DELETE the `channels` array from the trust hub card. The tile imports TRUST_PULSE.
1.9  Derive TRUST_PULSE.verdict. Unit test: never asserts "no cliff breach"
     while any cliffOrSlope === "cliff" && wow > 0.
```

### PHASE 2 — COMPONENTS THAT CONSUME THE SCHEMA

```
2.1  FIX components/common/ConfidenceBand.tsx — Med must not be severity-med (amber).
     Unit test: no band returns severityMed or severityHigh.
2.2  DELETE the local InferredChip in TrustBreakdownIntelligence.tsx and the local chip
     in CliffSlopePieCharts.tsx. Use ConfidenceBand everywhere. One chip in the repo.
2.3  NEW components/common/TrustSeverityBadge.tsx   — cliffOrSlope + blastRadius
2.4  NEW components/common/StageOwnerTag.tsx        — originationStage + fixOwner
2.5  NEW components/common/AnxietyWindowChip.tsx    — pre-contact / contacting / escalated
2.6  TrustBreakdownIntelligence §01 — the sort:
       {[...TRUST_DRIVERS].sort((a,b) => b.severityScore - a.severityScore).map((d) => {
     Render on the card face: TrustSeverityBadge · StageOwnerTag · AnxietyWindowChip
     · ConfidenceBand · pnlMetric. Render q.label — you already compute it.
2.7  Section 05 — replace the inert <span>{a.kind}</span> with <DraftActionFooter/>.
     The component already exists at components/common/DraftActionFooter.tsx.
2.8  Rewrite all dealPoints verbs to push-to-owner. No imperative enforcement verbs.
2.9  NEW SellerSkuCutTile · CorrelatedDefectTile (section 02)
2.10 NEW NewImperfectionDetector (the Jalna card) · MultiImperfectionCohortCard
2.11 NEW TrustStageJourneyStrip · CostIndexByStage
2.12 NEW SteeringCommitteeExport · BridgeCardExport (with the champion's name)
2.13 Wire #NeverDelivered mention velocity → never.blastRadius, per channel.
     Never aggregate across channels.
```

### PHASE 3 — LAYOUT

```
3.1  Tile: replace the 5-bar outcome stack with the cliff badge + count.
     Add ConfidenceBand to the Conversation AI block.
3.2  Drill above the fold: KPI band (Gap-to-target → Cliff-events-live)
     → TrustStageJourneyStrip → NewImperfectionDetector → top 3–4 cards,
     in a Cliff row and a Slope row.
3.3  GATE section 02 behind a driver-card selection. It must not render on load.
3.4  Replace SegmentMatrixViz (HVHF/LVLF) with two labelled bars.
3.5  Extract SECTION_REGISTRY: SectionSpec[] and .map() the drill's sections.
     Mirror the pattern HUB_JOURNEY_CARDS already uses.
3.6  Verify contrast on the dark theme at 1080p share resolution.
```

---

# L. THE ONE THING TO FIX FIRST

**The severity model is already in the code — `type`, `blast`, `incident` and `classify()` all exist and are computed on every card — and it reaches nothing but an icon's colour; recalibrate `incidentRate` per §2.4, correct `refund` to `cliff`, make `severityScore` the sort key, and render the badge on the card face, so that counterfeit stops sitting seventh on a screen whose own AI summary says counterfeit needs a compliance pass now.**
