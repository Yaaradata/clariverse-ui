# LisN · HDFC Bank demo rebuild
## Brief 1 — Audience and Messaging

Version 1.1 · 24 September 2026 · Gate 1 of 6 · **Status: approved by Ranjith (sections 1, 5, 7 and 8 confirmed as written)**

**Change in v1.1.** Integrated Anjani Rathor's remarks at the News18 Rising Bharat Summit – East Edition, Kolkata (this week). Changes are marked **[v1.1]**. The source is public, so it is SHOW/SAY-licensed.

**Purpose.** Fix who the demo is for, what each person needs to believe, and the words that get them there. Every later brief (screens, data, build spec) inherits from this one. If a line here would not change a screen or a sentence of copy, it has been cut.

**Evidence tags used below**
- `[CALL]` said by Vidya on the call (paraphrased close to verbatim)
- `[PUBLIC]` public, citable source (link given)
- `[RB]` Anjani Rathor at the News18 Rising Bharat Summit – East Edition, Kolkata (paraphrased close to verbatim from the transcript)
- `[HYP]` our hypothesis; to validate with Vidya tomorrow
- Licence: everything here is SHOW or SAY unless marked. **KNOW-only items are excluded from this brief and from every artefact downstream**: Vidya's confidential initiative, and all IndusInd / Vishal Jha content.

---

## 1. Success tests

| Meeting | Audience | Pass looks like |
|---|---|---|
| V1 · tomorrow | Vidya (reviewer and champion) | "Yes, I'd put this in front of Anjani. Change these three things." Plus a date for the second huddle. |
| V2 · in about 10–14 days, ideally before 26 October | Anjani Rathor (buyer), possibly Kannan | "Let's scope the discovery." A named owner and a start date. |
| After V2 | MD's office (consumer) | "I'd read this before the 8:30 call." |

The single design test for every screen: **could Vidya forward this screenshot on WhatsApp, with no narration, and make Anjani look good in front of the MD?**

---

## 2. Audience map

### 2.1 Vidya Pradeep — reviewer, champion, forwarder
- **Role in the decision.** Sponsor and door-opener. Reports to the MD. Mani reports to her. `[CALL]`
- **What she told us.**
  - GenBI already delivers the BI layer; drop it.
  - CX is bank-wide and rolls up under Anjani.
  - Package listening as a reputational pulse.
  - Split what each function should hear.
  - Use IO, BO, grievance, RBI and banking language. `[CALL]`
- **What she needs to see.** That we heard her, point by point. That this won't embarrass her when she forwards it.
- **What would kill it.**
  - Anything that looks like the old cards BI demo.
  - Any claim she can't vouch for.
  - Any hint that her confidences travel.
- **Line that lands.** "We built exactly the split you described: CX hears everything; product, policy, compliance and the MD each get their top ten."

### 2.2 Anjani Rathor — the buyer
- **Role and remit.** Group Head – Digital Banking and Customer Experience. He heads Digital Banking, Customer Experience, Data and Process Excellence across branches, virtual banking, internet banking and agency banking. Joined HDFC in 2020 as Chief Digital Officer; previously at Bharti Airtel. `[PUBLIC]` https://www.hdfc.bank.in/about-us/management-team/mr-anjani-rathor
- **His own frame.** In the digital era, trust is built through availability, customer experience, data intimacy and security. `[PUBLIC]` https://www.businessworld.in/article/how-hdfc-bank-is-reimagining-its-digital-ecosystems-575937
- **[v1.1] What he said this week** `[RB]`:
  - **Access to experience.** India is moving from an economy of access to an economy of experience. Getting something is no longer the differentiator; getting it effortlessly is.
  - **Better experience is cheaper.** A better experience makes an industry more efficient; you spend less generating demand.
  - **The customer's new question.** It has moved from "can I get access?" to "does my bank know me, and can I get this proactively?"
  - **Scale.** The bank handles about 250 crore transactions a month (close to 10 crore a day), around the clock, across the contact centre, net banking and increasingly digital channels.
  - **"Cure", in his own example.** An Infinia transaction declined on limit triggers an instant WhatsApp and SMS offering a limit increase, because the bank monitors continuously at the back end. Tomorrow, he says, the bank should cure it proactively and tell the customer it has been taken care of.
  - **Transparency.** The benchmark is the best app on the customer's phone, not other banks. He named end-to-end tracking, like following a package, and one-click journeys.
  - **24x7.** Customers explore and complete car loans at 9 or 10 at night, even midnight; banking is now round the clock.
  - **Physical and digital.** It is not physical versus digital. The branch and the relationship manager are the go-to people for life's big moments, such as a 20-year home loan.
  - **WhatsApp banking.** Pay, download statements, block a card and raise a limit are available there, and will become more contextual.
  - **Consent.** Processing data with consent, under India's privacy regime, is what makes predictive experience possible.
  - **Safety.** Security is a balancing act, with investment equal on experience and safety; incidents and vulnerabilities do surface.
  - **His closing trend.** Make banking safe and contextual. "Our job is not to be in the face. Our job is to be available when customers need it."
