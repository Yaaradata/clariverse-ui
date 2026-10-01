# LiSN × KGS demo v2 — spec change

Sep 30, 2026 · @Ranjith

## 1. Why v2 — what the call changed

v2 moves the demo from a President's early-warning screen to the **India / Asia-ex-China regional team**. It is built around three questions Kartik raised himself: **Are we keeping our promises? What keeps coming back? What do installers experience?** A **Partner view** is added for his partner-branded idea. Kartik's own test was "I don't think we have that many signals" (40:30), so v2 sells one source of truth and a closed loop, not signal-from-noise at volume.

| What Kartik said (call time) | What changes in the demo |
| --- | --- |
| Firmware updates are tested before rollout; "that part is well addressed" (23:11) | Remove the firmware hero and the "Is our installed base healthy?" question. No defect, batch or release language anywhere |
| "We may not have the volumes… not a problem of distilling signal from noise" (39:42–40:30) | Remove the 233,900-interaction funnel and every big-volume counter. Use small, honest counts (about 80 interactions a working day) |
| Partners are "the guys who pay the bill"; their daily contact is late orders and moved delivery dates (15:54, 30:28) | **New hero: delivery promise**, measured against the original date, by region and distributor, tracked week by week: "are we getting better or worse" |
| "Fixed once, but we haven't really fixed the root cause"; "one source of truth" (40:30) | **New question: What keeps coming back?** Each recurring theme is linked to its last fix and flagged when it returns |
| Commissioning time and "easiest to program" praise are not captured (23:59) | **New question: What do installers experience?** Friction and praise by commissioning step |
| "Something that we brand and we give to our strategic partners… we're the backbone" (26:17) | **New Partner view**: a partner's own workspace plus what KGS sees, with the consent boundary drawn on screen |
| India first; regional GM in Delhi; the team covers sales, tech support, engineering and ops (35:11, 39:42) | The screen is scoped to Asia ex China (India regions + SEA) and serves six regional roles (section 2) |
| Salesforce is the CRM (41:14) | Salesforce cases and notes are a named source. An optional pipeline-notes tile is P2 |
| "Is the separation costing us?" only got "Right, yeah" (38:13) | Remove the separation question and route entirely |

**Keep from v1 unchanged:** the shell, design tokens and components (03), synthetic badge, anonymise toggle, severity strip, confidence marker (K/I), join tags, P&L destination tag, evidence drawer (4 tabs), human gate with live approval timestamp, `demoState`, and the `fmt()` / `label()` helpers. v2 is a re-point, not a rebuild.

**Who sees it:** Amit (regional GM) and his team at or after the India AI workshop, and Kartik. The workshop decides which view becomes the first pilot.

## 2. Who it is for — personas and role views

The primary user is the **Regional GM, Asia ex China**. Five functional leads under the GM each get a view, plus one partner-side persona for the Partner view. Never show a real person's name on screen. Label roles only ("Regional GM"), even though we know the GM is Amit.

| Role (on-screen label) | What they own | The question they bring | Lands on | What they can approve in the demo |
| --- | --- | --- | --- | --- |
| **Regional GM** (primary) | P&L for Asia ex China; distributors and strategic partners | "Where do I need to step in this week, and are we getting better or worse?" | Regional overview | Nothing operational. Can "Ask for a decision" from the owner |
| **Operations & fulfilment lead** | Order promise, allocation, dispatch, last-mile carriers | "Which distributors are we letting down on delivery, and is it us or the last mile?" | Are we keeping our promises? | Promise actions: allocation change, carrier review |
| **Technical support lead** | Help desk, service calls, knowledge articles | "What keeps coming back after we thought we fixed it?" | What keeps coming back? | Knowledge-base and process fixes |
| **Partner manager** | Relationship with named distributors and strategic partners | "Which partner is frustrated, and what do I tell them?" | Partner view | Sends partner updates. The only role that can mark a draft "sent", and in the demo it stays a draft |
| **Product liaison** | Feedback into the US product and engineering teams | "What do installers find slow or easy when commissioning our systems?" | What do installers experience? | Product-feedback notes |
| **Sales ops / sales excellence** | Salesforce hygiene, pipeline reviews | "What is the pipeline really telling me?" | Overview (pipeline-notes tile, P2) | Nothing in P0 |
| **Partner service manager** (at a distributor) | Their own first-line support to builders and sites | "What do my customers need from me today, and what is stuck with KGS?" | Partner view → Partner workspace tab | Their own actions only |

