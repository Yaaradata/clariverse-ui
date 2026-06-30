# LiSN / Fluid CX at Nuvama — Stakeholders, Data, Differentiated Outputs

**Engine: Claude (Opus) — one of four reports for mechanical merge.**
Research only. No screens, no mock data, no build instructions. Answers three questions: who to target, what data LiSN should collect/analyse, and what those stakeholders can see from LiSN that their other platforms cannot.

**Panel:** AI architect (wealth data / conversation intelligence) · the buyer's dual lens (Head of Wealth/Private vs Head of Client Experience) · Senior PM for LiSN/Fluid · Regulation & investor-protection adviser (India). Where the panel splits, the split is stated inside the point it affects.

**LiSN boundary carried on every section:** LiSN owns the interaction / voice / complaint corpus at full coverage; consumes the operator's book and event feeds but never owns the lakehouse; never auto-fires (it drafts, a human approves, every step is audit-logged); joins at cohort level by default, not identity level; and marks every AI element.

**A note on confidence.** Firm financials, the regulatory texts, the regional Market-Head cluster, the new Group CRO and the two AI platforms are confirmed from Nuvama disclosures, regulator texts and named interviews. Several seats the brief seeds — a distinct named Head of AI / Group CIO, a named Head of Client Experience, the PCG head, a group-level Compliance head, and whether Nuvama itself runs GreyLabs — could **not** be independently confirmed from public sources and are flagged in plain language at each point and in the ledger at the end. Treat any single source's ranking of who matters most as a hypothesis to test, not as settled.

---

## Context corrections and confirmations (read before A)

| Item in the brief | What the sources show (Jun 2025 – Feb 2026) | Status |
|---|---|---|
| ~₹4.6 trn client assets (30 Jun 2025) | ~₹4.6 trn at 30 Jun 2025 (Wikipedia / company); **₹4.62 trn at 31 Dec 2025** (Q3 FY26): wealth ₹3.29 trn, asset services ₹1.20 trn, AM AUM ₹12,605 cr | Confirmed, extended |
| ~1.3m affluent/HNI; 4,400+ families | ~1.3m+ affluent/HNI clients; **4,400–4,500+ wealthiest families** (Jun–Sep 2025) | Confirmed |
| Nuvama Wealth ~1,200 RMs; NPS ~77 | **~1,100 RMs in the Nov-2025 corporate overview** (was ~1,200 in Oct-2024); **NPS now 82** (was 77 a year earlier); ~7,000 active EWMs; 500+ locations incl. ~70 branches; ~50 solutions | Confirmed, **NPS revised up** |
| Nuvama Private UHNI; ARR yield ~1% | Nuvama Private client assets **₹2,10,805 cr** (Sep 2025, +2% YoY); ARR assets +24% YoY; ARR yield ~1.02% (FY24); Private ≈ 68% of wealth AUM | Confirmed |
| Owned by PAG; listed Sep 2023 | PAG majority owner; listed BSE/NSE **26 Sep 2023**; SEBI Chair is **Tuhin Kanta Pandey** | Confirmed |
| Group CRO Keyur Ajmera (Feb 2026) | **Keyur Ajmera = Group CRO w.e.f. 1 Feb 2026**, replacing Venkataraman Ananthakrishnan, who moves to "a new senior leadership role at Nuvama Group level" (unnamed — watch-item) | Confirmed |
| GreyLabs "already in use" at Nuvama | GreyLabs AI confirmed as a Mumbai BFSI speech-analytics / agent-QA vendor now extending into agentic voice agents; **public client lists name IDFC First, Motilal Oswal, Groww, SBI Life, Max Life, Slice, Fibe, KreditBee, RBL, AU, Axis Finance — not Nuvama.** The Nuvama–GreyLabs relationship is **plausible but unconfirmed from public sources** | **Flagged** |

Subsidiaries worth carrying into the data picture: Nuvama Wealth & Investment Ltd (NWIL — broking), Nuvama Clearing Services, **Nuvama Wealth Finance** (the NBFC behind the LAS / ESOP-funding / MTF book), Nuvama Asset Management (NAML), and **Pickright Technologies** (an in-house technology subsidiary — relevant to who actually builds and owns the stack).

