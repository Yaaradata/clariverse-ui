<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# \# Research Prompt — LiSN / Fluid CX at Nuvama

1. **Who are the right stakeholders to target** — not only the CX or product head, but the other people who matter across wealth and private banking.
2. **What data should LiSN collect or analyse** — especially data connected to RMs, private-banking teams, customer interactions, and existing platforms.
3. **What can those stakeholders see from LiSN** — the insights, dashboards and outputs LiSN can provide that their other platforms cannot.

---

## ROLE

Answer as the consensus of a four-person panel that **surfaces disagreement rather than averaging it**. When the panel splits, state the competing views inside the point they affect.

1. **AI architect — wealth data / ML and conversation intelligence.** Judges what can actually be detected from RM–client conversations once joined to the book, the false-positive risk, and what makes a signal trustworthy at the scale of ~1,200 RMs and ~7,000 external partners.
2. **The buyer's dual lens — Head of Wealth / Private (the P\&L and book owner) and Head of Client Experience (the native voice-of-client owner).** Holds the tension between the revenue seat and the service seat — the seam LiSN sits across.
3. **Senior PM for LiSN / Fluid.** Judges what is buildable inside the product boundary and how to sequence it for a near-term Nuvama demo.
4. **Regulation and investor-protection adviser, India.** Ties findings to live SEBI IA / PMS / MF rules, suitability and mis-selling duties, AI-use disclosure and DPDP limits.

## CONTEXT — what we already know about Nuvama (verify, correct and extend; do not take as settled)

Confirm every name, title, number and tool from current sources, and where you cannot confirm something, say so in plain language rather than asserting it.

**The firm.** Nuvama Group is one of India's leading non-bank wealth managers — roughly ₹4.6 trillion in client assets including custody, ~1.3 million affluent/HNI clients, and 4,400+ of the wealthiest families (30 June 2025). Majority owned by PAG; listed September 2023. Wealth Management splits into **Nuvama Wealth** (affluent/HNI; ~1,200 RMs, ~7,000 External Wealth Managers, 450+ locations, ~50 investment solutions, NPS ~77, "tech plus human" model; includes the broking-led Professional Clients Group) and **Nuvama Private** (UHNI / family office; Family Office, Wealth Structuring \& Estate Planning; in-house "Infinity"; ARR yield ~1%; offshore via Dubai/DIFC).

**Leadership (seed — confirm names and current titles).** Ashish Kehair (MD \& CEO); Alok Saigal (President \& Head, Nuvama Private); the Nuvama Wealth (HNI) head (confirm); regional Market Heads / Senior Managing Partners who own RM teams — Sandeep Chakraborti (South \& East), Vivek Jain (Maharashtra \& Gujarat), Priyanshu Gaurav (West-2), Amit Saxena (North); Saurabh Rungta (CIO, Nuvama Private); the PCG head; Keyur Ajmera (Group CRO, from Feb 2026); the Client Experience and the Compliance heads (find and name); and the technology leaders — a Group CIO, a CIO and a Head of AI (the likely demo audience).

**The platforms Nuvama already runs — the crux of question 3.** Each sits on only **one side** of the voice-to-book divide, and none joins the two:

- *Book side:* RM/EWM dashboards, an enhanced portfolio-solutions tool, a unified product journey, a revamped app and website.
- *Engagement side:* an AI proposal-generation tool for RMs, and a WhatsApp client chatbot.
- *Call/voice side:* **GreyLabs AI** — a BFSI speech-analytics, transcription and agent-QA vendor — already in use.
Verify and extend this list.

**Where LiSN sits.** LiSN / Fluid CX is the interaction-intelligence layer: it owns the interaction/voice/complaint corpus at full coverage, consumes the operator's book and event feeds but never owns the lakehouse, never auto-fires (it drafts, a human approves, every step is audit-logged), joins at cohort level not identity level, and marks every AI element. The wedge in one line: *GreyLabs tells Nuvama what was said on a call; LiSN tells them what it means — for the client's money, the RM's book and their compliance exposure — across every channel and for every audience.*

## RULES

- **Scope.** Nuvama is primary — its wealth and private arms, technology estate, public disclosures and leadership. Use peer Indian wealth managers (360 ONE, Kotak / ICICI / Axis / HDFC private banking, ASK, Anand Rathi) and global operators only as light contrast. Horizon: current state plus 12–24 months, prioritising the last 18.
- **Recall before ranking.** Find every plausible finding, including weak or single-source ones; keep thin items, noting where evidence is thin. Rank only at the merge.
- **Source priority.** Cite sources; prefer Nuvama disclosures and regulator texts over trade press over vendor blogs; down-weight vendor marketing; separate fact from inference.
- **Boundary and compliance.** Carry the LiSN boundary into every section (consumes the book, owns the corpus, never owns the lakehouse, never auto-fires, cohort-level, AI-marked). Default to cohort- not identity-level joins; respect DPDP consent and recording limits; separate *insight* from *differential action*. Do not invent — mark anything unconfirmed.


## DELIVERABLE

### A — Who to target *(question 1)*

Wealth has no single portfolio owner, so map the cluster — explicitly going beyond the CX/product head. Organise into three groups, and for **each named role** give: what they own; the KPI vocabulary they are measured on, each metric with its P\&L or operational destination, cadence and trajectory (e.g. NNM, AUM, ARR yield, RM productivity, client/family attrition, share of wallet, MPIS penetration, NPS, complaint TAT, suitability adherence, mis-selling incidents); the questions they ask, flagging those needing cross-system stitching; their seat type (P\&L anchor / native CX buyer / technical champion / routing seat / economic signer / blocker); why LiSN matters to them; and which tools they rely on today and what those cannot tell them.

- **A1 · Economic / P\&L buyers** — the Nuvama Wealth (HNI) head, the Nuvama Private (UHNI) head, the CEO as sponsor.
- **A2 · Technical champions** — the Group CIO, the CIO, the Head of AI (the demo audience).
- **A3 · Routing seats** — the regional Market Heads who own RM teams, the Private-arm CIO, the PCG head, the Group CRO, the Client Experience head, Products \& Advisory, Compliance / Supervision.

Close by naming the **two anchors** — the P\&L/book seat and the native CX buyer — and state the wedge as the join between them. Treat any single source's ranking of who matters most as a hypothesis to test.

### B — What data to collect and analyse *(question 2)*

Organise the data into the four buckets named in the question, and for each say what it is, where it lives, and what it can reveal:

- **B1 · RM data** — RM–client advisory and review calls, RM free-text CRM notes, proposal-tool usage and outputs, RM productivity, pipeline and activity.
- **B2 · Private-banking / wealth-team data** — the EWM channel (~7,000 partners), Market-Head / region / branch structure, team books, NNM by team, RM and EWM attrition.
- **B3 · Customer-interaction data (the corpus LiSN would own, at full coverage)** — RM calls, the WhatsApp-bot chats, app and portal messages, service calls, the complaint / grievance registry and SEBI SCORES escalations, NPS and survey verbatims, email. Note where GreyLabs already captures telephony only.
- **B4 · Existing-platform / book data (LiSN consumes, never owns)** — the RM/EWM dashboards, the portfolio-solutions tool, the MPIS / Infinity book (holdings, product mix), net-new-money flows and ARR-yield, broking and custody, the LAS book, suitability / KYC records, the CRM.