Kartik can view as Regional GM. His framing (differentiation through partners and customer experience) is carried by the overview headline and the Partner view, not by a separate President screen.

## 3. Information architecture — routes and navigation

There are five top-level routes and two deep dives. The promise deep dive is the double-click that must always work.

| Route | Screen title (exact) | Replaces v1 | Priority |
| --- | --- | --- | --- |
| `/` | "Asia ex China — this week" | `/` exec overview (re-pointed) | P0 |
| `/promise` | "Are we keeping our promises?" | `/installed-base` | P0 |
| `/promise/signal/pr-01` | "North region: promises slipping" (hero deep dive) | `/installed-base/signal/fw-4-1` | P0 |
| `/recurring` | "What keeps coming back?" | `/channel` | P0 |
| `/recurring/theme/rc-01` | "Licence re-activation, back a third time" | new | P1 |
| `/install` | "What do installers experience?" | `/separation` | P1 |
| `/partner` | "Partner view" (tabs: Partner workspace · What KGS sees) | new | P0 |

**Left rail (top to bottom):** Overview · Promises · Recurring · Install · Partners. Use the same icon style as v1. Delete the v1 installed-base and separation entries.

**Header breadcrumb:** "Global Commercial Fire · Asia ex China · {role} · {page}". For example: "Global Commercial Fire · Asia ex China · Operations lead · Promises".

**Context bar (every route):** Region \[Asia ex China ▾: All, North, South, East, West, SEA\] · Period \[13 weeks to 25 Sep 2026 ▾\] · **Viewing as** \[role ▾\] · Data as of 25 Sep 2026 18:00 IST · Anonymise \[toggle\] · badge "SYNTHETIC SCENARIO — illustrative data, not KGS data".

**Drill path the presenter runs:** Overview → click the promise card or the PR-01 signal → `/promise` → click PR-01 on the Signal Wall → hero deep dive → open Evidence (drawer) → view the draft → switch "Viewing as" to Operations lead → Approve → loop status moves to "Watching" → back to Overview (the PR-01 card now shows "Action approved") → Partner view.

## 4. Screen 1 — Regional overview (`/`)

The overview keeps v1's layout. Top to bottom: brief bar, pulse, three question cards, signal strip, then the value and sources strip. Every figure below is \[illustrative\] and comes from `overview.json`.

**A. Read strip** (replaces the v1 funnel):

> "LiSN read 386 partner and installer interactions this week, about 77 a working day, across email, help desk, service calls and Salesforce. 13-week history: 4,940."

**B. Executive brief** (one line): "Delivery promise slipped for three distributors in North; one issue we fixed in June is back; installers report extra set-up time on network configuration."

**C. Executive pulse** (three cards, v1 PulseCard):

| Card | Copy |
| --- | --- |
| 1. What's critical | "North: promise kept 71% against its own 88% over 4 weeks. 3 distributors, 46 order lines, 2 projects facing a fire NOC inspection." |
| 2. Where's your focus | "Licence re-activation after a laptop change is back for the third time since the June fix. 11 contacts this week." |
| 3. What's stable | "Installers keep praising ease of programming: 22 mentions this quarter, steady. South and West promise kept on target." |

**D. Three question cards** (v1 QuestionCard). The big number is the count of signals needing attention, with a week-on-week delta. Borders: Promises orange (focus), Recurring teal, Install sky blue.

| Card | Big number | Gauge 1 | Gauge 2 | Mini KPI 1 | Mini KPI 2 | LiSN insight box |
| --- | --- | --- | --- | --- | --- | --- |
| **Are we keeping our promises?** | 2 signals · +1 vs last week | Promise kept vs original date: 82% | Delivery complaints answered same day: 64% | Biggest gap: "North · 3 distributors" | Last-mile share of misses: "\~24% (candidate)" | "Most North misses trace to one allocation queue, not supply. Other regions ship the same product family on time." |
| **What keeps coming back?** | 3 themes back after a fix · +1 | Themes with a fix on record: 58% | Repeat contacts: 22% of help-desk volume | Top returning theme: "Licence re-activation" | Days since its last fix: 105 | "Three fixes did not hold. Each is linked to what was done last time." |
| **What do installers experience?** | 2 signals · 0 | Friction : praise mentions: 61 : 39 | Feedback captured from partners: 18% (help desk only) | Top friction step: "Network configuration" | Top praise: "Ease of programming" | "Installers describe about 25 extra minutes on network set-up. Most first-line feedback sits with partners and is not connected yet." |