- **[v1.1] What this means for us.** He is already selling predictive, contextual, proactive banking in public. What he cannot yet show is whether it is landing: which cures failed, which customers still had to call, where transparency is missing, and which night-time journeys broke. **LisN is how the bank hears whether its proactive promise is being kept.**
- **Pains, in his chair.**
  - Resolve things before they become escalations to the MD. `[CALL]`
  - RBI pressure on customer experience. `[CALL]`
  - Vendors in multiple places, no single filtered view. `[CALL]`
  - TAT breaches invisible across the bank. `[CALL]`
- **What he is likely measured on.** `[HYP]` Complaint volumes and repeat complaints; maintainable complaints at the RBI Ombudsman; IO referrals; TAT adherence; digital adoption and availability; escalations reaching the MD's office.
- **What he needs to see.**
  - One view across all channels and businesses.
  - Owner routing.
  - Early warning before the ladder climbs.
  - Promise breaks.
  - Evidence behind every number.
- **What would kill it.**
  - "Another dashboard."
  - A cards-only lens.
  - Anything that threatens GenBI or the AI factory.
  - Data leaving the bank.
- **Line that lands.** "Your trust pillars, heard across every channel, with the owner and the next action attached, before it reaches the MD's desk."
- **[v1.1] Opener for V2.** "You said this week that the job is to be available when customers need it, not in their face. This shows where customers are telling you that isn't happening yet, and who can fix it." Use once, in the opener only. Don't quote him back to himself on every screen.

### 2.3 The MD's office — the consumer
- **Context.**
  - The MD and CEO retires on 26 October 2026. `[PUBLIC]` https://www.business-standard.com/companies/news/hdfc-bank-ceo-sashidhar-jagdishan-to-retire-on-october-26-2026-126082900646_1.html
  - The board has shortlisted two successor candidates for RBI approval. `[PUBLIC]`
  - **Design the view for the office, not the individual.** No named-MD framing anywhere.
- **Pains.**
  - A daily 8:30 review of interactions and happy interactions where people "are just throwing data". `[CALL]`
  - A heavy inbox of customer escalations marked to the MD that cascades to senior leaders every morning. `[CALL]`
  - "Are we listening? Do we even know the mood of today?" `[CALL]`
- **What the office needs to see.**
  - One page.
  - The mood today against baseline.
  - At most three things that need the MD.
  - What has already been routed, and to whom.
- **What would kill it.** Volume without judgement. Red everywhere. Jargon.
- **Line that lands.** "What needs you today, what's already handled, and what's changing."

### 2.4 Kannan Ramaseshan — quality and process `[HYP]`
- **Role.** Named by Vidya as one of the two people "we have to go to". Our research places him in Quality Initiatives. Verify his current title before V2.
- **Pains.** TAT and service-deliverable breaches that nobody tracks bank-wide: welcome kit, card issue to dispatch, reward redemption. `[CALL]`
- **What he needs to see.** The promise-break view: where each committed timeline snapped, detected from what customers say, with the likely stage and owner.

### 2.5 AI factory (Nikhil Swaroop) and IT — potential blockers
- **Position.** Build in-house. The MD's call is not to work with external AI parties. GenBI is being built with every business unit. `[CALL]`
- **What would make them allies.**
  - LisN runs inside the bank on their approved models.
  - It does the outside-in listening Vidya said the bank will never build.
  - It applies one experience bar to their AI agents (EVA, voice bots), which makes their products measurably better.
- **What would kill it.** Any BI overlap. Any action that looks like it replaces CRM, IVR, fraud authorisation or decisioning systems.

