# NatWest · LisN opportunity: full research pack

Nov 12, 2026 · @Yaaralabs

One document combining the Tanvi Gokhale profile, NatWest's customer-experience and contact-centre stack, the LisN gap analysis, the customer-outcome numbers, the competitor view, the review of our own clariverse-ui repo, and the demo decision and build brief. Prepared for Ranjith Melarkode.

## Executive summary

NatWest has automated nearly every individual customer interaction already, but nothing public sits above those channels and tells a customer-experience leader where customers are being lost. That layer is LisN's opening.

1. **What they have.** An Amazon Web Services contact centre (Amazon Connect, 9 centres, about 25 million calls a year, about 9,000 agents), 205 Amazon Lex voice bots with over 60% containment, Amazon Contact Lens speech analytics on 100% of calls, AI call summaries saving 70,000 to 90,000 hours a year, AI-drafted complaint letters for 100% of complaints, the Cora chatbot (12.9 million conversations in 2025, half with no human), a voice-to-voice assistant on their own small language model, a Fraud Triage Agent, and Scam Signal (the telecom call-in-progress check Ranjith heard about).  
2. **Who built it.** Amazon Web Services, IBM watsonx, OpenAI, NVIDIA, Adobe, Microsoft, Accenture, plus in-house models. No public evidence of Medallia, Qualtrics, Sprinklr, Brandwatch, NICE, Verint or any app-review analytics.  
3. **What they do not have.** No cross-channel executive read, no join of public voice-of-customer with internal contact data, no detection of chatbot hand-off failure, no complaint early warning before the Financial Ombudsman Service, no Consumer Duty outcome evidence by segment, no brand-level anomaly view, no outcome monitoring of their own AI agents. NatWest's own AI Adoption Report (September 2026\) describes exactly this ambition.  
4. **Where it hurts.** National Westminster Bank logged 86,498 complaints in H1 2026, 55% upheld, only 48% closed within three days (Barclays 57%); Financial Ombudsman Service new cases run at about 660 a month, up from about 510; NatWest sits 12th or 13th of 17 in the Competition and Markets Authority survey and Royal Bank of Scotland last (48%); Trustpilot is 86% one-star.  
5. **What to show.** A NatWest Group-wide LisN view built around the gaps in point 3: one screen across calls, Cora, complaints, branch and public voice; where Cora "resolved" it but the customer came back; complaint and Ombudsman early warning by theme and product; Consumer Duty outcomes by segment; the brands side by side (NatWest, Royal Bank of Scotland, Ulster Bank) with Royal Bank of Scotland's app-versus-overall gap as one proof point. Built by replicating the HDFC Pulse v2 pattern as `natwest_v2`. The buyer has changed: Harsh Agarwal replaced Tanvi Gokhale as Managing Director, Customer Experience and Engagement in September 2026; her current role is unconfirmed.

## 1\. The brief and how the research was done

Ranjith Melarkode connected with Tanvi Gokhale of NatWest on 5 November 2026 and asked for three things: who she is and what she runs; what NatWest has already done in the customer and customer-contact space (he heard about the telecom call-in-progress scam check during his visit to NatWest on Tuesday 3 November); and how to tune the LisN demo so it lands with her. On 12 November the brief widened to a full inventory of NatWest's customer-experience platforms, voice and natural-language automation, anything resembling LisN, where NatWest operates, and what to show.

Method and evidence standard:

