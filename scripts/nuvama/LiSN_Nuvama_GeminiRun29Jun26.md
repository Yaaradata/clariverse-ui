# **LiSN / Fluid CX at Nuvama: Stakeholder, Data, and Output Architecture**

The following research report represents the synthesis and consensus of a four-person expert panel, comprising an AI Architect specialising in wealth data and conversation intelligence, a Buyer’s Dual Lens representing the tension between the P\&L and Client Experience seats, a Senior Product Manager for LiSN / Fluid CX, and an Indian Regulation and Investor-Protection Adviser. The analysis meticulously maps the deployment architecture of LiSN within Nuvama Group, evaluating the stakeholder cluster, the underlying data taxonomy, and the highly differentiated analytical outputs the platform can generate.  
Throughout the evaluation, the panel surfaces internal disagreements regarding technical feasibility, commercial prioritisation, and regulatory boundaries. The analysis operates strictly within the defined LiSN boundary: the system consumes the book and owns the interaction corpus at full coverage, but it never assumes ownership of the primary data lakehouse. It operates exclusively via cohort-level joins rather than identity-level mapping, never auto-fires operational actions (instead drafting intelligence for human approval accompanied by comprehensive audit logs), and explicitly marks all artificial intelligence elements to comply with the Securities and Exchange Board of India (SEBI) mandates. Where current sources fail to confirm executive titles, platform names, or metrics, the panel flags these gaps in plain language to avoid the invention of facts.

## **Section A — Who to Target**

The procurement and operational deployment of an interaction-intelligence layer at a financial institution of Nuvama's scale does not rely on a single portfolio owner. Nuvama Group oversees approximately ₹4.6 trillion in client assets as of June 2025, supported by a workforce of over 3,400 employees and a network of roughly 7,000 External Wealth Managers (EWMs)1. The firm divides its core wealth operations between Nuvama Wealth, which caters to affluent and High-Net-Worth (HNI) individuals, and Nuvama Private, which serves Ultra-High-Net-Worth (UHNI) individuals and family offices2. Selling LiSN requires mapping the metrics, trajectories, and operational blind spots of the executives who govern these specific divisions, extending far beyond the traditional Client Experience or Product headers.

### **A1 · Economic / P\&L Buyers**

The ultimate economic signers are the executives who carry the revenue targets and manage the massive distribution networks. For Nuvama, this requires penetrating the leadership of both the mass-affluent/HNI business and the UHNI private banking division.  
**Rahul Jain, President & Head, Nuvama Wealth (HNI/Affluent)** Rahul Jain commands the mass-affluent and HNI business, encompassing the \~1,200 internal Relationship Managers (RMs), the expansive \~7,000 EWM partner network, and the broader retail distribution architecture1. His primary objective is driving Net New Money (NNM) and migrating transactional revenue into Annual Recurring Revenue (ARR) through Managed Products & Investment Solutions (MPIS).  
His performance is measured on the penetration of MPIS, which currently constitutes over 54% of segment revenues and experienced a 59% year-over-year growth in Q1 FY265. Jain is also heavily focused on RM productivity and maintaining an optimal cost-to-income ratio, which currently hovers around 55%5. The questions he asks revolve around conversion: Which RM conversational behaviours consistently drive MPIS funding? Why do specific branches leak NNM to competitors despite offering identical investment solutions? This requires cross-system stitching between the Customer Relationship Management (CRM) notes, the telephony transcripts, and the core portfolio management systems.  
As the P\&L anchor for the high-volume wealth division, LiSN matters to Jain because manual supervision breaks down at the scale of 1,200 RMs and 7,000 EWMs. He currently relies on the core CRM, the MARS advisory platform, and traditional RM dashboards6. These tools accurately display what was sold, but they possess a critical blind spot: they cannot reveal the conversational friction, the specific client objections, or the misaligned value propositions that preceded a lost sale.  
**Alok Saigal, President & Head, Nuvama Private (UHNI & Family Office)** Alok Saigal governs the UHNI wealth segment, overseeing family office services, wealth structuring, estate planning, and the in-house "Infinity" portfolio platform1. His economic calculus differs significantly from the mass-affluent side.  
Saigal’s key performance indicators centre on ARR yield, which is growing at 25% year-over-year and contributes 66% of total Private segment revenues5. Client and family attrition is a critical metric; with a base of 4,400+ of India's wealthiest families, retaining multi-generational capital is paramount1. He also focuses on share of wallet, aiming to consolidate fragmented family wealth into the Infinity platform. Saigal asks qualitative questions: Are the Senior Managing Partners effectively communicating institutional governance structures during periodic portfolio reviews? What underlying anxieties are patriarchs expressing verbally that are not being formally logged in the CRM?  
As the P\&L anchor for the ultra-high-margin division, LiSN is vital to Saigal because UHNI attrition is rarely abrupt. It is typically preceded by subtle conversational cues regarding dissatisfaction with risk exposure, service responsiveness, or macroeconomic anxieties11. Saigal relies heavily on the Infinity platform and Nuvama's proprietary nu-AI platform, launched in 2025 to assist RMs with institutional knowledge and meeting preparation11. However, while nu-AI assists RMs before the meeting, it cannot evaluate the actual execution of the conversation or correlate the client's verbal feedback with subsequent capital retention or flight.  
**Ashish Kehair, Managing Director & CEO, Nuvama Group** As the chief executive and primary sponsor, Ashish Kehair owns the consolidated entity, its overall strategic direction, and its public market performance following the September 2023 listing1. His primary metrics are total AUM (roughly ₹4.6 trillion), consolidated Profit After Tax (PAT), and overall Return on Equity (RoE), which currently exceeds 30%5. Kehair acts as the ultimate executive sponsor, requiring assurance that technology investments directly support scale, resilience, and compliance across the enterprise9.