The card trend chart is 13 weekly points: promise-kept %, returning-theme contacts, and friction mentions respectively.

**E. Signal strip: "This week's signals"** (v1 RiskSpikeCard, renamed). Five cards, then one "sources" card.

| ID | Card title | Severity | Owner | P&L tag | Confidence |
| --- | --- | --- | --- | --- | --- |
| PR-01 | North promises slipping (hero) | S2 · slope | Operations lead | On-time delivery · partner loyalty | M 0.68 |
| PR-02 | Last-mile delays, Gurugram hub | S3 · slope | Operations lead | On-time delivery | M 0.55 |
| RC-01 | Licence re-activation, back a third time | S3 · cliff | Technical support lead | Cost-to-serve | H 0.81 |
| RC-03 | Order status asked on the help desk, not the order desk | S4 · slope | Technical support lead | Cost-to-serve | M 0.62 |
| IN-01 | Network configuration adds set-up time | S3 · slope | Product liaison | Partner experience | M 0.58 |

Each card keeps the v1 anatomy: channel mix, top intent, time window, before → after metric and a recommendation box. Click opens the deep dive, or the page anchor for P1 items.

**F. Sources card** (replaces v1 "Evidence readiness"). Two columns. **Connected (KGS-owned):** order desk email, help desk, service calls, Salesforce cases and notes, ERP promise dates. **Not connected (partner-owned):** partner first-line support, partner email with builders and sites. Footnote: "Richer installer voice sits with partners. See Partner view."

**G. Loop closure strip** (replaces the v1 money value strip; no currency on this screen): "This quarter: 11 issues closed with a confirmed fix · 3 came back after a fix · promise kept (all regions) up 6 points since August, North the exception · same-day replies to partners 52% → 64%."

**Remove from v1:** the governed safety and cyber watch tile, the 233,900 funnel and money figures, and every firmware, separation or installed-base string.

## 5. Screen 2 — Are we keeping our promises? (`/promise`) and the hero deep dive

This is the lead story. Kartik said of delivery "we know we are not" on time, and wants to see whether it is "getting better or worse" by region and customer (30:28–31:12). Data is `promise.json` and `signal_pr01.json`.

### 5a. `/promise` panels (reuse v1 drill-down components)

1. **KPI tiles (5):** orders due this quarter 1,180 · promise kept vs original date 82% · vs revised date 93% · average slip 4.1 days · delivery complaints this week 38.
2. **Promise kept by region, weekly** (v1 LineMonitor): 13 weeks, lines for North, South, East, West and SEA, plus a 90% target line. North drops from 88% to 71% over the last 4 weeks.
3. **Distributor table** (v1 SegmentTable). Columns: distributor (synthetic ID, e.g. D-N-04) · region · orders due · kept vs original % · average slip days · complaints (4 wks) · trend arrow · top candidate cause. 12 rows, sorted by kept % ascending. D-N-04, D-N-07 and D-N-11 sit at the top.
4. **"What partners said vs what the order system shows"** (v1 EnhancedPanel, badge "joined with order data"). Rows pair a complaint phrase with its order-line facts, e.g. "You confirmed Monday, now it shows the 22nd" ↔ original 15 Sep, revised 22 Sep, allocation queue N-2.
5. **Candidate causes by region** (stacked bar): KGS-side (allocation, backorder, order change) vs last mile (carrier, site access). Label "candidate causes — owner confirms".
6. **Signal Wall** (v1 AISummaryWall): PR-01 (hero, "Open signal →"), PR-02, and a quieter "SEA improving" card. Footer counts: Critical 0 · Needs action 2 · Improving 1.
7. **LiSN evidence summary** (v1 DiagnosisBox): *Main signal:* North promise kept 71% vs its own 88%. *What changed:* allocation queue N-2 re-sequenced in week 35 (candidate). *Decide first:* confirm dates for the 2 projects with fire NOC inspections.

