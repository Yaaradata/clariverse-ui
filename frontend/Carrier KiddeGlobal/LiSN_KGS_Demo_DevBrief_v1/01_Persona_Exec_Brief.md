# 01 · Persona & Exec Brief — who the KGS demo is for

**For:** Ranjit BK (building the KGS demo tomorrow in Cursor) · **From:** Exec Persona & Value Strategist · **v1 · 28 Sep 2026**
**Read with:** `02_Requirements_Pain_Value.md` (what goes on each screen, exact copy, value maths).
**Sources:** `out/Messaging_Positioning_Demo_Inputs.md` (§10 demo spec), `out/Personas_Stakeholders_Risks.md` (P1–P9), dossier IDs in brackets (e.g. M0.1-5). Everything about KGS internals below is either public (with an ID) or an **industry pattern**, not a claim about KGS.

---

## 1. Who we are building for

**Kartik Kumar — President, Global Commercial Fire, Kidde Global Solutions (KGS).** On screen he is only ever **"President"**. Never show his name or any other person's name. Roles only.

| Topic | What to know | Why it matters for the build |
|---|---|---|
| **Role** | Runs Global Commercial Fire as a P&L. He was VP & GM Commercial Fire / Edwards MD (2023–24), then President GCF under Carrier, and President at KGS since Dec 2024 (M0.1-2). | He knows the products and channel in depth. Generic "CX" screens will not impress him. |
| **P&L** | ~$1bn+. This is his own figure, shared privately (M0.3-11). **Never show it or any figure derived from it** on screen. | All money on screen is sized from synthetic operating data (panels, backlog, invoices), never from revenue. |
| **Brands** | Edwards, Kidde Commercial, GST, Aritech, EMS, AirSense. Keep Gloria, suppression and residential out. | The Brand filter lists exactly these six. |
| **Regions** | NA (US regions + Canada), UK-EU, MEA, India, China, APAC/AUS, LatAm. | The Region filter uses these. The hero sits in NA (US-SE, US-SW, Canada). |
| **Channel model** | **NA:** Edwards sells through Strategic Partners / ESDs (engineered-systems distributors) and dealers. **UK-EU:** distributors and integrators. **China:** GST sells through distributors, integrators and vertical projects. **India/MEA:** mostly a consultant and EPC route. Specifiers and AHJs shape demand but buy nothing. | "Customer" is almost always a **partner or installer**. Say "partner" and "installer", not "customer". |
| **Carve-out context** | KGS was formed on 2 Dec 2024 when Lone Star bought the business from Carrier ($3.0bn EV). It is now in **year 2 of separation**, standing up its own entities, portals, ERP and EDI, with some systems still under Carrier TSAs (M0.3-1, E.2). | This is why Q3 ("Is the separation costing us?") exists. Say **"KGS"**, never "Carrier", for the current business. |
| **Background** | Container-refrigeration P&L at Carrier Transicold, where he regained ~$100m of key accounts (EMEA). Six Sigma Black Belt (he built a pricing tool, +15% win rate). Strategy and M&A roles, including Honeywell strategy. Sits on the carve-out management team (M0.1-11, M0.1-9). | He thinks in **special cause vs control limits**, cohorts and baselines. He has run a key-account recovery play before. He will spot fake precision immediately. |
| **What he says publicly** | "The **quality and reliability** of our products are as critical as bringing forth new innovative capabilities"; new solutions for "existing **gaps and needs**" (M0.1-5). "Investing for **ambitious growth in China**" (energy storage, petrochemicals, rail, electronics, data centres) (M0.1-1). **Connected services** as a personal theme: ConnectedSafety+ and KESMobile to cut site disruption and service calls (M0.1-4). "Grow core… **digital & life cycle services**" (M0.1-11). He visits dealers personally (M0.1-7). He says installers are the best teachers (M0.1-6). | Mirror his words in the UI copy: "quality and reliability", "gaps and needs", "lifecycle". Position LiSN as **the human layer beside ConnectedSafety+**, never as a rival to it. China is a v2 lens, not v1. |
| **What we don't know** | No public long-form interview sets out his post-carve-out operating model, EBITDA targets or AI views (M0.1-10). No KGS scorecard is public. | Don't write copy that assumes KGS's internal KPIs. Frame the numbers as "the kind of thing you'd measure". |
| **Buying role** | Sponsor, not evaluator. He opens the door and names an owner. Owners and Finance judge the Discovery. | The demo's job is to make him think **"who on my team should see this?"** Every card names a routed owner (a role). |

---

## 2. His week

### 2.1 The questions he asks
(Panel reconstruction from P1; the pattern is typical of a President running an OEM P&L.)

