# 08 · Demo script, close and QA — LiSN × KGS Global Commercial Fire

**For:** Ranjith (presenter) and Ranjit BK (driver) · **From:** Demo Director · **v1 · 28 Sep 2026**
**Read with:** `01` (persona, trust-breakers §6.2), `02` (value register §2), `04` (exact copy, routes, approval flow §4.9). Exact on-screen strings are in 04; this file does not change them.

**Goal of the session:** Kartik says *"let's try this — and get more people on the next call"*, names an owner, and names who should join.
**Roles:** Ranjith talks; Ranjit BK (RBK) clicks, on cue, and takes notes. RBK never clicks ahead of the line. When Kartik is reading, the mouse sits still and off the text.
**On screen he is always "President".** Never show or say his name on screen; never mention figures he has shared privately.

---

## 1. Run-of-show (13 minutes + 2 minutes buffer)

| Segment | Time | Screen |
|---|---|---|
| 0 · Setup | T−30 to T−0 | — |
| 1 · Framing | 0:00–1:00 | `/` (top) |
| 2 · Exec overview | 1:00–3:00 | `/` |
| 3 · Q1 drill-down | 3:00–4:15 | `/installed-base` |
| 4 · **The double-click** | 4:15–8:45 | `/installed-base/signal/fw-4-1` → drawer → draft → approve → `/` |
| 5 · Q2 and Q3, governed watch | 8:45–10:15 | `/channel`, `/separation`, `/` |
| 6 · Value ledger | 10:15–11:15 | `/` Applied value + "How we count" |
| 7 · Close and ask | 11:15–13:00 | `/` Evidence readiness |
| 8 · Five questions | 13:00–15:00 | any |

If Kartik engages, let the conversation run; the script is a floor, not a ceiling. Two of the five questions are asked inside the flow (segments 4 and 5), so the end section can be short.

### 1.0 Setup (T−30 to T−0) — RBK

- [ ] Chrome, guest profile (no extensions, bookmarks bar hidden), 1920×1080, zoom 100%, full screen. OS notifications and chat apps off. Cursor and terminals closed.
- [ ] Tab 1: live demo `/?intro=0`. Tab 2: local production build (`localhost:3000/?intro=0`), already running. Tab 3 (hidden): fallback screenshot PDF (§5.9).
- [ ] **Demo controls → "Reset demo".** Confirm: Viewing as = President · Anonymise **OFF** · no "Decision requested" chip · AV-3 reads "5 awaiting owners".
- [ ] **Badge visible** top-right: "SYNTHETIC SCENARIO — illustrative data, not KGS data". Footer visible.
- [ ] Warm-up: open and close the evidence drawer once, then **Reset demo again** (the drawer adds "President · just now" to the audit log).
- [ ] Share **the browser window only**, not the desktop.
- [ ] Ranjith has this script and the objection cards (§4) printed or on a second screen.
- [ ] Agree cue words: Ranjith's line ends on the element; RBK acts on the noun ("…the evidence" → click "Evidence · 23").

### 1.1 Framing — 0:00–1:00

**RBK:** stays on `/`, scrolled to the top. Mouse still.

**Ranjith (exact):**
> "Thank you for the time. What you'll see is a synthetic scenario for Global Commercial Fire. Nothing on this screen is KGS data, and nothing here is a finding about any KGS product — the badge in the corner stays on the whole time. It is sized to a business like yours: about 1,800 installer, partner and distributor interactions a working day.
>
> It's built around one question. When the fifth installer in a different region describes the same fault, how soon does it reach the owner as one pattern — with the firmware, the batch, the partners and the panels it touches? The same day, or at the monthly review?
>
> I'll show you the weekly view, then take one signal all the way down to the calls behind it and the decision it's waiting for. About twelve minutes, then five questions for you. Ranjit is driving."

### 1.2 Exec overview — 1:00–3:00

| Click (RBK) | Say (Ranjith) | Pause / cue |
|---|---|---|
| Point at the funnel strip. Hover "212 suppressed" to open the popover. | "Across the top, the funnel. 233,900 interactions read over 26 weeks, about 9,000 this week. 1,640 candidate clusters. 212 suppressed — quarter-end order chasing, how-to questions after a launch, planned drills, credit holds. The reasons are shown, never hidden. And five signals above threshold this week, plus two governed watch items." | — |
| Move to the Executive Brief and Pulse. | "Five signals: installed base two, channel two, separation one. Every one has a named owner, and none has been actioned without approval." | — |
| Point across the three question cards. | "Your three hats. Is our installed base healthy? Are we holding our channel? Is the separation costing us? The big number is a count of signals above threshold — not a score." | — |
| Point at Q1 gauge 2, then the "2". | "And look what sits beside the count on the first card: the EST4 RMA rate, 0.28% against a 0.35% limit — in control. Two signals under a green aggregate." | **PAUSE 3 s.** Let him look. |
| Scroll gently to the Field Signal Monitor; drag the strip once to the end card. | "The Field Signal Monitor: the five, ranked by severity, population and consequence, each routed to one owner. Every card shows its severity, confidence, owner and the decision it's waiting for. And the last card is what was thrown away, and why." | — |
| Scroll back up to the Q1 card. | "Let's start with the installed base." | — |