### **A2 · Technical Champions**

The technical cluster holds the keys to the infrastructure. They evaluate whether a new platform can integrate securely without violating Nuvama's cloud architecture, data residency requirements, and security postures.  
**Harsh Jha, Group Head of Technology / CTO** Harsh Jha owns the enterprise IT infrastructure, cloud architecture, cybersecurity, and vendor ecosystem management13. His performance is measured by system uptime, infrastructure cost optimisation, security compliance, and deployment velocity. He has recently overseen major modernisations, including the implementation of Oracle Fusion Cloud ERP and the deployment of Netenrich Adaptive MDR for the Security Operations Center (SOC)14.  
As a technical champion, LiSN appeals to Jha because it aligns with his mandate for secure, cloud-native solutions. More importantly, LiSN's architectural boundary—specifically that it consumes the book but never owns the lakehouse—mitigates his data residency and security concerns13. Currently, Jha manages a fragmented vendor ecosystem, including GreyLabs AI for transcription14. He requires an intelligence layer that can seamlessly ingest outputs from these existing vendors via API without requiring a massive architectural overhaul.  
**The Head of AI (Name Currently Unconfirmed)** Nuvama operates a Digital and AI Centre of Excellence, which explores agentic AI workflow solutions, commercial tools like Cursor, and LLMs such as Amazon Q, GitHub Copilot, and Anthropic's Claude19. The specific executive leading this division represents a critical junction in the procurement process.  
*Panel Disagreement:* The Senior PM argues that this role is a natural technical champion, eager to adopt advanced conversational intelligence to supplement their existing AI initiatives. Conversely, the Buyer's Dual Lens cautions that internal AI leaders often exhibit a "build versus buy" bias, viewing third-party AI applications as a threat to their own developmental mandates19. To secure this stakeholder, LiSN must be positioned strictly as an application layer that leverages and enriches the internal data infrastructure, rather than attempting to replace the foundational models the internal team is already building.  
**Deepak Shah, Senior Vice President, Enterprise Applications** Deepak Shah owns the core enterprise applications, having recently managed the rollout of Oracle Fusion Financials to automate tedious processes and gain real-time insights16. He occupies a technical routing seat, ensuring that LiSN's API endpoints are compatible with Nuvama's core financial and reporting systems.

### **A3 · Routing Seats and Compliance Blockers**

Operational implementation and regulatory approval depend on a network of regional leaders and compliance executives who can either accelerate or block the deployment.  
**Regional Market Heads / Senior Managing Partners** This group includes executives such as Sandeep Chakraborti (South & East), Vivek Jain (Maharashtra & Gujarat), Priyanshu Gaurav (West-2), and Amit Saxena (North)20. They own the regional RM teams, branch profitability, and local client relationships. Their KPIs include regional NNM targets, RM attrition rates, and MPIS sales quotas. They occupy operational routing seats and would be the daily consumers of LiSN's analytical outputs regarding RM coaching, regional productivity, and localized client sentiment.  
**Saurabh Rungta, CIO & Senior Managing Partner, Nuvama Private** Saurabh Rungta oversees product due diligence, model portfolios, asset allocation strategy, and compliance with regulatory requirements within the Private wealth division22. His metrics revolve around portfolio alpha, risk-adjusted returns, and product uptake. He acts as a key influencer who needs to understand if clients are rejecting specific investment strategies due to fundamental market fear or due to poor articulation by the RM during the advisory process.  
**Santosh Pandey, President & Head, Professional Clients Group (PCG)** Santosh Pandey leads the broking and trading-led segment of the business1. He occupies a routing seat focused on margin trading facilities, execution speed, and high-frequency client interactions, representing a distinctly different conversational profile than the long-term advisory dialogues of the Private wealth division.  
**Keyur Ajmera, Group Chief Risk Officer (Effective Feb 2026\)** Keyur Ajmera, assuming the role of Group CRO, oversees enterprise risk management, operational risk, and fraud detection23. His KPIs include risk exposure limits, audit findings, and regulatory penalty avoidance. He occupies an economic blocker seat. Ajmera will meticulously evaluate whether LiSN introduces new operational risks, data leakage vulnerabilities, or adequately surveils existing risks within the RM network.  
**Dr. Dinesh Soni, Group Head \- Compliance (Effective Oct 2025\)** Dr. Dinesh Soni brings extensive experience from the National Stock Exchange (NSE) and SEBI to oversee regulatory adherence and compliance frameworks at Nuvama26. His performance is measured by the management of SEBI SCORES escalations, the prevention of mis-selling incidents, and suitability audit pass rates.  
Soni is a critical routing seat and potential compliance blocker. The regulatory landscape in India is tightening significantly. SEBI's 2026 overhaul of Portfolio Management Services (PMS) heavily targets distributor mis-selling, demanding stringent suitability assessments29. Furthermore, SEBI’s recent Investment Adviser (IA) rules on Artificial Intelligence (issued Dec 2024/Jan 2025\) mandate that entities using AI tools are solely responsible for data security, client confidentiality, and the accuracy of the advice, requiring explicit disclosures to clients30. LiSN matters to Soni because it provides the auditability required by SEBI, but he must be convinced that the platform's "human-in-the-loop" drafting architecture limits Nuvama's autonomous AI liability.  
**The Client Experience Head (Name Currently Unconfirmed)** While the exact name of the CX Head is unconfirmed in the current public corpus (grievances route to ceosoffice@nuvama.com33), this executive owns the Voice of the Customer, grievance redressal, and overall service quality. Their metrics include Net Promoter Score (NPS), Complaint Turnaround Time (TAT), and grievance escalation ratios. This is the native CX buyer seat, seeking to understand the root causes of client dissatisfaction before they escalate to formal SEBI complaints.

