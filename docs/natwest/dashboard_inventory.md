# NatWest Group · Customer Pulse v1 — what is on the dashboard

Inventory of every screen, section, figure, owner and drill-down in the NatWest demo as built on 13 Nov 2026
(local `main`, not deployed). Written so a reviewer who cannot see the screens can judge what is NatWest-relevant and
what is carried over from the HDFC (India) demo it was cloned from.

## 0. Context the reviewer needs

- **What it is.** A clone of the HDFC "Customer Pulse" demo (the version reviewed on 13 Oct 2026, `oct13`). Brief rule:
  same screens, sections, order, cards, tables and drill routes as `oct13`; only words and data change to NatWest.
  Nothing added, removed or restyled.
- **Buyer persona.** Managing Director, Customer Experience and Engagement, Retail Banking. The brief's question:
  "where is the customer experience leaking, by segment, by journey and by brand".
- **Where.** `/role-based` → card "NatWest Group" → role "Head of Customer Experience" → `/natwest-pulse/v1/mds-office`.
- **Data.** Three kinds:
  - **Internal · illustrative until discovery.** All internal figures are synthetic, generated for a 20-million-customer
    group. Complaints are scaled to the H1 2026 return the brief quotes: about 49,200 in the 1 Aug–11 Nov window
    (86,498 per half-year), about 55% upheld, about 48% closed within 3 days.
  - **Public · live.** Nothing is loaded. The NatWest public pull (App Store, Google Play, X, Reddit, Trustpilot,
    MoneySavingExpert) does not exist yet, so every public figure is 0 or "Public data not yet loaded".
  - **Register.** UK rules: 8-week final response (FCA DISP), 15 business days for payment-services complaints, 6 months
    to refer to the Financial Ombudsman Service, PSR 5-business-day push-payment-scam reimbursement, Faster Payments same
    day. Source citations are pending: the research pack was never supplied.