**If he asks…**
- *"Is 1,800 a day right for us?"* → "It's sized from industry patterns, not from KGS. Discovery replaces it with your actual volumes in week one."
- *"What's a signal versus a cluster?"* → "A cluster is one problem phrased many ways, counted once. A signal is a cluster that's moved against its own baseline past the threshold. 1,640 clusters, five signals."
- *"Where's the health score?"* → "Deliberately not there. A composite score would be false precision. It counts what's above threshold and shows you the aggregate beside it."

### 1.3 Q1 drill-down — 3:00–4:15

| Click (RBK) | Say (Ranjith) | Pause / cue |
|---|---|---|
| Click the Q1 card → `/installed-base`. Point along the four KPI tiles. | "Installed base. Two signals above threshold. 45 of 46 firmware cohorts in control. The EST4 RMA rate in control. And firmware recorded on 38% of EST4 trouble cases — I'll come back to that one." | — |
| Point at the EST4 row and footnote in "Interactions read". | "The EST4 platform as a whole is only 1.3 times its own baseline. The problem cohort is 23 contacts inside 1,960. The platform average hides it; the version denominator doesn't." | **PAUSE 2 s.** |
| Point at "Contacts lead, RMAs lag". | "Contacts lead, RMAs lag. The RMA line hasn't moved, and it isn't reviewed until 7 October." | — |
| Point at wall card "#1 of 5". | "Number one of five. Let's open it." | — |

**If he asks…**
- *"What's the date-code one?"* → RBK scrolls to the date-code heat strip. "Detector family D-2, date codes 2611 to 2614, synthetic: early-life failures at 4.2 times the adjacent weeks, while the SKU return rate is 0.21% against a 0.30% limit. 1,900 units are still in distributor stock — containable. It's with the Director of Product Quality, awaiting approval."
- *"Why is the Edge cluster suppressed?"* → "How-to questions after a training release. That's adoption, not a fault, so it's kept out of the signals and shown here so you can see what LiSN didn't escalate."

### 1.4 The double-click — 4:15–8:45

**A · Open the hero (4:15)**
- **RBK:** click "Open signal →" on wall card 1. Mouse off the headline.
- **PAUSE 5 s.** Let him read the headline.
- **Ranjith:** "EST4, firmware 4.1 — a synthetic version. 'Devices not found after upgrade' at 3.1 times the rate of panels still on 4.0. Nine partners, three regions, 1,240 panels on the version."

**B · The river (4:40)**
- **RBK:** hover the "16 Sep" marker; then move to the grey line.
- **Ranjith:** "6.2 contacts per thousand panel-weeks, against 2.0 on 4.0, over the same three weeks — each panel aligned to its own upgrade date. Released 2 September. Above threshold on 16 September, at the third independent partner. The next monthly RMA review is 7 October: 21 days later. And the grey line is the EST4 RMA rate. Flat. In control."
- **PAUSE 3 s.** Then: "That's the special-cause test, applied to installer calls."
- **Cue:** stop and let him react. Do not fill the silence.

**C · Severity, confidence, counter-evidence (5:20)**
- **RBK:** move along the severity strip; point at the confidence marker; click to expand "Counter-evidence".
- **Ranjith:** "S2, quality. A cliff at the release. 1,240 panels exposed and 5,560 eligible that haven't upgraded yet. Incident flag off — no fire event, injury or dispatch mentioned; any S1 phrase in this cohort would go to Quality immediately. Medium confidence: 15 cases have the firmware in the record; 8 are inferred, and they're kept separate. And it argues against itself: 412 panels on 4.1 at 180 sites show no symptom. It concentrates in configurations with more than two loops — a candidate, not a cause."

**D · Evidence drawer (6:00)**
- **RBK:** click "Evidence · 23". Leave snippet 1 in view.
- **Ranjith:** "Every number opens to the calls behind it." Reads snippet 1 aloud: *"After we pushed 4.1 the loop comes back with half the devices missing. Rolled one panel back to 4.0 and it mapped fine."* "Installers are already working round it — five rollbacks across four partners."
- **RBK:** click tab "Linked RMAs 2".
- **Ranjith:** "Two returns in three weeks, both no fault found. Without the join, each one closes as NFF on its own."
- **RBK:** click "Method & audit"; point at "President · just now".
- **Ranjith:** "The method's here, and so is who has looked. That's you, just now."
- **RBK:** Esc to close.

**E · Draft brief (6:45)**
- **RBK:** click "View draft". Scroll slowly to "Candidate causes (ranked)" and its footer.
- **Ranjith:** "LiSN has drafted the investigation brief for Engineering: the signal, the excerpts, the cohort, the configurations, candidate causes ranked — each with the evidence for, against, and a test — and the decision it's asking for. It's a draft. It hasn't gone anywhere. And the footer says it plainly: LiSN does not determine cause. Engineering decides."
- **RBK:** close the modal.