---

# A — Who to target

Wealth has **no single portfolio owner**. The book is owned by revenue seats (Wealth and Private), the experience is owned by a service seat, the rails are owned by a technology seat, and the exposure is owned by risk and compliance seats. LiSN sits on the **seam between the revenue seat and the service seat** — so the map must go well beyond the CX/product head and name every seat that either signs, routes, blocks or champions.

Seat types used below: **P&L anchor** · **native CX buyer** · **technical champion** · **routing seat** · **economic signer** · **blocker**.

## A1 · Economic / P&L buyers

### Rahul Jain — Head, Nuvama Wealth (affluent / HNI arm)
*Per Nuvama's corporate site; the page predates the latest reshuffles, so confirm current tenure before the demo.*
- **Owns:** the HNI/affluent P&L — ~1,100 in-house RMs plus the ~7,000-strong External Wealth Manager (EWM) channel across 500+ locations; the broking-led Professional Clients Group sits inside this world. Book ≈ ₹1.08 trn client assets.
- **KPI vocabulary → destination, cadence, trajectory:**
  - **NNM / net new money → revenue base** (monthly/quarterly; the firm targets 20–30% net-flow growth). The single number he lives on.
  - **MPIS penetration (Managed Products & Investment Solutions) → ARR yield** (quarterly; MPIS +27% YoY) — the shift from transactional broking to recurring fee.
  - **RM productivity = NNM and revenue per RM → cost-to-income** (monthly; RM count fell ~1,200→~1,100, so per-RM output is under scrutiny).
  - **Client / family attrition and NNM leak → AUM retention** (quarterly; *needs cross-system stitching* — the book shows the outflow, not the cause).
  - **Share of wallet → ARR yield** (the gap between assets held and assets visible elsewhere).
  - **NPS 82 → retention and referral** (he co-owns this with the CX seat).
- **Questions he asks** (★ = needs cross-system stitching): which RMs and branches are leaking NNM and why ★; which "happy" clients (high NPS, no complaint) are quietly redeeming ★; where MPIS conversations are happening but not converting to flow ★; which EWM partners are dormant or drifting; are my top RMs' methods reproducible.
- **Seat:** P&L anchor (HNI). The likeliest economic signer for an HNI-arm beachhead.
- **Why LiSN matters:** he can see the book move and the NPS number, but not the *why* between them. LiSN reads the RM-call and chat corpus across his channel and ties review-call sentiment and proposal conversations to NNM and redemptions at cohort level — the causal layer his dashboards do not hold.
- **Tools today & their limit:** RM/EWM dashboards and the portfolio-solutions tool (book and flows, no voice); the AI proposal tool (output, not whether the pitch landed); NPS surveys (a score, not a root cause).

### Alok Saigal — President & Head, Nuvama Private (UHNI / family office)
- **Owns:** the UHNI P&L (book ≈ ₹2.11 trn, ~68% of wealth AUM), Family Office, Wealth Structuring & Estate Planning, Products & Advisory, and the offshore proposition (Dubai/DIFC, Singapore). Fewer, far larger, multi-generational relationships.
- **KPI vocabulary → destination, cadence, trajectory:**
  - **ARR assets / ARR yield (~1%) → recurring revenue** (quarterly; ARR assets +24% YoY) — the economic core of Private.
  - **ARR NNM → revenue growth** (the FY25 group ARR NNM was ₹10,097 cr, +52%; managed products ≈ 90% of ARR flows).
  - **Family attrition / generational continuity → multi-decade AUM** (the existential metric for UHNI; *needs cross-system stitching* across calls, structuring conversations and book).
  - **Suitability adherence and mis-selling incidents → regulatory and franchise risk** (rising in weight — see the SEBI PMS review below).
  - **Share of wallet across entities (business + personal + family-office) → ARR yield.**
