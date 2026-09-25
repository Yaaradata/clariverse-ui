# LisN · HDFC Bank demo rebuild
## Brief 2 — Experience and Language

Version 1.1 · 24 September 2026 · Gate 2 of 6 · Status: **approved with Ranjith's changes (v1.1)**

**v1.1 decisions (these override anything below that conflicts):**
- **Two views of the exec page:** the MD's office and the Head of CX. Same structure, different altitude. No Retail or Cards lens switcher.
- **Three questions, not four.** The existing three stay: satisfaction and journey, market, service promise. "Is anything climbing?" is folded in:
  - the escalation ladder and climb-risk move into the **service promise** view
  - safety and reputation watch move into the **market** view
- **The exec page keeps its current shape:** summary, the three questions, actions to take.
- **Drill-down views keep their current structure.** Content, language and data change; layout stays.
- **Status vocabulary** as defined in §3.
Inherits from: B1 v1.1 (approved). Feeds: B3 (data fills the `{slots}`), then B4 (the build spec for Claude Code).

**Purpose.** Lock the screens, the order they appear in, the words on them, and the rules every tile follows. Headlines use `{slots}` because the real public data (B3) decides what they say.

---

## 1. The screen set

Five screens plus one side panel. **Fewer screens is the success criterion.**

| # | Screen | Question it answers | Altitude | Data |
|---|---|---|---|---|
| S0 | **MD's Desk** | What needs us today, what's handled, what's changing? | MD's office, Anjani | Mixed; tagged per tile |
| S1 | **Are customers happy?** | How customers feel, by trust pillar, relationship tier and journey | Anjani | Public live plus internal illustrative |
| S2 | **What is the market saying?** | The public narrative, the promise gap, the ICICI context | Anjani, MD's office | **Public live only** |
| S3 | **Are we keeping our promises?** | TAT breaches, transparency gaps, cure watch, disputes | Anjani, Kannan | Public live plus internal illustrative plus joined |
| S4 | **Is anything climbing?** | The escalation ladder, climb-risk, safety and reputation | Anjani, Compliance, MD's office | Public live plus internal illustrative |
| S5 | **Signal detail** (one template) | What is it, is it real, who owns it, what next, show me the evidence | Anyone who drills | Per signal |
| Panel | **Ask LisN** | Ad-hoc questions with cited answers | MD's office, Anjani | Scoped to demo data |

**[Superseded by v1.1: two exec views, three questions, no lens switcher. S4 content is folded into S2 and S3.]**

**Anchor decision.** S0 to S4 are **bank-wide**. Retail and Cards are **lenses**, not separate products: "View as" re-scopes the same screens, using the existing role-based routes (`retail_banking/head_retail`, `credit_cards/head_cards`). This is how Vidya's bifurcation point gets demonstrated: the same listening, routed differently. Whether Retail or Cards is the default lens is decided once the retail exports have been reviewed.

**"View as" options:** MD's office (default) · Head of CX · Head of Retail · Head of Cards · Product · Policy and Credit · Compliance and Audit.

---

## 2. Information flow and the drill contract

```
S0 MD's Desk ──► S1–S4 question screens ──► theme list ──► S5 Signal detail ──► evidence (source items)
```

The contract, enforced as tests in B4:
1. **Every number on a summary tile is clickable** and opens the list that sums to it.
2. **Every list item opens S5.**
3. **Every S5 opens the source items** (anonymised).
4. **Totals reconcile across screens** because every tile reads from one seeded dataset.
5. **No screen is more than three clicks from the MD's Desk.**
6. **"Back" always returns to the exact place the user left.**

---

## 3. Global components (defined once, used everywhere)