**F · The gate, as President (7:15)**
- **RBK:** hover the disabled "Approve investigation" so the tooltip "Approval sits with VP Engineering" shows.
- **Ranjith:** "You can't approve this one. It isn't your decision — it's Engineering's. What you can do is ask."
- **RBK:** click "Ask VP Engineering for a decision". The chip "Decision requested by President" appears.
- **Ranjith (question 1 of 5, in flow):** "Who in your team would own this card?"
- **PAUSE.** Wait for the answer. RBK writes it down word for word.

**G · Switch to VP Engineering (7:45)**
- **RBK:** click "Viewing as: VP Engineering". Point at the breadcrumb changing.
- **Ranjith:** "Now the same screen, as VP Engineering."

**H · Approve (7:55)**
- **RBK:** click "Approve investigation". Wait for the spinner, the green state and the toast. Do not move until the toast has shown.
- **Ranjith:** "Approved, and logged with the time. Look at what didn't happen. The rollout decision is still open — that's Engineering's call, not LiSN's. The note for tech-support agents now waits for the VP of Service. Nothing has gone outside. And LiSN keeps watching: 4.1 is re-measured against 4.0 every day."
- **RBK (optional, if time):** open "Evidence · 23" → "Method & audit"; the approval line is at the top with the same timestamp. Close.

**I · Back to the weekly view (8:25)**
- **RBK:** switch "Viewing as" back to President (state stays approved). Rail → Overview. Point at Pulse card 1 chip "Investigation approved", then Field Signal Monitor card 1 "✓ Investigation approved", then AV-3 "4 awaiting owners".
- **Ranjith:** "And the weekly view has caught up. One decision taken, by the person who owns it."

**If he asks…**
- *"Is there actually a problem with 4.1?"* → "No. 4.1 is a synthetic version number. Nothing here is a finding about any KGS product — that's why the badge never goes away."
- *"Why three partners?"* → "The trigger is at least 2.5 times and at least three independent partners, so one noisy partner can't raise it on its own. In Discovery your team sets the threshold."
- *"How do you know which firmware a case is on?"* → "Where it's recorded on the case, that's K. Otherwise it's inferred from ship date or download logs and marked I. How often it's recorded is the first thing Discovery measures."
- *"Why is the money so small?"* → "Because it's week three. The point is the 21 days. If the rollout carried on unchanged, about $0.15m over 12 weeks — the method is one click away."
- *"Can it tell us the root cause?"* → "No, and it shouldn't. It gives candidates with the evidence for and against. Engineering decides."
- *"Show me the statistics."* → RBK opens "Method & audit". "Difference-in-differences, event-time aligned; Poisson exact test; baseline is 26 weeks on the prior version."
- *"What if I want to approve it?"* → "By design the gate sits with the owner. You can ask; you can't approve for them."
- *"Doesn't ConnectedSafety+ do this?"* → objection card 1 (§4).

### 1.5 Q2 and Q3, then the governed watch — 8:45–10:15

| Click (RBK) | Say (Ranjith) |
|---|---|
| Rail → Channel (`/channel`). Point at the partner timeline. | "Same method, your channel hat. One Strategic Partner — ESD-SE-07, synthetic — drifting against its own baseline: 3.1 times the friction for six weeks, recontacts 38% against 14%, two of five certified technicians lapsed, a competitor named in four calls. EST4 sell-in down 22% while territory peers are up 4%. The friction led the sell-in by about five weeks. A recovery brief is waiting for the Regional GM — no outreach sent." |
| Flip the backorder toggle "vs revised / vs original". | "And backlog: 94% on time against the revised promise date. 71% against the original." |
| Rail → Separation (`/separation`). Point at the cutover timeline and the control line. | "The separation. Since UK-EU invoicing moved to the new entity on 1 September, remit-to and entity contacts are 2.7 times — against 1.1 in the control regions that haven't cut over. 14 distributors, £1.1m in dispute, DSO up six days. The other three cutovers are clean against control. Candidate: PO-entity mapping in the EDI layer — engineering to confirm." |
| Rail → Overview; scroll to the governed watch tile; click it; close the modal. | "Safety and cyber. You see that two items exist, who holds them and how long since the first mention — not the contents. Those are restricted to Quality, PSIRT and Legal. LiSN does not determine reportability." |

**Ranjith (question 2 of 5, in flow):** "Of everything you've seen, which would you open first on a Monday — and which would you delete?"
**PAUSE.** RBK notes the answer.

**Fallback if Q2 or Q3 is not built or misbehaves:** stay on `/`; use the Q2 and Q3 question cards and Field Signal Monitor cards 3 and 5. Same lines.

**If he asks…**
- *"Partners will feel watched."* → "Only what partners send to KGS. No cross-partner disclosure, no pricing analytics, and Legal reviews the channel taxonomy."
- *"How do you know the cutover caused it?"* → "The control region. Same weeks, not cut over, 1.1 times. Timing is known; the cause is a candidate for engineering to confirm."
- *"What's in the cyber item?"* → "I can't show you in the President role, by design. It opens for PSIRT and Legal."

### 1.6 Value ledger — 10:15–11:15