Then name the **join that matters most and that no current tool makes: what the client said ↔ what happened to their money and the RM's book** — with concrete examples (review-call sentiment ↔ slowing NNM and redemptions; WhatsApp queries ↔ holdings and suitability; complaint themes ↔ AUM at risk; proposal usage ↔ what was said ↔ what got funded). Finish with the slices LiSN must analyse across: client segment × RM / EWM / Market-Head / branch / region × product × channel × tenure.

### C — What they can see that other platforms cannot *(question 3)*

- **C1 · The incumbents and their blind spot** — GreyLabs AI and Nuvama's own dashboards, portfolio tool, proposal tool and WhatsApp bot. For each: its strengths, its gaps, and whether it touches the interaction corpus, the book, or only one of them.
- **C2 · The outputs LiSN can give** — propose each insight, dashboard or output (e.g. silent-attrition early warning, suitability / mis-selling surveillance across 100% of advice, RM and EWM productivity-and-coaching intelligence, proposal-to-flow conversion, root-caused NPS movement, and the multi-audience layer). For **each**, state the join behind it, the stakeholder owner from Section A, the evidence it shows, and **whether GreyLabs or a Nuvama dashboard can already produce it** — because if they can, it is not differentiation. Where regulation (SEBI IA AI-disclosure and suitability, the 2026 PMS mis-selling tightening, DPDP) makes an output more valuable, say so against that output. Carry the LiSN boundary on every one.


### Synthesis (one page)

The three highest-impact, least-served needs for Nuvama; the one-line reason LiSN wins that a call-analytics tool or a portfolio dashboard cannot; the recommended anchor stakeholder and beachhead arm (HNI Wealth vs UHNI Private) as a tested hypothesis; and a one-line demo opening that lands on the GreyLabs gap the CIO already raised.

## OUTPUT AND BAR

Return Sections A, B and C, then the synthesis, with the engine name at the top. The report clears the bar when: A maps the cluster beyond the CX head, with each role's KPI vocabulary tied to a P\&L destination and the two anchors named; B covers all four data buckets and names the interaction-to-book join with concrete examples; C states, for every proposed output, its join, owner, evidence and whether an incumbent already produces it; nothing is invented (unconfirmed items are flagged in plain language); and the synthesis names the three needs, the wedge, the anchor and the demo opening.

**Avoid:** a single "the buyer is X" answer instead of a mapped cluster; data listed without the join that connects it; "differentiated" outputs that GreyLabs or the RM dashboards already produce; KPIs with no P\&L destination; inventing names or titles; and a wedge a call-analytics-only or book-only tool could also make.

## BRAND RULES

"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; never "cheap" — use "cost-efficient at scale"; no exclamation marks; India primary; domain-correct terms (a Relationship Manager, never an "agent"; a client outflow is "attrition" or "NNM leak", never a "chargeback").

LiSN / Fluid CX wins at Nuvama when it becomes the layer where “what was said” in every interaction is joined, safely and auditable, to “what happened to the client’s money and the RM’s book” – and exposed differently to the P\&L anchors, CX owner, CIO/Head of AI, CRO and Market Heads who cannot see that join today.[^1][^2][^3][^4][^5]

***

## Engine: LiSN / Fluid CX

The four-person panel below responds jointly, and we surface disagreement explicitly where it matters to product scope, buying centre and regulatory posture.

***

## Context: Nuvama today (validated and gaps)

Nuvama Wealth Management Limited (Nuvama Group) is a listed, Mumbai‑headquartered wealth manager with client assets (including custody) of about ₹4.6 trillion as of June 30, 2025; ICRA and CARE ratings rationales and Nuvama’s corporate overview all converge on this order of magnitude.[^6][^7][^3][^8][^1]

These disclosures and presentations show Nuvama serving roughly 4,400+ of the wealthiest families and ~1.3 million affluent/HNI clients, with a hybrid “tech plus human” model and two main wealth divisions: Nuvama Wealth (HNIs/affluent) and Nuvama Private (UHNI/family office), plus Nuvama Asset Management for AIF/PMS and alternatives.[^9][^3][^8][^10]

Recent investor material indicates around ~1,100 RMs and ~8,000 active External Wealth Managers (EWMs), covering 500+ locations; an earlier corporate overview referenced ~1,300 RMs, so we treat the counts as “roughly 1.1–1.3k RMs and 7–8k EWMs” rather than a single precise number.[^11][^1]

PAG is the majority shareholder, with about 54–56% ownership depending on source; Nuvama listed in September 2023 on NSE and BSE.[^12][^13][^14][^8]

Leadership seats we can validate include:

- Ashish Kehair – MD \& CEO, Nuvama Group.[^15][^16]
- Alok Saigal – President \& Head, Nuvama Private.[^17][^18][^19]
- Harsh Jha – Group Head of Technology / CIO/CTO, Nuvama Group (head of information technology).[^20]
- Amit Ahuja – CTO, Nuvama Wealth.[^21]
- Anshu Kapoor – President \& Head, Nuvama Asset Management (product/solutions anchor on MPIS/AIF/PMS shelf).[^22][^23]
- Keyur Ajmera – appointed Group Chief Risk Officer effective 1 Feb 2026.[^24][^25]
- Client‑experience leadership: a “Head Client Experience Office” is referenced in partner‑site grievance text, and LinkedIn shows Dattattray Desai as National Head – Client Experience, and Praveen Kumar K as Platform and Client Experience Head for the Professional Clients Group (PCG).[^26][^27][^28][^29]

The Market Head / regional leadership is only partially visible publicly: LinkedIn shows Sandeep Chakraborti as Senior Managing Partner \& Market Head (South \& East) within Nuvama Private, but we could not confirm current titles for Vivek Jain, Priyanshu Gaurav or Amit Saxena from open sources, so we treat their specific designations as unconfirmed while assuming that such regional Market Head roles exist.[^30]

Saurabh Rungta is now Deputy CEO \& CIO at Centrum Wealth; earlier profiles show him as CIO \& Managing Partner at Edelweiss/Nuvama Private until October 2023, so a “CIO, Nuvama Private” role in 2026 appears outdated and should be treated as historical.[^31][^32]

On platforms, the public estate shows:

- **Book‑side / portfolio tools**:
    - Infinity – Nuvama’s proprietary PMS platform for HNI/UHNI and institutions, exposed via a dedicated Infinity app with interactive access to holdings, transactions and performance.[^10][^33]
    - Nuvama One – a sales‑side CRM and lead‑management application used by RMs to manage leads, pipeline and customer relationship data.[^34]
    - Broking/custody and standard trading apps/web, including Nuvama mobile trader and web platforms.[^33][^34]
- **Engagement‑side digital**:
    - A WhatsApp‑integrated chatbot for Nuvama Private, offering portfolio and capital‑growth reports and servicing features to clients.[^35]
- **Voice/QA‑side**:
    - GreyLabs AI – a BFSI‑tuned speech‑analytics provider that converts call recordings to text, runs LLMs for QA and sales/collections insight, and can analyse chats and emails—but we have no public source naming Nuvama as a GreyLabs client, even though the context suggests such a deployment.[^4][^5]