### 5b. Hero deep dive (`/promise/signal/pr-01`), the double-click

| Element | Spec (all values \[illustrative\]) |
| --- | --- |
| Rank chip | "#1 of 5 this week" + "Why ranked here?" popover: severity × drop vs own baseline × lines affected × source independence × projects at risk |
| Headline | "North: promise kept fell to 71% against its own 88% over 4 weeks — 3 distributors, 46 order lines, 2 projects facing a fire NOC inspection" |
| Chart | North weekly promise-kept % over 13 weeks, with its baseline band (84–91%), the 90% target, a marker "week 35: allocation queue re-sequenced (candidate)" and a marker "next monthly ops review 7 Oct" |
| Severity strip | S2 · Promise · slope (4-week decline) · blast radius: 3 distributors · 46 lines · 2 projects · incident flag Off |
| Confidence | M 0.68 · Known: 46 lines with original and revised dates from ERP · Inferred: cause read from 19 contacts · source independence 0.70 (3 distributors, 4 channels) |
| Cause split | KGS-side 35 of 46 lines (allocation 28, order change 7) · last mile 11 (Gurugram hub carrier). Label "candidate — Operations lead confirms" |
| Counter-evidence | "South and West receive the same product families on time; the pattern follows the allocation queue, not supply." |
| Join tags | Region North · D-N-04, D-N-07, D-N-11 · product families A (detection), B (panels) · channels email, service calls, Salesforce, help desk · weeks 36–39 |
| P&L destination | On-time delivery and cash (DSO); secondary: partner loyalty |
| Routed to | Operations lead (owner) · cc Regional GM, Partner manager North |
| Recommended action | Re-prioritise allocation for the 2 inspection-bound projects; send each distributor one confirmed date; open a carrier review for the Gurugram hub |
| Human gate | Banner: "Draft actions — awaiting Operations lead approval". As Regional GM, the Approve button is disabled with the tooltip "Approval sits with the Operations lead" and "Ask for a decision" is active |
| Approve flow | Switch "Viewing as" to Operations lead → Approve → banner changes to "Approved · partner updates handed to Partner manager to send · audit logged {live time IST}" + toast. Nothing is sent automatically |
| Loop tracker (new component) | Four steps: Open → Action approved → **Watching** ("next check 2 Oct: promise kept North") → Closed (owner confirms). This answers "are we getting better or worse" |
| Evidence drawer | 4 tabs: Snippets 19 · Order lines 46 · Distributors 3 · Method & audit |
| Drafts (modal previews, all marked "Not sent") | (1) partner update email with one confirmed date; (2) allocation change note; (3) carrier review request |

**Five snippets for the drawer** (synthetic; Indian English; no real names):

1. Email, D-N-04, 8 Sep: "You confirmed dispatch for Monday. The system now shows the 22nd. Our site handover is on the 25th."
2. Service call note, D-N-07, 11 Sep: "Third order this month where the date moved after confirmation."
3. Salesforce case, D-N-04, 15 Sep: "Builder has escalated. Detectors needed before the fire NOC inspection."
4. Email, D-N-11, 17 Sep: "Material reached the Gurugram hub on time, but local delivery took five days."
5. Help-desk ticket, 21 Sep: "Sales and support are giving us different dates. Which one is right?"

## 6. Screen 3 — What keeps coming back? (`/recurring`)

This page is Kartik's "one source of truth" and "fixed once, but we haven't really fixed the root cause" (40:30). Every recurring theme across help desk, service calls, email and Salesforce is grouped once, linked to its last fix, and flagged when it returns. LiSN flags recurrence and candidate causes; the owner confirms the cause. Data is `recurring.json` and `theme_rc01.json`.

### 6a. `/recurring` panels

1. **KPI tiles (4):** themes this quarter 27 · with a fix on record 58% · back after a fix 3 · repeat contacts 22% of help-desk volume.
2. **Theme register** (v1 SegmentTable, the core panel). Columns: theme · first seen · contacts (13 wks) · last fix (date · type: knowledge article / training / process / product feedback · owner) · status (Holding · Back after fix · No fix on record) · channels · partners affected. Sort "Back after fix" first. Seed rows:

| Theme | Contacts (13 wks) | Last fix | Status |
| --- | --- | --- | --- |
| Licence re-activation after a laptop change | 64 | 12 Jun · knowledge article · Tech support | Back after fix (3rd time) |
| Order status asked on the help desk, not the order desk | 58 | 3 Jul · process: auto-reply with order-desk link · Ops | Back after fix |
| Device addressing questions after a panel swap | 41 | 20 May · training session · Tech support | Back after fix |
| Legacy panel upgrade path | 37 | none | No fix on record |
| Network configuration during commissioning | 33 | none | No fix on record (links to Install) |
| Programming tool download link | 12 | 2 Aug · portal fix · IT | Holding |

3. **"Fixed before, back again" wall** (v1 AISummaryWall): one card per returning theme, showing the fix date, the return date, the change in weekly contacts, and "Open theme →".
4. **Theme timeline** (v1 LineMonitor): weekly contacts for the top 3 themes, with a fix marker (◆) and a return marker (▲) on each line.
5. **Where it comes from** (stacked bar): contacts by channel for each theme. This is the one-source-of-truth view: the same theme arrives through several channels.
6. **LiSN evidence summary:** *Main signal:* three fixes did not hold. *What changed:* licence contacts rose after the licence portal change on 18 Aug (candidate). *Decide first:* confirm with the US product team whether the portal change reset activations.

### 6b. Theme deep dive (`/recurring/theme/rc-01`, P1)

This reuses the hero layout. Headline: "Licence re-activation after a laptop change: back a third time. 11 contacts this week against 2 a week after the June fix." The chart shows weekly contacts over 26 weeks, with fix markers at 12 Jun and 18 Aug (portal change) and a return marker. It keeps the severity strip (S3 · cliff), confidence (H 0.81), join tags (product family: software/licence · channels · partners 7) and P&L destination (cost-to-serve; partner experience). The fix history is a small table: date · what was done · by whom · contacts per week before and after. Draft: "Update the knowledge article + ask the US product team to confirm the portal change", awaiting Technical support lead approval. The loop tracker is the same as the hero's.

## 7. Screen 4 — What do installers experience? (`/install`, P1)

This page captures what Kartik said goes missing: "it takes like half an hour more… what are the steps" and "your system is the easiest to program… we need to know" (23:59). It shows friction **and** praise by commissioning step, and routes friction to product and training and praise to marketing. Frame everything as experience, never as a fault or defect. Data is `install.json`.

1. **Capture-gap banner** (top of page, always visible): "Source: KGS help desk and service calls only. Partner first-line support is not connected, so most installer feedback is not here yet. See Partner view."
2. **Friction vs praise by commissioning step** (diverging bar chart: friction to the left, praise to the right). Steps, in this order: Design & device selection · Wiring & device addressing · Panel programming · Network configuration · Testing & handover (fire NOC inspection). Seed values (13 weeks, friction / praise): 6/4 · 14/5 · 9/22 · 21/3 · 11/5 (totals 61 / 39).
3. **"Time installers mention"** table. LiSN pulls stated times from the text; these are not measurements. Columns: step · phrase · stated extra time · mentions · partners. Seed: Network configuration · "takes about half an hour more to set up the network" · \~25 min (median stated) · 9 · 5.
4. **Praise worth using** card: top praise quotes by step, with an owner of Marketing / partner training. Seed quote: "Easiest panel we've programmed this year." (installer, via D-S-02, 9 Sep, synthetic).
5. **By product family and partner** (heat grid: friction mentions, product family × region). Anonymise-aware.
6. **Signal Wall:** IN-01 "Network configuration adds set-up time" (S3 · slope · owner Product liaison) and IN-02 "Praise for ease of programming holding" (improving).
7. **LiSN evidence summary:** *Main signal:* network configuration is the step installers most often call slow. *What changed:* mentions rose after the September partner training on the new network module (candidate). *Decide first:* share a one-page set-up guide with partners, and send a feedback note to the US product team.
8. **Drafts** (awaiting Product liaison approval, "Not sent"): feedback note to the US product team; a partner training tip sheet. Praise is routed to Marketing as a separate draft.

## 8. Screen 5 — Partner view (`/partner`, P0)

This is Kartik's own idea: "something that we brand and we give to our strategic partners… we're the backbone", which "makes their life easier" and builds loyalty against Honeywell (26:17–28:14). He warned that partners are "very territorial… this is my customer data" (27:17), so the consent boundary must be visible on screen. Label the whole route **"Concept"**. Data is `partner.json`.