| Click (RBK) | Say (Ranjith) |
|---|---|
| Scroll to "Applied value · this week". Point tile by tile. | "What is it worth? No savings claims. A median of 21 days ahead of the next scheduled review, across the five. Five signals, five owners. Decisions pending — four now, after that approval; seven drafts, none sent, no automatic actions. And exposure in view, kept separate on purpose: warranty and field up to half a million dollars, backlog at risk $2.3m, invoices in dispute £1.1m. Not added together." |
| Click "How we count". Scroll to the V-14 scale anchors. | "Every figure has its method here. And the scale comes from volumes — panels, RMAs, backlog — never from revenue." |
| Point at the footnote under the strip. | "And the honest caveat: lead time is measured against the review calendar, not against when your teams would otherwise have known. Discovery tests that blind." |

**If he asks** *"What would it be worth at our scale?"* → "I'd rather not guess. If the blind test works, the value case gets built by your owner on your warranty, cost-to-serve and DSO lines."

### 1.7 Close and the ask — 11:15–13:00

**RBK:** close the drawer; scroll to the Evidence readiness tile.

**Ranjith (exact):**
> "Last tile. Firmware recorded on 38% of EST4 trouble cases, recoverable from the text for most of the rest. That's the first thing Discovery measures — on your data.
>
> So here's what I'd suggest. Three things.
>
> **One — name an owner.** VP Service and Tech Support, or the Quality lead. They judge this, not you. You sponsor; they score.
>
> **Two — a 90-day Discovery.** Offline, in a KGS tenant. One portfolio and region — NA Edwards would be my suggestion — with 12 to 24 months of tech-support, RMA and order extracts. No production integration, nothing on the separation's critical path.
>
> **Three — make it blind.** Your team picks a past issue it already understands and doesn't tell us. We run blind. Your evaluators score us against criteria they write before any data is shared. If it isn't earlier than your existing reporting, we stop. No commercial proposal until the owner judges the readout worth one.
>
> And for the next call — who should be in the room?"

**PAUSE.** Let him name roles or people. If he hesitates, offer the list in §3: "Engineering, Service and Quality would be my first three; the CIO if the separation view is useful."

**If he says…**
- *"What does it cost?"* → "Nothing to decide now. No commercial proposal until your owner judges the Discovery worthwhile."
- *"InfoSec will want SOC 2."* → "It runs inside your tenant, under your controls, with no data egress. We'll complete your questionnaire and provide the architecture and data-flow documents. If policy needs SOC 2 regardless, we'd rather know now."
- *"Who else uses LiSN?"* → "Commercial fire would be LiSN's first life-safety application. That's exactly why we're proposing a blind test your team scores." (Name no customers.)
- *"Given we're related…"* → "That's why you sponsor and don't score or approve spend. The owner writes the criteria, and it goes through your normal vendor process."
- *"Not now."* → "If the timing's wrong with the separation, say so and I'll come back later."

---

## 2. The five questions (v2 feedback)

Ask in this order. Numbers 1 and 2 are already asked in flow (§1.4 F, §1.5); do not repeat them at the end.

| # | Question (say it like this) | Why we ask | Listen for |
|---|---|---|---|
| 1 | "Who in your team would own this card — Engineering, Quality or Service?" | Names the Discovery owner and the first invitee | A role and ideally a name |
| 2 | "Which would you open first on a Monday — and which would you delete?" | Ranks the v2 screen and shows what to cut | The domain he leads with; any "I wouldn't need this" |
| 3 | "What should reach you, rather than stay with the owner? Where would you set the line?" | Sets the President-level threshold | Severity, $ size, partner size, regions |
| 4 | "Is there a past issue whose timeline you know well enough to test us on blind?" | Seeds the blind retrospective | Yes/no, rough period, domain (not details on the call) |
| 5 | "For the next version, which matters most: an EST3-to-EST4 migration view, a ConnectedSafety+ join, or a China lens?" | v2 priority | One pick, and why |

**Hold in reserve** (ask only if he has time and energy; otherwise leave them for the owner): what his team calls this problem (quality escapes, field issues, cost-to-serve); which systems hold cases, RMAs and orders, and which are still on TSAs; whether cases capture model, firmware and serial; which region he'd choose; what a six-month win would look like to the owners.

**How to capture (RBK, live):** one row per question in the debrief sheet. Write his words, short and verbatim; not a paraphrase. Do not record the call unless he agrees first. Do not write down any financial figure he mentions.

| Q | His words (verbatim, short) | Role/person named | Implication for v2 / next call | Follow-up owed by us |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |
| 4 | | | | |
| 5 | | | | |
| Other | Objections raised, corrections to our terms, anything he pointed at twice | | | |

---

## 3. "Bring more people" — who to invite, in lines Kartik can forward

Recommend **three or four** people for the next call; Kartik is welcome but not needed. Lead with the first three.