Complaints and grievance‑redressal structures explicitly reference SEBI’s SCORES platform and SMART ODR, with internal TAT commitments (e.g. interim reply within 10 business days, final response within 21 days) aligned to SEBI’s 21‑day resolution rule.[^36][^37][^38]

The panel agrees the NPS figure (~77) mentioned in the prompt is plausible for a strong wealth platform, but we have not found a public Nuvama source that states this number explicitly and treat it as unconfirmed.[^2][^11]

***

## A — Who to target

### A1 Economic P\&L buyers

**1. MD \& CEO – Ashish Kehair (Group‑level P\&L anchor)**

- **What he owns.** Group‑wide revenue, profitability, capital allocation and reputational risk across wealth, asset management, asset services and capital‑markets lines.[^8][^15]
- **KPI vocabulary.** Consolidated AUM/client assets, segment net new money (NNM), ARR yield by business, cost‑to‑income ratio, ROE, serious complaint and mis‑selling incidence, and regulatory capital and rating trajectory; ratings reports already highlight client assets growth, net new money in wealth and asset management, and profitability.[^7][^3][^6]
- **Questions he asks (cross‑system).**
    - Where are NNM leaks and client attrition happening by segment, RM/EWM cohort and product, and are they linked to specific interaction themes or suitability issues (a join across CRM/portfolio, voice/chat and complaints)?[^38][^1][^36]
    - How do client‑experience and interaction‑quality scores translate into P\&L outcomes—higher ARR yield, lower attrition, fewer SEBI/AMFI escalations—at book and cohort level?
- **Seat type.** Economic signer and ultimate P\&L anchor; sponsor whose approval is needed for anything that touches suitability surveillance or AI use on client data.
- **Why LiSN matters.**
    - **Buyer lens:** LiSN helps distil “actionable narrative” from 100% of interaction data, tying it to book outcomes, so he can see which parts of the franchise are silently leaking NNM or generating regulatory heat despite strong headline growth.[^3][^1][^7][^36]
    - **AI architect:** Stresses that at this scale (1.1–1.3k RMs and ~8k EWMs) signals must be robust, cohort‑level, and DPDP‑compliant to avoid false alarms and reputational damage; LiSN’s cohort‑join, non‑auto‑fire and audit‑log constraints are therefore central to making signals trustworthy.[^39][^40]
    - **Regulator adviser:** Emphasises that SEBI’s evolving AI/ML guidelines and mis‑selling focus make a transparent, auditable AI interaction‑intelligence layer a board‑level risk‑management asset rather than just a CX tool.[^41][^42][^43][^40][^44]
- **Tools he uses today and their blind spot.**
    - Consolidated MIS, segment dashboards, Infinity/MPIS revenue mix views and complaints/NPS reports give “what happened” to AUM, revenue and grievances, but not “what clients and RMs actually said” across voice, WhatsApp and email or how that caused book moves or suitability risk.[^45][^2][^10][^38]

**2. Head, Nuvama Wealth (HNI/affluent) – seat confirmed, name not publicly clear**

- **What they own.** P\&L and client‑asset growth for the HNI/affluent segment, including RM and EWM networks, locations, and product‑mix economics (mutual funds, MPIS/AIF/PMS, broking and lending).[^1][^6][^7][^11]
- **KPI vocabulary.** Segment AUM/client assets, NNM, ARR yield, RM productivity (revenue/book per RM), EWM activation and share of wallet, client/family attrition, and penetration of manufacturer/platform solutions like MPIS and PMS; investor presentations already highlight MPIS revenue share and net‑new money flows in wealth and asset management as key performance indicators.[^7][^45]
- **Questions.**
    - Which RM and EWM cohorts are over‑relying on transactional broking or lending and under‑serving advisory MPIS/PMS despite clients expressing planning or dissatisfaction themes in calls and chats?
    - Where do complaint themes, SCORES escalations or negative sentiment precede outflows or MPIS redemptions—that is, where is NNM leak driven by unmet advice and suitability issues rather than market moves?.[^37][^36][^38]
- **Seat type.** P\&L anchor and primary book owner for HNI/affluent.
- **Why LiSN matters.**
    - **Buyer lens:** LiSN shows, by RM/EWM cohort and segment, how interaction quality, proposal use and complaint patterns drive NNM, ARR yield and product penetration, so they can prioritise coaching and proposition fixes where the book is at risk.
    - **PM:** Sees this seat as the most natural commercial anchor for LiSN’s first deployment, because its levers (RM productivity, NNM, MPIS penetration) are closely tied to interaction patterns and are already tracked in RM/EWM dashboards and Nuvama One CRM—but not yet joined to corpus‑level voice/chat intelligence.[^34][^11]
- **Tools today and blind spot.**
    - RM dashboards, Nuvama One CRM, portfolio tools and Infinity provide activity, pipeline, holdings and flows, but they do not show corpus‑level conversation themes or complaint narratives by cohort.[^33][^34]

**3. President \& Head, Nuvama Private – Alok Saigal (UHNI / family‑office P\&L owner)**

- **What he owns.** UHNI/family‑office book, bespoke advisory and structuring, family‑governance and estate‑planning solutions, and international flows via Nuvama Private’s global offering (Dubai/DIFC and broader international clients).[^18][^19][^46][^17]
- **KPI vocabulary.** UHNI AUM and NNM, ARR yield (often ~1% range in Indian UHNI/PMS contexts, though we have not found Nuvama publishing a specific figure), share of wallet across onshore/offshore, multi‑generation client retention, and incidence of complex complaint or suitability disputes (e.g. disputed PMS or structured products).[^42][^8]
- **Questions.**
    - Are private‑banking RMs and structuring teams consistently documenting client goals, risk appetite and constraints in ways that match SEBI IA suitability and PMS obligations—and does interaction evidence back that up before and after complex product sales?[^47][^43][^41]
    - Where do WhatsApp and email threads with UHNI principals show unaddressed concern, confusion or pushback that later manifests as disputes or SCORES complaints?.[^36][^35][^37][^38]
- **Seat type.** P\&L anchor with strong risk and reputational sensitivity.
- **Why LiSN matters.**
    - **Regulator adviser:** Argues this is the natural first regulatory‑value anchor, because SEBI and AMFI are tightening mis‑selling norms in PMS and complex products, and UHNI disputes are high‑impact; a cohort‑level suitability‑and‑mis‑selling lens across 100% advice interactions is a strong defence.[^43][^44][^42]
    - **AI architect:** More cautious, noting that deep‑structured UHNI conversations are harder to analyse reliably, and False Positives on mis‑selling flags are more costly; suggests starting with narrower, high‑precision patterns (e.g. missing risk‑profiling evidence) in this segment.
    - **Buyer lens \& PM:** See UHNI as a powerful sponsor seat but favour proving LiSN at scale in HNI Wealth first, where cohorts are larger and data more homogeneous, before applying the model to UHNI idiosyncrasies.

***

### A2 Technical champions

**1. Group Head of Technology / CIO/CTO – Harsh Jha**