| Component | Values | Rule |
|---|---|---|
| **Provenance tag** | `Public · live` · `Internal · illustrative until discovery` · `Joined · needs bank systems` | On every tile, bottom-left, small, neutral colour |
| **Status** (replaces CRITICAL/HIGH/WATCH) | `Needs you today` · `This week` · `Watching` · `Routed` · `Improving` | Colour only on "Needs you today" (accent) and "Improving" (green). Everything else neutral. |
| **Owner chip** | CX · Retail · Cards · Digital · Product · Policy and Credit · Compliance · Fraud and Cyber · Operations · RM | Every item has exactly one owner |
| **Rung chip** | Voice · Repeat · Grievance · MD's office · IO · RBI Ombudsman · Public | Used wherever climb matters |
| **Action chip** | Re-promise · Update and close · Notify proactively · Route with evidence · Monitor | Always a recommendation, routed to the owner's system. Never "freeze", "enforce", "throttle" or "trigger offers". |
| **Baseline caption** | "vs 6-week baseline" · "seasonal check: in discovery, using your history" | Under every trend and every delta |
| **Trust pillar** | Availability · Experience · Data intimacy · Security | Anjani's own frame; the grouping for themes |
| **Since yesterday's 8:30** | Overnight strip | Top of S0 only |

---

## 4. Screen specifications

Each screen opens with one **answer line**: a single sentence that is the conclusion. Everything below it is support.

### S0 · MD's Desk

**Header:** `HDFC Bank · Customer Pulse · {weekday date}, 07:45 · View as: MD's office ▾`

**Answer line:** `{n} signals need you today. {m} were routed overnight. {k} are improving.`

| Block | Content | Max items | Tag |
|---|---|---|---|
| A. Since yesterday's 8:30 | Overnight signals with owner acknowledgement status | 3 | Mixed |
| B. Mood of the day | One index against baseline; three drivers by trust pillar; one-line definition on tap | 1 index, 3 drivers | Public live (index built on public signal for V1) |
| C. Needs you | One line, owner, rung, action | 3 | Per item |
| D. Routed | Owner has acknowledged; status | 3 | Per item |
| E. Improving | What's getting better | 2 | Per item |
| F. The three questions | Three doors to S1–S3; each with one answer line, one number, a tag | 3 | Per tile |
| G. MD-marked mail | Themes, owner, ageing; "resolved before reaching the MD" | 5 themes | `Internal · illustrative until discovery` |

**Example copy (form only; B3 supplies the facts):**
- Needs you: `Reward-value concerns on premium cards up {x}% vs baseline across X and app reviews · Owner: Cards · Rung: Public · Action: Route with evidence`
- Routed: `Card dispatch delays in {region} · Owner: Operations · Acknowledged 22:10`

**Cut from the current overview:**
- "All three scores down this week"
- the red gauges
- unlabelled sparklines
- the Risk Spike Monitor as a carousel (its items become Needs you, Routed and S4 content)

### S1 · Are customers happy?

**Answer line:** `Customers are {most positive} on {pillar} and {least positive} on {pillar}; {tier} relationships show the sharpest change.`

| Block | Content | Tag |
|---|---|---|
| Trust pillars | Four tiles: sentiment against baseline, top two themes each | Public live |
| By relationship tier | Private Banking · Imperia · Preferred · Classic (verify names): positive, neutral and negative share, customers affected | Internal illustrative |
| Journey stages | Open, activate, everyday use, service requests, disputes, closure: negative share, repeat contact, closure intent | Internal illustrative |
| Retention watchlist | Closure intent in high-value tiers, routed to RM | Internal illustrative |

**Cut or rename:**
- HSHF / HSLF / LSHF / LSLF → HDFC tiers
- "Vulnerable Watchlist" → "Retention watchlist"
- NPS monitor → relabel "Sentiment trend (conversation-inferred)", or cut
- "FCI" → cut
- Strain and friction table → moves to S5 detail
- "Top Intent 16" block → cut (it contradicts itself)

### S2 · What is the market saying?

**Answer line:** `Across {N} public posts and reviews in six weeks, {top theme} leads; {theme} is rising fastest; {theme} is where HDFC is praised most.`