&#91;embedded content: Partner view · consent boundary\]

The partner keeps its customers' identities, pricing and raw messages. Only agreed aggregates cross to KGS, and confirmed dates and fixes flow back.

**Tab 1 — Partner workspace** (viewing as Partner service manager at synthetic distributor D-N-04, header "Partner workspace · powered by LiSN", a KGS co-brand placeholder, no real logos):

1. **Today's queue** (L1 view): customer contacts by priority, e.g. "Site handover on the 25th, detectors not delivered" (linked to PR-01), "Programming help, network set-up".
2. **Manager view** (L2): themes this week, reply time vs their own target, repeat contacts, which customers are waiting on KGS.
3. **Waiting on KGS** panel: open orders with promised vs current date, open returns, open questions. This is the partner's own "are we keeping promises".
4. **Sharing settings** card with toggles: Product and install themes **On** · Promise performance **On** · Commissioning experience **On** · Customer identities **Off (locked)** · Pricing **Off (locked)**.

**Tab 2 — What KGS sees** (viewing as Regional GM or Partner manager):

1. **Partners connected:** 4 of 12 distributors (synthetic). An honest coverage chip.
2. **Themes × partners heat grid** (aggregated counts only; no customer names).
3. **Promise performance by partner**, using the partner's own complaints joined to KGS order dates.
4. **Commissioning experience from partners**, which fills the capture gap flagged on the Install page.
5. **Partner health cards** (friction trend, reply time, open items). Card actions are for the Partner manager: "Draft update to partner — Not sent".

**Footer (both tabs):** "Concept: partner owns its data; KGS sees only what the partner shares. Legal and data-protection terms to be agreed."

## 9. Role views and the "Viewing as" switcher (P0)

In v1, "Viewing as" existed only on the hero decision panel. In v2 it is a **global control** in the context bar, stored in `demoState.role`, because six roles share one screen. Changing role re-orders emphasis and enables the right Approve buttons. It never hides data, except in the Partner workspace tab.

| Viewing as | Default landing | What moves to the top | Approve enabled on |
| --- | --- | --- | --- |
| Regional GM (default) | `/` | Pulse + the three question cards; loop-closure strip | none ("Ask for a decision" only) |
| Operations lead | `/promise` | PR-01, PR-02; distributor table sorted by slip | PR-01, PR-02 drafts |
| Technical support lead | `/recurring` | Theme register, "back after fix" first | RC-01, RC-03 drafts |
| Product liaison | `/install` | Friction by step; product feedback drafts | IN-01 drafts |
| Partner manager | `/partner` (What KGS sees) | Partner health cards; drafts to partners | Marks partner updates "ready to send" (never sends) |
| Partner service manager | `/partner` (Partner workspace) | Their queue; Waiting on KGS | Their own items only |

**Rules:**

- Switching role does **not** navigate unless the user clicks "Go to my view". The presenter stays on the current page.
- The Approve timestamp is the live click time in IST, captured once. It shows on the banner, audit log, toast and overview card, as in v1.
- "Reset demo" clears approvals, role (back to Regional GM) and loop states.
- Anonymise ON maps distributor IDs to "Partner P-01…" and regions to "Region 1…". Anonymise stays OFF by default in the live session.

## 10. Data contract and mock data (sized to Asia ex China)

New mock data goes in `src/mock/kgs-v2/`. Leave v1's `src/mock/kgs/` untouched. Reuse v1 types for `Severity`, `Confidence`, `JoinTags`, `PnLDestination`, `HumanGate`, `EvidenceSnippet` and `AnonymiseMap`, plus the `fmt()` / `label()` helpers. Every value is \[illustrative\] and sized to modest volumes.

**Scale (fixed):** 13 weeks to 25 Sep 2026 · 4,940 interactions total · 386 this week · about 77 per working day (range 55–105) · channel mix: email 38%, help desk 22%, service calls 20%, Salesforce cases and notes 15%, partner portal 5%. Regions: North, South, East, West (India) and SEA. 12 distributors (IDs `D-{region}-{nn}`), 4 strategic partners (`SP-01`…`SP-04`). Product families are generic: A detection, B panels, C notification, D software/licence. No real product names in v2 data.