- **What he owns.** Enterprise architecture across wealth, asset management, capital‑markets and asset‑services, including integration between CRM (Nuvama One), Infinity/portfolio systems, call‑recording infrastructure and analytics platforms.[^20][^34][^33]
- **KPI vocabulary.** Platform stability and uptime, security incidents, delivery velocity, integration cost, and adherence to DPDP and SEBI technology and AI‑usage expectations.[^40][^44][^39]
- **Questions.**
    - How do we add an interaction‑intelligence layer above existing systems without duplicating lakehouse ownership or breaching DPDP consent limits?.[^39]
    - Can we expose RM‑level and cohort‑level insight in cost‑efficient ways across RM desktops, Market‑Head views and CX/risk dashboards without fragmenting the tech stack?
- **Seat type.** Technical champion and gatekeeper; strong influence on demo evaluation and platform selection.
- **Why LiSN matters.**
    - **AI architect \& PM (aligned):** LiSN’s “corpus‑owner, book‑consumer” boundary—no primary lakehouse, cohort‑joins not identity‑joins, no auto‑fire, AI elements marked and audit‑logged—fits both DPDP and SEBI’s consultation on responsible AI/ML use, and limits the integration and governance burden.[^44][^40][^39]
    - **Regulator adviser:** Insists the demo must visibly show consent and purpose‑limitation handling and explain how differential action (e.g. contacting certain cohorts differently) is governed separately from insight generation.

**2. CTO – Nuvama Wealth (Amit Ahuja)**

- **What he owns.** RM desktop, RM dashboards, Nuvama One CRM, client‑facing wealth app/portal, and integration of proposal tools and bots with the wealth book.[^21][^34][^33]
- **KPI vocabulary.** RM adoption, platform performance, straight‑through journeys, proposal‑tool usage, and reduction in manual tracking.
- **Questions.**
    - Which RM journeys remain “blind” to interaction intelligence—for example, proposals generated but not discussed, or repeated service calls around the same portfolio issues?
    - What can be safely instrumented in RM tools to surface LiSN insights without overloading RMs or conflicting with supervision?
- **Seat type.** Technical champion and design partner for RM‑facing UX.
- **Why LiSN matters.**
    - **PM:** Sees this seat as core to deciding whether LiSN insight flows back into Nuvama One/Infinity widgets, or remains in separate dashboards.
    - **AI architect:** Prefers LiSN outputs to appear as cohort‑level tiles or RM‑coaching cues rather than raw scores per interaction, to reduce the risk of misuse.

**3. Head of AI – role likely but not publicly named**

We have not found a public “Head of AI” title at Nuvama, but given its scale and stated focus on GenAI tools, it is reasonable to expect a senior AI lead in technology or digital.[^5][^4][^22]

- **Seat type.** Technical champion who will judge models, explainability and operationalisation across wealth and private.
- **Panel disagreement.**
    - **AI architect:** Wants this role central in the demo, to interrogate false‑positive rates, signal calibration and supervision.
    - **Buyer lens \& PM:** See them as crucial but believe the commercial anchor must sit with Wealth/Private heads, or CX/risk, not AI alone.

***

### A3 Routing and control seats

**1. Group CRO – Keyur Ajmera**

- **What he owns.** Group risk framework: credit, market, operational and conduct risk across wealth and asset management; ratings and board oversight emphasise risk management importance.[^25][^6][^24][^7]
- **KPI vocabulary.** Mis‑selling incidents, suitability breaches, major complaint escalations, regulatory observations, and losses or provisions from risk events.
- **Questions.**
    - Can we detect clusters of “high‑risk advice behaviour” (e.g. inadequate risk disclosure, promise of guaranteed returns, aggressive cross‑selling) across 100% interactions, not just sampled QA, and tie them to product and RM/EWM cohorts?[^41][^47][^43]
    - How do we show SEBI/AMFI that we have proactive, AI‑supported surveillance without black‑box decisions or discriminatory treatment of clients?.[^40][^44]
- **Seat type.** Control‑function buyer, potential blocker if AI use is opaque.
- **Why LiSN matters.**
    - **Regulator adviser:** Argues CRO should co‑own LiSN, because its suitability/mis‑selling lens across interactions directly addresses SEBI IA and PMS concerns about mis‑selling and conflict of interest.[^42][^43][^41]
    - **Buyer lens:** Wants CRO as co‑sponsor but is wary that if CRO is primary buyer, commercial teams may perceive LiSN as surveillance, not growth.

**2. Client Experience leadership – National Head CX and Head Client Experience Office**

- **What they own.** End‑to‑end client experience, NPS, complaint‑handling and service‑process design, including SCORES and SMART ODR performance for Nuvama’s investment‑advisory services.[^27][^28][^29][^38][^36]
- **KPI vocabulary.** NPS trajectory, complaint volume and TAT, SCORES escalations, service‑call quality, digital journey satisfaction.
- **Questions.**
    - Which complaint themes, service‑call topics and chatbot conversations predict attrition, downgraded relationship or product exits, by segment and RM/EWM cohort?[^35][^38][^36]
    - Why do some cohorts show high NPS but flat share of wallet, or rising complaints despite stable AUM?
- **Seat type.** Native CX buyer—owns the “voice of client” corpus mandate.
- **Why LiSN matters.**
    - **Buyer lens \& PM (aligned):** This is the natural anchor for the corpus‑ownership side of LiSN: CX has legitimacy to own “every interaction, every channel” and to sponsor corpus‑level analysis that LiSN needs.
    - **AI architect:** Pushes to limit identity‑level joins from CX into book; wants CX to own interaction analytics, with P\&L joins built at cohort only.

**3. Market Heads / Senior Managing Partners (regional book owners)**

We can validate Sandeep Chakraborti’s role as Senior Managing Partner \& Market Head South \& East within Nuvama Private; other regional names remain unconfirmed from public data.[^30]

- **What they own.** Team‑book performance by region: RM and EWM teams, local NNM, RM/EWM productivity and attrition.
- **KPI vocabulary.** Region AUM, NNM by team, RM/EWM activity and pipeline, client attrition, complaints and suitability incidents by branch.
- **Questions.**
    - Which RM/EWM cohorts are driving silent attrition and suitability risk, and what specific interaction themes underlie these outcomes?
    - Where should coaching, supervision and product‑shelf changes be focused to improve both revenue and compliance metrics?
- **Seat type.** Routing seats and operational buyers; their dashboards are where LiSN cohort‑insight should land.

**4. PCG and Products/Advisory leadership**

- **PCG client‑experience and platform head – Praveen Kumar K.** Owns professional‑client service and platform excellence for PCG, measured on service quality, platform adoption and complaint levels.[^26]
- **Asset‑management/product shelf – Anshu Kapoor.** As President \& Head, Asset Management, he is accountable for MPIS/AIF/PMS performance, trail revenue, and regulatory alignment on PMS/AIF product structures.[^23][^45][^43]
- **Seat type.** Routing and product‑design seats for LiSN’s product‑level findings.

**5. Compliance / Supervision head**

We have not identified a named compliance head from public sources, though Nuvama’s disclosures and grievance policy imply a strong compliance function overseeing IA/PMS and MF distribution.[^43][^38][^36]

The panel agrees this seat will care deeply about how LiSN flags potential mis‑selling or suitability issues, and how such flags are documented and resolved.