- **Questions he asks** (★ cross-system): which families are disengaging before they say so ★; are PMS/AIF and structured products being sold to the right suitability profile, evidenced ★; which advisory relationships depend on a single RM (key-person risk) ★; is the offshore pitch converting; where is the next generation drifting to a competitor.
- **Seat:** P&L anchor (UHNI). Economic signer for a Private beachhead.
- **Why LiSN matters:** in UHNI a lost family is a structural revenue event, and the warning lives in the *tone and cadence* of review conversations long before the redemption. LiSN is the only layer that reads that signal across channels and prices it against the book, while marking every AI element and keeping joins cohort-level — which matters more here because UHNI data is the most identity-sensitive.
- **Tools today & their limit:** the AI proposal tool and AI WhatsApp bot (engagement, not meaning-at-risk); Infinity and the enhanced portfolio tool (in-house performance, not client intent); none reads the advisory conversation as evidence.

### Ashish Kehair — MD & CEO, Nuvama Group (sponsor)
- **Owns:** group strategy and the "tech plus human" thesis; the public narrative that asset growth is outpacing revenue (the monetisation gap).
- **KPI vocabulary → destination:** group client assets and NNM → market cap and the monetisation story; ARR-yield trajectory → recurring-revenue quality; cost-to-income → operating leverage; franchise/regulatory standing → licence-to-operate.
- **Seat:** economic sponsor, not the day-to-day buyer. His sign-off de-risks budget; he will not run the pilot.
- **Why LiSN matters:** LiSN is a direct lever on the gap he narrates publicly — turning the un-mined interaction corpus into retained NNM and defensible recurring revenue, without taking on autonomous-action risk.
- **Panel note:** the PM and the CX adviser agree he is the *halo*, not the beachhead — lead with a P&L head and a CX head, name him as sponsor.

## A2 · Technical champions (the demo audience)

### Riyaz Ladiwala — President & Head, Technology & Operations, Nuvama Group
*Confirmed from a 2023 interview; verify he still holds the seat.*
- **Owns:** the dedicated Nuvama IT organisation stood up post-PAG under "Project Plutus"; the book-side platforms, the cloud telephony that records ~900 users for trade-confirmation compliance, onboarding rails (RM in ~30s, client in ~10 min), and operations. The in-house technology subsidiary **Pickright Technologies** likely sits in his world.
- **KPI vocabulary → destination:** platform uptime and adoption → service cost and RM efficiency; build-vs-buy and vendor consolidation → tech spend; **model accuracy, auditability and data governance → regulatory exposure under SEBI Regulation 16C** (he is now accountable for the *output* of any AI tool, in-house or bought); integration effort → time-to-value.
- **Questions he asks** (★ cross-system): does this sit on top of our book without owning the lakehouse; can every AI output be explained and audit-logged for SEBI; what is the integration cost against GreyLabs and the proposal tool; can we avoid vendor lock-in.
- **Seat:** technical champion and a partial economic signer for technology. **Also the most likely demo host** and the person who frames the GreyLabs gap.
- **Why LiSN matters:** LiSN is explicitly a *consume-don't-own*, *never-auto-fire*, *AI-marked*, *audit-logged* layer — which is the answer to the exact liability Regulation 16C just placed on his desk. That posture is a feature he can defend to risk and compliance, not a constraint.

### A distinct "Head of AI" and/or "Group CIO"
- The brief names a Group CIO, a CIO and a Head of AI as the demo audience. A senior technology-and-operations leader is confirmed (Ladiwala). A **separately named Head of AI or Group CIO could not be confirmed** from public sources. Verify via LinkedIn / the firm before the demo; do not assert a name. Whoever owns AI/data governance is the second technical champion and the person who must be comfortable with the model-accuracy and false-positive story.

## A3 · Routing seats (own teams, route the deal, or can block it)