| Role | Why them (one line for Ranjith) | Line Kartik can forward |
|---|---|---|
| **VP Service & Tech Support** | Owns the contact data and cost-to-serve; the natural Discovery owner. | "Worth 20 minutes: a way to see repeat-contact clusters and emerging field issues across all our tech-support traffic, joined to RMA and orders. It's an offline test on our data and your team would set the criteria." |
| **VP Engineering** | Owns the hero card; judges the method. | "They say installer calls can show a firmware-release problem before the RMA trend moves. I'd like you to test that blind on a past issue we already understand." |
| **Quality / Field Quality lead** | Date-code and RMA special cause; first-mention timestamps. | "This looks for special-cause clusters in RMA and call narratives while the aggregate return rate is still green — worth a look from your side." |
| **CIO / separation lead** | Data access, TSAs and the cutover view. | "No integration ask — offline extracts only, in our cloud. It shows what distributors experience after each cutover. Can you tell me if an extract is feasible?" |
| Regional GM NA | Partner drift and backlog consequence. | "Early warning on partners going quiet or unhappy, from their own calls and emails, before it shows up in orders." |
| CFO | Every signal carries its P&L line; no savings claims. | "Not asking for budget. If the blind test works, the value case would be built on our warranty, cost-to-serve and DSO lines." |
| *Later:* PSIRT / CLO | Governed watch design. | "Before this goes anywhere I want Legal and PSIRT comfortable with the design — it routes, it never decides." |

**A forwardable paragraph** (for Kartik to paste; Ranjith to confirm tone before offering it):
> "I've seen a short demo of LiSN, an early-warning layer that reads what installers, partners and distributors tell us — tech-support calls, cases, RMA notes, emails — and joins it to firmware, batch, RMA and order data. The proposal is a 90-day offline test in our own tenant: we pick a past issue we already understand, they run blind, and our team scores the result against criteria we set first. I'd like [role] to own the evaluation. Could you join a 30-minute call?"

---

## 4. Objection quick-cards (keep beside the screen)

| # | If he says | Say (one line) |
|---|---|---|
| 1 | "ConnectedSafety+ already does this." | "ConnectedSafety+ shows what enrolled panels did; LiSN shows what installers and partners say about all panels, connected or not — the human layer beside it, not a rival." |
| 2 | "We already run RMA Paretos and a monthly quality review." | "A Pareto ranks volume; LiSN ranks change against each cohort's own baseline and brings in the calls before the RMA. Discovery compares time-to-recognition — if it isn't earlier, we stop." |
| 3 | "Salesforce / Einstein can do this." | "Keep it — it's a source. LiSN adds per-cohort baselines, joins to firmware, serial, RMA and orders, and the evidence trail; if your programme already does that, Discovery will show it and we'll say so." |
| 4 | "Our own team or an LLM could build this." | "You could. An LLM explains the text it's handed; the hard parts are matching, baselines, installed-base denominators and provenance. The question is time and focus during separation — and the blind test gives you a benchmark either way." |
| 5 | "We're mid-separation; no bandwidth." | "One-off extracts and a KGS tenant. No production integration, nothing on the separation's critical path." |
| 6 | "Our cases don't carry firmware." | "Possibly — that's the first thing Discovery measures. Where fields are sparse, cohorts drop to family level and the confidence marker says so." |
| 7 | "We'll drown in false alarms." | "Recall broad, rank severe: 212 look-alikes suppressed with the reasons shown, confidence and counter-evidence on every signal, and false-positive rate is a Discovery metric." |
| 8 | "Legal won't let an AI flag safety issues." | "LiSN decides nothing. It makes what's already in your systems findable and routes it to Quality, PSIRT and Legal under counsel's rules. It does not determine reportability." |

**Second line** (one breath each): *Is this our data?* "No — synthetic, sized to your volumes." · *Cost?* "No proposal until your owner judges the Discovery." · *SOC 2?* "Runs in your tenant, no egress; we'll answer your questionnaire." · *Small vendor?* "Bounded, offline, in your cloud, scored by KGS — the risk is capped by design."

**Never say:** "your data is fragmented", "you can't see this today", "resolves", "root cause", "predicts", "real-time", "300K", savings or ROI, any customer name, "Carrier" for the current business, any figure he has shared privately.

---

## 5. Pre-demo QA checklist

Run the full list the evening before on the live URL **and** the local build. Re-run §5.1 and the setup in §1.0 one hour before.

### 5.1 Functional
- [ ] Routes load: `/`, `/installed-base`, `/installed-base/signal/fw-4-1`, `/signals/A1` (redirects to the hero), `/channel`, `/separation`. Rail icons go to the right routes. Back works.
- [ ] Pulse card 1 and Field Signal Monitor card 1 open the hero. Q1 card opens `/installed-base`. Wall card 1, the 4.1 line in the cohort monitor and P-J "Open signal →" open the hero.
- [ ] Funnel: "212 suppressed" popover; "5 signals above threshold" scrolls to the monitor; "2 governed watch items" scrolls to the watch tile.
- [ ] "What's counted" popover on each question card; "Why ranked here?" popover on the hero.
- [ ] Evidence drawer: 4 tabs; 5 featured + 23 total snippets; "President · just now" added on first open; Esc closes; focus trapped.
- [ ] "View draft" modal opens and closes; header chip "DRAFT — not sent".
- [ ] **Approval flow, end to end:** Approve disabled as President with tooltip → "Ask VP Engineering for a decision" adds chip and audit line and disables itself → switch to VP Engineering → Approve → spinner → green state → audit line → toast → switch back keeps state → Pulse chip, monitor card chip, AV-3 "4 awaiting owners", P-J box all updated.
- [ ] **Timestamp identical** on the gate, audit log and toast; format "DD Mon HH:MM UTC".
- [ ] Reload resets everything. "Reset demo" resets everything and returns to `/` with the toast "Demo reset".
- [ ] Governed watch tile opens the restricted modal only.
- [ ] No enabled Send / Notify / Export button anywhere; "Export list" disabled with "Export disabled in demo".
- [ ] Q2 backorder toggle flips 94% ↔ 71% (P1). "How we count" drawer opens from the strip and the AV tiles.