| File | Feeds | Key contents |
| --- | --- | --- |
| `meta.json` | Shell | Region list, period, roles, badge and footer copy, data-as-of |
| `overview.json` | `/` | Read strip, brief, pulse, 3 question cards (count, delta, gauges, KPIs, 13-pt trend, insight), 5 signal cards, sources card, loop-closure strip |
| `promise.json` | `/promise` | KPI tiles; weekly promise-kept % by region (5 × 13); 12 distributor rows; said-vs-shows pairs; cause split by region; signal wall; evidence summary |
| `signal_pr01.json` | Hero | Headline, chart series + baseline band + markers, severity, confidence (K/I), cause split, counter-evidence, join tags, P&L, owners, action, gate, loop steps, 19 snippets, 46 order lines, 3 drafts |
| `recurring.json` | `/recurring` | KPI tiles; 27 themes (6 seeded as in section 6); weekly contacts for the top 3 with fix/return markers; channel split per theme; wall; evidence summary |
| `theme_rc01.json` | Theme deep dive | 26-week series, fix history, drafts, loop |
| `install.json` | `/install` | 5 steps × friction/praise; stated-time table; praise quotes; family × region grid; signals; drafts; capture-gap flag |
| `partner.json` | `/partner` | Partner workspace for D-N-04 (queue, manager view, waiting on KGS, sharing toggles); KGS view (4 of 12 connected, theme × partner grid, promise by partner, health cards) |
| `anonymise.json` | Toggle | Distributor → "Partner P-nn", region → "Region n", city/hub → "Hub n" |

**New types:** `PromiseLine {id, distributor, region, family, originalDate, revisedDate, deliveredDate?, slipDays, contactIds[], candidateCause: 'allocation'|'backorder'|'order-change'|'last-mile'}` · `LoopStatus {step: 'open'|'approved'|'watching'|'closed', nextCheck?, approvedAt?, approvedBy?}` · `Theme {id, name, firstSeen, contacts13w, channels, partners, status: 'holding'|'back-after-fix'|'no-fix', fixes: FixRecord[]}` · `FixRecord {date, type: 'kb'|'training'|'process'|'product-feedback', owner, before, after}` · `InstallFeedback {step, polarity: 'friction'|'praise', text, statedMinutes?, partner, date}` · `SharingScope {themes, promise, commissioning, identities: false, pricing: false}` · `SourceConnection {name, owner: 'kgs'|'partner', connected}`.

**Checks (extend `check_mock.py`):** weekly totals sum to 4,940, and this week to 386 · PR-01 cause split = 46 lines (28 + 7 + 11) · install totals 61 / 39 · counts on overview cards match their pages · no currency anywhere in v2 · banned strings absent (section 11) · anonymise ON leaves no distributor ID, city or region name.

## 11. Copy rules — use, avoid, remove

The voice is calm, operational and evidence-first. Where possible, use Kartik's own words back to him. House style is unchanged: "LiSN", British spelling, no exclamation marks, and LiSN "aids resolution".

| Use (his words where possible) | Never use |
| --- | --- |
| "One source of truth" | "Distil signal from noise", "executive attention", "24/7 analyst", "not a dashboard" |
| "Close the loop" · "getting better or worse" | "Resolve" / "time to resolve" (say "aids resolution") |
| "Fix it once" · "back after a fix" | "Root cause found" (say "candidate cause — owner confirms") |
| "Promise kept vs original date" | Firmware, defect, batch, release failure, "installed base healthy" |
| "Help partners run their businesses better" | Separation, carve-out, TSA, Carrier |
| "Partner workspace" · "What KGS sees" | Big volumes: 300K, 233,900, "thousands of baselines" |
| "Draft — awaiting {role} approval" · "Not sent" | "We'll take the action", auto-send, "in 30 minutes" |
| "Synthetic scenario" | Client names or stories (bank, retailer), revenue figures, criticism of Salesforce or any tool |

**Remove from the v1 codebase on this branch:** the `/installed-base`, `/installed-base/signal/fw-4-1`, `/channel` and `/separation` routes and their rail entries; the firmware lineage chart, date-code heat strip and governed safety/cyber watch tile; the funnel strip and money value strip; the v1 exec copy in `exec.json`. Keep the components; re-bind them to v2 data.