| Role (seat) | What they own | Lead KPI → destination | Question that needs cross-system stitching | Why LiSN matters | Tools today & the gap |
|---|---|---|---|---|---|
| **Regional Market Heads / Senior Managing Partners** — Sandeep Chakraborti (South & East), Amit Saxena (North), Vivek Jain (Maharashtra & Gujarat), Priyanshu Gaurav (Maharashtra & Goa ex-Mumbai) *(all confirmed)* | RM teams and the regional book | **NNM by team → regional P&L**; RM productivity; team attrition | Which of my RMs are about to lose a client, and which coach themselves out of risk | They route the pilot to their best teams and see per-RM, per-branch attrition risk and coaching gaps | Team dashboards (flows, no conversation evidence) |
| **Saurabh Rungta — Senior Managing Partner & CIO, Nuvama Private** *(confirmed)* | Private investment platform and Infinity; product suitability | Portfolio performance and ARR yield → recurring revenue | Are products landing with the right suitability profile, evidenced | Ties what was advised to what was suitable and what got funded | Infinity / portfolio tools (performance, not advice-as-evidence) |
| **Head of Client Experience** *(name unconfirmed — flag)* | Voice of client, NPS, complaint/grievance, SCORES | **NPS 82 → retention/referral; complaint TAT → service cost & regulatory standing** | What is actually moving NPS, and which complaint themes sit on AUM at risk | The native CX buyer; LiSN root-causes NPS and links complaint themes to revenue | Surveys + GreyLabs telephony QA (a score and call audits, not the cross-channel why) |
| **Keyur Ajmera — Group Chief Risk Officer (from 1 Feb 2026)** *(confirmed)* | Enterprise risk across wealth, broking, clearing, AM | Suitability/mis-selling exposure, conduct risk → capital and licence | Where is mis-selling or unsuitable advice happening across 100% of advice, not a 1–2% sample | Surveillance across the full advice corpus, human-gated and audit-logged | Sampling-based QA and exception reports (thin coverage) |
| **Compliance / Supervision** — Srijith Menon (Compliance Officer, NWIL) *(confirmed for the broking entity; a group-level head not separately confirmed)* | Regulatory adherence, SEBI filings, SCORES | Mis-selling incidents, complaint TAT, AI-disclosure compliance → enforcement risk | Can we evidence suitability and AI-use disclosure to SEBI on demand | Turns the corpus into auditable suitability and disclosure evidence | Manual surveillance, SCORES logs |
| **Products & Advisory** — incl. Shweta Shah (Head, Wealth Structuring & Estate Planning) *(confirmed); broader Products & Advisory ownership flagged* | Product shelf, advisory frameworks | MPIS/ARR penetration, suitability fit | Which products are over- or mis-pitched relative to demand and fit | Distils what clients actually ask for vs what is pushed | Product MIS (shelf and flow, no demand signal) |
| **PCG (Professional Clients Group) head** *(name unconfirmed — flag)* | The broking-led professional-trader segment | Brokerage and activity → capital-markets revenue | Where service friction is suppressing trading activity | Reads service-call and chat friction against activity | Broking dashboards (TX3/Markets) |
| **Private-arm CIO / Group CIO** | (see A2) | — | — | — | — |

Adjacent but not buyers: **Shiv Sehgal** (President & Head, Nuvama Capital Markets — clearing/custody + institutional equities) and **Anshu Kapoor** (President & Head, Nuvama Asset Management). Useful for the corpus picture (custody, the manufacturer of the products being advised), but neither owns the voice-to-book seam.

## The two anchors and the wedge

- **P&L / book anchor:** the **Head of Nuvama Wealth (Rahul Jain)** for an HNI beachhead, or the **President & Head of Nuvama Private (Alok Saigal)** for a UHNI beachhead. He owns NNM, AUM, RM productivity, MPIS/ARR penetration and attrition — and feels the monetisation gap directly.
- **Native CX buyer:** the **Head of Client Experience** *(name unconfirmed — flag)*, who owns NPS (82), complaint TAT, SCORES and survey verbatims.

**The wedge is the join between them.** The revenue seat sees the book move and cannot say why; the service seat hears the client and cannot price it into NNM or AUM. LiSN is the only layer that joins **what the client said ↔ what happened to their money and the RM's book**, at cohort level, human-gated and AI-marked. A call-analytics tool serves only the service seat's "what was said"; a portfolio dashboard serves only the revenue seat's "what happened" — neither crosses the seam.

**Panel split to test, not to assume:** the PM and CX adviser lean **HNI Wealth** as the beachhead (more RMs, more interactions, an NPS culture, telephony likely already recorded — richer, faster-to-value corpus). The regulation adviser leans **UHNI Private**, because PMS/AIF suitability and the forthcoming PMS mis-selling tightening bite hardest there and the per-relationship stakes are largest. The AI architect cautions that the **EWM channel (~7,000 partners) is partner-intermediated** — Nuvama may not hold those partner-client conversations — so the *in-house RM channel* is where coverage is genuinely full. See the synthesis for the recommended hypothesis.