***

**Two anchors and the wedge.**

Across all seats, the panel converges on two anchors for LiSN:

- **P\&L/book anchor:** Head, Nuvama Wealth (HNI) for scale, or President \& Head, Nuvama Private for high‑risk UHNI book—this is the tension.[^17][^18][^11]
- **Native CX anchor:** National Head Client Experience / Head Client Experience Office, as the legitimate owner of the “100% interaction corpus”.[^28][^27][^38]

LiSN’s wedge is the join between these anchors: CX owns and interprets “what clients and RMs said” across voice, WhatsApp, email, app and complaints; Wealth/Private own “what happened to their money and the RM’s book”; LiSN distils cohort‑level joins between the two, under CRO/Compliance and CIO‑approved boundaries.

***

## B — What data LiSN should collect and analyse

### B1 RM data

**What it is.**

- RM–client advisory and review calls captured in call‑recording systems and processed today by speech‑analytics like GreyLabs (where deployed)..[^4][^5]
- RM free‑text notes and meeting records in CRM tools such as Nuvama One.[^34]
- Proposal‑tool usage and outputs—any GenAI‑driven proposal engines used by RMs, plus standard portfolio and idea proposals produced from Infinity or MPIS.[^45][^33][^34]
- RM productivity, pipeline and activity metrics: lead volumes, conversion rates, meeting counts, proposal issuance, and product take‑up by RM.

**Where it lives.**

- Call recordings and transcripts in telephony/QA platforms, likely integrated with GreyLabs‑type analytics but not publicly documented for Nuvama.[^5][^4]
- CRM (Nuvama One) holds leads, opportunities, tasks and RM notes; Infinity holds positions, transactions and performance per client.[^33][^34]

**What it can reveal for LiSN (panel view).**

- **AI architect:** With high‑quality transcripts and structured CRM data, LiSN can reliably detect advisory cadence (how often reviews happen), coverage gaps (clients with book drift but few interactions), and repeated themes (e.g. unaddressed risk concerns) at cohort level; however, model‑based detection of “poor advice” must be conservative and rule‑enriched to avoid misclassifying legitimate high‑risk strategies.[^47][^4][^5]
- **Buyer lens:** RM data is the bridge between interaction quality and RM productivity: LiSN can show which RMs convert advice conversations and proposals into funded flows and durable ARR, and which generate noise, complaints or churn.
- **PM:** Sees RM data as core to early demos—e.g. a simple RM‑cohort view of “review‑call quality × NNM outcome”—because much can be built by joining existing CRM and book fields to interaction‑level tags without touching raw PII.
- **Regulator adviser:** Wants RM data explicitly linked to suitability documentation and risk‑profiling evidence (e.g. presence of mandated risk‑profiling language) as per SEBI IA requirements.[^41][^47]

***

### B2 Private‑banking / wealth‑team data

**What it is.**

- EWM channel data: ~8,000 active External Wealth Managers, their AUM, flows and activity levels.[^11]
- Market‑Head / region / branch structures: which RMs and EWMs roll up into which Market Heads (e.g. Sandeep Chakraborti for South \& East in Private) and locations.[^30][^11]
- Team‑book data: NNM, AUM, revenue, product mix and trail commissions by team and region.[^7][^45]
- RM and EWM attrition: movements of advisers and partners in and out of the platform.

**Where it lives.**

- Internal hierarchy tables attached to CRM and HR systems, and RM/EWM dashboards used by Market Heads and Wealth leadership.[^1][^11]

**What it can reveal.**

- **Buyer lens:** LiSN can show, at cohort level, which teams have structurally better or worse interaction‑to‑book conversion (e.g. fewer complaints and higher advice‑led flows) and which are driving silent attrition or mis‑selling risk, informing Market Head coaching and EWM engagement.
- **AI architect:** Emphasises that when LiSN uses team‑level data, joins should be at cohort granularity (e.g. “team X’s UHNI structured‑product book”) rather than identity‑level per client, to stay inside DPDP’s purpose‑limitation and proportionality expectations.[^39]
- **Regulator adviser:** Notes SEBI and AMFI’s focus on distributor behaviour makes EWM channel analytics—especially mis‑selling signals and complaint clustering—valuable for supervision and regulatory dialogue.[^44][^43]

***

### B3 Customer‑interaction corpus (LiSN’s owned layer)

**What it is.**

- RM calls (advisory, reviews, service) across wealth and private.
- WhatsApp‑bot chats via Nuvama Private’s integrated chatbot, including portfolio‑report requests and service queries.[^35]
- App and portal messages—notifications, in‑app chats and secure messaging about portfolios and transactions via Infinity and other front ends.[^33]
- Service calls to helpdesks and branches.
- Complaint and grievance data including SCORES escalations, SMART ODR entries and internal complaint logs for Nuvama Wealth and Nuvama Asset Management, with complaint categories and TAT outcomes.[^37][^38][^36]
- NPS and survey verbatims from CX programmes.
- Client emails and RM outbound advisory communications.

**Where it lives.**

- Telephony and contact‑centre systems (voice), bot platforms and messaging infrastructure (WhatsApp, app, portal), email servers, CX survey tools, and complaint‑management systems tied to SCORES/SMART ODR.[^38][^36][^37][^35]

**What it can reveal (and GreyLabs’ current scope).**

- GreyLabs‑style platforms already convert calls to text, score QA parameters (e.g. script adherence, empathy) and detect basic sentiment and revenue‑opportunity cues across calls, and can analyse chats and emails where integrated.[^4][^5]
- **AI architect:** Notes that at Nuvama’s scale, LiSN can push beyond QA to multi‑channel patterns: for example, clients who repeatedly ask similar questions across WhatsApp, email and service calls before redeeming, or RMs whose advisory calls show high promise of returns language; but emphasises that voice sentiment is noisy and must be anchored by complaint and flow data.
- **Buyer lens:** Sees this corpus as the “95% we are not listening to” today—especially for EWMs and private clients—and the primary source of unmet‑needs and attrition signals.
- **PM:** Plans LiSN’s first demo around this corpus, because it is where LiSN genuinely owns something no existing Nuvama platform claims: unified, cross‑channel interaction intelligence.

***

### B4 Existing‑platform / book data (LiSN consumes, never owns)

**What it is.**

- RM/EWM dashboards showing book, pipeline, productivity and flows per adviser, team and region.[^11][^1]
- Portfolio‑solutions tools and product‑journey systems for MPIS, PMS, mutual funds and broking.
- Infinity and related PMS/AIF books: holdings, transactions, product mix, valuations and performance.[^10][^33]
- NNM flows and ARR yield by segment and product; CARE and investor disclosures highlight net new money and yield trends.[^45][^7]
- Broking and custody data, LAS (loan against securities) and structured credit exposures.
- Suitability/KYC records and risk‑profiling data required under SEBI IA regulations and PMS documentation, plus MF distributor suitability records referencing AMFI guidance.[^47][^43][^41]
- CRM entities from Nuvama One: leads, opportunities, deals, visits and RM notes.[^34]

**Where it lives.**

- Nuvama’s internal lakehouse(s), Infinity/PMS systems, broking and custody back‑office, CRM and compliance systems, all under CIO/CRO governance.