| Cadence | Questions |
|---|---|
| **Daily / weekly** | Is anything in the field that could become a quality or safety event? Which big partners are unhappy? What is shipping late? Did last week's cutover break anything for distributors? |
| **Monthly** | Why did warranty / RMA cost move? Are we winning EST3→EST4 migrations or losing them to competitors? How is China tracking? Where is DSO going? |
| **Event-triggered** | After a firmware release, a TSA cutover, a product launch (Edge, Evolve) or a large lost bid: *"What are installers and partners saying, and since when?"* |

### 2.2 What reaches him late today (industry pattern, not a claim about KGS)
In most building-technology OEMs:
- **Quality:** a release or date-code problem is recognised when the RMA trend or the warranty accrual moves, often weeks after installers first described it on calls. The aggregate return rate can sit inside its control limit while one cohort goes wrong ("aggregate-rate blindness", D.2).
- **Channel:** partner risk surfaces at the lost bid, the QBR or quarter-close orders. Escalation language sits in RSM inboxes.
- **Supply:** OTD measured against the *revised* promise date looks fine while partners talk about cancelling.
- **Separation:** cutover dashboards report technical status as green, and the business effect (wrong remit-to, portal lockouts, missing acknowledgements) arrives as escalations and a month-end DSO surprise.
- **Safety / cyber:** awareness can begin in an ordinary support call that nobody routes to PSIRT or Legal.
- **Workarounds** that fall short: monthly operating reviews, RMA Paretos, sampled calls, agent-chosen reason codes, dealer visits.

### 2.3 What he is measured on
No KGS scorecard is public (B, 4-src). These are the typical PE year-2 metrics, and each screen ties to one:

| Metric | Screen that protects it |
|---|---|
| **EBITDA / margin leakage** (warranty, expedites, credits) | Q1, Q2 |
| **Warranty and quality cost** (DOA, field failure, RMA, NFF) | Q1 (hero, date-code tile) |
| **Channel share / partner revenue retention** | Q2 (partner drift) |
| **Backlog conversion / OTIF** | Q2 (backorder consequence) |
| **Aftermarket / lifecycle mix** (EST3→EST4 migration, connected services) | v2 teaser only |
| **Cash / DSO** | Q3 (carve-out friction) |
| **Separation milestones** (TSA exit, clean cutovers) | Q3 |
| **Cost-to-serve** | Secondary line on the hero, Q3 and the value ledger |
| **Safety / cyber time-to-detection** (non-negotiable) | Safety & Cyber watch (governed) |

---

## 3. The 60-second glossary

| Term | Plain meaning |
|---|---|
| **Installer** | A technician who installs, programmes, commissions and services fire-alarm systems. In the US often NICET-certified. They make most of the technical calls. |
| **ESD / Edwards Strategic Partner** | An Engineered Systems Distributor: an authorised Edwards partner in NA that sells, installs and services Edwards systems in a territory. In the demo, "ESD-SE-07" is a synthetic partner ID. |
| **Distributor** | A company that stocks and resells KGS products to integrators and contractors. The main route in UK-EU and APAC. |
| **AHJ** | Authority Having Jurisdiction: the fire marshal or building-control officer who accepts or rejects a system at acceptance testing. They buy nothing but can block a project. |
| **RMA** | Return Merchandise Authorisation: a product sent back as faulty. The RMA narrative is the free text explaining why. |
| **DOA** | Dead on arrival: fails at installation. |
| **NFF** | No fault found: a returned part tests fine on the bench. A high NFF rate often means the real problem is somewhere else, such as firmware or configuration. |
| **Firmware** | Software running on the panel. A new release (e.g. 4.0 → 4.1) is downloaded and installed per panel. |
| **Date code / batch** | When a device was made (YYWW, e.g. 2611 = 2026 week 11). A bad batch shows up as a cluster in a date-code window. |
| **Panel** | The fire-alarm control panel, the "brain" of a building's system. The installed base is counted in panels. |
| **EST3 / EST4** | Edwards' flagship panel platforms. EST3 is legacy (new orders halted end-2023; re-check before quoting). EST4 is current. EST3→EST4 migration is a big aftermarket opportunity. |
| **Signature devices / loops** | Edwards' addressable detectors and modules (SIGA modules are one family), wired on "loops" (signalling line circuits) back to the panel. |
| **Loop mapping** | The panel discovering and mapping every device on a loop. "Devices not found" means the map comes back incomplete. This is the hero symptom. |
| **Commissioning** | Setting up, programming and testing a new system before the AHJ accepts it. |
| **ConnectedSafety+** | KGS's cloud platform for remote panel monitoring, diagnostics and inspections (telemetry). KESMobile is the dealer mobile app. **LiSN is the human layer beside it**: what people say, next to what panels do. |
| **UL 268 7th edition** | A US smoke-detector standard (effective 30 Jun 2024) with tougher nuisance-alarm (cooking) tests. It drives a replacement cycle. v2 topic. |
| **TSA** | Transition Services Agreement: Carrier still runs some systems for KGS for a fee until KGS has its own. |
| **Carve-out** | Separating a business from its parent into a standalone company. |
| **Cutover** | The day a process moves from an old system or entity to a new one (e.g. UK-EU invoicing moved to a new KGS entity on 1 Sep). |
| **DSO** | Days Sales Outstanding: how long customers take to pay. When DSO goes up, cash is tied up. |
| **PSIRT** | Product Security Incident Response Team: owns product vulnerability reports. |
| **EU CRA Art. 14** | The EU Cyber Resilience Act reporting duty, live since 11 Sep 2026. Actively exploited vulnerabilities and severe incidents need an early warning within 24h and a notification within 72h of the manufacturer becoming aware. |
| **CPSC §15** | The US consumer-product safety reporting duty. Report generally within 24h of information suggesting a hazard; no need to wait for an injury. |
| **Panel-weeks** | One panel observed for one week. Rates are "contacts per 1,000 panel-weeks" so that a release with few panels can be compared fairly with one that has many. |
| **S1–S4** | LiSN severity class. **S1** life-safety / regulatory · **S2** material impairment, revenue or cash · **S3** operational or performance · **S4** efficiency. Always shown with a text label, never colour alone. |
| **K / I** | Confidence split. **K** = known (joined, verified records). **I** = inferred (extracted from text or imputed). Shown on every signal. |
| **Cliff / slope** | Signal type. A cliff is a step at an event (release, cutover). A slope is sustained drift. |
| **Blast radius** | How much is affected: panels, sites, partners, regions, $ backlog or invoices. |