---

# B — What data to collect and analyse

Four buckets. LiSN **owns** the interaction corpus (B3) at full coverage; **consumes** the book and event feeds (B4); B1 and B2 straddle both. The boundary holds on every item: cohort-level joins by default, consent and recording limits respected (DPDP), insight separated from differential action.

## B1 · RM data
- **RM–client advisory and review calls** — the highest-value stream. *Where it lives:* the cloud telephony that already records ~900 users for trade-confirmation compliance; possibly GreyLabs for transcription. *Reveals:* advice quality, suitability language, sentiment trajectory, the early tremor of disengagement, whether a proposal was actually pitched and how it landed. **Coverage caveat (AI architect):** full on the in-house RM channel; thin-to-absent on EWM-intermediated relationships.
- **RM free-text CRM notes** — *in the CRM.* *Reveals:* stated intent, life events, objections, competitor mentions — the structured-but-unmined layer.
- **Proposal-tool usage and outputs** — *the AI proposal tool.* *Reveals:* what was proposed, to whom, how often, and (joined to calls and the book) whether it converted.
- **RM productivity, pipeline and activity** — *RM dashboards.* *Reveals:* effort and output per RM; the denominator for coaching intelligence.

## B2 · Private-banking / wealth-team data
- **The EWM channel (~7,000 partners)** — *partner systems + Nuvama Partners platform.* *Reveals:* partner activity, dormancy, drift. **Boundary:** partner-client conversations are largely the partner's, not Nuvama's — so the corpus here is activity and outcome data, not full voice. Be explicit about this asymmetry.
- **Market-Head / region / branch structure and team books** — *book-side dashboards.* *Reveals:* the slicing spine for every LiSN output (team, branch, region).
- **NNM by team; RM and EWM attrition** — *flows and HR/MIS.* *Reveals:* where money and people are leaving; the outcome side of the join.

## B3 · Customer-interaction data — the corpus LiSN would own, at full coverage
- **RM calls** (as B1) · **WhatsApp-bot chats** (the AI client bot — query themes, friction) · **app and portal messages** (Nuvama Markets, Nuvama Private app, TX3) · **service calls** · **the complaint / grievance registry and SEBI SCORES escalations** (the regulatory voice) · **NPS and survey verbatims** (free-text, not just the score) · **email.**
- *Where GreyLabs already sits:* **telephony only**, and as agent-QA — it captures and audits the call channel. The rest of this corpus (chat, app messages, complaints, SCORES, verbatims, email) is **outside a telephony tool's reach**, and none of it is joined to the book.
- **Boundary:** DPDP consent and recording limits govern collection; advisory conversations carry PAN and account data, so purpose-limitation and cohort-level analysis are not optional niceties — they are the design.

## B4 · Existing-platform / book data — LiSN consumes, never owns
- RM/EWM dashboards · the enhanced portfolio-solutions tool · the **MPIS / Infinity book** (holdings, product mix) · **net-new-money flows and ARR-yield** · **broking and custody** (NWIL, Nuvama Clearing) · the **LAS / MTF / ESOP-funding book** (Nuvama Wealth Finance) · **suitability / KYC records** · the **CRM**. *Reveals:* the "what happened to the money" side of every join. LiSN reads these as feeds; the lakehouse stays with Nuvama.

## The join that matters most — and that no current tool makes
**What the client said ↔ what happened to their money and the RM's book.** Concretely:
1. **Review-call sentiment ↔ slowing NNM and redemptions** — disengaged tone or rising friction in review calls, read against a cohort's NNM trajectory and redemption pattern, surfaces *silent attrition / NNM leak* weeks before the outflow.
2. **WhatsApp queries ↔ holdings and suitability** — a cohort repeatedly asking the bot about risk, liquidity or a product they do not hold, read against their actual holdings, flags suitability mismatch and unmet demand.
3. **Complaint themes ↔ AUM at risk** — clustering complaints and SCORES escalations and joining them to the book quantifies the AUM sitting behind a theme — not just the ticket count.
4. **Proposal usage ↔ what was said ↔ what got funded** — the proposal tool shows what was *generated*; the call shows what was *pitched*; the book shows what was *funded*. Joining the three yields true proposal-to-flow conversion and shows where good pitches die.