### 5.2 Visual
- [ ] At 1920×1080, 100% zoom: no horizontal scroll on the page (the monitor strip scrolls on its own), no clipped chips, no overlapping chart markers on the hero river ("2 Sep", "16 Sep", "7 Oct" all readable).
- [ ] Screen-share legibility: view the shared window on a second laptop over the actual call tool. Smallest text readable; grey-on-grey contrast acceptable.
- [ ] Severity always shows text ("S2 · Material impact"), never colour alone. Money never green or red.
- [ ] Borders: Q1 orange highlighted, Q2 teal, Q3 sky-400. Only the LiSN monogram as a logo; no bank, client or partner logos.
- [ ] Badge sits above the drawer and modal backdrops. Footer fixed on every route.
- [ ] Motion: count-ups finish within 0.7 s; no bounces; the approval morph plays once.

### 5.3 Content and house style
- [ ] Run this in the DevTools console on **every route, with the drawer and draft modal open once each**. Every hit must be reviewed; the only allowed hits are listed below the snippet.

```js
(() => {
  const exact = ["LisN","Lisn","LISN","FCI","HSHF","MCC","EMI","CSAT","NPS","ROI","!"];
  const ci = ["resolv","root cause","conversation ai","ai risk spike","ai summary wall","cardholder","cards","chargeback",
    "merchant","sentiment","churn","customer journey","head of cards","predict","real-time","cheap","crossed a threshold",
    "index","health score","recall","defect confirmed","field action","residential","smoke alarm","co alarm","carrier",
    "gloria","300k","100% of","saving","payback","notified","has contacted","has been sent","auto-fix","auto-report",
    "organization","prioritize","color","center","behavior","analyze","license"];
  const svg = [...document.querySelectorAll("svg text")].map(n => n.textContent).join(" ");
  const t = document.body.innerText + " " + svg + " " + document.title;
  return [...exact.filter(w => t.includes(w)), ...ci.filter(w => t.toLowerCase().includes(w))];
})();
```
Allowed hits: "Recall broad, rank severe." (suppressed card footer) · "LiSN does not determine cause" and "Candidate, not cause" (not matched by "root cause") · "not sent". Anything else is a fix.

- [ ] "LiSN" never CSS-uppercased (look for "LISN" in caps labels such as "LiSN INSIGHT").
- [ ] "(synthetic)" after every firmware version, serial range, date code, SKU family and partner ID, on every screen.
- [ ] Every money value carries the "ILLUSTRATIVE" chip or sits under "Synthetic scenario". No $ plus £. AV-4 shows three separate lines.
- [ ] Wording is "above threshold this week" everywhere, including the Executive Brief and the intro.
- [ ] No person's name anywhere (roles only; the President is "President"). No competitor name ("[competitor]").
- [ ] No revenue, savings, ROI or payback anywhere, including "How we count" (its footer says so).
- [ ] Brands filter lists exactly Edwards, Kidde Commercial, GST, Aritech, EMS, AirSense. No Gloria, suppression, extinguishers or residential products.

### 5.4 Anonymise
- [ ] Default **OFF** on load; `?anon=1` forces ON.
- [ ] Toggle ON on each route (drawer and modal open once each), then run:

```js
(() => {
  const named = ["Edwards","Kidde Commercial","Aritech","EMS","GST","AirSense","EST4","EST3","Edge","iO","Evolve","VM/VS",
    "2X","FireCell","SmartCell","ModuLaser","ESD-","DLR-","DIST-","US-SE","US-SW","US-NE","US-MW","US-W","Canada",
    "UK-EU","Florida","Texas","Georgia","Ontario","Arizona","Alabama","Houston"];
  const svg = [...document.querySelectorAll("svg text")].map(n => n.textContent).join(" ");
  const t = document.body.innerText + " " + svg + " " + document.title;
  return named.filter(w => t.includes(w));
})();
```
Expected: empty, except false positives inside ordinary words (e.g. "EMS" inside "SYSTEMS"). "KGS" in the badge and footer is intended.
- [ ] "ANONYMISED" chip and the diagonal watermark "Synthetic scenario — not KGS data" appear.
- [ ] Print preview (Ctrl+P) forces anonymise ON and restores the previous state afterwards.
- [ ] Hero H1 reads "Panel platform A · firmware A.4.1 (synthetic) — …"; partners read "Partner P-07" etc.; regions "Region NA-1" etc.