---

## 4. The "second call": who Kartik invites next

If the demo lands, he forwards it to these people. Each one should find **their** thing on screen within 10 seconds. The routed-owner chips on each card should name these roles, so the demo seeds the invitation.

| Persona (file ID) | What they look for on screen | Where it lives |
|---|---|---|
| **VP Engineering** (P2) | The per-version rate against a release marker, with the **installed-base denominator**, counter-evidence and candidate causes, and **no root-cause claim**. Every excerpt is readable. | Hero lineage river, counter-evidence line, evidence drawer |
| **Quality / Field Quality lead** (P3) | A date-code window going wrong **while the SKU return rate is inside its control limit**, containable stock by distributor, and a first-mention timestamp. | Q1 date-code tile (heat strip beside the green p-chart) |
| **VP Service & Tech Support** (P4, native buyer) | Tech-support **cost-to-serve** as a secondary P&L line, the workaround chip ("rolled back to 4.0" spreading), the draft known-issue note for agents, and that it reads **every contact, not a sample**. | Hero secondary P&L line and chips; evidence-readiness tile |
| **CIO / separation lead** (P7) | Each cutover's business effect against a **control region**, a read-only overlay with no integration ask, and a draft defect ticket. | Q3 cutover timeline |
| **Regional GM NA** (P5) | One Strategic Partner's friction vs sell-in against **its own baseline**, certification lapses, and a recovery brief waiting for their approval (no outreach sent). | Q2 partner-drift panel |
| **CFO** (P8) | Every signal carries **its P&L line** (warranty, backlog, DSO), with a visible method and **no savings claims**. | Applied-value ledger; "How we count" drawer |
| *PSIRT / CLO (P9), usually invited by the CFO or CIO* | That the governed watch shows **counts and clock state only**, says "LiSN does not determine reportability", and restricts contents by role. | Safety & Cyber watch |

---

## 5. Tone rules for all UI copy