| Stakeholder Name | Role / Ownership | Primary KPIs & Trajectory | Seat Type |
| :---- | :---- | :---- | :---- |
| **Rahul Jain** | President & Head, Nuvama Wealth (Mass-affluent, HNI, \~1,200 RMs, EWMs) | NNM; MPIS penetration (growing at 59% YoY); RM Productivity. | Economic / P\&L Anchor |
| **Alok Saigal** | President & Head, Nuvama Private (UHNI, Family Office, Infinity platform) | ARR Yield (contributing 66% to revenue); Client Attrition; Share of Wallet. | Economic / P\&L Anchor |
| **Ashish Kehair** | MD & CEO, Nuvama Group | Total AUM (₹4.6T); Consolidated PAT; RoE (\>30%). | Executive Sponsor |
| **Harsh Jha** | Group Head of Technology / CTO | System uptime; Cloud integration velocity; Security compliance. | Technical Champion |
| **Unconfirmed** | Head of AI / Digital Centre of Excellence | Internal LLM adoption; Tool latency; Innovation deployment. | Technical Champion / Blocker |
| **Regional Heads** | Market Heads (Sandeep Chakraborti, Vivek Jain, Priyanshu Gaurav, Amit Saxena) | Regional NNM targets; RM attrition; Local market share. | Operational Routing Seats |
| **Dr. Dinesh Soni** | Group Head \- Compliance (from Oct 2025\) | SEBI SCORES escalations; Mis-selling incidents; Suitability audit rates. | Compliance Blocker |
| **Unconfirmed** | Head of Client Experience | NPS (\~77); Complaint TAT; First-call resolution. | Native CX Buyer |

### **The Anchors and the Wedge**

The procurement dynamic at Nuvama reveals two fundamental anchors: the **P\&L/Book Seat** (jointly held by Rahul Jain for Wealth and Alok Saigal for Private) and the **Native CX Buyer** (the Client Experience Head).  
Any hypothesis suggesting that a call-analytics tool can be sold solely to the CX Head is fundamentally flawed in the wealth management domain. The wedge for LiSN is the operational join between these two specific seats. Currently, Nuvama treats client satisfaction and revenue generation as separate reporting silos. LiSN sits across this seam, translating qualitative conversational data (traditionally a CX metric) into leading indicators of AUM retention, RM productivity, and MPIS funding (hard P\&L metrics). By demonstrating how conversational empathy directly drives Net New Money, LiSN converts a CX expenditure into a revenue-generating asset, thereby securing the P\&L owners as the ultimate economic signers.

## **Section B — What Data to Collect and Analyse**

To function as the interaction-intelligence layer without violating its architectural boundaries, LiSN must aggregate, standardise, and analyse disparate data streams. The data architecture is organised into four distinct buckets, strictly adhering to the principle that LiSN consumes the book and owns the interaction corpus, but never owns the central lakehouse.

### **B1 · RM Data**

* **What it is:** The digital footprint and operational exhaust of the RM workforce.  
* **Where it lives:** The central CRM (such as Salesforce Financial Services Cloud or Oracle equivalents), human resources platforms, and Nuvama's proprietary proposal generation engines like nu-AI and the MARS platform11.  
* **What it reveals:** This bucket encompasses metadata on RM–client advisory and review calls, RM free-text CRM notes, the usage frequency of portfolio-solutions tools, RM productivity metrics, pipeline velocity, and daily activity logs. Crucially, analysing this data reveals the frequent disparity between what an RM logs in the CRM system and the actual reality of the interaction.

### **B2 · Private-Banking / Wealth-Team Data**

* **What it is:** The structural hierarchy and aggregated performance metrics of the wealth management divisions.  
* **Where it lives:** Core banking systems, HR mapping, and enterprise performance management dashboards.  
* **What it reveals:** It maps the complex network of \~7,000 EWM partners1 and the internal reporting structures rolling up to Regional Market Heads. It details individual team books, NNM generation by specific teams, and the attrition rates of both RMs and EWMs. This data is essential for contextualising an individual operator's performance against regional or national benchmarks.

### **B3 · Customer-Interaction Data (The Corpus LiSN Owns)**

* **What it is:** The comprehensive, omnichannel Voice of the Customer, representing full coverage of all unstructured client communications.  
* **Where it lives:** Telephony servers, digital communication gateways, customer support infrastructure, and the formal grievance registry.  
* **What it reveals:** This bucket forms the core corpus that LiSN will own and standardise. It includes recorded RM advisory calls, WhatsApp-bot chat logs, messaging from the Nuvama app and the Infinity portal35, inbound service calls, the SEBI SCORES complaint registry, NPS survey verbatims, and email correspondence.  
* *Incumbent Context:* Nuvama currently deploys GreyLabs AI, an agentic voice AI vendor, to capture and transcribe telephony data18. However, GreyLabs operates largely as a siloed transcription and basic QA tool. LiSN must ingest this transcription corpus, standardise it, and fuse it with text-based channels to form a unified, omnichannel interaction corpus.

### **B4 · Existing-Platform / Book Data (LiSN Consumes, Never Owns)**