**LiSN’s boundary.**

All panel members agree LiSN must **consume** this data via governed feeds but **never own** the lakehouse; joins are done at pre‑defined cohort grain (segment × RM/EWM × product bucket × region × tenure), and outputs are advisory—no auto‑fired client or RM actions—with every AI‑generated element clearly marked and fully audit‑logged.[^40][^44][^39]

***

### The join that matters most – “what they said ↔ what happened”

The core join Nuvama does not currently make is: **interaction corpus (calls, chats, emails, complaints, surveys) ↔ book outcomes (flows, holdings, product mix, suitability events) at cohort level.**

**Concrete examples (panel scenarios).**

- **Silent‑attrition early warning.**
    - Cohort: HNI clients with decreasing NNM and rising redemptions from MPIS/PMS over the last two quarters.[^7][^45]
    - Join: Review‑call transcripts show increasing mentions of confusion about strategy, unmet liquidity needs, or unhappiness with volatility; WhatsApp chats show repeated basic queries about products; complaint logs show more service/communication issues for that cohort.[^36][^38][^4][^35]
    - Output: LiSN surfaces “HNI cohort X shows early attrition risk driven by unmet communication and suitability reassurance”, tagged by RM/EWM and region, which existing dashboards cannot do because they see flows but not why.
- **WhatsApp queries ↔ holdings and suitability.**
    - Cohort: UHNI clients using the Nuvama Private WhatsApp chatbot heavily to query structured products and PMS performance.[^10][^35][^33]
    - Join: High frequency of “guaranteed returns” or “principal protection” questions, plus bot escalations to RMs; book data shows concentrated exposure to complex products and leveraged positions.[^42][^43][^41]
    - Output: LiSN flags cohorts where interaction themes suggest misunderstanding of risk relative to holdings—supporting CRO and Compliance in suitability oversight.
- **Complaint themes ↔ AUM at risk.**
    - Cohort: clients with repeated complaint categories (e.g. “advice quality”, “documentation gaps”) and SCORES escalations.[^37][^38][^36]
    - Join: Book data shows high AUM concentration and high fee products; NNM stagnates.
    - Output: LiSN shows “AUM at risk segments” where complaint narratives and book profiles align, enabling targeted remediation.
- **Proposal usage ↔ what was said ↔ what got funded.**
    - Cohort: RMs who generate many proposals via CRM/Infinity but show low funding rates and higher subsequent complaint/incidence.[^34][^33]
    - Join: Calls and emails show rushed or incomplete explanation, or heavy push towards manufacturer products; funding and subsequent flows are weak or contentious.
    - Output: LiSN highlights RM/EWM cohorts where proposal‑to‑flow conversion and downstream experience are misaligned, powering supervision and coaching.

**Slices LiSN must analyse across.**

The panel agrees LiSN’s core analytical grain should be **client segment × RM/EWM/Market‑Head/branch/region × product cluster × channel × tenure**, with DPDP‑aligned cohort‑level joins rather than client‑identity‑level outputs.[^39][^11]

***

## C — What they can see that other platforms cannot

### C1 Incumbent platforms and their blind spot

**1. GreyLabs‑style speech analytics**

- **Strengths.** BFSI‑tuned speech‑to‑text, QA scoring, sentiment analysis and detection of sales and collection opportunities on 100% of analysed calls; ability to cover chats and emails where integrated.[^5][^4]
- **Gaps.**
    - Works primarily on **interaction corpus**, not on the wealth book; it does not natively join calls to holdings, NNM, product mix or suitability records.
    - Its “revenue opportunity” flags are not calibrated to Nuvama’s ARR yield, MPIS penetration or mis‑selling risk frameworks.
- **Touchpoints.** Interaction corpus (voice, possibly chat/email); no direct book view and no cohort‑level P\&L join.

**2. Nuvama One CRM and RM/EWM dashboards**

- **Strengths.** Strong lead management, pipeline tracking, RM productivity views and team hierarchy; centralised CRM view for wealth RMs.[^11][^34]
- **Gaps.**
    - Limited insight into what was actually said in calls, WhatsApp or emails; notes are patchy and not corpus‑level.
    - No unified view of sentiment or complaint themes across channels by cohort.
- **Touchpoints.** Book and activity side; minimal interaction‑corpus insight.

**3. Infinity and portfolio/solutions tools**

- **Strengths.** High‑quality PMS/MPIS book, performance analytics and portfolio insights, with client‑facing apps for real‑time access.[^10][^33]
- **Gaps.**
    - Deep book visibility but very little structured capture of interaction narratives and suitability conversations.
- **Touchpoints.** Book only.

**4. WhatsApp chatbot and digital journeys**

- **Strengths.** Convenient servicing for Nuvama Private clients, access to portfolio and capital‑growth reports, potentially high engagement and self‑service.[^35]
- **Gaps.**
    - Chat logs are not systematically joined to complaints, calls or book shifts.
    - No cohort‑level analysis of query themes vs holdings and risk.
- **Touchpoints.** Engagement side (WhatsApp and digital), not book.

**Panel conclusion.**

All four panelists agree: **every existing tool sits on only one side of the divide—interaction, or book, or CRM—but none joins them in a regulated, cohort‑level, AI‑marked way.** This is LiSN’s differentiation wedge.

***

### C2 LiSN outputs – joins, owners, evidence and incumbency

Below, each proposed LiSN output includes: the underlying join, its primary stakeholder owner from Section A, what evidence it surfaces, and whether incumbents can already produce it.

#### 1. Silent‑attrition and NNM‑leak early warning

- **Join.** Interaction sentiment and complaint themes (calls, WhatsApp, emails, SCORES) ↔ NNM and AUM trajectories by cohort (segment × RM/EWM × region × tenure)..[^38][^36][^37][^45][^7][^35][^11]
- **Stakeholder owner.** Head, Nuvama Wealth (HNI) and Market Heads, with CX as corpus owner and CRO overseeing risk framing.
- **Evidence.**
    - Rising “confusion / unmet expectation” tags in calls and chats.
    - Increasing complaint frequency and severity.
    - Slowing NNM and rising redemptions for the same cohorts.
- **Incumbent coverage.**
    - RM dashboards show NNM trends but not joined to unified sentiment and complaint themes.
    - GreyLabs can show negative sentiment in calls but not calibrated to book trajectories or complaint statistics.
    - **Panel consensus:** LiSN’s specific join is **not** something existing Nuvama tools can already produce.


#### 2. Suitability and mis‑selling surveillance across 100% advice

- **Join.** Presence/absence and quality of mandated suitability and risk‑profiling conversations (language patterns in calls, emails, WhatsApp) ↔ product mix, risk profile and complaint disputes, at cohort level under SEBI IA/PMS norms.[^43][^41][^42][^47][^35][^10]
- **Stakeholder owner.** CRO and Compliance, with Advisor‑line P\&L owners (Wealth/Private) sharing responsibility.
- **Evidence.**
    - Interaction tags for key IA obligations (risk profiling, explanation of product features and risks, avoidance of guaranteed‑return promises)..[^41][^47]
    - Clusters of high‑risk product sales (PMS, derivatives, structured credit) with weak evidence of suitability conversations and above‑average complaint incidence.