| Rule | Do | Don't |
|---|---|---|
| Executive, calm, evidence-first | "3.1× panels still on 4.0 · 9 partners · 3 regions" | "Massive firmware crisis detected" |
| No hype, no exclamation marks | "Above threshold since 16 Sep" | "Caught it early!" |
| Numbers before adjectives | "£1.1m in dispute · 212 invoices" | "Significant cash impact" |
| **"aids resolution"**, drafts, approved by | "Draft investigation brief — awaiting VP Engineering approval" | "resolves", "auto-fixes", "LiSN has notified partners" |
| Candidate, not verdict | "Candidate: configurations with more than two signalling loops — not a cause" | "Root cause: loop configuration" |
| Question form for pain | "How soon does it reach the owner?" | "Your data is fragmented" / "you can't see this today" |
| Brand name | **"LiSN"** always | "Lisn", "LisN", "LISN" |
| British spelling | organisation, prioritise, anonymise, programme, colour, centre, behaviour, licence (noun) | organization, prioritize, color |
| Vocabulary | installers, partners, distributors, installed base, cohort, own baseline, special cause, RMA, NFF, cost-to-serve | customers (as the only word), sentiment, CSAT, NPS, churn, customer journey, tickets |
| Labels | "LiSN insight", "LiSN suggests · owner decides", "Field Signal Monitor" | "Conversation AI", "AI Risk Spike Monitor", "FCI" |
| Money | Round, with unit and the [illustrative] tag: "≈ $0.15m", "£1.1m" | "$152,347.18", savings, ROI, "cheap" |
| Imperatives | Suggestions addressed to the owner: "Owner to decide: pause the 4.1 rollout?" | Commands: "Freeze rollout now" |

---

## 6. What must happen for Kartik to say "let's try this — and get more people on the next call"

### 6.1 The five moments the demo must deliver

| # | Moment | What he sees | What he should think |
|---|---|---|---|
| 1 | **"It's sized to us."** | Synthetic badge plus funnel: "233,900 interactions read (26 weeks; ~9,000 this week) · 1,640 candidate clusters · 212 suppressed · **5 signals above threshold** · 2 governed watch items" | "Not a bank tool with our logo. They understand our volumes, and they suppress noise." |
| 2 | **"Special cause under a green aggregate."** | The hero lineage river: fw 4.1 at 6.2 vs 4.0 at 2.0 per 1,000 panel-weeks, crossing on **16 Sep** at the third independent partner, while the grey EST4 RMA line stays flat and "in control". Next monthly RMA review: **7 Oct**. | "That is my Black Belt test applied to installer calls, and it's three weeks ahead of the review." |
| 3 | **"Every number opens to the calls behind it."** | The evidence drawer ("Evidence · 23") with verbatims, e.g. *"Rolled one panel back to 4.0 and it mapped fine."* Two NFF RMAs, K vs I per case, and counter-evidence. | "It isn't a black box. Installers are already working around it." |
| 4 | **"It goes to the right owner and waits for them."** | Routed to VP Engineering. "Draft investigation brief — awaiting VP Engineering approval". Approve is disabled for President, with the tooltip "Approval sits with VP Engineering". Viewed as VP Engineering, it approves, and the state and audit log update. Nothing is sent externally. | "Who on my team owns this card?" (the cue for invitations) |
| 5 | **"Same method across all three of my hats."** | Q2: ESD-SE-07 drifting against its own baseline while sell-in slips. Q3: UK-EU remit-to friction 2.7× vs a control region at 1.1× after the 1 Sep cutover. The governed watch shows that 2 items exist and who holds them, not their contents. The close: the evidence-readiness tile, "Discovery measures this first — on your data". | "Quality, channel and separation on one method. Low risk to test. Let me get Engineering, Service and the CIO on the next call." |

### 6.2 Five things that would make him lose trust

| # | Trust-breaker | Examples to hunt down in the build |
|---|---|---|
| 1 | **Overclaiming** | "resolves", "root cause", "predicts failures", "real-time" (unqualified), "300K daily", "100% of all KGS interactions", "AI finds the defect", any SOC 2 / certification claim, named LiSN customers |
| 2 | **Implying a real KGS defect** | A firmware version, serial range, partner ID or date code not marked "(synthetic)". The badge or footer not visible. Screenshots or exports in named mode. The words "recall", "defect confirmed" or "field action". Residential products. Any platform name in the Safety & Cyber watch. |
| 3 | **Banking leftovers** | FCI, Conversation AI, HSHF, cards, cardholders, disputes (as a banking term), chargeback, MCC, merchant, EMI, CSAT/NPS, sentiment gauges, churn, "customer journey", #hashtags, social-reach metrics, "Head of Cards" in breadcrumbs, US spelling |
| 4 | **Fake-precision money** | Unrounded $ figures, savings or ROI totals, summing unlike exposures into one big number, any number derived from Commercial Fire revenue, $ without a method tooltip, no [illustrative] tag |
| 5 | **Auto-actions** | Enabled "Send", "Notify partners", "Auto-fix", "Auto-report" buttons. Copy saying LiSN "has contacted" anyone. An approval the President can click on someone else's behalf. Watch contents visible in the President role. |

**Rule of thumb:** if a sentence on screen would make VP Engineering, the CLO or the CFO wince when Kartik forwards it, rewrite it.