* **What it is:** The hard financial reality of the client's relationship with the firm.  
* **Where it lives:** Nuvama's central data lakehouse, custody and clearing systems, and the Infinity/MARS platforms.  
* **What it reveals:** This data feeds the RM/EWM dashboards and the portfolio-solutions tools. It details the MPIS and Infinity book (comprising specific holdings, asset allocation, and product mix), Net New Money flows, ARR-yield trajectories, broking and custody transaction logs, the highly sensitive Loan Against Shares (LAS) book38, and the critical suitability and KYC records required by SEBI39.

| Data Bucket | Description & Origin | Primary Systems of Record | Analytical Value |
| :---- | :---- | :---- | :---- |
| **B1: RM Data** | Operational exhaust of the workforce. | CRM, nu-AI platform, MARS. | Reveals the gap between logged notes and actual advisory effort. |
| **B2: Wealth-Team Data** | Structural hierarchy and team metrics. | HR systems, Performance Dashboards. | Contextualises individual performance against regional benchmarks. |
| **B3: Customer-Interaction Data** | Unstructured Voice of the Customer. | Telephony (via GreyLabs), WhatsApp, App, SEBI SCORES. | Captures raw sentiment, objections, and compliance adherence. |
| **B4: Book Data** | Financial reality of the client. | Core Lakehouse, Custody systems, Infinity platform. | Provides the ultimate P\&L truth: AUM flows, holdings, and yields. |

### **The Join That Matters Most: Interaction ↔ Book**

The fundamental differentiation of LiSN lies in executing the join that no current Nuvama tool makes: mathematically connecting **what the client said** (B3) to **what happened to their money and the RM's book** (B4).  
*Panel Disagreement on Join Methodology:* The Senior PM strongly advocates presenting these joins at the individual identity level, arguing that Market Heads require granular data to micromanage specific RMs and intervene on specific client accounts. The Regulation and Investor-Protection Adviser strictly overrules this approach. Under India's Digital Personal Data Protection (DPDP) Act 2023, the processing of personal data requires explicit, informed, and revocable consent, and minimizing identity exposure is a legal imperative40. Furthermore, the Consent Manager framework under DPDP mandates strict purpose limitation and auditability42. The panel consensus enforces the LiSN boundary: all interaction-to-book joins must be executed and presented exclusively at the **cohort level**, eliminating individual privacy exposure while preserving macro-level strategic intelligence.  
*Concrete Examples of the Join:*

1. **Review-Call Sentiment ↔ Slowing NNM and Redemptions:** An RM conducts a quarterly portfolio review via telephony. The transcription (B3) reveals the client expressing repeated frustration over high management fees or underperformance in a specific debt mutual fund. Three weeks later, the book data (B4) reflects halted Systematic Investment Plans (SIPs) and a partial redemption. The join proves that fee-sensitivity in verbal interactions is a leading indicator of AUM leakage.  
2. **WhatsApp Queries ↔ Holdings and Suitability:** A client frequently messages the WhatsApp bot (B3) asking basic questions about capital protection and liquidity. However, their portfolio holdings (B4) show a high concentration in illiquid, high-risk alternative investment funds (AIFs) or structured products. The join instantly flags a severe suitability mismatch, triggering a compliance review before regulatory intervention is required.  
3. **Complaint Themes ↔ AUM at Risk:** The grievance registry logs a spike in complaints regarding delayed reporting from a specific regional branch (B3). LiSN joins this to the team's book (B2, B4) to calculate that ₹450 Crore in AUM is managed by the affected cohort of clients, translating a localized customer service issue into a quantified P\&L risk.  
4. **Proposal Usage ↔ What Was Said ↔ What Got Funded:** An RM generates a multi-asset proposal using the nu-AI tool (B1). LiSN analyses the subsequent call transcript (B3) to verify if the RM successfully articulated the specific "yield plus" strategy44. Finally, it tracks the book (B4) to see if the proposal resulted in funded ARR, mapping the entire funnel from AI-generation to conversational pitch to capital deployment.

### **The Slices LiSN Must Analyse Across**

To provide actionable intelligence that transcends basic reporting, LiSN must slice the joined data across a multidimensional matrix:**Client Segment** (Affluent vs. HNI vs. UHNI / Family Office) × **Operator** (RM vs. EWM vs. Market-Head vs. Branch vs. Region) × **Product** (MPIS vs. AIF vs. LAS vs. Broking) × **Channel** (Telephony vs. WhatsApp vs. App) × **Tenure** (New onboarding vs. 10+ year legacy clients).

## **Section C — What Stakeholders Can See That Other Platforms Cannot**

Nuvama currently operates a highly sophisticated but inherently fragmented technology stack. To justify enterprise procurement, LiSN must generate analytical outputs that the incumbents inherently cannot produce due to their architectural limitations. If an existing dashboard can generate the insight, it does not constitute differentiation.

### **C1 · The Incumbents and Their Blind Spots**

**GreyLabs AI**

* *Strengths:* GreyLabs is an established, well-funded Agentic Voice AI platform in the Indian BFSI sector, providing highly accurate speech-to-text transcription, translation of regional Indian languages, and baseline call Quality Assurance (QA)18. It leverages large language models (LLMs) to monitor agent performance.  
* *Gaps:* GreyLabs is entirely confined to the call/voice side of the divide. It touches the interaction corpus but is completely blind to the book. It can determine if an RM was polite, compliant, and adhered to a script, but it cannot determine if that politeness resulted in a ₹5 Crore AIF allocation. It lacks the financial context to measure outcomes.  
* *Boundary:* Touches the interaction corpus only.