## The slices LiSN must analyse across
**Client segment × RM / EWM / Market-Head / branch / region × product × channel × tenure.** Every output below is sliceable on this lattice; tenure matters because the first 12–24 months of a relationship and the generational handover in UHNI are the highest-risk windows.

---

# C — What they can see that other platforms cannot

## C1 · The incumbents and their blind spot

| Platform | Strengths | Gaps | Touches corpus / book / one only |
|---|---|---|---|
| **GreyLabs AI** | BFSI-tuned speech-to-text and call QA; transcription; agent-QA; cross-sell flagging; multilingual; now moving to agentic voice agents | Telephony-only; agent-QA framing built for **contact-centre agents, not Relationship Managers** in advisory relationships; does not consume the book; no voice-to-money join; chat/app/complaint/email channels out of scope | **Corpus only — and only the call slice of it** |
| **RM / EWM dashboards** | Flows, NNM, productivity, activity by team/branch | No interaction data; show the outflow, never the cause | **Book only** |
| **Portfolio-solutions / Infinity tool** | Holdings, product mix, performance | No client intent or voice; cannot see suitability-as-advised | **Book only** |
| **AI proposal tool (RMs)** | Fast, tailored proposals at scale | Records the *output*, not whether it was pitched or landed; no conversion truth | **Book-adjacent only** |
| **AI WhatsApp bot (clients)** | Real-time client engagement | A response channel, not an analysis layer; query data not joined to book or other channels | **Corpus (one channel) only** |

**The blind spot in one line:** every incumbent sits on **one side** of the voice-to-book divide. GreyLabs holds (part of) the voice; the dashboards and portfolio tool hold the book; the proposal tool and bot hold single slices of engagement. **None joins voice to money**, and none reads the full cross-channel corpus.

## C2 · The outputs LiSN can give

Each output states the **join**, the **owner (from A)**, the **evidence shown**, the **incumbent check** (the differentiation test — if GreyLabs or a Nuvama dashboard can already produce it, it is not differentiation), the **regulatory lift**, and the **boundary**.

### 1. Silent-attrition / NNM-leak early warning
- **Join:** review-call sentiment + chat/complaint friction ↔ slowing NNM and redemption pattern, by cohort.
- **Owner:** Head of Nuvama Wealth / Head of Private (P&L); routed via Market Heads.
- **Evidence shown:** the cohorts whose tone is cooling while flows are still positive; the AUM and ARR at risk behind them; the channels and themes driving it.
- **Incumbent check:** **Differentiated.** GreyLabs sees call sentiment but not NNM; the dashboards see NNM but not why; neither joins them. **No incumbent can produce this.**
- **Regulatory lift:** indirect — retention, not compliance.
- **Boundary:** cohort-level; LiSN drafts a "review these cohorts" prompt, a human acts, the step is logged. It does not auto-contact clients.

### 2. Suitability & mis-selling surveillance across 100% of advice
- **Join:** what was advised (calls + proposals) ↔ the client's suitability/KYC profile and holdings ↔ what got funded.
- **Owner:** Group CRO (Keyur Ajmera) and Compliance/Supervision; product fit co-owned by Saurabh Rungta.
- **Evidence shown:** advice that sits outside the suitability profile; product pushes against risk appetite; the deviation rate by RM/branch/product, on the **full corpus, not a 1–2% sample**.
- **Incumbent check:** **Strongly differentiated.** GreyLabs can flag keywords on calls but cannot test them against the book/suitability data it does not hold; dashboards hold suitability data but not the advice conversation. **No incumbent joins advice-as-spoken to suitability-as-recorded.**
- **Regulatory lift (high):** the SEBI Chairman's Feb-2026 signal of a **PMS-regulations review explicitly targeting evidence-based suitability and distributor mis-selling** (a consultation expected around the June-2026 board meeting), the SEBI **IA suitability** duties, and **DPDP** purpose-limitation all make *evidence of suitability across 100% of advice* more valuable. This is the output most lifted by regulation.
- **Boundary:** surveillance produces evidence and drafts flags; a supervisor adjudicates; every step audit-logged; AI-marked.