- **Regulatory value.**
    - Directly supports SEBI IA and PMS expectations on suitability, conflict of interest and record‑keeping; aligns with AMFI’s mis‑selling concerns.[^42][^43][^41]
    - Provides a transparent, cohort‑level AI tool aligned with SEBI’s consultation on responsible AI/ML use rather than opaque robo‑advice.[^44][^40]
- **Incumbent coverage.**
    - GreyLabs can tag certain phrases but is not configured to regulatory suitability frameworks or book joins.
    - Compliance systems track documentation but not interaction narratives across all channels.
    - **Panel view:** This is a **new capability**, so long as LiSN stays advisory (no auto‑blocking) and DPDP‑compliant.[^39]


#### 3. RM and EWM productivity and coaching intelligence

- **Join.** Interaction quality (advice‑clarity, responsiveness, client understanding) and cadence ↔ RM/EWM productivity (NNM, ARR yield, share of wallet) and complaint rates, by RM/EWM and Market Head cohorts.[^1][^4][^36][^5][^38][^7][^11]
- **Stakeholder owner.** Market Heads, Head Nuvama Wealth, CX and supervision jointly.
- **Evidence.**
    - RM/EWM cohorts with high advice‑quality and cadence tags and strong NNM/ARR outcomes; cohorts with low advice‑quality tags and higher attrition or complaint incidence.
- **Incumbent coverage.**
    - RM dashboards and CRM show productivity and activity but not systemic advice‑quality metrics across multiple channels.
    - GreyLabs can score calls per agent, but does not tie these scores to book outcomes or integrate WhatsApp/email behaviour; and is call‑centric.
    - **Panel view:** LiSN is incrementally differentiated here because of its multi‑channel, cohort‑join and multi‑audience framing.


#### 4. Proposal‑to‑flow conversion and mis‑match detection

- **Join.** Proposal generation and content (from CRM and portfolio tools) ↔ subsequent funded flows, complaint themes and call/email narratives about those proposals.[^4][^36][^5][^45][^38][^33][^34]
- **Stakeholder owner.** Head Nuvama Wealth, Product \& Advisory, Market Heads and CX.
- **Evidence.**
    - RMs/EWMs with high proposal issuance but weak funding and higher “pushy sales” complaint language.
    - Templates or product types that consistently underperform or generate post‑sale confusion.
- **Incumbent coverage.**
    - CRM and Infinity can show proposals and flows, but do not attach interaction narratives to them.
    - GreyLabs may flag sales opportunities but not “proposal mismatch” across the life‑cycle.
    - **Panel view:** LiSN adds unique value by tracking proposals end‑to‑end across corpus and book.


#### 5. Root‑caused NPS and complaint movement

- **Join.** NPS scores and survey verbatims, plus complaint categories and SCORES/SMART ODR data ↔ book and interaction patterns for the same cohorts.[^36][^37][^38]
- **Stakeholder owner.** CX leadership, with CEO and CRO as key consumers.
- **Evidence.**
    - Which themes—e.g. “too many product switches”, “poor explanation of risk”, “digital friction”—drive NPS down and complaint volume up in specific segments and regions.
- **Incumbent coverage.**
    - CX currently sees NPS and complaints but not joined to corpus‑wide interaction themes and book characteristics; GreyLabs may supply sentiment, but not full CX‑to‑P\&L joins.
    - **Panel view:** LiSN is differentiated here through multi‑source causal mapping.


#### 6. Multi‑audience lens (CEO, CRO, CX, CIO, Market Heads, RMs)

- **Join.** The same underlying interaction↔book signals, cut and framed differently per audience.
- **Stakeholder owner.** All anchors identified in Section A.
- **Evidence.**
    - CEO view: segment‑level tiles for NNM‑risk, mis‑selling‑risk and CX‑risk.
    - CRO view: suitability and mis‑selling clusters, with evidence trails.
    - CX view: corpus‑level themes driving NPS and attrition.
    - Market Head view: RM/EWM cohorts with coaching and supervision priorities.
- **Incumbent coverage.**
    - Existing tools provide siloed views (P\&L, risk, CX, tech), but not a shared model of “what interactions mean for book and compliance” with AI marked, cohort‑level joins.
    - **Panel view:** This multi‑audience framing is LiSN’s structural differentiation.

Across all outputs, LiSN strictly maintains its boundary: it owns the interaction corpus, consumes book feeds under CIO/CRO control, works at cohort level, never auto‑fires actions, marks all AI components, and keeps a full audit trail—aligning with DPDP and SEBI’s emerging AI/ML rules.[^40][^44][^39]

***

## Synthesis

### Three highest‑impact, least‑served needs

The panel converges on three Nuvama needs that are both high‑impact and under‑served by current tools:

1. **Cohort‑level early warning of NNM leaks and silent attrition rooted in interaction and complaint patterns, not just market moves.** RM/EWM dashboards and GreyLabs can separately see flows or sentiment, but cannot jointly show “this segment’s narrative is turning negative and money is starting to leave”.[^5][^38][^1][^7][^4][^36]
2. **Systematic suitability and mis‑selling surveillance across 100% advice interactions, joined to product books and complaint data, under SEBI IA/PMS and AMFI norms.** Existing frameworks rely on documentation and sample QA; they do not distil the full interaction corpus into risk signals that are cohort‑level, auditable and AI‑marked.[^47][^43][^44][^41][^42][^40]
3. **RM/EWM and team‑coaching intelligence that unifies interaction quality, book outcomes and complaint experience into targeted, multi‑audience views (Market Heads, CX, CRO and P\&L owners).** Current RM dashboards show productivity, and GreyLabs scores calls, but neither gives an integrated “who needs what intervention, and why” view.[^38][^4][^36][^5][^11][^34]

### One‑line wedge – why LiSN wins

LiSN / Fluid CX is the **interaction‑intelligence layer above Nuvama’s channels and book that joins what clients and RMs said, across every channel, to what happened to their money and the RM’s book—at cohort level, DPDP‑compliant and AI‑marked—in ways neither call‑analytics nor portfolio dashboards are designed to do.**[^4][^5][^10][^33][^40][^34][^39]

### Anchor stakeholder and beachhead arm (tested hypothesis, with tension)

- **Panel majority (Buyer lens + PM + AI architect):**
    - **Anchor P\&L seat:** Head, Nuvama Wealth (HNI), because scale (~1.1–1.3k RMs and thousands of EWMs) and relatively standardised products make cohort‑based interaction↔book joins tractable and commercially meaningful.[^1][^11]
    - **Anchor CX seat:** National Head Client Experience / Head Client Experience Office, as the corpus owner.[^27][^28][^38]
    - **Beachhead arm:** HNI Wealth first, then extend to Private once precision and governance patterns are proven.
- **Regulator adviser (minority view):**
    - Prefers **Nuvama Private** as initial sponsor for suitability/mis‑selling use‑cases, arguing that UHNI disputes, PMS overhauls and complex products will draw early SEBI attention; however, accepts that demos may use HNI cohorts for data‑density reasons before full UHNI deployment.[^46][^43][^42]


### Demo opening – landing the GreyLabs gap the CIO already feels

A one‑line demo opening the panel recommends for the CIO/CXO room:

> “You already use speech‑analytics to hear what was said on your calls; today we will show, on your own wealth and private books, what those conversations **mean** for your net‑new‑money, suitability risk and client attrition at cohort level—and why none of your current dashboards or QA tools can make that join under DPDP and SEBI’s AI rules.”[^44][^7][^5][^40][^1][^4][^39]

This opening explicitly respects LiSN’s boundary (no lakehouse ownership, no auto‑fire, AI‑marked outputs) and invites the CIO, CX and P\&L owners into the same problem: the missing interaction‑to‑book join that LiSN is designed to distil.
<span style="display:none">[^48][^49][^50][^51][^52][^53][^54][^55][^56][^57][^58][^59][^60][^61][^62][^63][^64][^65][^66][^67]</span>

<div align="center">⁂</div>

[^1]: https://www.nuvama.com/wp-content/uploads/2025/08/Corporate-Overview_Aug25.pdf

[^2]: https://www.nuvama.com/wp-content/uploads/2025/08/Nuvama_Investor-Presentation_Q1-FY-25-26.pdf

[^3]: https://www.icra.in/Rating/GetRationalReportFilePdf?Id=138544

[^4]: https://yourstory.com/2024/08/greylabs-ai-bets-on-genai-speech-analytics-accurate-insights

[^5]: https://m.thewire.in/article/ptiprnews/neysa-and-greylabs-ai-collaborate-to-bring-complete-voice-coverage-compliance-insight-and-conversion-at-enterprise-scale

[^6]: https://www.icra.in/Rating/GetRationalReportFilePdf?id=136120

[^7]: https://www.careratings.com/upload/CompanyFiles/PR/202407140733_Nuvama_Wealth_Management_Limited.pdf

[^8]: https://en.wikipedia.org/wiki/Nuvama_Group

[^9]: https://www.screener.in/company/NUVAMA/consolidated/

[^10]: https://www.linkedin.com/posts/nuvama-private_infinity-core-activity-7467866050118807552-fBg0

[^11]: https://www.nuvama.com/wp-content/uploads/2026/05/SE_InvestorPPT.pdf

[^12]: https://www.nuvama.com/media-archive/press-releases/nuvama-wealth-management-limited-lists-on-the-stock-exchanges/

[^13]: https://www.privatebankerinternational.com/news/pag-exploring-options-for-nuvama/

[^14]: https://www.youtube.com/watch?v=U9Cfr5ISH2M

[^15]: https://www.nuvama.com/about-us/

[^16]: https://www.bloomberg.com/profile/person/7076318

[^17]: https://www.zoominfo.com/p/Alok-Saigal/6920053318

[^18]: https://www.linkedin.com/in/aloksaigal1

[^19]: https://in.linkedin.com/company/nuvama-private

[^20]: https://www.linkedin.com/in/harsh-jha-3a9b355

[^21]: https://www.linkedin.com/in/aahuja

[^22]: https://www.nuvama.com

[^23]: https://www.linkedin.com/in/anshukapoor

[^24]: https://www.investywise.com/nuvama-wealth-management-key-leadership-change-investment-update/

[^25]: https://www.zoominfo.com/p/Keyur-Ajmera/2019843610

[^26]: https://www.linkedin.com/in/praveen-kumar-k-3a5764b

[^27]: https://www.linkedin.com/in/dattattray-desai-6b595346

[^28]: https://partners.nuvamawealth.com/Career.aspx

[^29]: https://partners.nuvamawealth.com/AboutUs.aspx

[^30]: https://www.linkedin.com/in/sandeep-chakraborti-83a8981ab

[^31]: https://www.linkedin.com/in/saurabh-rungta-0457753

[^32]: https://contactout.com/Saurabh-Rungta-89970898

[^33]: https://play.google.com/store/apps/details?id=com.wealthspectrum.wealth.edelwm\&hl=en

[^34]: https://apps.apple.com/in/app/nuvama-one/id6475937874

[^35]: https://www.linkedin.com/posts/nuvama-private_nuvama-privates-latest-whatsapp-integrated-activity-7247974837632040961-COh3

[^36]: https://www.nuvama.com/wp-content/uploads/2025/07/Clean_Grievance-Policy_July_2025-2.pdf

[^37]: https://investor.sebi.gov.in/securities-resolvedispute.html

[^38]: https://www.nuvamaprivate.com/complaint-resolution-report/

[^39]: https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf

[^40]: https://www.sebi.gov.in/reports-and-statistics/reports/jun-2025/consultation-paper-on-guidelines-for-responsible-usage-of-ai-ml-in-indian-securities-markets_94687.html

[^41]: https://investor.sebi.gov.in/investment_advisor.html

[^42]: https://www.venturasecurities.com/blog/sebis-2026-pms-overhaul-a-turning-point-for-the-industry/

[^43]: https://www.amfiindia.com/uploads/AMFI_Master_Cicular_for_MF_Ds_3c7f5ee44f.pdf

[^44]: https://www.aarnalaw.com/insights/sebis-new-digital-compliance-rules-what-investment-advisers-must-know-in-2026

[^45]: https://www.nuvama.com/wp-content/uploads/2024/05/Investor-Presentation.pdf

[^46]: https://www.hubbis.com/article/how-nuvama-private-is-connecting-indian-wealth-to-global-opportunity-and-global-capital-to-india

[^47]: https://www.sebi.gov.in/sebi_data/attachdocs/may-2026/ORDER_1779864043.pdf

[^48]: https://partners.nuvamawealth.com/BranchLocator.aspx

[^49]: https://www.facebook.com/NuvamaWealth/videos/at-nuvama-wealth-every-platform-we-design-is-built-to-make-investing-simpler-sma/1065948342283298/

[^50]: https://www.nuvamawealth.com

[^51]: https://in.linkedin.com/company/nuvama-group

[^52]: https://au.finance.yahoo.com/quote/NUVAMA.NS/profile/

[^53]: https://www.nuvamaassetservices.com/Home/WHOWEARE

[^54]: https://www.linkedin.com/in/ashish-kehair-3670189

[^55]: https://www.zoominfo.com/p/Ashish-Kehair/1240318821

[^56]: https://rocketreach.co/ashish-kehair-email_9606791

[^57]: https://www.youtube.com/watch?v=z_Gyka_D3dQ

[^58]: https://manus.im/tools/ai-proposal-maker

[^59]: https://www.nuvamaprivate.com

[^60]: https://www.amcbridge.com/technology-demos/labs/ai-proposal-generator

[^61]: https://www.linkedin.com/posts/nuvama-wealth_fraudalert-activity-7244340558398148608-TXv9

[^62]: https://www.linkedin.com/in/madhur-b-9a2296144

[^63]: https://www.cervinfamilyoffice.com/clever-mechanics-that-sidestep-the-sebi-rules-for-ias/

[^64]: https://www.instagram.com/reel/DXrA7BEDtsx/

[^65]: https://vinodkothari.com/2025/12/every-business-is-a-data-business-applicability-of-dpdp-act-to-non-financial-entities/

[^66]: https://in.linkedin.com/company/nuvama-wealth

[^67]: https://sarthaklaw.com/sebi-update-guidelines-for-investment-advisers/