**Nuvama's Dashboards & Portfolio Tools (Infinity / MARS)**

* *Strengths:* These platforms provide impeccable accuracy regarding Net Asset Value (NAV), asset allocation, ARR yields, and historical performance tracking6.  
* *Gaps:* These tools are purely quantitative and retrospective. They display that an outflow occurred yesterday, but they cannot reveal the conversational context, the specific client objections, or the RM's failure to address market anxieties that caused the outflow.  
* *Boundary:* Touches the book only.

**nu-AI / Proposal Generation Tools**

* *Strengths:* Nuvama's proprietary nu-AI platform assists RMs in pre-meeting preparation, generates sophisticated investment proposals, and provides LLM-driven research summaries11.  
* *Gaps:* It operates strictly in the pre-interaction phase. It does not ingest the actual live customer conversation to verify if the generated proposal was well-received, misunderstood, or actively rejected by the client during the pitch.  
* *Boundary:* Touches RM data and book data, but misses the live interaction corpus.

### **C2 · The Differentiated Outputs LiSN Can Give**

Every output proposed below maintains the strict LiSN boundary: it consumes the book, operates exclusively at the cohort level, drafts intelligence for human approval rather than auto-firing actions, and is explicitly marked as AI-generated to satisfy SEBI compliance.  
**1\. Silent-Attrition Early Warning System**

* **The Join:** Call sentiment and interaction frequency (telephony/email) ↔ Login frequency (app/portal) ↔ Paused SIPs/NNM stagnation.  
* **The Owner:** Regional Market Heads (e.g., Vivek Jain, Sandeep Chakraborti) and Alok Saigal (Private).  
* **The Evidence:** Visual dashboards highlighting specific regional or wealth-band cohorts where communication volume has dropped by 40% over 90 days, correlated with halted fresh capital inflows. This indicates a high probability of impending full-book redemption.  
* **Incumbent Differentiation:** GreyLabs cannot see the halted inflows in the custody system; Nuvama's portfolio dashboards cannot see the drop in conversational sentiment or email frequency. LiSN provides the predictive intersection.

**2\. Suitability & Mis-Selling Surveillance (100% Coverage)**

* **The Join:** Transcribed financial advice and risk promises (telephony/WhatsApp) ↔ Client KYC and risk profile (CRM) ↔ Actual executed trades and portfolio concentration (Book).  
* **The Owner:** Dr. Dinesh Soni (Group Head \- Compliance) and Keyur Ajmera (Group CRO).  
* **The Evidence & Regulatory Value:** This output is critical. SEBI's impending 2026 overhaul of PMS regulations heavily targets distributor mis-selling, demanding stringent suitability assessments and evidence-based client communication29. Furthermore, SEBI’s 2024/2025 Investment Adviser rules mandate that AI tools used in advisory services must ensure data integrity, maintain audit logs, and provide full accountability30. LiSN drafts suitability alerts across 100% of interactions—something human auditors cannot physically accomplish—allowing compliance teams to review potential breaches before they escalate to the SEBI SCORES registry.  
* **Incumbent Differentiation:** Trading dashboards only flag concentration risk post-trade; they cannot prove whether the RM adequately explained the risk or promised guaranteed returns during the preceding call.

**3\. Proposal-to-Flow Conversion Analytics**

* **The Join:** nu-AI generated investment proposals ↔ Transcript of the RM pitching the proposal ↔ Subsequent MPIS funding.  
* **The Owner:** Rahul Jain (President & Head, Nuvama Wealth).  
* **The Evidence:** Analysis demonstrating which specific conversational framing of "yield plus" or "alternative assets" results in the highest conversion rates from proposal generation to funded ARR among HNI cohorts.  
* *Panel Disagreement:* The AI Architect warns that attempting to detect "persuasive framing" via Natural Language Processing (NLP) can yield unacceptable false-positive rates. The panel consensus limits this output to tracking explicit mentions of specific product names (e.g., "Infinity Core MF") mapped against the subsequent funding of those exact products.  
* **Incumbent Differentiation:** Proposal tools track generation; GreyLabs tracks the pitch. Only LiSN connects the pitch to the actual capital flow in the portfolio system.

**4\. RM and EWM Productivity-and-Coaching Intelligence**

* **The Join:** Talk-to-listen ratios and script adherence (transcripts) ↔ NNM generated by the RM/EWM cohort.  
* **The Owner:** Regional Market Heads.  
* **The Evidence:** Aggregated cohort data revealing that top-quintile EWMs allow clients to speak 60% of the time during periodic reviews, while bottom-quintile EWMs dominate the conversation, correlating directly with lower wallet share capture and lower MPIS penetration.  
* **Incumbent Differentiation:** GreyLabs provides the basic talk-to-listen ratio, but it cannot rank those ratios against the actual Net New Money produced by the RM.

**5\. Root-Caused NPS Movement**

* **The Join:** NPS survey scores and verbatims ↔ Service/Trade complaint logs ↔ Specific portfolio events (e.g., LAS margin calls, delayed reporting).  
* **The Owner:** Client Experience Head.  
* **The Evidence:** A dynamic visualization showing that a 15-point drop in NPS among the Maharashtra cohort was not due to generic RM performance, but specifically correlated with poor conversational handling of recent Loan Against Shares (LAS) margin calls during a period of market volatility38.  
* **Incumbent Differentiation:** CRM systems track the raw NPS score; LiSN isolates the specific operational or market event that caused the score to move.

**6\. The Multi-Audience Reporting Layer**