### 5.5 Safety and cyber tile
- [ ] Footer reads exactly "LiSN does not determine reportability."
- [ ] Modal: "Access limited to Quality, PSIRT and Legal roles. Routed to Quality / PSIRT — human decision. LiSN does not determine reportability."
- [ ] No platform, firmware, country or content in either mode; content lines render as redaction bars. P&L line "P&L: Restricted"; no $ figure.
- [ ] W-1 shows "6 Sep 14:38 UTC" routing and the "23 Sep 10:02" chronology update. W-2 shows 09:14 first mention, 09:21 routing, clock "8h 46m", and the 24h / 72h ticks labelled "reference only".
- [ ] No reportability verdict, "report filed", "notified regulator" or similar anywhere.

### 5.6 No residential recall content, no banking or FCI leftovers
- [ ] Console check in §5.3 returns no "residential", "smoke alarm", "co alarm", "recall" (other than the allowed footer).
- [ ] Section titles: "Field Signal Monitor", "LiSN Signal Wall", "LiSN INSIGHT", "LiSN suggests · owner decides", "LiSN evidence summary" (rows "Main signal / What changed / Decide first"). Not "AI Risk Spike Monitor", "AI Summary Wall", "Conversation AI", "Real-time FCI intelligence".
- [ ] Breadcrumbs start "Global Commercial Fire · President · …" — no "Credit Cards", "Head of Credit Cards", "Lifecycle · Journey · Retention".
- [ ] No hashtags, social reach, word clouds, sentiment gauges or volume league tables survive from the bank build.

### 5.7 Numbers consistent across exec, drill-down and hero
Every figure must be identical wherever it appears. Tick each row.

| Figure | Must match on |
|---|---|
| **5** signals above threshold (= 2 + 2 + 1) | Funnel · Brief · monitor chip "5 ABOVE THRESHOLD" · AV-2 "5 → 5 owners" · hero "#1 of 5" · question-card counts |
| 233,900 · ~9,000 · 1,640 · **212** (74 + 58 + 41 + 27 + 12) · 2 | Funnel · suppressed popover · suppressed end card · AV-6 · "How we count" V-12/V-14 |
| **3.1×** · 6.2 vs 2.0 | Pulse 1 · Q1 insight · Q1 MiniKPI · monitor card 1 · wall card 1 · hero H1 and metric line · "Why ranked" |
| **1,240** panels · **5,560** eligible · ~610 sites | Pulse 1 · Q1 MiniKPI 2 · monitor card 1 · severity strip · cohort table total (540 + 430 + 270) · drawer Cohort · "Why ranked" |
| 9 partners · 3 regions · **23** contacts (11 + 8 + 4) · K 15 / I 8 | Hero · monitor card 1 · drawer ("Evidence · 23", "Snippets 23") · confidence marker |
| 2 Sep · **16 Sep** · **7 Oct** · **21 days** | Hero river markers · Q1 contacts-vs-RMA · AV-1 · hero sub-tile · wall card 1 |
| ≈ $12k · ≈ $0.15m · ~140 | Hero P&L · "Why ranked" ($0.15m) · "How we count" |
| EST4 RMA **0.28%** vs **0.35%** (gauge 80%) | Q1 card gauge 2 · Q1 KPI tile · Q1 contacts-vs-RMA · hero grey line label |
| 45 / 46 (98%) | Q1 gauge 1 · Q1 KPI tile · cohort monitor subtitle · "What's stable" |
| D-2: 4.2× · 4,800 · 1,900 (40%) · 11 distributors · ≤ $0.35m · 0.21% vs 0.30% · K 22 / I 9 | Monitor card 2 · Q1 "What's counted" row #2 · date-code strip · wall card 2 |
| ESD-SE-07: 13 → 40 · 3.1× · 14% → 38% · −22% / +4% · $6.4m · $0.9m · 2 of 5 · 4 mentions | Q2 card · monitor card 3 · Q2 partner league and timeline · Q2 diagnosis |
| N-3: 3.2× · 94% / 71% · $2.3m · 312 lines · 11 partners · 4 projects | Q2 card · monitor card 4 · Q2 backorder panel · AV-4 |
| UK-EU: 2.7× (control 1.1×) · portal 3.4× · 14 of 180 · £1.1m / 212 invoices · DSO +6 days | Pulse 2 · Q3 card · monitor card 5 · Q3 KPIs and timeline · AV-4 |
| AV-4 "Warranty & field ≤ $0.5m" (= 0.15 + 0.35) · AV-5 ~430 (= 140 + 290) · $11k–26k | Applied value strip · "How we count" |
| AV-1 21 days (leads 13 · 19 · 21 · 25 · 34, median 21) · AV-3 5 → 4 after approval | Applied value strip · AV-1 popover |
| Q2 "CERTIFICATIONS LAPSING ≤30 DAYS" **186** (not 212) · Houston switching 11 vs 3 (3.7×) · P-F "about 2%" | Q2 KPI row · Q2 switching table · Q1 contacts-vs-RMA caption |