### 3. RM & EWM productivity-and-coaching intelligence
- **Join:** call/chat behaviour and proposal usage ↔ NNM and conversion outcomes, by RM and partner.
- **Owner:** Market Heads and Head of Nuvama Wealth.
- **Evidence shown:** what top RMs do differently in conversations that converts; where coaching closes the gap; dormant or drifting EWMs.
- **Incumbent check:** **Partially differentiated.** GreyLabs does agent-QA scorecards on calls — but for **contact-centre agents and on the call channel only**, and without the NNM outcome join. LiSN's RM-appropriate, outcome-joined, cross-channel version is differentiated; a plain call-QA scorecard is not. State this honestly to avoid over-claiming.
- **Regulatory lift:** modest (training/record-keeping).
- **Boundary:** coaching insight at cohort/role level; not a covert individual-surveillance tool; human-reviewed.

### 4. Proposal-to-flow conversion
- **Join:** proposal generated ↔ pitched-on-call ↔ funded-in-book.
- **Owner:** Head of Nuvama Wealth / Products & Advisory.
- **Evidence shown:** true conversion from proposal to flow; where strong proposals die (not pitched, mis-pitched, or pitched-and-lost); product-level lift.
- **Incumbent check:** **Differentiated.** The proposal tool sees generation; the book sees funding; nothing sits in between to see the pitch. **No incumbent closes this loop.**
- **Regulatory lift:** low–moderate (ties to suitability evidence).
- **Boundary:** cohort/product-level conversion; consumes the proposal and book feeds, owns neither.

### 5. Root-caused NPS movement
- **Join:** NPS and survey verbatims + complaint/SCORES themes + call/chat sentiment ↔ segment, RM, product and channel.
- **Owner:** Head of Client Experience (native CX buyer).
- **Evidence shown:** *why* NPS (82) moved — the themes and channels behind the number — and which themes carry AUM at risk.
- **Incumbent check:** **Differentiated.** Surveys give the score; GreyLabs gives call themes (one channel); neither root-causes across all channels nor prices the theme against the book. **No incumbent does the full cross-channel root cause.**
- **Regulatory lift:** moderate — complaint-handling and SCORES TAT are regulated.
- **Boundary:** cohort-level themes; insight, not auto-routing of individual cases.

### 6. The multi-audience layer (one corpus, many lenses)
- **Join:** the same corpus-to-book joins, re-projected per seat — P&L sees NNM-at-risk and conversion; CX sees root-caused NPS; Risk/Compliance sees suitability deviation; Technology sees an audit-logged, AI-marked, consume-don't-own layer.
- **Owner:** spans A1–A3; the CEO is the halo.
- **Evidence shown:** each audience sees its own KPIs sourced from one governed corpus, not five disconnected tools.
- **Incumbent check:** **Differentiated by construction.** No incumbent holds a cross-channel corpus joined to the book, so none can re-project it per audience.
- **Regulatory lift:** high in aggregate — Regulation 16C makes the buyer liable for AI outputs, so a single governed, audit-logged, AI-marked layer is easier to defend than several opaque point tools.
- **Boundary:** one corpus, cohort-level joins, human gates, full audit trail, AI markers throughout.

---

# Synthesis (one page)

**The three highest-impact, least-served needs for Nuvama**
1. **Silent-attrition / NNM-leak early warning** — the firm publicly narrates a monetisation gap and targets 20–30% net-flow growth, yet nothing today reads the *why* between a cooling client and a redemption. This is pure, defensible NNM retention, and no incumbent can produce it.
2. **Suitability & mis-selling surveillance across 100% of advice** — the largest regulatory tailwind. SEBI's Feb-2026 signal of a PMS review targeting **evidence-based suitability and distributor mis-selling**, the IA suitability duties and DPDP purpose-limitation converge on exactly what 100%-coverage interaction surveillance provides, while sampling-based QA covers 1–2%.
3. **Proposal-to-flow conversion** — Nuvama has already invested in an AI proposal tool; the missing, un-instrumented step is whether the proposal was pitched and funded. LiSN closes a loop the firm's own investment leaves open.