* **The Join:** Aggregated interaction-to-book data ↔ Role-based access controls.  
* **The Owner:** Harsh Jha (Group CTO) for architectural provisioning; Ashish Kehair (CEO) for executive consumption.  
* **The Evidence & Regulatory Value:** A unified architecture where the same underlying cohort data generates a risk-exposure dashboard for the CRO, a conversion-rate dashboard for the Wealth Head, and a grievance-resolution dashboard for the CX Head. This complies with DPDP by ensuring data minimization—stakeholders only see the cohort abstractions necessary for their function, never raw, unconsented personal data40. All analytical abstractions are flagged as AI-generated to meet SEBI disclosure standards31.

## **Synthesis**

**The Three Highest-Impact, Least-Served Needs**

1. **Predicting silent AUM attrition** by correlating decaying conversational sentiment and reduced interaction frequency with paused capital inflows long before the client initiates a full-book redemption.  
2. **Proving PMS and advisory suitability across 100% of interactions**, fulfilling SEBI’s strict 2026 mandates on mis-selling and governance without requiring an army of human auditors, while maintaining the required AI audit logs.  
3. **Mapping conversational conversion**, explicitly linking how RMs and the 7,000-strong EWM network pitch alternative assets to the actual funding of Managed Products & Investment Solutions (MPIS).

**The Wedge: Why LiSN Wins** GreyLabs accurately transcribes what was said on a call, and the Infinity/MARS dashboards flawlessly report what was funded; LiSN wins because it is the only intelligence layer that joins the two. It reveals precisely how interaction behaviours drive Net New Money and compliance exposure without ever demanding ownership of the central data lakehouse or violating DPDP cohort-level boundaries.  
**Anchor Stakeholder and Beachhead Hypothesis***Target:* **Rahul Jain (President & Head, Nuvama Wealth)** as the primary P\&L anchor, supported by the **Client Experience Head** as the native CX buyer.*Beachhead:* **Nuvama Wealth (HNI/Affluent)** rather than Nuvama Private (UHNI). While Private offers higher margins and ARR yields, Wealth relies on a massive, highly distributed workforce of \~1,200 RMs and \~7,000 EWMs. It is precisely at this scale that manual human supervision inherently breaks down, making LiSN’s automated, cohort-level surveillance an immediate operational and compliance necessity.  
**Demo Opening** "Mr. Jha, GreyLabs already provides you with excellent transcripts of your RMs' calls; LiSN takes those exact transcripts, overlays your NNM and portfolio data via API, and shows Mr. Jain precisely which conversations are leaking AUM and shows Dr. Soni exactly where SEBI’s 2026 suitability rules are being breached—all while operating strictly on cohorts, ensuring your data never leaves your lakehouse and your DPDP compliance remains intact."

#### **Works cited**