- **Data frozen** Thursday 12 November 2026, 07:45 GMT. The window is 1 Aug to 11 Nov 2026.
- **On every screen:**
  - Watermark: "Demonstration · public data plus illustrative internal data · not NatWest Group MIS".
  - Footer: the scope note ("Retail figures: NatWest, Royal Bank of Scotland and Ulster Bank… Coutts, Mettle and other
    group companies… excluded"), "Every action is a recommendation routed to its owner; LisN does not execute, authorise
    or decide", and the freeze date.

## 1. Global frame (on every screen)

| Element | What it shows / does |
|---|---|
| Header | "NatWest Group · Customer Pulse · Thursday 12 November 2026, 07:45 GMT" |
| Period toggle | Morning brief (last 24 h) · Last 7 days (default) · Last 30 days · Full window. Every figure on the page changes with it; changes are shown "vs previous period" |
| Light / dark switch | Theme only |
| Ask LisN bar | Search box at the top; suggested questions answered from precomputed figures (no AI model call). See §6 |
| Left rail (4 links) | MD's office / Head of CX · Cards: business view · Action queue: escalation emails · My view: pinned answers |
| Back button | On every drill page |
| "Sample rows · 32,000 kept for drill-down" | Label on drill pages, meaning their counts are of the synthetic sample, not bank-scale |

## 2. Screens, section by section

### 2.1 MD's office / Head of CX (home) — `/mds-office` (identical view at `/head-cx`)
Subtitle: "The pulse first, then today's morning brief, business by business."

**A. Customer pulse.** "Listed customers on the bank's own channels, then public voice. The two are never added together."
- **Internal channels: four cohort cards.** Each card shows:
  - contacts in the period, with its change;
  - the cohort size ("1,200,000 customers");
  - **Open**, with its change;
  - **No reply 48h+**, with its change and a trend sparkline;
  - **Owners alerted** ("492 of 1,628": owners told today, of the customers due an alert).

  | Cohort | Size shown | How defined |
  |---|---|---|
  | Financially vulnerable (Consumer Duty) | 1,200,000 | assumption |
  | Recent complainants (90 days) | 43,000 | derived from the complaints return |
  | Premier and Private | 800,000 | assumption |
  | Multi-product households | about 1.4 million | derived: customers holding 4 or more products |
- **External channels (Public · live).** Reads "Public data not yet loaded. Sources: App Store · Google Play · X · Reddit
  · Trustpilot · Forums (MoneySavingExpert)". In `oct13` this block holds total mentions, positive/negative, response
  rate by source, high-impact mentions, high-priority mentions and trending posts; all are hidden until the pull lands.
- **Drill-downs:** none from the cohort cards on this screen. The cohorts are detailed on the Priority page (§2.5),
  which is not linked from the left rail.

**B. CX pulse.** "All customer contact: the bank's own channels and public voice."
- **Overall contact volume.** Internal vs external (external 0%).
- **Internal channels.** Rings for Volume, Resolved, Open (with change), Waiting on customer and Open too long (over 48
  hours).
- **Channel table.** Columns Volume · Resolved · Open · Waiting · Too long; rows **Calls · Cora · App chat · Email ·
  Social · Branch**.
- **External channels.** Reads "Public data not yet loaded".
- **Drill-downs:** none.

**C. Ombudsman watch.** "Complaints eligible to go to the Financial Ombudsman Service, or close to it." As of 12 Nov
08:30, with changes since 5 Nov.
- **Four tiles**, each with a count, a share ring and a change:
  1. **Within 8 weeks, 10 days or fewer left.** No final response, close to the deadline.
  2. **Past 8 weeks, no final response.** May refer now.
  3. **Unhappy with the final response.** Within 6 months of it.
  4. **Referred to the Ombudsman.** With the Financial Ombudsman Service.
- **"At risk, by business".** Bar list for Credit cards · Payments and fraud · Current accounts and app · Personal loans
  · Mortgages · Overdrafts · Savings · Cora and digital assistant.
- **(i) note.** "Eligibility and risk only; LisN does not predict who will refer."
- **Drill-downs:** none from the tiles; the Cards save list is on the Cards business view.

**D. Today's morning brief.** "Bank-wide, built from the six businesses below."
- **What needs you.** The first item is always the Ombudsman watch line ("17 complaints have 3 days or fewer to the
  final-response deadline; 38 are past it…"). Then the top internal issue per business ("Credit limit: 10,258 internal
  cases open over 48 hours").
- **Signals that are building.** Needs public data; currently "Nothing met the rule in this period".
- **What's improving or stable.** Public-based; currently "Too few public items to compare (0 now, 0 before)".

**E. Business deep-dive cards (six), inside the brief.** Credit cards · Payments and fraud · Current accounts and app ·
Personal loans · Mortgages · Savings. Each card shows:
- negative % public (blank) and open % internal;
- contacts, split into internal and public (public 0);
- an internal trend and a public trend;
- open and waiting on customer;
- responded (blank);
- negative public (blank) and negative internal;
- the top issue (internal only, e.g. "Faster Payments or Open Banking failure");
- the quote slot ("No quotable public post in this period").

Drill-down: the Credit cards card opens the Cards business view. The other five open pages that read "Coming soon"
(§2.4).

### 2.2 Are customers satisfied with their journey? — `/satisfaction`
Subtitle: "Trust pillars · Relationship tiers · Journey stages". Reached from Ask LisN answers, not from the rail.
- **Public items this window, by source.** Empty (public). Links to the market screen.
- **Interactions and sentiment by relationship tier.**
  - Table: Tier · Interactions · Positive · Negative · Customers affected · split bar.
  - Tiers: Standard, Packaged, Premier, Private (internal).
- **Sentiment trend (conversation-inferred).** By public source; empty.
- **Strain and friction by business.** Business · Items · Repeat contact · Escalation language · Negative (public);
  empty.
- **Top themes by trust pillar.** Availability · Experience · Data intimacy · Security (public); empty.
- **What customers are saying.** Public quotes; empty.
- **Retention watchlist.**
  - Columns: Tier · Customers with closure intent · Top driver · Owner · Action.
  - Owner: "Relationship managers (Premier)" for high tiers. Shows 0.
- **Where is the struggle? Journey stages.**
  - Columns: Stage (Open · Activate · Everyday use · Service requests · Disputes and fraud · Close) · Interactions ·
    Negative share · Repeat contact · Closure intent.
  - Internal sample: 32,000 interactions.
- **Repeat contact by theme and business.** Internal.
- **Drill-downs:** theme names link to signal pages (§2.10).

### 2.3 What is the market saying about us? — `/market`
Subtitle: "What we say vs what customers hear · Rising themes · Voices with reach · App pulse · Safety". Every section
needs public data, so all are currently empty.
- **What we say vs what customers hear.** Columns: What we say · Negative items · Where it breaks most · Trend · Owner.
  Generic retail-bank service promises against public complaints.
- **Rising themes.**
- **Voices with reach.**
- **App pulse.** Per app and store: ratings, the version fix list, a "Show group-company apps" toggle. Apps: NatWest app,
  Royal Bank of Scotland app, Ulster Bank app.
- **Safety and reputation watch.**
- **All themes this window.**
- **Top six themes: weekly share of voice.**
- **Not on this screen:** the brief's peer column (Lloyds, Barclays, HSBC UK, Santander UK; Monzo and Starling greyed),
  the Royal Bank of Scotland app-versus-overall finding (66% vs 48%, CMA August 2026) and any brand-by-brand comparison.
  `oct13` has no such section.

### 2.4 Business views — `/business/<product>`
- **Credit cards — `/business/cards`** ("Credit cards: business view. For the head of Cards: the issue pulse, issues by
  category and what customers say"). Sections:
  - **Issue pulse: Cards.** Internal channels and external (public, empty).
  - **Ombudsman watch: Cards.** The four FOS states for Cards, by category.
  - **Save list: call today.**
    - Ten complaint rows: ID · masked customer · state (within 8 weeks / eligible) · category · why (e.g. "no final
      response, 4 days to the deadline; 2 repeat contacts; 2 channels") · owner.
    - Owners are roles: Credit cards · Rewards lead / Disputes lead / Pricing lead / Credit policy lead / Acquisition
      lead / Fulfilment lead / Retention lead / Service lead / Fraud lead / Digital lead; Final-response team.
  - **Issues by category.** Rewards and redemption · Upgrades, variants and eligibility · Applications and verification
    · Fees and charges · Limits · Disputes, refunds and reversals · Card delivery · Closure · Service and complaint
    handling · Fraud and security · App and online card servicing. Each category has an owner role and its themes as
    subcategories.
  - **Three drill-down tiles.** These open:
    - **"Are my customers happy?" — `/business/cards/happy`.** Where contacts come from (Stage · Contacts · Negative ·
      Repeat); contacts by customer list; repeat contact by category. Public parts are empty: sentiment by source,
      sentiment trend, what customers are saying, themes by trust pillar.
    - **"What is the market saying about us?" — `/business/cards/market`.** All Cards themes in public voice, top six by
      share of voice, rising themes, safety, voices with reach, and top complaints and feature requests per store (Google
      Play: 0, App Store: 0). All public, so all empty.
    - **"Are we keeping our timelines?" — `/business/cards/service`.** How Cards contacts were handled, the escalation
      ladder (who they name), closure intent (11,467 internal), cure watch, transparency gap, dispute recovery funnel,
      top service failures, and timelines customers say were missed.
- **Every other business — `/business/payments_fraud`, `current_accounts`, `personal_loans`, `mortgages`, `overdrafts`,
  `savings`, `digital`.** A title ("Payments and fraud: business view") and "Coming soon.", with a link to the Cards
  view. Same as `oct13`, where only Cards has a business view.

### 2.5 Priority relationships — `/priority`
Subtitle: "Cohorts from the bank's own tiers and lists · Open over 5 and 24 hours · Owner notified · High-impact
complaints". Reached from Ask LisN and links, not the rail.
- **One block per cohort:** Financially vulnerable (Consumer Duty) · Recent complainants (90 days) · Premier and
  Private · Premier · Multi-product households. Each block shows:
  - open issues;
  - over 5 hours and over 24 hours;
  - "Owner told today: X of Y";
  - a table of negative contacts by channel since 1 Aug.
- **Priority customers this morning.**
  - Columns: Customer (masked id) · Cohort · Products · Latest signal · Oldest open · Owner · Owner status.
  - 12 fictional customers (London, Manchester, Edinburgh, Glasgow, Bristol, Belfast, Leeds, Birmingham, Cardiff,
    Aberdeen, Brighton). All are Private or Premier tier.
  - Drill-down: each row opens the customer signal trail (§2.9).
- **High-impact complaints.** Why it is high impact (third contact on the same issue · public post with reach ·
  official or regulator domain · legal language or a solicitor named · regulator or ombudsman named) and the count.
- **How a customer gets on a list.** Relationship tier · the bank's priority lists · linked contacts · suggestions.

### 2.6 Action queue: escalation email triage — `/action-queue` (rail link)
Subtitle: "20 synthetic second-line escalation emails · Six buckets · Draft replies for a person to approve".
- **Buckets** (with triage time: "180 minutes" manual vs "3 days"):
  1. Reply with backend status
  2. Call today (deliverable breaking)
  3. Escalate (no backend movement, deliverable broken)
  4. Proactive status message
  5. Close with confirmation
  6. Route to another product owner
- **Each email** shows the customer (masked), product, subject, backend status and a draft reply in UK terms (8-week
  final response, Financial Ombudsman Service, Faster Payments). The draft reply waits for a person to approve.

### 2.7 Are we meeting our deliverables? — `/deliverables` (also `/service-promise`, which redirects here)
- **Deliverables ledger.**
  - Columns: Deliverable · timeline · Compensation · Met · Outside · Open too long · Public posts describing a delay ·
    Owner · Action.
  - Thirteen deliverables:
    - Failed payment returned — "Same day (Faster Payments)"
    - Final response to a complaint — "8 weeks (FCA DISP)"
    - Push payment scam reimbursement — "5 business days (PSR)"
    - Credit card closure
    - Unauthorised transaction refund
    - Credit file correction
    - Title deeds after mortgage redemption
    - Card dispatch and delivery
    - Card dispute and chargeback
    - Service request
    - Account freeze review
    - Loan decision and payout
    - First response to a query or complaint
  - The last ten read "Bank timeline: confirm with the bank".
- **Deliverables met, by product.** Cards · Payments · Accounts · Loans · Mortgages · Overdrafts · Savings · Cora.
- **Missed timelines heard in public.** Public; empty.
- **Escalation ladder.** Target · Rung · Posts. Public; empty. Rungs: Voice → Repeat → Complaint → Head of CX → Final
  response → Financial Ombudsman Service → Public.
- **Closure intent · Cure watch · Transparency gap.**
- **Why disputes breach SLA.** Age bands.
- **Top service failures.**
- **Dispute recovery funnel.**

### 2.8 Modules — `/module/<id>`
- **Cards — `/module/cards`.** "What · Is it real · Issue list · Where · How high · Owner and action · Evidence".
  - Issue table: Issue · Public mentions · Public negative · Inside: interactions · Open / open too long · Deliverable
    met · timeline.
  - "The numbers first": Total · Closed or responded · Open · Open too long.
  - Drill-down: each issue opens its signal page.
- **Cora and digital assistant — `/module/cora_digital`.** **Currently empty: "No app data."** In `oct13` this module is
  built only from public app-store reviews (release pulse, fix list), so nothing renders without the public pull. The
  brief's headline item, "journeys Cora marked resolved that come back as a call or complaint within 7 days", is **not
  built**.

### 2.9 Customer signal trail — `/customer/<masked id>` (from Priority)
"One customer, every product and channel · Fictional persona, masked id".
- **Without LisN / With LisN.** The narrative contrast.
- **Customer.** Segment, tenure, city, products.
- **Signal trail: one customer, every channel.** Dated contacts, e.g. "Faster Payments failure, reversed same day".
- **Recommended actions.** To · Customer · Due.

### 2.10 Signal detail — `/signal/<theme>` (57 themes)
"Signal detail · What · Is it real · Where · How high · Who and what next · Evidence". Built from public data, so every
signal page currently shows the theme name and "Public data not yet loaded". Reached from theme names on Satisfaction,
Market, the Cards module and the brief.

### 2.11 My view — `/my-view` (rail link)
"The Ask LisN answers you pinned, as panels. This session only." Empty until something is pinned.

## 3. Drill-down map

| From | Click | Goes to | Content today |
|---|---|---|---|
| Rail | MD's office / Head of CX | `/mds-office` | Full |
| Rail | Cards: business view | `/business/cards` | Full (public parts empty) |
| Rail | Action queue | `/action-queue` | Full |
| Rail | My view | `/my-view` | Empty until pinned |
| Home, brief | Credit cards deep-dive card | `/business/cards` | Full |
| Home, brief | Other five deep-dive cards | `/business/<id>` | "Coming soon" |
| Cards business view | Three tiles | `/business/cards/happy`, `/market`, `/service` | Internal parts full, public parts empty |
| Cards business view | Save list row | none | — |
| Cards module | Issue name | `/signal/<theme>` | "Public data not yet loaded" |
| Satisfaction, Market | Theme name | `/signal/<theme>` | "Public data not yet loaded" |
| Priority | Customer row | `/customer/<id>` | Full (fictional persona) |
| Ask LisN answer | Link in answer | Relevant screen | — |
| Cohort cards, CX pulse rows, Ombudsman tiles | none | — | No drill-down |
| — | `/satisfaction`, `/market`, `/priority`, `/deliverables`, `/module/*` | Not on the rail | Reached from Ask LisN and in-page links only |

## 4. Business heads and owners named (all roles, never people)

- **Products (business cards):**
  - Credit cards — Credit cards product owner; on the Cards view, "the head of Cards".
  - Payments and fraud — Payments operations.
  - Current accounts and app — Current accounts product owner.
  - Personal loans — Lending product owner.
  - Mortgages — Lending product owner.
  - Overdrafts — Current accounts product owner.
  - Savings — Savings product owner.
  - Cora and digital assistant — Digital and Cora.
- **Credit cards category leads:** Rewards · Product · Acquisition · Pricing · Credit policy · Disputes · Fulfilment ·
  Retention · Service · Fraud · Digital lead.
- **Complaints and Ombudsman:**
  - Complaints lead (CX owner).
  - Final-response team: owns complaints at the referral stage.
  - Head of CX: an escalation-ladder rung.
- **Others:** Fraud operations · Compliance · Operations · Relationship managers (Premier) · Social care lead ·
  Service-delivery head · Branch region lead.
- **Owner alerts:** in the cohort cards, "Owners alerted" (formerly "RMs alerted").

## 5. Products, channels, themes used across screens

- **Eight product rows** (as in `oct13`):
  - the six business cards above;
  - Overdrafts (the `oct13` eighth row, relabelled);
  - Cora and digital assistant (module and channel, not a card).
- **Channels:** Calls · Cora · App chat · Email · Social · Branch. Branch is internal; social is the bank's own inbox.
- **57 UK themes.** Examples:
  - Faster Payments or Open Banking failure; fraud block or account freeze; push payment scam reimbursement; mortgage
    rate switch;
  - Cora unresolved, had to call; branch closures and access; value and fair treatment; app login and biometrics;
  - identity checks and profile updates; credit file corrections; savings rates and bonus terms; complaints closed
    without resolution; could not get through.
- **Tiers:** Standard · Packaged · Premier · Private.

## 6. Ask LisN suggested questions

Precomputed for the selected period. Some questions are answered with a refusal, to show role-based access.
- Which business needs my attention first?
- How are our most sensitive customers being served?
- How many contacts are open too long?
- Which channel carries the most contacts?
- Which business has the largest backlog?
- Which business has the most negative public voice?
- What is building in public voice? · What is improving or stable? · What is trending on social media? · Did the bank
  respond to public posts?
- How many complaints are referred to the Financial Ombudsman Service? · Which business has the most Ombudsman risk? ·
  Are customers on our lists at risk of going to the Ombudsman?
- Cards: Which Cards complaints should we call today? · Which Cards categories feed Ombudsman risk? · What are the top
  issues in Cards? · Where are replies late? · Are we keeping our timelines? · Where do Cards contacts escalate? · Which
  channels do Cards customers use? · Which Cards themes are rising in public? · Are customers saying they will close
  their card? · How are card disputes moving?
- How are Mortgages customers doing this week?
- The NatWest answer bank also holds five persona questions: cross-channel leak, Cora leakage, Ombudsman risk, brand
  gap, Consumer Duty evidence.

## 7. Brief items that are NOT on screen

The `oct13` layout has no place for these, or they need data that does not exist yet:

- Brand comparison (NatWest vs Royal Bank of Scotland vs Ulster Bank) and a brand filter. The brand is stored on public
  records only; no internal figure is split by brand.
- Peers column (Lloyds, Barclays, HSBC UK, Santander UK; Monzo, Starling) and the CMA Royal Bank of Scotland app finding
  (66% vs 48%).
- Consumer Duty's four outcomes (products and services, price and value, consumer understanding, consumer support) as
  a breakdown. Consumer Duty appears only in the cohort name "Financially vulnerable (Consumer Duty)".
- Cora leakage (resolved by Cora, back within 7 days): the Cora module is empty.
- Segment pulse by everyday / mortgage holders / multi-product / financially vulnerable. The cohorts above are the
  closest equivalent.
- AI-agent outcomes (Fraud Triage Agent, AI complaint letters).
- Any public-voice figure: all public sections are empty until the pull lands.

## 8. Carried over from HDFC; may not fit the NatWest persona

For the reviewer to judge:

- **Cards-first design.** Only Credit cards has a business view, category leads, a save list and three drill-downs;
  the other five businesses read "Coming soon".
- **Escalation-email triage queue** (an HDFC operations concept): useful for a contact-centre head, less so for a
  propositions and segment strategist.
- **Priority relationships and personas.** All 12 personas are Private or Premier tier customers, a wealth-led framing
  from HDFC.
- **Trust pillars** (Availability · Experience · Data intimacy · Security) and the "What we say vs what customers hear"
  promise list.
- **Deliverables ledger with a "Compensation" column.** HDFC had regulatory compensation per day of delay; NatWest rows
  show "—" or the Ombudsman route.
- **Release pulse / app version fix list** (public; empty).
- **"MD's office / Head of CX" as the page title,** an HDFC framing; the NatWest role is "Head of Customer Experience".