**The one-line reason LiSN wins that a call-analytics tool or a portfolio dashboard cannot**
> GreyLabs tells Nuvama what was said on a call and a portfolio dashboard tells them what happened to the money — LiSN is the only layer that joins the two, reading what the client said across every channel and tying it to what happened to their money and the RM's book, at cohort level, human-gated and audit-logged.

**Recommended anchor and beachhead — as a tested hypothesis**
- **Anchor pair:** the **Head of Nuvama Wealth (Rahul Jain — confirm tenure)** as the P&L/book anchor, paired with the **Head of Client Experience (name to be confirmed)** as the native CX buyer, hosted technically by **Riyaz Ladiwala (Technology & Operations)** and de-risked for the **Group CRO (Keyur Ajmera)**.
- **Beachhead hypothesis:** start in **HNI Wealth**, where the in-house RM channel gives genuinely full corpus coverage, interaction volume is high, telephony is likely already recorded, and an NPS culture exists — then extend the suitability-surveillance output into **UHNI Private**, where the PMS mis-selling tailwind is strongest. **Test, do not assume:** the competing view (regulation adviser) is that Private should lead on the suitability case; resolve it in discovery by checking (a) where calls are actually recorded today, and (b) whether the EWM channel is in or out of corpus scope.

**One-line demo opening that lands on the GreyLabs gap the CIO already raised**
> "GreyLabs already tells you what was said on the call — so the open question is what it *meant* for the client's money, the RM's book and your suitability exposure. That join is the one thing none of your platforms makes, and it is the only thing LiSN does."

---

## Sources & confidence ledger

**Confirmed (Nuvama disclosures, regulator texts, named interviews, company registries):**
- Financials and scale: Nuvama Q3 FY26 results and board-meeting outcome (23 Jan 2026, BSE/NSE filings); Nuvama investor/corporate overviews (Q4 FY25, Nov 2025); AlphaStreet, Tickertape, Screener, Simply Wall St; Wikipedia (firm overview).
- Leadership: Nuvama "About Us" and Board pages; Nuvama Private "Media/Careers/Contact" pages; The Org and Bloomberg/Equilar profiles (Saigal, Saxena, Chakraborti, Rungta, Vivek Jain, Priyanshu Gaurav); Hubbis interviews (Saigal, Saxena). Group CRO change: Nuvama board outcome 23 Jan 2026, MarketScreener, ScanX, Prysm.
- Platforms: Hubbis interview with Alok Saigal (AI proposal tool, AI WhatsApp bot, Infinity); Banking Frontiers interview with Riyaz Ladiwala (Project Plutus, cloud telephony recording ~900 users, onboarding times); Nuvama site (One Platform, Nuvama Markets, TX3).
- GreyLabs: Tracxn, Crunchbase, CB Insights, Inc42, IBS Intelligence, The Tech Portal, Whalesbook (profile, funding, client list, agentic pivot).
- Regulation: SEBI (Intermediaries) (Amendment) Regulations 2025 / Regulation 16C (SCC Times, Lexology, Lexplosion, HNLU CCL); SEBI Consultation Paper on Responsible AI/ML, 20 Jun 2025 (SEBI.gov.in, Lexology, Business Today, Independent Directors Databank); SEBI (Portfolio Managers) Regulations 2020 and APMI distributor registration (Groww, PMS Bazaar, Navia); SEBI Chairman Tuhin Kanta Pandey on the PMS review, Feb 2026 (Business Standard, CAalley, Whalesbook); DPDP Act 2023 phased commencement (secondary summary — treat dates as indicative).

**Flagged as unconfirmed from public sources — verify before relying:**
- A distinct **named Head of AI** and/or a **Group CIO** separate from the Technology & Operations head.
- A **named Head of Client Experience** (the native CX anchor).
- A **named PCG head** and a **group-level Compliance head** distinct from the broking-entity Compliance Officer (Srijith Menon).
- **Whether Nuvama itself runs GreyLabs** — plausible and consistent with the brief, but not in any public GreyLabs client list found.
- **Rahul Jain's current tenure** as Head of Nuvama Wealth (sourced from a corporate page that predates recent reshuffles).
- **DPDP commencement dates** and the **final status of the SEBI Responsible-AI/ML guidelines** (the latter was at consultation stage as of the research window).