### 2.6 Manikandan Ramji — ally to keep whole
- **Role.** Reports to Vidya. Not the decision-maker. Invested in the cards thread. `[CALL]`
- **Handling.** Ask Vidya tomorrow how she wants him involved. The cards view becomes "what the Head of Cards receives", which keeps his work visible inside the bank-wide story.

---

## 3. Pain register

| # | Pain | Evidence | Owner | Who feels it most |
|---|---|---|---|---|
| P1 | The MD's daily review has data but no listening | `[CALL]` 8:30 calls; "people are just throwing data" | MD's office, Anjani | MD's office |
| P2 | MD-marked customer mail cascades down every morning | `[CALL]` "my day starts with" the MD's emails | MD's office, Anjani | Vidya, all senior leaders |
| P3 | Complaints climb to the IO, the RBI Ombudsman, @RBI and the press before the bank sees the pattern | `[CALL]` IO/BO/RBI tagging theme; RBI pressure | Anjani, Compliance | Anjani |
| P4 | Each function hears everything or nothing; no routing | `[CALL]` "top 10 for product, top 10 for compliance" | Anjani | Product, Policy, Compliance heads |
| P5 | TAT breaches on key deliverables are invisible bank-wide | `[CALL]` welcome kit, dispatch, redemption | Kannan, Anjani | Operations |
| P6 | Reputational issues are "crawling"; multiple vendors, no filter | `[CALL]` | MD's office, Anjani | MD's office |
| P7 | AI agents and human agents are not held to the same experience bar | `[CALL]` agents and conversational AI mentioned; our proposition | Anjani (digital), AI factory | AI factory |
| P8 | Signal versus noise: seasonal spikes treated as crises, real shifts missed | Deck and product premise; `[HYP]` for HDFC | Everyone | Everyone |
| P9 **[v1.1]** | Proactive cures are measured on the transaction side; nobody hears whether the cure landed or the customer called anyway | `[RB]` Infinia decline example; "cure proactively" | Anjani, Digital | Anjani |
| P10 **[v1.1]** | Missing transparency drives "where is my…" contacts (refund, card, dispute, loan), which is avoidable demand | `[RB]` package-tracking and Uber analogies; `[CALL]` TAT snaps | Anjani, Process Excellence | Contact centre, Operations |
| P11 **[v1.1]** | Round-the-clock journeys break outside office hours, and the signal waits for the morning | `[RB]` night-time loan journeys; `[CALL]` 8:30 review | Anjani, MD's office | MD's office |
| P12 **[v1.1]** | Safety signals (scam calls, phishing waves, a new vulnerability) surface first in customer voice | `[RB]` "balancing act", incidents do happen | Anjani, fraud and cyber owners | Anjani |

**Explicitly not our pain to solve:** business BI, P&L, interchange, spend analytics. GenBI owns these. `[CALL]`

---

## 4. Strategy per pain

| Pain | How LisN addresses it | Where it shows | The action |
|---|---|---|---|
| P1 | A daily brief: mood against baseline, three items that need the MD, three routed | MD's Desk | Read in two minutes before 8:30 |
| P2 | Sieve MD-marked mail into themes, owner and ageing | MD's Desk panel (illustrative until discovery) | Route to owner; the MD sees only what's unresolved |
| P3 | Escalation ladder with climb-risk per theme | "Is anything climbing?" | Intervene on the lower rung |
| P4 | Owner routing: CX hears all; top ten each for Product, Policy and Credit, Compliance and Audit, the MD | Routing view | Each owner gets their list, with evidence |
| P5 | Promise-break signals mined from what customers say about elapsed timelines | "Are we keeping our promises?" | Re-promise, update-and-close, or proactive notice, routed into CRM |
| P6 | Reputation as the top rung of the ladder, not a separate module | "What is the market saying?" | Owner acknowledgement and response |
| P7 | One experience bar for assisted and AI journeys | Teaser on the closing screen (V2) | Improves EVA and bots; makes the AI factory an ally |
| P8 | Organisational memory: baselines, seasonality, one problem counted once | Captions throughout; the AI Analyst | Fewer, truer alerts over time |
| P9 **[v1.1]** | **Cure watch.** Contacts and posts after a decline or failure that the proactive message should have handled | "Are we keeping our promises?" | Route to the digital journey owner; fix the cure rule |
| P10 **[v1.1]** | **Transparency gap.** Volume of status-seeking contacts by request type, as avoidable demand | "Are we keeping our promises?" | Push stage updates in app, WhatsApp and SMS; each point of reduction is capacity released |
| P11 **[v1.1]** | **Since yesterday's 8:30.** Overnight signals summarised at the top of the brief | MD's Desk | Owners acknowledge before the call |
| P12 **[v1.1]** | **Safety signals** grouped under the security pillar, routed to fraud and cyber owners, framed calmly | "Is anything climbing?" | Route with evidence. LisN detects in voice; it never makes fraud decisions |