### 5.8 Timestamps plausible
- [ ] "Data as of 25 Sep 2026 18:00 UTC" everywhere it appears (ContextBar, wall pill, joined panels, "What's counted" footer). Period "26 weeks to 25 Sep 2026".
- [ ] No static timestamp later than 25 Sep 18:00 UTC (latest evidence 25 Sep 14:08; latest audit entry 25 Sep 07:55). Only live demo actions carry today's date.
- [ ] Third-partner email: "Received 15 Sep 23:12 ET = 16 Sep 03:12 UTC"; routed 16 Sep 06:10 UTC (after the crossing).
- [ ] Weekday sense: 25 Sep and 18 Sep are Fridays (weekly digest); 5 Oct a Monday (OTIF and DSO reports); 7 Oct a Wednesday. W-1 on Sunday 6 Sep is plausible for an always-on watch — say so if asked.
- [ ] The W-2 clock is frozen at the data-as-of time ("8h 46m"). If asked: "The clock is frozen at the data-as-of time for the demo."
- [ ] Live approval time is UTC. If presenting from IST, expect it to read about 5½ hours behind the local clock; that is correct.

### 5.9 Failure-recovery plan

**Prepare the night before**
- **Local production build** on RBK's laptop (`npm run build && npm run start`), tested with Wi-Fi **off**: fonts, icons and charts render with no network.
- **Fallback screenshot PDF**, in run-of-show order, captured in named mode with the badge visible, **kept local and never sent**: (1) overview top · (2) monitor strip and watch tile · (3) Q1 top · (4) hero · (5) hero with counter-evidence open · (6) drawer snippets · (7) draft modal · (8) gate as President with tooltip · (9) approved as VP Engineering with toast · (10) overview after approval · (11) Q2 · (12) Q3 · (13) Applied value with "How we count" · (14) Evidence readiness. Keep a copy on Ranjith's laptop too.
- A separate **anonymised** set of the send-pack frames (§6).

| Failure | Recovery (RBK unless stated) |
|---|---|
| Live URL slow or down | Switch to tab 2 (local build). Ranjith: "One moment — switching to the local copy." |
| Driver laptop or share fails | Ranjith shares the fallback PDF from his own laptop and narrates the same lines. |
| Approval flow breaks mid-click | Reload (resets) → `/installed-base/signal/fw-4-1?intro=0` → repeat F–H. If it fails again, show frames 8–10. |
| Wrong state (already approved, wrong role) | Demo controls → "Reset demo", then go straight to the hero. |
| A chart fails to render | Narrate from the metric line and open the evidence drawer instead. |
| Anonymise switched on by mistake | Leave it: "This is the mode anything forwarded uses." Switch off at the next natural break. |
| Q2 or Q3 not ready | Use the overview question cards and monitor cards 3 and 5 (§1.5 fallback). |
| Time cut to 5 minutes | Framing (30 s) → funnel and Q1 card (60 s) → hero river, gate, approve (2½ min) → the ask (60 s). |
| Kartik on a phone or small screen | Zoom to 125%; stay on the hero and drawer; promise the screenshots within 24 hours. |

---

## 6. After the demo

### 6.1 Send within 24 hours
1. **A short covering note** — forwardable, stands alone: no "as we discussed", no private figures, relationship line included if not already disclosed in writing, an easy exit ("if the timing is wrong with the separation, say so"). Channel and tone: Ranjith to confirm (email or WhatsApp) before it is drafted.
2. **The one-page brief** (`out/Messaging_Positioning_Demo_Inputs.md` §8), laid out, with any corrections from the call applied.
3. **Five or six anonymised screenshots**, watermarked, as one PDF: overview · hero · evidence drawer · decision panel after approval · Applied value with "How we count" · Evidence readiness. Name files neutrally (e.g. `LiSN_synthetic_scenario_01_overview.png`). Run §5.4 on each frame before sending.
4. **The forwardable lines** from §3 for the roles he named, and the forwardable paragraph if he wants it.

**Do not send:** named-mode screenshots, the live demo link (Anonymise can be switched off there), the dev pack, anything containing figures he shared privately.

### 6.2 Log the same day (project doc, e.g. `KGS_Demo_Debrief_v1.md`)
- Date, attendees (roles), run time, what was skipped.
- The five answers from the capture sheet (§2), verbatim and short.
- **Owner named** and **invitees named** for the next call; proposed date.
- Objections raised, the answer given, and whether it landed.
- Where he paused, pointed or asked twice (these shape v2).
- Corrections to our terminology or domain facts — these become standing corrections for every later document.
- Data and system facts he volunteered (TSA status, whether cases carry firmware) — no financial figures.
- Demo defects seen (RBK), fixed before the next call.
- Next step, owner on our side, due date.

---

## 7. Open items for Ranjith before the call
Items 1–3 below were settled in the pack review on 28 Sep. The open list for Ranjith is now kept in one place: `00_README_START_HERE.md` §8.
1. **"212" — settled.** The Q2 certification KPI is now 186; "212" means only look-alikes suppressed (V-12) and invoices in dispute (V-08).
2. **ESD-SE-07 ratio — settled.** 40 interactions vs 13 (3.08 → 3.1×), in 02, 04, 05a and the mock.
3. **Presenter wording — settled.** "above threshold this week" throughout.