| Block | Content | Tag |
|---|---|---|
| Themes by pillar | Clustered themes with 6-week trajectory | Public live |
| Promise gap | HDFC's own stated promises against where customers say they break | Public live (promises from HDFC's public material) |
| App pulse | MobileBanking and PayZapp review themes by app version; rating trend | Public live |
| Voices with reach | Anonymised: "Finance creator, ~{n}k followers", theme, reach, owner | Public live |
| **Where customers compare us (ICICI)** | Theme share for HDFC and ICICI, each normalised to its own volume; switching signals both ways; at least one "HDFC leads" item | Public live |

**Cut:**
- Rankings and Reviews (US comparison sites)
- Momentum Hashtags (invented)
- every US card name, handle and competitor

### S3 · Are we keeping our promises?

**Answer line:** `{n} promise types breached this week; {top} drives most repeat contact; {x}% of contacts are customers asking where something is.`

| Block | Content | Tag |
|---|---|---|
| Promise ledger | Promise · stated or regulatory TAT · breaches heard in voice · repeat share · owner · action | Public live (voice) plus internal illustrative |
| Transparency gap | "Where is my…" contacts by request type (refund, card, dispute, loan, statement), framed as avoidable demand | Mixed |
| Cure watch | Contacts and posts after a decline or failure that a proactive message should have handled | Mixed |
| Dispute drill | Existing "Why disputes breach SLA", reconciled, keeping the "needs dispute-platform feeds" note | `Joined · needs bank systems` |
| Action triage | Re-promise / update and close / notify proactively, with counts | Internal illustrative |

**Candidate promise rows** (every regulatory figure must pass verification in §7 before it is displayed):
- credit card closure
- card dispatch and welcome kit
- reward redemption
- failed-transaction reversal
- dispute resolution
- credit-information correction
- loan disbursal

### S4 · Is anything climbing? [v1.1: folded in. The ladder and climb-risk go into S3; safety and reputation watch go into S2.]

**Answer line:** `{n} themes show escalation language this week; {theme} is closest to the ombudsman rung.`

| Block | Content | Tag |
|---|---|---|
| The ladder | Voice → Repeat → Grievance → MD's office → IO → RBI Ombudsman → Public, with counts per rung | Public rung live; others illustrative |
| Climb-risk | Themes where customers mention the RBI, the ombudsman, consumer court, "third time" or complaint numbers | Public live |
| Safety signals | Scam calls, phishing waves, app security concerns; owner: Fraud and Cyber; calm framing | Public live |
| Reputation watch | Posts with reach and escalation intent; owner acknowledgement time | Public live |

### S5 · Signal detail (one template)

In this order:
1. **What:** one sentence.
2. **Is it real:** first seen, trajectory against baseline, seasonal check, one problem counted once across phrasings and channels.
3. **Where:** channels, pillar, tier, business.
4. **How high:** rung and climb-risk.
5. **Who and what next:** owner, recommended action, routed-to system.
6. **Evidence:** 3–5 anonymised, paraphrased source items with date, channel and link.
7. **Provenance tag.**

### Ask LisN (side panel)

**Suggested prompts:**
1. What would reach the MD's desk this week if we did nothing?
2. Which complaints are most likely to go to the Internal Ombudsman?
3. Is the {theme} spike seasonal or new?
4. Where did we break a TAT promise yesterday?
5. Where did a proactive cure not land?
6. What should Product hear this week?
7. What are customers saying about the latest app release?
8. Where do customers compare us with ICICI, and where do we lead?

**Rules:**
- Every answer cites its source items.
- Out-of-scope questions return: `That needs your internal data. It's part of discovery.`
- Never improvise figures.
- Test six off-script questions before the session.

---

## 5. Visual and tone rules

1. **Calm by default.** Neutral base, one accent colour for "Needs you today", green for "Improving". No red gauges.
2. **Answer line on every screen,** in the largest type after the title.
3. **Charts:** every trend has labelled axes and a baseline. Sparklines without axes are removed.
4. **Legibility:** body text large enough to survive a phone screenshot. No truncated titles. No floating element covering content.
5. **Colour never carries meaning alone.** Every status also has a word.
6. **Numbers:** ₹ lakh or crore, Indian digit grouping (1,00,000). No $.