**Rename:** "Field Signal Monitor" → "This week's signals" · "AI Summary Wall" → "Signal Wall" · "LiSN Diagnosis" → "LiSN evidence summary" (rows: Main signal / What changed / Decide first) · "Evidence readiness" → "Sources".

## 12. Build order, acceptance and Cursor prompts

Branch `kgs-v2` from `kgs-commercial-fire` and keep v1 deployable. The build is about 9 hours. The P0 path (steps 1–6) is demo-ready at about 6.5 hours.

1. **Data layer (60 min):** create `src/mock/kgs-v2/` files and types per section 10; extend the generator and checks; all checks pass.
2. **Shell (45 min):** new rail entries and routes; breadcrumb; context bar with Region, Period and global "Viewing as"; remove the v1 routes listed in section 11.
3. **Regional overview (120 min):** read strip, brief, pulse, three question cards, signal strip, sources card, loop-closure strip.
4. **`/promise` page (60 min):** KPI tiles, region line chart, distributor table, said-vs-shows panel, cause split, Signal Wall, evidence summary.
5. **Hero deep dive (90 min):** headline, chart with baseline band and markers, severity, confidence, cause split, counter-evidence, join tags, P&L, gate, role-based Approve, **loop tracker**, evidence drawer (4 tabs), 3 draft modals.
6. **Partner view (75 min):** two tabs, sharing toggles (identities and pricing locked off), KGS aggregate panels, "Concept" labels and footer.
7. **`/recurring` (60 min, P0 if time):** KPI tiles, theme register, "back after fix" wall, timeline with fix/return markers, channel split.
8. **`/install` + theme deep dive (60 min, P1).**
9. **Motion, anonymise sweep, QA (30 min).**

**Acceptance checks**

- [ ] Overview numbers match their pages (2 promise signals, 3 themes back after a fix, 61 : 39 install mentions)
- [ ] Promise card → `/promise` → PR-01 → evidence drawer → draft → switch to Operations lead → Approve → live IST timestamp on the banner, toast and audit log; loop tracker shows "Watching"
- [ ] Back on the overview, the PR-01 card shows "Action approved"; Reset demo clears it
- [ ] As Regional GM, every Approve is disabled with a tooltip naming the owner
- [ ] Partner view: identities and pricing toggles are locked off; the footer says "Concept"
- [ ] Synthetic badge on every route, drawer and modal
- [ ] No banned string from section 11 anywhere in the UI or data (search the build)
- [ ] Anonymise ON: no distributor ID, city or region name visible
- [ ] No currency anywhere in v2
- [ ] Legible at 1280 and 1920 widths on a shared screen

**Cursor prompts** (paste in order; add this doc as `docs/kgs-v2/SPEC.md` first)

```
@docs/kgs-v2/SPEC.md @docs/kgs-brief/03_Look_and_Feel_Reference.md @src/mock/kgs/types.ts
Step 1. Create src/mock/kgs-v2/ with the JSON files and new types in SPEC section 10.
Reuse v1 types. Seed every fixed value in SPEC sections 4–8 exactly. Extend check_mock.py
with the SPEC section 10 checks and run it until all pass. Do not touch src/mock/kgs/.
```

```
@docs/kgs-v2/SPEC.md sections 3 and 9
Step 2. Update the shell: rail entries, routes, breadcrumb, context bar with a global
"Viewing as" role stored in demoState.role. Remove the v1 routes listed in SPEC section 11.
Keep existing components and tokens; do not restyle.
```

```
@docs/kgs-v2/SPEC.md section 5 @src/mock/kgs-v2/signal_pr01.json
Step 5. Build /promise/signal/pr-01 by re-binding the v1 hero components. Add a LoopTracker
component (Open, Action approved, Watching, Closed). Approve is enabled only when
demoState.role === 'Operations lead'; on click capture the live IST time once and show it
on the banner, toast, audit log and the overview PR-01 card.
```

```
@docs/kgs-v2/SPEC.md section 8 @src/mock/kgs-v2/partner.json
Step 6. Build /partner with tabs "Partner workspace" and "What KGS sees". Sharing toggles:
identities and pricing locked Off with a lock icon. Label the route "Concept" and add the
footer from SPEC section 8. No real logos.
```