1. About Us \- Nuvama Wealth Management Expertise, [https://www.nuvama.com/about-us/](https://www.nuvama.com/about-us/)  
2. Nuvama Group \- Wikipedia, [https://en.wikipedia.org/wiki/Nuvama\_Group](https://en.wikipedia.org/wiki/Nuvama_Group)  
3. About Nuvama Wealth \- Company Information, Overview, History and Profile, [https://trendlyne.com/equity/about/1715909/NUVAMA/nuvama-wealth-management-ltd/](https://trendlyne.com/equity/about/1715909/NUVAMA/nuvama-wealth-management-ltd/)  
4. Nuvama-Annual-Report-FY-24-25-1.pdf, [https://www.nuvama.com/wp-content/uploads/2025/08/Nuvama-Annual-Report-FY-24-25-1.pdf](https://www.nuvama.com/wp-content/uploads/2025/08/Nuvama-Annual-Report-FY-24-25-1.pdf)  
5. Nuvama Letterhead\_ESL\_final \- NSE, [https://nsearchives.nseindia.com/corporate/NWML\_13082025204655\_SE\_InvestorPPT.pdf](https://nsearchives.nseindia.com/corporate/NWML_13082025204655_SE_InvestorPPT.pdf)  
6. Nuvama Wealth Management: A Deep Dive into the Business \- sharpely Knowledge Hub, [https://sharpely.in/blogs/nuvama-wealth-management-deep-dive-business/](https://sharpely.in/blogs/nuvama-wealth-management-deep-dive-business/)  
7. Escalation Matrix \- Nuvama Private | Wealth Management Services | Financial Advisory Firm, [https://www.nuvamaprivate.com/escalation-matrix/](https://www.nuvamaprivate.com/escalation-matrix/)  
8. Infinity \- Nuvama Private | Wealth Management Services | Financial Advisory Firm, [https://pwtest.nuvamaprivate.com/infinity/](https://pwtest.nuvamaprivate.com/infinity/)  
9. Nuvama Letterhead\_ESL\_final, [https://www.nuvama.com/wp-content/uploads/2026/05/SE\_InvestorPPT.pdf](https://www.nuvama.com/wp-content/uploads/2026/05/SE_InvestorPPT.pdf)  
10. From Accumulation to Continuity: Redefining the UHNW Client Experience in India \- Hubbis, [https://www.hubbis.com/article/from-accumulation-to-continuity-redefining-the-uhnw-client-experience-in-india](https://www.hubbis.com/article/from-accumulation-to-continuity-redefining-the-uhnw-client-experience-in-india)  
11. Nuvama Private's Onkarpreet Singh Jutla on Global Diversification, Alternatives and Risk-Calibrated Growth for India 2026 \- Hubbis, [https://hubbis.com/article/nuvama-private-s-onkarpreet-singh-jutla-on-global-diversification-alternatives-and-risk-calibrated-growth-for-india-2026](https://hubbis.com/article/nuvama-private-s-onkarpreet-singh-jutla-on-global-diversification-alternatives-and-risk-calibrated-growth-for-india-2026)  
12. Untitled \- Nuvama Private, [https://www.nuvamaprivate.com/cas/pdf/hubbis\_UHNW\_Client\_Experience\_in\_India.pdf](https://www.nuvamaprivate.com/cas/pdf/hubbis_UHNW_Client_Experience_in_India.pdf)  
13. Interview with Harsh Jha Head of Technology, Nuvama Group \- \- tele.net, [https://tele.net.in/interview-with-harsh-jha-head-of-technology-nuvama-group/](https://tele.net.in/interview-with-harsh-jha-head-of-technology-nuvama-group/)  
14. Netenrich Deepens India Commitment with Strategic BFSI Win & New Mumbai Office, [https://netenrich.com/newsroom/netenrich-india-expansion-mumbai-bfsi-mdr-nuvama](https://netenrich.com/newsroom/netenrich-india-expansion-mumbai-bfsi-mdr-nuvama)  
15. Speakers \- Technology Senate, [https://www.technologysenate.com/speakers.php](https://www.technologysenate.com/speakers.php)  
16. Nuvama bolsters productivity and compliance with Oracle Fusion Cloud ERP, [https://www.oracle.com/in/customers/nuvama/](https://www.oracle.com/in/customers/nuvama/)  
17. Nuvama SOC Case Study: Transforming BFSI Security Operations \- Netenrich, [https://netenrich.com/resources/case-studies/nuvama-bfsi-soc-case-study](https://netenrich.com/resources/case-studies/nuvama-bfsi-soc-case-study)  
18. 3rd Edition Bharat Insurance Summit & Awards 2026 Bharat's Brightest Minds in Insurance, Together at One Stage – The Brainalytics, [https://www.thebrainalytics.com/event/3rd-edition-bharat-insurance-summit-awards-2026/](https://www.thebrainalytics.com/event/3rd-edition-bharat-insurance-summit-awards-2026/)  
19. AI Tools for Coding: Test, Select, Repeat \- Banking Frontiers, [https://bankingfrontiers.com/ai-tools-for-coding-test-select-repeat/](https://bankingfrontiers.com/ai-tools-for-coding-test-select-repeat/)  
20. Leadership Team \- Nuvama Private \- The Org, [https://theorg.com/org/nuvama-private/teams/leadership-team](https://theorg.com/org/nuvama-private/teams/leadership-team)  
21. Ahmedabad Archives \- Nuvama Private | Wealth Management Services | Financial Advisory Firm, [https://www.nuvamaprivate.com/job-location/ahmedabad/](https://www.nuvamaprivate.com/job-location/ahmedabad/)  
22. Best Financial Advisors | Wealth Management Consultant | Our Platform \- Nuvama Private, [https://pwtest.nuvamaprivate.com/our-platform/](https://pwtest.nuvamaprivate.com/our-platform/)  
23. Nuvama Wealth Management Limited (543988) Leadership & Management Team Analysis, [https://simplywall.st/stocks/in/diversified-financials/bse-543988/nuvama-wealth-management-shares/management](https://simplywall.st/stocks/in/diversified-financials/bse-543988/nuvama-wealth-management-shares/management)  
24. Nuvama Wealth Management Limited (NUVAMA) Leadership & Management Team Analysis \- Simply Wall St, [https://simplywall.st/stocks/in/diversified-financials/nse-nuvama/nuvama-wealth-management-shares/management](https://simplywall.st/stocks/in/diversified-financials/nse-nuvama/nuvama-wealth-management-shares/management)  
25. Equity \- JKB Financial Services Limited, [https://www.jkbfsl.com/market/equity/news-analysis/news\_details/Corporate\_News/1667230](https://www.jkbfsl.com/market/equity/news-analysis/news_details/Corporate_News/1667230)  
26. Nuvama Wealth Management Expands into Mutual Fund Business, Appoints New Compliance Head \- ScanX, [https://scanx.trade/stock-market-news/corporate-actions/nuvama-wealth-management-expands-into-mutual-fund-business-appoints-new-compliance-head/20876449](https://scanx.trade/stock-market-news/corporate-actions/nuvama-wealth-management-expands-into-mutual-fund-business-appoints-new-compliance-head/20876449)  
27. FACULTY PROFILE National Convention of Company Secretaries (53rd Edition) \- ICSI, [https://www.icsi.edu/media/webmodules/53\_NC\_Faculty\_Profile\_Booklet.pdf](https://www.icsi.edu/media/webmodules/53_NC_Faculty_Profile_Booklet.pdf)  
28. Nuvama Letterhead\_ESL\_final, [https://www.nuvama.com/wp-content/uploads/2025/10/SE\_BMOutcome\_Oct011025-Final.pdf](https://www.nuvama.com/wp-content/uploads/2025/10/SE_BMOutcome_Oct011025-Final.pdf)  
29. SEBI's 2026 PMS overhaul: a turning point for the industry \- Ventura, [https://www.venturasecurities.com/blog/sebis-2026-pms-overhaul-a-turning-point-for-the-industry/](https://www.venturasecurities.com/blog/sebis-2026-pms-overhaul-a-turning-point-for-the-industry/)  
30. SEBI Digital Compliance Rules 2026: Advertising, AI & Adviser Regulations \- Aarna Law, [https://www.aarnalaw.com/insights/sebis-new-digital-compliance-rules-what-investment-advisers-must-know-in-2026](https://www.aarnalaw.com/insights/sebis-new-digital-compliance-rules-what-investment-advisers-must-know-in-2026)  
31. MASTER CIRCULAR HO/38/12/11(2)2026-MIRSD-POD/I/4300/2026 February 06, 2026 To, All Investment Advisers Investment Adviser A, [https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/52514/SEBI-issued-the-Master-Circular-for-Investment-Advisers-Feb092026.pdf](https://avantiscdnprodstorage.blob.core.windows.net/legalupdatedocs/52514/SEBI-issued-the-Master-Circular-for-Investment-Advisers-Feb092026.pdf)  
32. SEBI Update – Guidelines for Investment Advisers \- Sarthak Law, [https://sarthaklaw.com/sebi-update-guidelines-for-investment-advisers/](https://sarthaklaw.com/sebi-update-guidelines-for-investment-advisers/)  
33. corporate office \- Nuvama Partners, [https://partners.nuvamawealth.com/BranchLocator.aspx](https://partners.nuvamawealth.com/BranchLocator.aspx)  
34. Relationship Manager at Nuvama Wealth in Chennai \- Getmereferred.com, [https://getmereferred.com/job-listing/relationship-manager-nuvama-wealth-chennai-5-to-10-years-experience-9b25be29-0b1b-4a28-bb12-47377fe481ae](https://getmereferred.com/job-listing/relationship-manager-nuvama-wealth-chennai-5-to-10-years-experience-9b25be29-0b1b-4a28-bb12-47377fe481ae)  
35. Wealth Management Services in India \- Nuvama Private, [https://www.nuvamaprivate.com/our-solutions/](https://www.nuvamaprivate.com/our-solutions/)  
36. Software Engineer 3 \- Full Stack \- GreyLabs AI | Built In, [https://builtin.com/job/software-engineer-3-full-stack/9892445](https://builtin.com/job/software-engineer-3-full-stack/9892445)  
37. GreyLabs AI bets on GenAI to tune into customer conversations and draw smart insights, [https://yourstory.com/2024/08/greylabs-ai-bets-on-genai-speech-analytics-accurate-insights](https://yourstory.com/2024/08/greylabs-ai-bets-on-genai-speech-analytics-accurate-insights)  
38. Nuvama Wealth Management Limited \- Rating Rationale \- Crisil, [https://www.crisil.com/mnt/winshare/Ratings/RatingList/RatingDocs/NuvamaWealthManagementLimited\_March%2025\_%202026\_RR\_391676.html](https://www.crisil.com/mnt/winshare/Ratings/RatingList/RatingDocs/NuvamaWealthManagementLimited_March%2025_%202026_RR_391676.html)  
39. PMS Client Onboarding and SEBI Compliance: A Complete Guide for HNI Investors, [https://msna.co.in/pms/pms-client-onboarding-and-sebi-compliance-a-complete-guide-for-hni-investors/](https://msna.co.in/pms/pms-client-onboarding-and-sebi-compliance-a-complete-guide-for-hni-investors/)  
40. Top DPDP Consent Management Platforms in India (2026 Guide) \- KavachOne, [https://kavachone.com/blog/top-dpdp-consent-management-platform-india](https://kavachone.com/blog/top-dpdp-consent-management-platform-india)  
41. Consent Managers under India's DPDP Act and DPDP Rules \- AZB & Partners, [https://www.azbpartners.com/bank/consent-managers-under-indias-dpdp-act-and-dpdp-rules/](https://www.azbpartners.com/bank/consent-managers-under-indias-dpdp-act-and-dpdp-rules/)  
42. DPDP Consent Management Framework Guide \- Progressive Techserve, [https://www.progressive.in/blog/dpdp-consent-management-framework/](https://www.progressive.in/blog/dpdp-consent-management-framework/)  
43. Consent Manager under the DPDP Act: A New Institutional Layer for India's Data Protection Regime \- Economic Laws Practice, [https://elplaw.in/wp-content/uploads/2026/05/Consent-Manager-under-the-DPDP-Act-A-New-Institutional-Layer-for-Indias-Data-Protection-Regime.pdf](https://elplaw.in/wp-content/uploads/2026/05/Consent-Manager-under-the-DPDP-Act-A-New-Institutional-Layer-for-Indias-Data-Protection-Regime.pdf)  
44. Yatin Shah \- 360 ONE \- Asian Private Banker, [https://asianprivatebanker.com/final-word-2025/yatin-shah-360-one/](https://asianprivatebanker.com/final-word-2025/yatin-shah-360-one/)  
45. GreyLabs AI Raises ₹85 Crore to Revolutionize Voice AI in India's BFSI Sector \- Karostartup, [https://www.karostartup.com/article/greylabs-ai-raises-indian-rupee85-crore-to-revolutionize-voice-ai-in-indias-bfsi-sector](https://www.karostartup.com/article/greylabs-ai-raises-indian-rupee85-crore-to-revolutionize-voice-ai-in-indias-bfsi-sector)  
46. QJA/MN/IMD/IMD-SEC-4/32418/2026-27 BEFORE SECURITIES AND EXCHANGE BOARD OF INDIA FINAL ORDER Under Sections 11(1), 11(4), 11 \- SEBI, [https://www.sebi.gov.in/sebi\_data/attachdocs/may-2026/1779810509185.pdf](https://www.sebi.gov.in/sebi_data/attachdocs/may-2026/1779810509185.pdf)  
47. AI does not absolve data privacy responsibility | India \- Law.asia, [https://law.asia/ai-data-privacy-sebi-responsibility/](https://law.asia/ai-data-privacy-sebi-responsibility/)