**Boundary rule.** Every action is a recommendation *routed to an owner into their system*. LisN never executes, never authorises, never decides.

---

## 5. Messaging

### 5.1 Core narrative (one sentence)
> HDFC Bank already knows what customers do. LisN tells you what they are saying, where it is heading and who needs to act, before it reaches the MD's desk, the ombudsman or the press.

**Short form:** *Hear it on the first rung.*

**[v1.1] Anjani-facing variant, in his vocabulary:**
> Predictive, contextual banking needs a bank that listens. LisN hears, across every channel and every hour, where the experience isn't yet effortless, and routes it to the owner before it climbs.

**[v1.1] Organise signals under his four trust pillars.** Availability, experience, data intimacy and security become the grouping on "Are customers happy?" and the MD's Desk. Close on his own theme: **safe and contextual**.

### 5.2 The four executive questions (the spine of every screen)
1. Are customers happy?
2. What is the market saying about us?
3. Are we keeping our promises?
4. Is anything climbing?

### 5.3 Three pillars
1. **Listen to everything.** Every internal and external channel, every business, every hour, not a sample. **[v1.1]** Name his channels: contact centre, branch and RM, net banking, mobile app, PayZapp, WhatsApp banking, EVA and voice bots, plus X, Reddit and the app stores.
2. **Route to the owner.** Each function hears its top ten; CX hears all.
3. **Act before it climbs.** Recommended actions, routed into existing systems, measured on escalations and time to resolve.

### 5.4 Per-audience messages

| Audience | Lead message | Proof they need |
|---|---|---|
| Vidya | "We built what you described." | Point-by-point mapping of her asks to screens |
| Anjani | "Your four trust pillars, heard across every channel, routed and acted on." | Real public-signal view; ladder; promise breaks; evidence drill-down |
| MD's office | "What needs you today; what's already handled." | One-page MD's Desk |
| Kannan | "Where our promises snapped, and why." | Promise-break view |
| AI factory / IT | "Runs inside, on your models; the outside-in piece you won't build; makes your agents better." | Deployment slide; GenBI complementarity line |

### 5.5 Outcome metrics (declared, baselined in discovery; no invented impact figures)
- Escalations reaching the MD's office
- Repeat-complaint rate
- IO referral rate; RBI Ombudsman maintainable complaints (lagging)
- Time to resolve on routed signals
- Time from first public signal to owner acknowledgement
- **[v1.1]** Status-seeking ("where is my…") contacts per request type, for the transparency lever
- **[v1.1]** Post-cure contacts: customers who called or posted after a proactive cure should have resolved it

### 5.6 Executive appeal rules
1. **Answer first.** Every screen opens with its one-line conclusion.
2. **Lead with control, not alarm.** "Needs you / routed / improving" before "critical".
3. **Three items maximum** in any summary block.
4. **Every item carries an owner and a next action.**
5. **Every number has a baseline and a source tag:** *Public · live* or *Internal · illustrative until discovery*.
6. **HDFC and Anjani are the heroes.** We are the instrument.
7. **Forwardable.** Legible as a phone screenshot, with a caption, no narration needed.
8. **House style.** British spelling, rupees (lakh and crore), no exclamation marks.
9. **[v1.1] Calm by design.** He wants banking to be available, not "in the face". The interface should feel the same way: quiet defaults, colour reserved for what truly needs attention.
10. **[v1.1] Use his words where they fit:** economy of experience, effortless, proactive, cure, contextual, transparency, 24x7, safe, with consent. They go into the B2 glossary.

---

## 6. Objections and answers