---

## 6. Glossary

### Use

| Term | Use for |
|---|---|
| RBI Ombudsman (RB-IOS) | The external escalation rung (say "BO" only if HDFC does) |
| Internal Ombudsman (IO) | The internal escalation rung |
| Maintainable complaints | RBI Ombudsman complaints that meet the scheme's grounds |
| Grievance redressal · Principal Nodal Officer | Formal complaint handling |
| TAT | Committed turnaround times |
| Repeat complaint · RCA | Recurrence and root cause |
| MD's office | Never a named individual |
| Relationship tiers (Private Banking, Imperia, Preferred, Classic) | Segments; verify names |
| Closure intent · attrition | Instead of "churn" on screens |
| Trust pillars: availability, experience, data intimacy, security | Grouping |
| Proactive · cure · contextual · effortless · transparency · 24x7 · safe · with consent | Anjani's vocabulary |
| Complementary | Our relationship to GenBI and in-house AI |
| Customer voice · signal · owner · routed | Our core nouns |

### Avoid

| Avoid | Because |
|---|---|
| HSHF, HSLF, LSHF, LSLF | Our jargon, not HDFC's |
| $, APR, balance transfer, intro APR | US products |
| NerdWallet, WalletHub, Bankrate, Credit Karma, Trustpilot; Citi, Chase, Wells Fargo card names | US context; shows another prospect's material |
| "Vulnerable" (for churn risk) | A conduct term with a specific meaning |
| NPS (unlabelled), FCI | Contested or undefined |
| #RewardScam, #BankAppCrash, "takedown", "scam" beside HDFC's name | Reputational liability if forwarded |
| CRITICAL in capitals, "surge", "crash" | Alarmist; breaks the calm-by-default rule |
| Freeze, enforce, throttle, trigger offers | Crosses the product boundary |
| "Dashboard", "listening intelligence" | Evokes BI and single-channel social listening |
| Naming any listening vendor | Unnecessary; we don't know what they use |

---

## 7. Verification register (Track A, before anything is displayed)

| Item | Status |
|---|---|
| Credit card closure within seven working days, ₹500 per day of delay | Confirmed in multiple secondary sources. **Check the current instrument on rbi.org.in**: a secondary source reports the 2022 card directions were re-issued as 2025 Directions for commercial banks (28 November 2025). |
| Credit-information complaints: ₹100 per calendar day if unresolved after 30 days | Secondary source; verify the RBI circular |
| Failed-transaction TAT and compensation framework | Verify on rbi.org.in |
| IO directions: rejected complaints escalated to the IO before the final reply | Verify |
| RB-IOS 2021, CMS portal | Verify |
| HDFC relationship tier names; card portfolio names; X care handle; EVA | Verify on hdfc.bank.in |
| Kannan Ramaseshan's current title | Verify |

---

## 8. Two-minute walk-through (the story tomorrow)

1. **S0.** Read the answer line. Open "Since yesterday's 8:30".
2. **Click Needs you #1 → S5.** Show the evidence and the owner.
3. **Back → switch to the Head of CX view.** Same listening at a different altitude: every item has its owner, showing who hears what.
4. **S3.** Promise ledger, then the transparency gap, then the ladder: "hear it on the first rung".
5. **S2.** Market narrative and the ICICI strip.
6. **Ask LisN.** One scripted question.
7. **Close:** runs inside the bank, on your models, complementary to GenBI.

---

## 9. Slots for B3 (data)

| Slot | Filled from |
|---|---|
| Themes and trajectories by pillar | HDFC dump |
| Escalation-language counts | HDFC dump |
| Promise-break and "where is my…" counts by request type | HDFC dump |
| Cure-watch items | HDFC dump |
| App version themes | App-store dumps |
| ICICI theme share, switching signals, "HDFC leads" item | ICICI dump |
| Mood-of-the-day definition and value | HDFC dump |
| All illustrative internal figures | Seeded dataset, reconciled to the public figures |

---

**Gate 2: approved 24 September 2026 with the v1.1 decisions above.**