- Web research across NatWest Group press releases, annual and interim results, the NatWest AI Adoption Report, Amazon Web Services case studies and the re:Invent 2024 NatWest session, IBM and Adobe case studies, Financial Conduct Authority complaints data, Financial Ombudsman Service data, Competition and Markets Authority and Ipsos survey results, trade press (Finextra, FF News, Computer Weekly, FinTech Futures) and job postings.  
- Every claim is tagged by confidence: **Confirmed-NW** (NatWest's own words), **Confirmed-Vendor** (a named vendor naming NatWest), **Press** (trade or general press), **Inferred** (our analysis), **Not found** (searched, no public evidence; absence from public sources, not proof of absence at NatWest).  
- The clariverse-ui repository (Yaaradata/clariverse-ui) was cloned, installed and run on 12 November; eleven candidate dashboard routes were rendered and screenshotted to verify what exists.  
- Tanvi's LinkedIn profile could not be read (LinkedIn blocks automated access and requires sign-in); her profile is drawn from the Halfords Group board page, NatWest press releases and a third-party profile aggregator.

## 2\. The buyer: Tanvi Gokhale and who else decides

Tanvi Gokhale is almost certainly the contact, but her role changed in September 2026 and only she can confirm where she now sits. She thinks like a strategist and propositions leader, not a contact-centre operator.

| Item | Finding | Confidence |
| :---- | :---- | :---- |
| Last confirmed title | [Managing Director, Customer Experience and Engagement, Retail Banking, NatWest Group](https://www.halfordscompany.com/who-we-are/our-leadership/) (from January 2026). Before that: Managing Director, Everyday Banking and Unsecured Lending (February 2025 to January 2026); Managing Director, Retail Strategy and Innovation (from April 2022); Head of Strategy, Retail | High |
| Role change | NatWest announced [Harsh Agarwal as Managing Director, Customer Experience and Engagement](https://www.natwestgroup.com/news-and-insights/news-room/press-releases/2026/natwest-group-appoints-harsh-agarwal-as-managing-director-custom.html) on 11 September 2026, reporting to Solange Chamberlain, Chief Executive Officer, Retail Banking. Agarwal is ex-IKEA (Global Chief Omnichannel Officer) and ex-Target. No public note on Tanvi's new role; the Halfords page and her LinkedIn still show NatWest | High that the role changed; her new remit unknown |
| What that function owns | Propositions, segment strategy and digital experience across the mobile app and digital products. Not the contact centre and not complaints operations | High |
| Background | 14 years at Lloyds Banking Group, latest as Managing Director, Segmentation and Propositions; strategy consulting at Booz and Company; London School of Economics; Kellogg MBA | High |
| Outside roles | Non-executive director at Halfords Group since June 2023, chairs its environmental, social and governance committee; Trustee of English Heritage | High |
| Public themes | Championed NatWest being the first United Kingdom bank with an app inside ChatGPT; talks about reducing friction in the joins between physical and digital channels; speaks on artificial intelligence and the future of work. Source is a third-party aggregator | Medium |

&nbsp;

Who else decides at NatWest (as of November 2026):

| Person | Role | Relevance | Evidence |
| :---- | :---- | :---- | :---- |
| Solange Chamberlain | Chief Executive Officer, Retail Banking | Ultimate sponsor; hired Agarwal | Confirmed-NW |
| Harsh Agarwal | Managing Director, Customer Experience and Engagement (from September 2026\) | Primary business buyer now; remit covers propositions, segment strategy, digital experience. Chamberlain cited his "ability to turn insight into commercial value" | Confirmed-NW |
| James Holian | Chief Customer and Operations Officer (from 1 October 2025\) | Likely owner of contact centres and customer operations; data owner for Amazon Connect and complaints data | Confirmed-NW via press summary |
| Judith Cruickshank | Chief Operating Officer, Retail Banking (2026) | Retail operations budget holder | Press |
| Des McDaid; Tamara van den Ban | Managing Director, Everyday Banking; Managing Director, Premier Banking | Segment owners, potential LisN users | Press |
| Scott Marcar | Group Chief Information Officer (technology, AI and data) | Technology approval; owns the Amazon Web Services and OpenAI relationships | Confirmed-NW |
| Triona O'Keeffe | Chief Data and Analytics Officer from January 2027 (ex-London Stock Exchange Group) | Data access and platform approval | Confirmed-NW |
| Karen Dewar | Interim Chief Data and Analytics Officer (since August 2025\) | Current data gatekeeper | Press |
| Dr Maja Pantic | Chief AI Research Officer (since June 2025\) | Built the voice assistant on NatWest's own small language model; possible ally on speech evaluation | Confirmed-NW |
| Dr Paul Dongha | Head of Responsible AI | Every AI use case passes the AI and Data Ethics (AIDE) triage; LisN would too | Press |
| Wendy Redshaw | Chief Digital Information Officer, Retail (as of December 2024\) | Led Cora+; status not re-verified | Press |
| David Grunwald | Group Director of Innovation | Runs the Open Innovation team and the Fintech Programme, the start-up route in | Confirmed-NW |
| Head of contact centres; head of complaints; Consumer Duty champion | Not identified publicly | Need direct discovery | Not found |

&nbsp;

What this means for the pitch: the demo must answer "where is the customer experience leaking, by segment and journey", not "how do we handle calls faster". If Tanvi has moved, she becomes the warm internal advocate and Agarwal the sponsor; the framing has to be re-checked against her new role before the meeting.

## 3\. NatWest's organisation, brands, geography and scale

NatWest Group is one company with several brands sharing one technology estate; the brands' customer scores differ sharply, which is itself a LisN use case.

| Item | Finding | Evidence |
| :---- | :---- | :---- |
| Group | NatWest Group plc, headquartered in Edinburgh; over 20 million customers; total assets £745.4 billion at 30 June 2026 | Confirmed-NW; Press |
| Businesses | Retail Banking; Private Banking and Wealth Management (Coutts; Evelyn Partners acquisition added about 2,200 staff in H1 2026); Commercial and Institutional (Mettle, Lombard, RBS International, FreeAgent) | Confirmed-NW |
| Brands by region | NatWest (England and Wales); Royal Bank of Scotland (Scotland); Ulster Bank (Northern Ireland; the Republic of Ireland retail business was wound down); Coutts; Mettle; Holt's; Lombard; RBS International; FreeAgent | Confirmed-NW |
| People | About 60,000 colleagues; headcount fell by about 1,000 in Q3 2026 to about 59,500; about 1,400 roles cut in 2026 alongside the AI rollout. Chief Executive Paul Thwaite: "new roles that are very much dedicated on AI" and other roles "being changed because of AI" | Confirmed-NW; Press |
| Contact centres | 9 contact centres, about 25 million calls a year, about 9,000 agents, all on Amazon Connect; customer-service and complaints roles advertised in Edinburgh, Manchester (Spinningfields) and Southend-on-Sea | Confirmed-Vendor; Press |
| India | 1,000 software engineers recruited through the India Hub in Bengaluru in 2025\. Offshore contact-centre operations in Chennai or Gurugram: not found | Press; Not found |
| Data and AI governance | Every AI use case passes the AI and Data Ethics (AIDE) triage; an AI dashboard goes to the Board Risk Committee from 2026; NatWest is in the Financial Conduct Authority's AI Live Testing cohort (named 3 December 2025\) | Confirmed-NW |
| Strategic technology partners | OpenAI (first United Kingdom bank, 20 March 2025), Amazon Web Services and Accenture (five-year data platform, 23 July 2025), IBM, Microsoft, Adobe, Google Cloud, NVIDIA; £1.2 billion spent on technology, data and AI in 2025 | Confirmed-NW |
| Start-up route | NatWest Open Innovation team and Fintech Programme (12 weeks, pre-Series A and Series A); 2026 theme "How AI is Shaping the Future of Customer Experience"; cohort included Aveni (financial-services conversation analytics), Condukt, DeepFlow, Empath\_AI (vocal biomarkers for vulnerable customers), Galveston Group, Gradient Labs, Murphy AI, Round Treasury | Confirmed-NW |
| Branch network trend; Ulster Bank detail | Not retrieved | Not found |

Where LisN would be procured (inferred): business sponsor in Retail Customer Experience and Engagement (Agarwal's team), with Customer Operations (Holian) as data owner for Amazon Connect and complaints data; technology approval from the Group Chief Information Officer and Chief Data and Analytics Officer, plus AIDE review. Applying to the next Fintech Programme cohort in parallel is a low-friction way in. Building the integration on Amazon Web Services (Connect data lake, S3, Athena) reduces security-review friction.

## 4\. What NatWest already has: the platform inventory

NatWest's contact estate is Amazon Web Services-centred and heavily automated. Anything in this table is a "we already have that" risk if it appears on our screens.

| Domain | Platform and vendor | What it does at NatWest | Adopted | Scale | Status | Evidence |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Contact-centre telephony | Amazon Connect (Amazon Web Services) | Core routing, agent desktop, contact flows | Credit-card pilot 2019; all agents migrated by 2025 | 9 centres; about 25 million calls a year; about 9,000 agents; 678 contact flows; 342 Lambda functions (1.7 million invocations a day) | Live | Confirmed-Vendor: re:Invent 2024 session FSI316, presented by NatWest's Jill Beattie and Stephen Couch |
| Resilience | Amazon Connect and Lex Global Resiliency | Active-active London and Frankfurt | Blog 9 July 2026 | Over 3 million voice calls a month; integrates with 26 services including workforce management, voice biometrics, conversational AI | Live | Confirmed-Vendor |
| Interactive voice response, natural-language call steering | Amazon Lex V2 | Gateway bot chained to child bots for intent capture | Replaced legacy engine | 205 Lex bots, over 60% containment; 1,700 intents across 35 journeys; "30-plus self-service journeys built in three weeks" | Live | Confirmed-Vendor; Press |
| Voice biometrics | Vendor not named (historically reported as Nuance) | Caller authentication | Pre-dates Connect | Shown as third-party service in the architecture | Live | Confirmed-Vendor that it exists; vendor Not found |
| Speech and conversation analytics | Amazon Contact Lens | Sentiment, hang-up analysis, vulnerability signals, call summarisation for training; replaced separate legacy call-recording, speech-analytics and quality tools | 2023 to 2024 | 100% of call volume; average handling time down 7%; customer sentiment up 22%; colleague sentiment up 20%; 423,000 hang-ups analysed; 4 times more vulnerable-customer conversations identified; about 1,000 calls a week with profanity | Live | Confirmed-Vendor |
| Contact-centre management information | Amazon Connect analytics data lake (zero-ETL), Lake Formation, Athena, QuickSight | Contact records, conversation analytics and agent metrics in one store | 2024 | Not quantified | Live | Confirmed-Vendor: AWS blog January 2026 |
| Agent assist and knowledge | Amazon Q in Connect, Bedrock, S3 knowledge store | Real-time knowledge search and next best action | Pilots 2024 to 2025 | Experiment 1 (12,000 articles): 58% intent recognition, 32% solution identification; Experiment 2 (1,000 curated articles): 78% and 50% | Pilot | Confirmed-Vendor |
| Internal colleague assistant | AskArchie and AskArchie+ | Colleague question answering | Pre-2025 | Not disclosed | Live | Confirmed-NW |
| Call transcription and summarisation | In-contact-centre AI transcription (engine not named; likely Contact Lens and/or internal LLM) | Summaries of calls; feeds complaint responses | Scaled 2025 | About 9,000 contact-centre colleagues; more than 70,000 hours a year saved from about 700,000 interactions; summarisation time cut by more than 70%; 100% of complaint calls in Commercial and Institutional transcribed | Live | Confirmed-NW: FY25 results, Chief Information Officer blog |
| Chatbot | Cora (2017) and Cora+ (generative AI on IBM watsonx Assistant with retrieval-augmented generation, built with IBM Client Engineering) | Customer digital assistant in app and web; summarises prior chats for human agents at hand-off | Cora+ June 2024 pilot, kept in production | 10.8 million queries (2023); over 11 million (2024); 12.9 million (2025, 50% no human); 7.1 million in H1 2026 (3.8 million fully digital, up 23%) | Live | Confirmed-NW; Confirmed-Vendor (IBM case study October 2024\) |
| Generative AI model provider | OpenAI | Digital assistants, fraud and scam handling, colleague tools | 20 March 2025 | 275-plus AI projects explored, about 25 in production at the time | Live | Confirmed-NW |
| Agentic assistant | Agentic Spending Insights in Cora (OpenAI models) | Natural-language questions about spending | Q1 2026 | 25,000 customers | Pilot | Confirmed-NW |
| Voice-to-voice agent | Spending Insights audio-visual, built by the Chief AI Research Office on NatWest's own small language model, with NVIDIA Nemotron automatic speech recognition | Real-time voice conversation with interruptions and topic changes | 25 September 2026 (Royal Bank of Scotland first); Nemotron 14 October 2026 | 75% of Royal Bank of Scotland customers by mid-October; 90 colleagues and about 3,000 questions in testing; "mishear 20% fewer words" across accents | Trial, rolling out | Confirmed-NW |
| Fraud triage agent | Fraud Triage Agent in Cora | Customer describes a suspicious card transaction and is routed to fraud, scam or dispute team | August to September 2026, all brands, credit cards | Nearly 19,000 conversations by 25 September (NatWest); 52,000 issues by Q3 results (press; figures conflict) | Live | Confirmed-NW; Press |
| Telecom fraud signal | Scam Signal (GSMA Open Gateway and UK Finance with EE, Virgin Media O2, Three, Vodafone) | Network tells the bank the customer is on a call while making a high-risk payment, correlated with authorised push payment fraud patterns | November 2024; NatWest a named participant | No NatWest-specific results published; one vendor cites about 41% fewer scams in progress at deploying institutions | Participant | Press; vendor |
| Transaction fraud | Real-time fraud platform (Featurespace ARIC reported earlier; not re-confirmed this cycle) | Scam detection rate up 135%, false positives down 75% | 2022 to 2023 | Enterprise-wide | Live | Press |
| Complaints automation | AI complaint summarisation, AI-generated complaint responses, agent for deciding outcomes | Drafts letters, summarises cases | 2025 to 2026 | About 90,000 hours a year saved; about 19 minutes per case, over 22,000 hours in 2025; Chief Financial Officer Katie Murray (26 February 2026): 100% of complaint letters AI-produced with a human check | Live | Confirmed-NW |
| Agentic complaints investigation | Agentic model investigating complaints across data sources, summary to a human handler; tracked daily on accuracy, coherence, hallucination | Financial Conduct Authority AI Live Testing | Blog 5 May 2026 | Not disclosed | Regulatory sandbox pilot | Confirmed-NW |
| Distribution in AI channels | NatWest app inside ChatGPT (home-buying and remortgage guidance) | First United Kingdom bank | 30 April 2026 | Not disclosed | Live | Confirmed-NW |
| Customer data platform | Adobe Experience Cloud: Real-Time Customer Data Platform, Experience Platform, Customer Journey Analytics, Journey Optimizer, Target, Campaign, Experience Manager | "Single view of interactions" for 19 million customers; personalised campaigns | 24 March 2022 | Loan follow-up click-through 3.5% to 6.5%; £11 million a year anticipated benefit; about 250,000 trigger emails a month | Live | Confirmed-Vendor; Press |
| Bank-wide data platform | Amazon Web Services and Accenture | Consolidate data on 20 million customers into one AI-enabled platform; complaints handling and fraud prevention named as use cases | 23 July 2025, five years | Building | Building | Confirmed-NW |
| Colleague generative AI | Microsoft Copilot Chat; Aiden (internal platform); GitLab Duo | Productivity, coding | April 2025 onward | All 60,000 colleagues; over 40% of code AI-written by May 2026 | Live | Confirmed-NW |
| Workforce management | Third-party, vendor not named | Scheduling, integrated with Connect | Not stated | Not stated | Live | Vendor Not found |

Searched for and not found in public sources (absence from public sources, not proof of absence):

| Category | Vendors checked | Finding |
| :---- | :---- | :---- |
| Other contact-centre platforms | Genesys, NICE CXone, Avaya, Cisco | Not found; the re:Invent deck refers only to a "legacy CCaaS solution" that Connect replaced |
| Speech-analytics specialists | NICE Nexidia, CallMiner, Verint | Not found; Contact Lens is the incumbent |
| Voice-of-customer and survey tools | Medallia, Qualtrics, InMoment | Not found as named vendors. A March 2026 Senior Customer Experience Researcher job ad requires analysing "NPS, CSAT, CES and Voice of Customer" from "diverse data sources", so the work exists as a human analyst function |
| Social listening | Sprinklr, Brandwatch, Hootsuite, Khoros | Not found |
| App-review analytics | Appbot, AppFollow | Not found |
| Customer relationship management | Salesforce, Pega | Not found this cycle; not confirmed either way |
| Data warehouse | Snowflake, Teradata | Not found this cycle; the Amazon Web Services and Accenture platform is the stated direction |
| "24 AI models for complaints in H1 2025" | Earlier claim | Not found in sources reviewed; treat as unverified |

## 5\. Voice and natural-language automation: every published number

NatWest publishes throughput and efficiency metrics (hours saved, containment, conversation counts). It does not publish outcome-quality metrics: repeat contact after a chatbot containment, complaint rate after an AI-drafted response, sentiment drift by segment. That gap is where LisN fits.

| Capability | Metric as published | Date | Publisher | Evidence |
| :---- | :---- | :---- | :---- | :---- |
| Interactive voice response intent capture | 205 Lex bots, over 60% containment; 1,700 intents in 35 journeys | December 2024 | Amazon Web Services re:Invent FSI316 (NatWest speakers) | Confirmed-Vendor |
| Self-service build speed | 30-plus new self-service journeys in three weeks | 2025 | Amazon Web Services via ContactCenterGuide | Press |
| Hang-up analysis | 423,000 hang-ups; 68,000 under 10 seconds; 230,000 after natural-language steering; 125,000 on direct-to-agent lines | December 2024 | FSI316 | Confirmed-Vendor |
| Contact Lens outcomes | Average handling time down 7%; customer sentiment up 22%; colleague sentiment up 20% | December 2024 | FSI316 | Confirmed-Vendor |
| Cora volume | 10.8 million (2023); over 11 million (2024, written evidence to Parliament); 12.9 million (2025); 7.1 million (H1 2026\) | 2024 to July 2026 | NatWest releases, Parliament evidence AIFS0049, Interim Results 2026 | Confirmed-NW |
| Cora containment | 50% of 2025 conversations needed no human; generative-AI journeys show about a 20-point uplift in no-human resolution; 3.8 million H1 2026 conversations fully digital, up 23% | FY25; H1 2026 | NatWest Innovation page; Interim Results | Confirmed-NW |
| Generative-AI journeys | From 4 to 21 during 2025; all journeys targeted by end-2026 | 31 December 2025 | NatWest; 2025 Annual Report | Confirmed-NW; end-2026 target Press |
| Share of chats by generative AI | Cora handled 11% more chats than Q1 2025; 20% handled by generative AI | Q1 2026 | Q1 2026 results via press summary | Press |
| Cora+ satisfaction | "Up to 150% improvement in customer satisfaction" on some question types | October 2024 to March 2025 | NatWest release; IBM case study (Miles Hillier); Parliament evidence | Confirmed-NW. Caution: an "up to" figure on some question types, not programme-wide. A Head of Customer Experience will know this |
| Call summaries | More than 70,000 hours a year saved (retail) | February 2026 | Chief Information Officer Scott Marcar blog; FY25 results | Confirmed-NW |
| Complaints automation | About 90,000 hours a year (summarisation plus AI responses); about 19 minutes per case, over 22,000 hours in 2025; 100% of complaint letters AI-drafted with human check | February 2026 | 2025 Annual Results; Chief Financial Officer roundtable | Confirmed-NW |
| Contact-centre transcription | About 9,000 contact-centre colleagues using AI transcription | FY25 | NatWest Innovation page | Confirmed-NW |
| United Kingdom-accent speech recognition | NVIDIA Nemotron: "mishear 20% fewer words" across accents tested; no customer data shared with NVIDIA | 14 October 2026 | NatWest release | Confirmed-NW |
| Voice-to-voice | Spending Insights trial, Royal Bank of Scotland first; 75% of its customers by mid-October 2026 | 25 September to 14 October 2026 | NatWest releases | Confirmed-NW |
| Fraud triage | About 19,000 conversations | 25 September 2026 | NatWest release | Confirmed-NW |

## 6\. Does anything like LisN exist at NatWest?

No. NatWest has bought or built strong channel-level intelligence: Contact Lens for voice, Cora telemetry for chat, AI for complaint handling, Adobe for marketing. Nothing public sits above those channels, joins them with public voice-of-customer, and alerts executives to anomalies. NatWest's own AI Adoption Report (September 2026, chapter 1\) says AI can "connect information from different parts of a customer's experience and identify signals" and give a business "memory and context across interactions". That is the LisN thesis in NatWest's words, and it is aspiration, not a shipped product.

| LisN capability | Closest NatWest analogue | Assessment |
| :---- | :---- | :---- |
| Unified executive view of contact signals | Amazon Connect analytics data lake plus QuickSight dashboards | Exists for voice and contact-centre operations only; no public evidence it joins Cora chat, complaints, branch and public voice. Confirmed-Vendor for the component; Not found for the join |
| Theme and intent classification | Lex intents (1,700); Contact Lens categories; complaint summarisation | Strong within each channel; no published cross-channel taxonomy |
| Sentiment and vulnerability detection | Contact Lens sentiment and vulnerability flags (4 times more vulnerable conversations identified) | Exists for calls only |
| Single customer view, "customer memory" | Adobe Real-Time Customer Data Platform (2022, 19 million customers); Amazon Web Services and Accenture platform (2025) | Marketing- and personalisation-oriented, not customer-experience diagnostic |
| Complaint root cause and early warning | Agentic complaints investigation (Financial Conduct Authority sandbox); AI complaint summarisation | Focused on handling individual complaints faster, not predicting complaint surges or Ombudsman escalation. Not found for early warning |
| Social listening joined to internal data | None | Not found |
| App-store review analytics | None | Not found |
| Consumer Duty outcome monitoring tooling | None named; board reports not retrieved | Not found |
| Closed-loop feedback | Adobe Campaign trigger emails (about 250,000 a month) for stalled commercial journeys | Commercial recovery, not complaint or voice-of-customer loop |
| Hiring signals | Senior Customer Experience Researcher (closing 25 March 2026): define and analyse NPS, CSAT, CES and voice of customer "using diverse data sources to map customer pain points"; Complaints Analyst, Customer Insight and Resolution (Edinburgh); Customer Insight Analyst roles (London, Edinburgh, Manchester) | Voice-of-customer insight is a human analyst function working across diverse sources, which is the manual workflow LisN automates. Press |
| Chief AI Research Office (Maja Pantic) | Multimodal AI against deepfakes, audiovisual conversational AI, biometrics, proprietary small language models | No customer-analytics or voice-of-customer work found |
| Fintech Programme 2026 | Aveni (financial-services conversation analytics) and Empath\_AI (vocal biomarkers for vulnerable customers) in the cohort | Competitive watch: both are adjacent to LisN and now have a NatWest relationship. Confirmed-NW |

&nbsp;

7\. The gaps: where LisN fits

Eight gaps, each marked as evidenced by absence from public sources or inferred from what is published.

| \# | Gap | Evidenced or inferred | Why it matters to NatWest now |
| :---- | :---- | :---- | :---- |
| 1 | Cross-channel executive read (calls, Cora, complaints, branch in one view) | Evidenced by absence: every published analytics asset is channel-scoped | The new Managing Director's remit spans propositions, segments and digital journeys; a cross-channel read lets him own outcomes, not features |
| 2 | Public voice versus internal join (app-store reviews, Reddit, X, Trustpilot against contact data) | Evidenced by absence: no social-listening or review-analytics vendor found | Trustpilot's page for natwest.com lists 8,492 reviews, 86% one-star. Public sentiment is visibly negative and not linked to internal contact drivers |
| 3 | Cora hand-off failure detection (contained chats that become calls or complaints) | Inferred: containment published (50%; plus 20 points on generative-AI journeys), no repeat-contact or failure-demand metric | With all journeys moving to generative and agentic Cora, containment that only moves failure demand elsewhere is a Consumer Duty risk |
| 4 | Complaint early warning before the Financial Ombudsman Service | Evidenced by absence for prediction; handling is heavily automated | Ombudsman new cases against National Westminster Bank ran at roughly 660 a month in July 2025 to March 2026 versus about 510 a month in H1 2025 |
| 5 | Consumer Duty outcome evidence by segment | Inferred: no named tool; board reports not retrieved | Contact Lens already flags vulnerability; turning that into board-ready outcome evidence by segment is unaddressed in public |
| 6 | Segment-level friction across app, Cora, phone and branch | Inferred | Royal Bank of Scotland: app 66% versus overall 48% in the Competition and Markets Authority survey; the problem sits outside the app |
| 7 | Brand-level anomaly detection (Royal Bank of Scotland versus NatWest versus Ulster) | Inferred | Royal Bank of Scotland ranks last of 17 while sharing NatWest's platform; a brand-split view is the obvious first use case |
| 8 | AI-agent quality monitoring (Fraud Triage Agent, voice assistant, AI complaint letters) | Inferred: accuracy and hallucination tracked in the sandbox, nothing customer-outcome based published | 100% of complaint letters are AI-drafted; "did this response lead to an Ombudsman referral or a repeat complaint?" is a natural LisN module |

&nbsp;

What LisN should not pitch: speech-to-text, call summarisation, chatbot containment, agent assist. NatWest has these on Amazon Web Services, IBM, OpenAI, NVIDIA and in-house models, and would see LisN as duplicating its stack. Position LisN as the intelligence and anomaly layer that consumes Connect and Contact Lens exports, Cora logs, complaint records and public voice-of-customer, and lean on Amazon Web Services-native integration because that is where the contact data already sits.

## 8\. Customer-outcome pressure points

NatWest resolves fewer complaints within three days than Barclays at a higher complaint rate. AI drafting speeds up letters; it does not reduce the inflow.

Financial Conduct Authority complaints returns, banking and credit cards:

| Firm | Period | Complaints opened | Per 1,000 accounts | Upheld | Closed within 3 days | Source |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| National Westminster Bank plc | H2 2025 | 90,819 | 2.90 (31.3 million accounts) | 57% | 46% (plus 36% within 8 weeks) | [NatWest complaints page](https://www.natwestgroup.com/who-we-are/contact-us/feedback-and-complaints/national-westminster-bank-plc.html) |
| National Westminster Bank plc | H1 2026 | 86,498 (down about 5.1%) | 2.74 (31.6 million) | about 55% | 48% | NatWest page; [FCA firm-level table](https://www.fca.org.uk/data/firm-level-complaints-data-sortable-table) (22 October 2026\) |
| Royal Bank of Scotland plc | H2 2025 | 18,544 | 2.83 (6.6 million) | not retrieved | not retrieved | [NatWest RBS page](https://www.natwestgroup.com/who-we-are/contact-us/feedback-and-complaints/the-royal-bank-of-scotland-plc.html) |
| Royal Bank of Scotland plc | H1 2026 | 17,394 (down about 6.7%) | 2.66 | about 49% | not retrieved | NatWest page; FCA table |
| Barclays Bank UK (comparator) | H1 2026 | 85,021 | 2.14 | 57% | 57% | [Barclays](https://home.barclays/who-we-are/reporting/uk-complaints-data/january-to-june-2026/) |
| Lloyds Bank (comparator) | H1 2026 | 115,687 | 3.16 | 66% | 56% | FCA via BankCreditRatings |

Financial Ombudsman Service new cases:

| Firm | H1 2025 (6 months) | of which banking and credit | July 2025 to March 2026 (9 months) | of which banking and credit |
| :---- | :---- | :---- | :---- | :---- |
| National Westminster Bank | 3,051 | 2,833 | 5,935 | 5,612 |
| Royal Bank of Scotland | 658 | 618 | 1,030 | 957 |
| Barclays Bank UK | not retrieved | not retrieved | 6,826 | 6,295 |

Ombudsman-wide uphold rate: 32% in H1 2025, 33% in Q2 2025/26, 27% in Q3 2025/26. Firm-specific uphold rates for NatWest and Royal Bank of Scotland were not retrieved. The nine-month period is a one-off change to April–September and October–March cycles, so it is not directly comparable with H1 2025\.

Competition and Markets Authority / Ipsos service-quality survey, personal current accounts, Great Britain:

| Wave | Brand | Overall | Online and mobile | Branch | Source |
| :---- | :---- | :---- | :---- | :---- | :---- |
| August 2026 | Royal Bank of Scotland | 48%, 17th of 17 (last) | 66% | 51%, lowest published | ClearScore (25 September 2026); Alty (2 September 2026\) |
| August 2026 | NatWest | 12th or 13th (natwest.com shows both on different charts) | not verified | not verified | natwest.com |
| August 2025 | Royal Bank of Scotland | 49%, 17th |  |  | ClearScore |
| Undated (LoveMoney) | NatWest / Royal Bank of Scotland | 56% (13th) / 49% (17th) | 69% (13th) / 67% (14th) |  | LoveMoney |
| August 2026 leaders | Monzo / Starling / Nationwide |  | Monzo 85%, Starling 83% | Nationwide 83% | Bank of Scotland CMA page |

Business current accounts (August 2026): Mettle 82%, 3rd overall; NatWest brand 9th; Royal Bank of Scotland equal 4th for business branch services at 53%.

Other indicators:

- Authorised push payment fraud: NatWest says APP-linked losses rose 12% while unauthorised fraud losses fell 3%. Industry-wide, 88% of in-scope losses were reimbursed since October 2024 (Payment Systems Regulator dashboard, Q1 2026); APP losses over Faster Payments fell about 21%, about £73 million a year. The Payment Systems Regulator consults on changes in December 2026\.  
- Trustpilot for natwest.com: 8,492 reviews, 7,278 one-star (86%), 698 five-star (8%).  
- Crypto-transfer complaints: 1,278 attributed to NatWest Group including Royal Bank of Scotland, May to August 2026, third after Lloyds and Barclays (advocacy-group data).  
- No Financial Conduct Authority or Competition and Markets Authority Consumer Duty enforcement against NatWest found since 2023 (not exhaustively checked). The 2023 Coutts account-closure episode has its own governance page.  
- Not retrieved: UK Customer Satisfaction Index rank, annual-report Net Promoter Score, app-store ratings, main complaint causes by product, H2 2024 and H1 2025 returns.

## 9\. Competitor context

Every major United Kingdom bank now summarises calls and runs a generative-AI assistant. None publicly runs a cross-channel, public-plus-internal early-warning layer. NatWest can be first, and its own AI Adoption Report already describes that capability.

| Bank | Voice-of-customer, speech analytics and agentic customer experience (public) | Implication for LisN |
| :---- | :---- | :---- |
| Lloyds Banking Group | AI financial assistant in the app, over 500,000 Bank of Scotland customers, full rollout 2026; own agent platform "Envoy"; about 50 live generative-AI use cases delivered about £50 million of value in 2025, targeting over £100 million in 2026 | Ahead on assistant rollout and on quantifying value; NatWest's differentiator can be outcome intelligence |
| Barclays | Scam Signal live via FICO and JT (nine victims identified on day one; 6% card-fraud reduction forecast); Barclays US: over 8 million generative-AI call summaries since October 2025; contact-centre assistants guiding agents | Summaries and fraud signals are table stakes; nobody claims cross-channel voice-of-customer intelligence |
| HSBC UK | Contact-centre AI tools rolled out; Chief AI Officer since April 2026; Google Cloud, DeepMind and Mistral deals; 200-plus AI use cases | Platform partnerships, no published voice-of-customer layer |
| Santander | OpenAI partnership; speech analytics processes 10 million voice calls a year in Spain and auto-fills the customer relationship management system, freeing 100,000-plus hours; AI in over 40% of contact-centre interactions; AI voice channels for card queries in the United Kingdom | The clearest "others have this" example for speech analytics at scale, though Spain-based |
| Nationwide | Best branch score (83%) and narrowest app-versus-overall gap (1 point); Scam Checker Service and Call Checker | Shows the value of consistent human service; LisN can show where NatWest and Royal Bank of Scotland diverge from that |
| Monzo and Starling | Top of the Competition and Markets Authority survey overall and online (Monzo 85% online); in-app "is this really us calling" indicators; Monzo in Financial Conduct Authority AI Live Testing | Lack the branch and contact-centre complexity that makes a joined-up view valuable; LisN's value is highest for incumbents |

## 10\. Our own repo: what LisN dashboards exist and which can be shown

Nothing in Yaaradata/clariverse-ui can be shown to NatWest as it stands, but the HDFC Pulse v2 pattern is the right base and the IndusInd v2 clone proves the replication path. Verified 12 November 2026: repository cloned, dependencies installed, dev server run, eleven candidate routes rendered at 1536 pixels wide; all returned 200 with no console errors.

| Candidate | Route | Persona | What it is | Fit for NatWest | Verdict |
| :---- | :---- | :---- | :---- | :---- | :---- |
| HDFC Pulse v2 | /hdfc-pulse/v2 plus 15 drill routes (action queue, business views, deliverables, head of CX, market, MD's office, modules, priority, satisfaction, service promise, signal, customer, my view) | MD's office / Head of Customer Experience | Customer pulse (internal plus public, never added together), CX pulse by channel, Ombudsman watch, morning brief by business, Ask LisN, action queue, service promise, satisfaction, release pulse | Right persona, right questions, strongest build; but Reserve Bank of India, Internal Ombudsman, UPI, PayZapp, Play Store and rupee on every screen | Base pattern, not as-is |
| IndusInd v2 | /role-based/indusind\_bank (five role views) | MD's office / Head of Customer Experience | File-for-file copy of the HDFC v3 components (19 files, 2 to 194 lines changed each) over a separate data folder | Proves the clone path: new bank \= new data folder plus copy edits, no new screens | Template for the NatWest clone |
| Sterling Bank (United Kingdom) | /role-based/sterling\_bank/head\_retail and /head\_contact | Head of Retail Banking (Raghu Narula persona); Head of Contact Centre | Older Fluid Intelligence style: three question cards, AI risk-spike monitor, conversation-AI panels; already United Kingdom (pounds, Financial Ombudsman Service, Current Account Switch Service, Chase/Monzo/Nationwide peers) | Right country, wrong persona, older design, fictional bank name on screen | Fallback only if the meeting is within a week |
| Generic retail banking | /role-based/retail\_banking/head\_cx | Head of Customer Experience | Early executive view with Consumer Duty and Financial Conduct Authority lenses | Thin, no public-data layer | No |
| Openbank | /role-based/openbank/ceo\_insight | Chief Executive insight | United States digital bank, public voice plus recovery | Wrong market | No |

Why the v2 code supports replication: `lib/indusind-v2/load.ts` reads one data folder (`data/out/<bank>` and `data/seed/<bank>`) and every figure on screen comes from that bundle. The pipeline in `scripts/indusind_v2/` ingests Play Store, App Store, X, Reddit and forums, classifies by theme and product, seeds a labelled illustrative internal layer, and reconciles totals. The IndusInd meta file records 10,712 public records (6,245 Play Store, 2,235 X, 1,497 Reddit, 419 Technofino forum, 300 App Store) for July to September 2026, with group companies kept in the data but excluded from bank-wide figures. India-specific vocabulary (Reserve Bank of India, Ombudsman) is hard-coded in nine of the nineteen components and in `copy.ts`, so a register swap is a bounded task.

Carry-forward rules from the HDFC and IndusInd builds that apply unchanged (from `carry_forward_from_hdfc.md`): slice data on the server per page; redact in the pipeline, not the user interface; no post URLs or author handles in any payload; no internal labels or version tags on screen; every check has a fixture that must fail; stratify public data by source; no synthetic public data; size the internal layer against public anchors; executive view numbers first, subtitles at most six words; copied components carry the old bank's text, so strip every string and re-bind every regulatory sentence to a United Kingdom register entry.

One limitation found: `next build` fails in the research sandbox only because Google Fonts is unreachable there; dev mode works. The clone itself should be built on a machine with network access, as the IndusInd one was.

## 11\. Demo decision and the NatWest build brief

Replicate, do not build new: clone the HDFC Pulse v2 pattern as a `natwest_v2` version, the same way IndusInd v2 was made. Estimated effort about one working week from go-ahead: data collection and pipeline 2 to 3 days, copy and register swap 1 day, quality assurance 1 day.

| Option | Fit to the gaps in section 7 | Effort | Risk |
| :---- | :---- | :---- | :---- |
| Sterling Fluid CX demo | United Kingdom, ready now, built for a challenger-bank persona | None | Persona and scale mismatch; competitor name on screen |
| IndusInd pattern re-skinned as `natwest_v2` | Best: public live layer plus labelled illustrative internal layer, United Kingdom register, brand split | About one week | Needs the data pull and a United Kingdom copy pass |
| HDFC demo as is (Vidya's demo) | Weakest: Reserve Bank of India, Internal Ombudsman and Play Store content read as foreign | None | Lands as an India product |

&nbsp;

Build brief for `natwest_v2`:

1. **Data folder.** Copy `data/out/indusind_v2` and `data/seed/indusind_v2` to `natwest_v2`; copy `scripts/indusind_v2` to `scripts/natwest_v2`. Sources: NatWest, Royal Bank of Scotland and Ulster Bank apps on the United Kingdom App Store and Google Play, X, Reddit (r/UKPersonalFinance, r/NatWest), Trustpilot, MoneySavingExpert forum. Window 1 August to 11 November 2026\. Coutts and Mettle kept in the data, excluded from retail figures.  
2. **Scope.** NatWest Group retail as a whole, with a brand filter (NatWest, Royal Bank of Scotland, Ulster Bank). The home screen opens group-wide; Royal Bank of Scotland is one drill-down and one proof point, not the frame.  
3. **Products.** Replace the six HDFC businesses with: current accounts and app, savings, mortgages, credit cards, personal loans, payments and fraud. Add a seventh module "Cora and digital assistant" so the chatbot is a journey LisN watches, not something it replaces.  
4. **Register swap** (`copy.ts` and the nine components naming the Reserve Bank of India or the Ombudsman). Reserve Bank of India Ombudsman becomes Financial Ombudsman Service with the 8-week and 15-day rules; Internal Ombudsman becomes final response; Reserve Bank of India turnaround times become Financial Conduct Authority DISP timelines and the Payment Systems Regulator 5-day reimbursement rule; rupee becomes pound; UPI, PayZapp and INDIE become Faster Payments, Open Banking and the NatWest app; Play Store leads become App Store leads. Add Consumer Duty outcome wording to the brief tiles. Run `lint_terms.py` with a United Kingdom term list so no India word survives the build.  
5. **Peers.** Lloyds, Barclays, HSBC, Santander from the Competition and Markets Authority August 2026 survey and Financial Conduct Authority complaints returns; Monzo and Starling greyed as the upper benchmark. No Starling demo content anywhere in this version.  
6. **Screens, one per gap NatWest does not have.** (1) Cross-channel pulse: calls, Cora, complaints, branch, public voice on one screen, never added together. (2) Cora leakage: journeys marked "resolved" by the chatbot that reappear as a call or complaint within 7 days. (3) Complaint and Ombudsman watch: eligible, on the brink, unhappy with final response, by theme and product. (4) Consumer Duty outcomes by segment: everyday, mortgage holders, multi-product, financially vulnerable. (5) Brand lens: the three brands side by side with the same metrics. (6) AI-agent outcomes: Fraud Triage Agent and AI complaint letters followed through to repeat contact or Ombudsman referral. Keep Ask LisN and the morning brief.  
7. **Home-screen order for a propositions leader.** Customer pulse by segment, then cross-channel pulse with Cora as a channel, then Ombudsman watch, then morning brief by product. Drop the Reserve Bank of India and government segment and the relationship-manager-alerted tiles.  
8. **Illustrative internal layer.** Same seed method as `seed_internal_v3.py`, reconciled to the public mix within 20%, labelled "Internal · illustrative until discovery" on every tile, volumes scaled to a 20-million-customer bank, per-product shape taken from NatWest's own H1 2026 complaints return.  
9. **Quality gate.** Biome and TypeScript clean on the natwest paths, every route 200, `check_pii.py`, screens light and dark at 1536 at 1.25 scale and at 390, demo-content rules on every figure, no real customer names or post URLs on screen, no version tags or internal labels on screen.  
10. **Out of scope for the first cut.** Cards-portfolio drill (HDFC-specific), release pulse by app version unless the United Kingdom store series supports it.

## 12\. Pitch positioning

The one-line pitch: *you have automated every channel; nobody at NatWest has the view across them, and here is the screen that does.*

What to show maps one-to-one onto what NatWest does not have:

| What NatWest does not have | What LisN shows | Proof point to open with |
| :---- | :---- | :---- |
| A cross-channel executive read | One screen: calls, Cora, complaints, branch, public voice, by product and segment | NatWest 12th or 13th of 17 in the Competition and Markets Authority survey while every channel reports green on its own |
| Public voice joined to internal contact data | App-store, Reddit, X and Trustpilot themes against the internal contact mix, same taxonomy | Trustpilot 86% one-star; no social-listening or review-analytics vendor in their stack |
| Cora hand-off failure detection | "Resolved by Cora" journeys that come back as a call or complaint within 7 days | 50% containment published, zero repeat-contact figures published |
| Complaint early warning before the Ombudsman | Eligible, on the brink, unhappy with final response, by theme and product | 86,498 complaints H1 2026; Ombudsman cases about 660 a month, rising |
| Consumer Duty outcome evidence by segment | Outcomes for everyday, mortgage, multi-product and financially vulnerable customers | Contact Lens flags vulnerability on calls only; nothing board-ready by segment |
| Brand-level anomaly view | NatWest, Royal Bank of Scotland, Ulster Bank side by side on one metric set | Royal Bank of Scotland last of 17 (48%), app 66% versus overall 48%, on the same platform as NatWest |
| Outcome monitoring of their own AI agents | Fraud Triage Agent and AI complaint letters followed to repeat contact or Ombudsman referral | 100% of complaint letters AI-drafted; only accuracy and hallucination tracked, not customer outcome |

Royal Bank of Scotland as one proof point, in plain words: NatWest Group's brands share one technology estate, yet Royal Bank of Scotland came last of 17 in the Competition and Markets Authority survey (48%), has the lowest branch score (51%), and the widest gap between its app (66%) and its overall score (48%). Customers like the app but not the bank, so the loss is in the telephone, the branch, the Cora chat and complaint handling. It is the sharpest illustration of the brand-lens gap, and leadership attention is already there because it is the first brand for the voice assistant. It is one drill-down in a NatWest-wide demo, not the demo.

Say:

- "You have automated every channel. Nobody has the view across them."  
- Quote NatWest's own AI Adoption Report: AI can "connect information from different parts of a customer's experience and identify signals".  
- "LisN sits on top of Amazon Connect, Contact Lens, Cora logs and your complaints data. It replaces nothing."  
- Walk the seven gaps in the table above, one screen each, group-wide first, then the brand lens.  
- Propose a 12-week pilot across NatWest retail with one success metric: identify the top five cross-channel friction drivers and show they predict complaint and Ombudsman inflow, with the brand split as a built-in control.

Do not say:

- Anything about speech-to-text, call summarisation, chatbot containment or agent assist as LisN features.  
- Anything that attacks Cora's "150%" figure or Contact Lens; frame LisN as the layer that turns their AI investment into outcome evidence.  
- Anything about fewer agents; about 1,400 roles have been cut in 2026 alongside the AI rollout.

Stakeholder sequence: Harsh Agarwal as business sponsor; Tanvi Gokhale as warm advocate once her role is confirmed; James Holian's operations team as data owner; Chief Information Officer and Chief Data and Analytics Officer plus the AI and Data Ethics review early; the Fintech Programme in parallel.

## 13\. Open questions and blocked on people

- [ ] Ranjith: Tanvi's LinkedIn profile PDF export (LinkedIn blocks automated access), to confirm her role after the September 2026 change, or ask her directly  
- [ ] Ranjith: the meeting date, which decides Sterling-now versus the NatWest build  
- [ ] Ranjith: anything else heard at NatWest on Tuesday 3 November beyond the scam-call check  
- [ ] Ranjith: go or no-go on the `natwest_v2` build, given IndusInd and the UK Banking Audit work in flight  
- [ ] Someone to read NatWest's and Royal Bank of Scotland's exact August 2026 Competition and Markets Authority ranks off the Ipsos results page (the PDF text does not carry provider names)  
- [ ] Pull firm-specific Financial Ombudsman Service uphold rates for NatWest and Royal Bank of Scotland from the Ombudsman spreadsheet  
- [ ] Pull main complaint causes by product from the Financial Conduct Authority spreadsheet  
- [ ] Verify or drop the "24 AI models for complaints in H1 2025" claim against the H1 2025 interim deck  
- [ ] Resolve the Fraud Triage Agent volume conflict (about 19,000 conversations versus 52,000 issues)  
- [ ] Not retrieved: contact-centre site list, offshore contact centres, branch count, named heads of complaints and contact centres, Consumer Duty champion, UK Customer Satisfaction Index rank, annual-report Net Promoter Score, app-store ratings

## Glossary of abbreviations

| Abbreviation | In full | Meaning here |
| :---- | :---- | :---- |
| RBS | Royal Bank of Scotland | NatWest Group's Scottish brand |
| CMA | Competition and Markets Authority | United Kingdom competition regulator; publishes the six-monthly bank service-quality league table with Ipsos |
| FCA | Financial Conduct Authority | United Kingdom conduct regulator; receives banks' half-yearly complaints returns; runs AI Live Testing |
| FOS | Financial Ombudsman Service | Body customers escalate to after a bank's final response; the United Kingdom equivalent of the Reserve Bank of India Ombudsman |
| PSR | Payment Systems Regulator | Sets the authorised push payment fraud reimbursement rules |
| APP fraud | Authorised push payment fraud | A customer is tricked into sending money themselves |
| DISP | Dispute Resolution: Complaints sourcebook | The Financial Conduct Authority rulebook with complaint-handling timelines |
| CASS | Current Account Switch Service | United Kingdom scheme for moving an account to another bank |
| CX | Customer experience |  |
| MD CX\&E | Managing Director, Customer Experience and Engagement | Tanvi's former title; now Harsh Agarwal |
| CCaaS | Contact centre as a service | Cloud contact-centre platform |
| IVR | Interactive voice response | The automated telephone menu |
| NLCS | Natural-language call steering | Letting callers say what they want instead of pressing keys |
| ASR | Automatic speech recognition | Speech-to-text |
| SLM / LLM | Small / large language model |  |
| RAG | Retrieval-augmented generation | A chatbot answering from a document store |
| CDP | Customer data platform | Adobe Real-Time Customer Data Platform |
| AWS | Amazon Web Services | Amazon Connect (telephony), Amazon Lex (voice bots), Amazon Contact Lens (speech analytics), Amazon Q in Connect (agent assist), Bedrock, S3, Athena, QuickSight |
| ETL | Extract, transform, load | Data-pipeline step; "zero-ETL" means none needed |
| NPS / CSAT / CES | Net Promoter Score / customer satisfaction score / customer effort score |  |
| AHT | Average handling time | Of a call |
| MI | Management information | Internal reporting |
| VoC | Voice of customer | Public reviews, social posts, surveys |
| AIDE | AI and Data Ethics | NatWest's AI use-case triage |
| CRO / CIO / CDAO / COO / CFO | Chief Risk / Information / Data and Analytics / Operating / Financial Officer |  |
| NED | Non-executive director |  |
| ESG | Environmental, social and governance |  |
| FTE | Full-time equivalent | Headcount measure |
| GSMA | GSM Association | Mobile-operator industry body behind Scam Signal |
| UPI | Unified Payments Interface | India real-time payments, to be replaced by Faster Payments in the clone |
| HL-01 to HL-34 | Carry-forward rules from the HDFC build | In `carry_forward_from_hdfc.md` |

## Sources

Tanvi Gokhale and leadership

- [Halfords Group leadership page](https://www.halfordscompany.com/who-we-are/our-leadership/)  
- [NatWest: Harsh Agarwal appointed MD Customer Experience and Engagement, 11 September 2026](https://www.natwestgroup.com/news-and-insights/news-room/press-releases/2026/natwest-group-appoints-harsh-agarwal-as-managing-director-custom.html)  
- [FinTech Futures on the Agarwal appointment](https://www.fintechfutures.com/job-cuts-new-hires/natwest-appoints-harsh-agarwal-as-managing-director-of-customer-experience-and-engagement)  
- [FF News press release on the appointment](https://ffnews.com/news/press-release-natwest-appoints-former-ikea-executive-to-lead-customer-experience-a0b7f187)  
- [Humantic profile: Tanvi Gokhale (third-party aggregator)](https://humantic.ai/public-profile/tanvi-gokhale-e4a4190bff6895ab)  
- [LinkedIn: Tanvi Gokhale (not readable without sign-in)](https://www.linkedin.com/in/tanvi-gokhale-baa182/)

NatWest platforms and AI

- [AWS re:Invent 2024 FSI316: NatWest personalising customer experience with Amazon Connect and AI/ML](https://reinvent.awsevents.com/content/dam/reinvent/2024/slides/fsi/FSI316_NatWest-Personalizing-customer-experience-with-Amazon-Connect-and-AI-ML.pdf)  
- [AWS blog: how NatWest built multi-region resilience with Amazon Connect, 9 July 2026](https://aws.amazon.com/blogs/contact-center/how-natwest-built-multi-region-resilience-with-amazon-connect-customer/)  
- [AWS blog: how NatWest simplified contact-centre analytics, January 2026](https://aws.amazon.com/blogs/contact-center/how-natwest-simplified-contact-center-analytics-with-amazon-connect-analytics-data-lake)  
- [NatWest and OpenAI collaboration, 20 March 2025](https://www.natwestgroup.com/news-and-insights/news-room/press-releases/ai-and-data/2025/mar/natwest-open-ai-collaborate-to-accelerate-cutting-edge-ai-transf.html)  
- [NatWest: next generation of AI tools (voice Spending Insights, Fraud Triage Agent), 25 September 2026](https://www.natwestgroup.com/news-and-insights/news-room/press-releases/2026/natwest-group-first-to-unveil-next-generation-of-ai-tools-to-hel.html)  
- [NatWest: improved AI speech recognition with NVIDIA, 14 October 2026](https://www.natwestgroup.com/news-and-insights/news-room/press-releases/2026/natwest-improves-ai-speech-recognition-for-uk-banking-customers-.html)  
- [NatWest: first UK bank in ChatGPT, April 2026](https://www.natwestgroup.com/news-and-insights/news-room/press-releases/ai-and-data/2026/apr/natwest-becomes-first-uk-bank-to-launch-trusted-home-buying-advi.html)  
- [NatWest AI Adoption Report: AI for the future of customer relationships](https://www.natwestgroup.com/who-we-are/about-natwest-group/tech-data-and-AI/natwest-ai-adoption-report/how-we-use-AI-for-the-future-of-customer-relationships.html)  
- [NatWest: tech, data and AI page](https://www.natwestgroup.com/who-we-are/about-natwest-group/tech-data-and-AI.html)  
- [NatWest: innovation and digitisation](https://www.natwestgroup.com/sustainability/society/innovation-and-digitisation.html)  
- [NatWest: AI and data update, July 2025](https://www.natwestgroup.com/news-and-insights/latest-stories/ai-and-data/2025/jul/how-natwest-group-is-accelerating-opportunities-to-better-serve-.html)  
- [NatWest: tomorrow's banking through technology, February 2026](https://www.natwestgroup.com/news-and-insights/latest-stories/ai-and-data/2026/feb/being-a-trusted-partner-for-tomorrows-banking-through-technology.html)  
- [NatWest FY2025 results announcement, 13 February 2026](https://investors.natwestgroup.com/~/media/Files/R/RBS-IR-V2/results-center/13022026/nwg-company-announcement.pdf)  
- [NatWest written evidence to Parliament (AIFS0049)](https://committees.parliament.uk/writtenevidence/140244/pdf/)  
- [Adobe and NatWest, March 2022](https://www.adobe.com/content/dam/cc/uk/aboutadobe/newsroom/pdfs/240322-natwest-group-working-with-adobe.pdf)  
- [Diginomica: NatWest using Adobe and data](https://diginomica.com/how-natwest-using-adobe-and-data-create-more-personal-digital-relationships-customers)  
- [Finextra: AWS and Accenture data platform](https://finextra.com/newsarticle/46333/natwest-hires-aws-and-accenture-to-consolidate-customer-data-across-the-bank)  
- [Finextra: NatWest boasts of AI benefits](https://www.finextra.com/newsarticle/47312/natwest-boasts-of-ai-benefits)  
- [Computer Weekly: £1.2bn tech spend, February 2026](https://www.computerweekly.com/news/366639140/NatWest-hails-progress-after-12bn-spent-on-tech-last-year-but-true-AI-transformation-to-come)  
- [AI News: AI across NatWest functions](https://www.artificialintelligence-news.com/news/banking-ai-in-multiple-business-functions-at-natwest/)  
- [Fintech Magazine: NatWest and OpenAI](https://fintechmagazine.com/articles/natwest-partners-with-openai-in-uk-banking-industry-first)  
- [GSMA: Scam Signal launch, November 2024](https://www.gsma.com/newsroom/?p=21746)  
- [ACI Worldwide: Scam Signal outcomes](https://www.aciworldwide.com/blog/real-time-fraud-detection-telecom-signals-app-scams)  
- [FF News: Featurespace scam detection](https://ffnews.com/newsarticle/natwest-improves-scam-detection-rate-by-135-using-featurespaces-technology)  
- [BankingNewsAI: NatWest profile (secondary)](https://www.bankingnewsai.com/banks/natwest)  
- [NatWest Senior Customer Experience Researcher job ad](https://builtin.com/job/senior-customer-experience-researcher/8803718)  
- [NatWest Complaints Analyst, Customer Insight and Resolution job ad](https://www.jobleads.com/gb/job/complaints-analyst-customer-insight-resolution--city-of-edinburgh--e1ca2ac5c858874d7cd6172428a9cc615)

Complaints, Ombudsman, surveys, fraud

- [NatWest: National Westminster Bank complaints data](https://www.natwestgroup.com/who-we-are/contact-us/feedback-and-complaints/national-westminster-bank-plc.html)  
- [NatWest: Royal Bank of Scotland complaints data](https://www.natwestgroup.com/who-we-are/contact-us/feedback-and-complaints/the-royal-bank-of-scotland-plc.html)  
- [NatWest H1 2026 complaints return (PDF)](https://www.natwestgroup.com/content/dam/natwestgroup_com/natwestgroup/Docs/web-pages/who-we-are/complaints-data/NWG-2026-H1-NW-Complaints-Data.pdf.coredownload.pdf)  
- [FCA firm-level complaints data](https://www.fca.org.uk/data/firm-level-complaints-data-sortable-table)  
- [Barclays UK complaints data, January to June 2026](https://home.barclays/who-we-are/reporting/uk-complaints-data/january-to-june-2026/)  
- [Financial Ombudsman Service half-yearly data H1 2025](https://www.financial-ombudsman.org.uk/businesses/resolving-complaint/our-insight/half-yearly-complaints-data-h1-2025)  
- [Financial Ombudsman Service half-yearly data H2 2025](https://www.financial-ombudsman.org.uk/businesses/resolving-complaint/our-insight/half-yearly-complaints-data-h2-2025)  
- [Financial Ombudsman Service quarterly data Q2 2025/26](https://www.financial-ombudsman.org.uk/businesses/resolving-complaint/our-insight/quarterly-complaints-data-q2-2025-26)  
- [Ipsos: CMA personal current account service quality, August 2026](https://www.ipsos.com/sites/default/files/PCAGB_3rd_Party_Aug2026_v1.pdf_0.pdf)  
- [ClearScore: best and worst banks](https://www.clearscore.com/learn/managing-money/best-bank-worst-bank-uk)  
- [Alty: the UK bank app gap](https://alty.co/blog/uk-bank-app-gap)  
- [LoveMoney: best and worst banks](https://www.lovemoney.com/news/87749/best-and-worst-banks-how-customers-rate-their-service)  
- [Bank of Scotland: CMA results page](https://www.bankofscotland.co.uk/bankaccounts/help/cma-results.html)  
- [NatWest: customer advocacy and NPS](https://www.natwestgroup.com/sustainability/society/customer-advocacy.html)  
- [NatWest: consumer protection](https://www.natwestgroup.com/sustainability/society/consumer-protection.html)  
- [PSR APP fraud performance report 2022](https://www.psr.org.uk/media/vq1d5ycy/app-fraud-performance-report-covering-2022.pdf)  
- [Regulation Tomorrow: payment fraud falls £73m after PSR reimbursement scheme](https://www.regulationtomorrow.com/2026/07/payment-fraud-falls-by-73m-following-psr-reimbursement-scheme/)  
- [Insurance Business: UK fraud losses 2025](https://www.insurancebusinessmag.com/uk/news/breaking-news/uk-fraud-losses-hit-1-28-billion-as-scam-calls-rise-587641.aspx)  
- [Which?: hybrid payment scams](https://www.which.co.uk/news/article/watch-out-for-the-hybrid-payment-scam-that-banks-refuse-to-refund-aCKSM0r6cCYW)  
- [Crowdfund Insider: crypto-transfer complaints](https://www.crowdfundinsider.com/2026/10/319787-uk-banks-receive-numerous-complaints-on-crypto-transfer-restrictions-lloyds-banking-group-and-barclays-lead/)

Competitors

- [Computer Weekly: Santander AI value](https://www.computerweekly.com/news/366644979/Santander-extends-staff-access-to-AI-as-first-quarter-delivers-35m-value)  
- [The Digital Banker: Santander and OpenAI](https://thedigitalbanker.com/santander-partners-with-openai-to-accelerate-ai-first-banking-strategy/)  
- [BankingNewsAI: conversational AI in banking (secondary)](https://www.bankingnewsai.com/conversational-ai-in-banking)  
- [Barclays: service quality metrics](https://www.barclays.co.uk/current-accounts/service-quality-metrics/)

Our own material

- Yaaradata/clariverse-ui repository (cloned and run 12 November 2026\)  
- Project docs: `claude/indusind/carry_forward_from_hdfc.md`, `claude/indusind/indusind_v1_kickoff_prompt.md`  
- Earlier working doc: NatWest · LisN demo research for Tanvi Gokhale (11 November 2026\)