| Objection | Answer |
|---|---|
| "The bank doesn't work with external AI parties." | LisN deploys inside the bank on your approved models, and your data never leaves. It covers the outside-in listening across channels that the bank has said it will not build itself. |
| "GenBI already does this." | GenBI tells you what customers did. LisN tells you what they are saying and where it is heading. The two are complementary, and LisN can feed GenBI. |
| "We already have social listening." | Single-channel tools don't join internal and external voice, don't remember baselines, and don't route to owners. `[HYP]` Confirm which tools are in use before naming any. |
| "Public social is noisy and skewed." | Agreed. It is the early-warning and reputation rung, and discovery calibrates it against formal complaint grounds. |
| "Who else uses this?" | Answer only from the claims register below. |
| "How long, and what does it cost?" | A bounded four-to-six-week signal benchmark, at a fixed fee. Pricing is a separate gate before V2. |
| "Is this another dashboard?" | No. It is a daily brief with routed actions. The dashboard is only the drill-down. |
| **[v1.1]** "Our proactive engine already handles this." | It acts on transaction signals. LisN tells you where the cure didn't land and where customers still had to ask. The two are complementary, which is the word he used for fintechs. |
| **[v1.1]** "Consent and privacy?" | Consent-based processing inside the bank, which is the model he described publicly. |

---

## 7. Claims register

| Allowed | Not allowed |
|---|---|
| Built by a team with decades running CX operations and enterprise data and AI | Any named bank we demoed to, or "they all loved it" |
| Deployed in-bank, on bank-approved models; DPDP-aligned design | "Live with a top-three retailer", until signed. Until then: "design partnership in progress with a top-three Indian retailer" |
| Capacity figures only once benchmarked on the demo stack | Any rupee impact figure not derived from data we hold |
| The real public-signal analysis of HDFC (tagged *Public · live*) | Any IndusInd reference, or anything Vidya shared in confidence |
| **[v1.1]** His public scale figure (about 10 crore transactions a day), attributed to him, to show why sampling cannot keep up | Presenting transactions as interactions, or putting his figure into our own impact claims |

---

## 8. Competitive context (ICICI)

**Decision: include it, as decision content, in a single strip. It does not get its own screen.**

- **Why it's relevant to executives.** MDs and CX heads care intensely about the nearest rival. Vidya's own remark on the call appeared to reach for an HDFC-and-ICICI comparison. `[CALL]`, garbled; confirm tomorrow.
- **Why not a capability showcase.** "We can crawl competitors" is a feature. "Where customers compare us, and where we lead" is a decision.
- **[v1.1] His benchmark is the best app on the phone.** Weight the ICICI strip towards app-store themes (availability, transparency, one-click journeys). That matches how he frames competition. A fintech-app benchmark is an option for V2, not tomorrow.
- **What the strip shows.**
  - Theme mix for HDFC and ICICI over the same window, normalised as share of each bank's own volume.
  - Switching signals in both directions.
  - At least one area where HDFC leads.
- **Rules.**
  - No league tables, no raw-volume comparisons.
  - Never position it as "we can do this for ICICI too".
  - The ICICI dataset is a separate asset and never travels with HDFC material.
- **Tomorrow.** Show the strip if the data is ready and ask Vidya whether Anjani would want it. If the data isn't ready, mention it in one line and ask.

---

## 9. Questions for Vidya tomorrow

1. What does the 8:30 call review today, and who presents?
2. Roughly how many MD-marked customer emails arrive each day, and what happens to them?
3. What is Anjani reviewed on? Do our outcome metrics match?
4. Which of our terms are HDFC's own (IO, maintainable complaints, TAT, relationship tiers)?
5. What would make Anjani say no: the in-house policy, the AI factory, or an existing listening vendor?
6. Would the ICICI comparison help or hurt with Anjani?
7. How would she like Mani involved?
8. Should Kannan see it alongside Anjani?
9. **[v1.1]** Is there a named programme and owner behind the proactive "cure" work he described? Cure watch should route to that owner.
10. **[v1.1]** Would opening V2 with a reference to his Rising Bharat remarks land well, or feel too pointed?

## 10. The asks

- **Tomorrow (Vidya):** her edits, a date for the second huddle, and the timing of the Anjani introduction (plus Kannan if she agrees).
- **V2 (Anjani):** a bounded signal benchmark on three sources, running inside the bank: escalations addressed to the MD's office, IO and RBI Ombudsman cases, and public signal. Named owner, start date.

---

**Gate 1: approved 24 September 2026.** Brief 2 inherits from this version.
