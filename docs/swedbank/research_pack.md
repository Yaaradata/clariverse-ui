# Swedbank · LisN opportunity: research pack and clone brief

Nov 17, 2026 · @Yaaralabs

Research on Swedbank's Swedish retail bank for a LisN pitch to a Head of Customer Experience persona, and the brief to replicate the NatWest Pulse dashboard as `swedbank-pulse` on a four-week public-data window (22 Oct – 17 Nov 2026). Prepared for Ranjith Melarkode.

## Executive summary

Swedbank is Sweden's largest retail bank by customers and, in September 2026, its least-liked: last of every bank in the Svenskt Kvalitetsindex (SKI) survey at 60.3 of 100, below the 60 line SKI calls a fail. Its contact stack is older and thinner than NatWest's: a Nuance Nina chatbot from 2016, Genesys contact-centre telephony, Microsoft Copilot assistants in build, and no published cross-channel customer-intelligence layer. The pressure points are fraud (Swish scams), account freezes under the anti-money-laundering rules, repeated app and Swish outages, and a satisfaction score that has fallen two years running. That is a cleaner LisN story than NatWest's: less to avoid duplicating, and a visible number to move.

1. **What they have.** Nina (Nuance, 2016; about 40,000 conversations a month, 78–81% first-contact resolution at launch), Genesys multichannel platform with workforce optimisation, robotic process automation (about 35 people), GAN-based fraud detection, Microsoft Copilot-based virtual assistants for customers and staff (hiring in 2026), Adobe Experience Manager and Analytics, Qlik, AWS.
2. **What they do not have (publicly).** No cross-channel executive view, no public voice-of-customer join, no complaint early warning before ARN (the consumer disputes board), no outcome evidence for the Finansinspektionen account-closure review, no speech analytics or call-summarisation announcements.
3. **Where it hurts.** SKI Bank 2026: Swedbank 60.3, Sparbankerna 75.2, industry 66.0 and falling; Swedbank's own target is 65 in Sweden and it is below it. Konsumenternas Bank- och finansbyrå handled about 7,500 cases in 2025, led by fraud and anti-money-laundering account measures; Finansinspektionen called the four big banks in over 159,000 bank-initiated account closures in three years. Swish and app outages in April 2025, May 2025, April 2026 and 5 November 2026 (inside our data window).
4. **What to show.** `swedbank-pulse`: the NatWest Pulse layout, Swedish register, Swedish Banking only (Baltics excluded the way Ulster was), six products led by Payments and Swish, a four-week window (22 Oct – 17 Nov 2026) with windows Morning brief · Last 7 days · Last 14 days · Full window, and the ARN watch in place of the Financial Ombudsman watch.
5. **Persona.** Head of Customer Experience, Swedish Banking, reporting into Anna-Karin Laurell (Head of Swedish Banking, on the Group Executive Committee, ex-Folksam sales and customer service). No named contact yet.

## 1. The buyer and who decides

Persona for the demo: **Head of Customer Experience, Swedish Banking** — a generic business owner, because the contact's name has not been confirmed. Swedbank's own words for the remit are "availability and customer satisfaction for all our private customers", the stated purpose of the 2023 reorganisation that created a premium and private banking area and moved corporate customers out of Swedish Banking.

| Person | Role | Relevance | Evidence |
| --- | --- | --- | --- |
| Jens Henriksson | President and CEO (since October 2019) | Set the "first-class customer experience" and AI efficiency agenda in the 2025 annual report | [Swedbank](https://www.swedbank.com/about-swedbank/management-and-corporate-governance/ceo-and-group-executive-management/photos-and-cvs.html) |
| Anna-Karin Laurell | Head of Swedish Banking, Group Executive Committee (since 2024; ex-Folksam Head of Marketing and Sales; CEO, sales and customer-service background) | The persona's boss and the sponsor; owns the Swedish NKI target of 65 | [Inderes](https://www.inderes.se/en/releases/new-members-of-swedbanks-group-executive-committee), [Swedbank CVs](https://www.swedbank.com/about-swedbank/management-and-corporate-governance/ceo-and-group-executive-management/photos-and-cvs.html) |
| Malin Lilliecrona | Head of Premium and Private Banking (business area created 2023) | Owns the Premium segment the dashboard's cohorts will show | [MarketScreener](https://www.marketscreener.com/quote/stock/SWEDBANK-AB-6496651/news/Swedbank-gets-two-new-members-of-Group-Management-47204567/) |
| Lotta Lovén | Chief Information Officer and Head of Group Channels and Technologies | Technology approval; owns Genesys, Nina, Copilot build | [The Org](https://theorg.com/org/swedbank?person=c3dlZGJhbms6bG91aXNhLXJhbWVydA) |
| Henrik Liljeblad | Head of Group Business Support (confirmed 30 September 2026; ex-Head of transformation and procurement) | Procurement route | [Cision, 30 Sep 2026](https://news.cision.com/swedbank/r/changes-in-swedbank-s-group-executive-committee,c4402419) |
| Louisa Ramert | Head of Strategy and Business Development, Swedish Banking | Likely to own a CX-intelligence business case | [The Org](https://theorg.com/org/swedbank?person=c3dlZGJhbms6bG91aXNhLXJhbWVydA) |
| Swedbank Kundombudsman (Customer Ombudsman) | Second-line complaints appeal inside the bank | The internal stage before ARN; the dashboard's "final decision" state | [Swedbank complaints page](https://www.swedbank.se/en/contact-us/handling-of-complaints.html) |
| Head of contact centres (Kundcenter); head of complaints | Not identified publicly | Discovery | Not found |

What this means for the pitch: the persona is measured on NKI and SKI, both of which are public and both of which say Swedbank is last. The demo should show where satisfaction is being lost by journey and channel, and tie every screen back to the 65 target.

## 2. Swedbank: organisation, markets, scale

| Item | Finding | Evidence |
| --- | --- | --- |
| Group | Swedbank AB, headquartered in Sundbyberg (Stockholm); about 7.8 million private and corporate customers across four home markets: Sweden, Estonia, Latvia, Lithuania | [Annual Report 2025](https://live.euronext.com/sites/default/files/company_press_releases/attachments_oslo/2026/02/19/666208_Annual_Report_2025.pdf) |
| Swedish Banking | About 3.8 million private customers; Sweden's largest bank by private customers; run by Anna-Karin Laurell | Annual Report 2025 |
| Branches | 209 branches: 140 in Sweden, 69 in the Baltics (end 2025) | [MarketScreener](https://www.marketscreener.com/quote/stock/SWEDBANK-AB-6496651/company/) |
| Savings banks | Independent Sparbanker use Swedbank's platform and app; they score 75.2 in SKI against Swedbank's 60.3 on the same technology, which is itself a LisN finding (service, not systems) | [Dagens PS](https://www.dagensps.se/privatekonomi/har-ar-sveriges-basta-och-samsta-banker-storbanken-sist/) |
| Business areas | Swedish Banking; Baltic Banking; Corporates and Institutions; Wealth Management (Premium and Private Banking created 2023); Group Business Support; Group Channels and Technologies | [Swedbank GEC](https://www.swedbank.com/about-swedbank/management-and-corporate-governance/ceo-and-group-executive-management.html) |
| Satisfaction target | NKI target of at least 65 in Sweden and 72 in the Baltics; Sweden is below target, Baltics above (Estonia 73, Latvia 77, Lithuania 76 in 2024) | [Årsredovisning 2025](https://mb.cision.com/Main/67/4310161/3942918.pdf), [2024](https://mb.cision.com/Main/67/4111984/3289761.pdf) |
| Strategy | "First-class customer experience" through simplified processes, modernised infrastructure and AI to automate routine tasks; return-on-equity target of at least 15% supported by automation and AI | Annual Report 2025; [Investing.com](https://www.investing.com/news/earnings/swedbank-keeps-15-roe-goal-eyes-ai-boost-amid-geopolitical-uncertainty-4079554) |
| Legacy | 2019–2026 anti-money-laundering investigations (Baltic operations) concluded with the DFS settlement in 2026; the board says the bank can "now devote full focus to customers" | [Cision](https://news.cision.com/swedbank) |

Scope for the demo: **Swedish Banking, private customers, Sweden only.** Baltic Banking, Sparbankerna, Swedbank Pay, Swedbank Försäkring and Swedbank Robur are collected if they appear but excluded from retail figures, the way Ulster, Coutts and Mettle were for NatWest.

## 3. What Swedbank already has

Thinner and older than NatWest's stack. Nothing here is a cross-channel view, and most of it dates from 2014–2019.

| Domain | Platform and vendor | What it does | Adopted | Scale | Evidence |
| --- | --- | --- | --- | --- | --- |
| Contact-centre telephony | Genesys Customer Experience Platform (multichannel) with Workforce Optimisation and skills-based routing | Routing, scheduling, real-time monitoring | 2010s | Wait times cut by about 5 minutes (over 75%); 5% fewer repeat calls | [Genesys](https://www.genesys.com/en-gb/customer-stories/swedbank) |
| Chatbot | Nina (Nuance, now Microsoft) on swedbank.se; also used by agents as an internal knowledge layer | Answers basic questions; hands off to a human | Launched 2014, AI-enabled 2016 | About 30,000–40,000 conversations a month at launch; 78% first-contact resolution; 700 agents handling 3.6 million interactions a year | [Nuance 2016](https://news.nuance.com/2016-04-25-Nina-Virtual-Assistant-from-Nuance-Brings-Human-Touch-to-Swedbank-Customer-Service), [Diginomica](https://diginomica.com/swedbank-puts-customers-on-track-for-self-service-satisfaction) |
| Generative AI assistants | Microsoft Copilot-based virtual assistants, customer-facing and internal; a "Content Domain Lead – Conversational Banking and GenAI" role advertised in 2026 | Building | 2025–2026 | Not disclosed | [Swedbank jobs](https://jobs.swedbank.com/jobs/25489-content-domain-lead-conversational-banking-genai) |
| Process automation | Robotic process automation team (about 35 people, "enabling technology") | Automated customer processes; claimed up to 50% satisfaction uplift on trimmed processes | 2020 | Not disclosed | [Computer Sweden](https://computersweden.se/article/1288177/swedbank-har-fatt-smak-pa-automatisering-men-vad-tycker-kunderna.html) |
| Fraud | Generative adversarial networks for fraud-pattern detection | Real-time detection | Reported 2023–2024 | Not disclosed | [AIMultiple](https://research.aimultiple.com/generative-ai-in-banking/) |
| Payments control | Swish rule change (lower default limits) to counter fraud | Live | 4 September 2025 | All Swish users | [Marcus Oscarsson](https://marcusoscarsson.se/just-nu-swedbank-andrar-swish-regler-fran-4-september/) |
| Digital and data | Adobe Experience Manager, Adobe Analytics, Qlik, Amazon Web Services, REST platform | Web, analytics, reporting | Various | — | [LeadIQ](https://leadiq.com/c/swedbank/5a1d95b82300005c0084669e) |
| Complaints | Three-stage process: Kundcenter or branch → Kundombudsman (customer ombudsman, written appeal) → ARN or Konsumenternas Bank- och finansbyrå or court | Manual | Standing | — | [Swedbank](https://www.swedbank.se/en/contact-us/handling-of-complaints.html) |

Not found in public sources: speech or conversation analytics vendor, call summarisation, agentic assistants in production, voice AI, a voice-of-customer or social-listening platform, app-review analytics, a customer data platform beyond Adobe Analytics.

## 4. Does anything like LisN exist? Gaps

No. Swedbank measures satisfaction (NKI on about 40,000 customers a year, SKI externally) but nothing public joins contact channels, complaints and public voice into one read, and nothing gives early warning.

| # | Gap | Evidenced or inferred | Why it matters now |
| --- | --- | --- | --- |
| 1 | Cross-channel executive read (calls, Nina, app, branch, Kundcenter) | Evidenced by absence | The persona is measured on NKI; today it arrives once a year |
| 2 | Public voice joined to internal contact data | Evidenced by absence | Trustpilot 1,608 reviews, heavily one-star; App Store and Google Play reviews; r/sweden, Flashback, Familjeliv threads — nothing public links them to contact drivers |
| 3 | Nina hand-off failure detection | Inferred: Nina's 78% first-contact figure is from 2016; nothing published since | A ten-year-old bot with Copilot replacements in build is exactly where leakage sits |
| 4 | Complaint early warning before ARN and Finansinspektionen | Evidenced by absence | Konsumenternas byrån's 7,500 cases a year are led by fraud and account measures; ARN decisions on Swish fraud are public and go against banks |
| 5 | Account-freeze and closure outcomes (anti-money-laundering measures) | Evidenced by absence | Finansinspektionen summoned the four big banks over 159,000 bank-initiated closures in three years; this is the single most-reported complaint type |
| 6 | Outage impact on customers, by channel and day | Inferred | Outages on 14–17 April 2026, 19 May 2025, 5 November 2026 (in window); nothing public shows the contact and complaint tail after each |
| 7 | Sparbanker versus Swedbank on the same platform | Inferred | 75.2 against 60.3 on shared technology: the difference is service, which LisN can locate |

Do not pitch: chatbot replacement (Copilot is already underway), process automation, fraud detection. Position LisN as the layer over Genesys, Nina/Copilot logs, the complaints register and public voice.

## 5. Where it hurts

| Pressure point | Figure | Date | Source |
| --- | --- | --- | --- |
| SKI Bank 2026, private customers | Swedbank 60.3 of 100, last of all banks listed; Sparbankerna 75.2; Danske Bank 62.1 next lowest; industry average 66.0, down from 67.1; below 60 counts as a fail and a warning that customers are leaving | 21 September 2026, about 23,000 interviews in August | [Börskollen](https://www.borskollen.se/nyheter/27/hela-listan-bankerna-som-kunderna-ar-mest-och-minst-nojda-med), [nu.se](https://nu.se/avslojat-detta-ar-sveriges-samsta-bank-miljontals-kunder/) |
| SKI finding | Customers with a personal relationship score about ten points higher (78.5 where the bank takes the initiative); "the customer relationship needs to become more active, not just more digital" (Johan Parmler, SKI) | September 2026 | [Marcus Oscarsson](https://marcusoscarsson.se/sveriges-samsta-bank-pekas-ut-har-flera-miljoner-kunder/) |
| Own NKI target | At least 65 in Sweden; Sweden below target in 2025 | Annual report 2025 | [Årsredovisning 2025](https://mb.cision.com/Main/67/4310161/3942918.pdf) |
| Consumer guidance cases | Konsumenternas Bank- och finansbyrå: about 7,500 cases in 2025 (9,100 in 2024), most common area Payments: fraud and anti-money-laundering account measures; 25% of callers cite the money-laundering rules | 2025 | [TT](https://via.tt.se/pressmeddelande/4315068/stort-behov-av-vagledning-i-en-mer-komplex-finansiell-vardag?publisherId=3236283&lang=sv), [E55](https://www.e55.se/ekonomi/finansinspektionen-tvingas-agera-bankerna-stanger-konton/) |
| Account closures | 159,000 bank-initiated account closures in three years across the big banks; Finansinspektionen summoned Handelsbanken, SEB, Nordea and Swedbank | 2025 | [Dagens PS](https://www.dagensps.se/privatekonomi/problemet-vaxer-sa-manga-sparras-av-bankerna/) |
| Fraud and Swish | Supreme Court declined (May 2026) to hear a Swish case where the customer made the transfer; under current practice the customer can carry the whole loss; ARN has ruled in several cases that Swish payments are not unauthorised transactions | 2026 | [Infinity Insights](https://getinfinityinsights.com/articles/sweden-swish-scam-hd-praxis-2026), [Konsumentverket](https://www.konsumentverket.se/konsumentratt/bankbedragerier-och-kortbedragerier/) |
| Outages | 14–17 April 2026: payouts stuck for thousands of customers, Swish affected, fault at an external party; 19 May 2025: login and BankID failures nationwide; 5 November 2026: Swish disturbance at Swedbank (inside the data window) | 2025–2026 | [Realtid](https://www.realtid.se/bors-finans/bank-fintech/swedbank-i-tekniskt-kaos-utbetalningar-fastnar/), [Swish status](https://status.swish.nu/) |
| Trustpilot | swedbank.se: 1,608 reviews, dominated by one-star; frozen-account and fraud-handling stories, ARN case numbers quoted | 2026 | [Trustpilot](https://se.trustpilot.com/review/www.swedbank.se?page=3) |
| Public anecdotes | Accounts frozen for six months over 14,800 kronor of Swish transfers; an 81-year-old's account stopped under a fraud suspicion | 2024–2026 | [Marcus Oscarsson](https://marcusoscarsson.se/raseri-mot-swedbank-ny-trend-vacker-stor-oro/) |

Not retrieved this cycle: Swedbank's own complaint volumes (Swedish banks do not publish FCA-style returns), ARN case counts by bank, app-store ratings, NKI by segment. The crawl and the Konsumenternas annual report are the anchors.

## 6. Swedish register: what replaces the UK terms

Every regulatory sentence on screen re-binds to one of these. English on screen, Swedish institution names kept as proper nouns.

| UK term in natwest-pulse | Swedish replacement | Rule or note |
| --- | --- | --- |
| Financial Ombudsman Service; "Financial Ombudsman watch" | **ARN (Allmänna reklamationsnämnden, the National Board for Consumer Disputes)**; "ARN watch" | Consumer files in writing after the bank's final decision; SEK 150 fee; recommendations not binding but followed by banks |
| Final response (8 weeks, FCA DISP) | **Bank's final decision**, then appeal to the **Kundombudsman** (Swedbank's Customer Ombudsman) | Swedbank's own 3-stage process; no statutory 8-week clock — use "15 business days, bank standard (confirm with the bank)" for the first reply, and the payment-services rule of 15 business days where it applies |
| FCA; Consumer Duty | **Finansinspektionen (FI)**; FI's consumer-protection supervision and the right to a payment account (betalkonto) | Consumer Duty's four outcomes become FI's focus areas: access to payment accounts · fraud handling · fair treatment of vulnerable customers · clear information |
| Payment Systems Regulator; APP reimbursement, 5 business days | **Swish fraud handling**: unauthorised transaction rules under the Payment Services Act (betaltjänstlagen); Supreme Court and ARN practice on manipulated transfers | No reimbursement mandate; show "investigated within 15 business days (bank standard)" and "ARN eligible" |
| Faster Payments, Open Banking | **Swish**, **Bankgiro**, **BankID** | Swish is the retail rail; BankID the login and signing |
| Current Account Switch Service; switching intent | **Bank switch (byta bank)**; switching intent | No CASS equivalent; keep the phrase |
| Consumer guidance body | **Konsumenternas Bank- och finansbyrå** | Independent guidance; about 7,500 cases in 2025 |
| NPS, CMA survey | **NKI (Nöjd Kund Index)** and **SKI (Svenskt Kvalitetsindex)** | SKI 2026 figures above |
| Cora | **Nina** (and the Copilot assistant where named) | Channel row "Nina" |
| Secure message | **Internetbanken message (meddelande)** and **app chat** | Keep one row: "App and internet bank messages" |
| Branch | **Kontor** (branch) | 140 in Sweden |
| £ | **SEK (kr)** | No decimals on screen |
| Premier, Select, Reward | **Premium**, **Private Banking**, **Bas** (standard) | Premium and Private Banking is Malin Lilliecrona's area |
| Financially vulnerable (Consumer Duty) | **Customers in a vulnerable situation** (FI wording) and **account-measure affected** (frozen or restricted accounts) | The second cohort is Swedbank-specific and the most-complained-about |
| Sort code, 8-digit account | **Clearing number + account number**, **personnummer** (never on screen), **BankID** | PII rules |

## 7. Demo decision and the swedbank-pulse clone brief

Clone `natwest-pulse/v1` as `swedbank-pulse/v1`, the same way NatWest was cloned from `oct13`: same screens, sections, order, cards, tables and drill routes; only words, register and data change. Four-week window. Build on `main`, one commit per step, no push until Deployment Protection is confirmed. Log as SW-D01 onward.

1. **Copy.** `app/natwest-pulse/v1` → `app/swedbank-pulse/v1`; `components/natwest-pulse` → `components/swedbank-pulse`; `lib/natwest-pulse` → `lib/swedbank-pulse`; `scripts/natwest_pulse` → `scripts/swedbank_pulse`; `data/out|seed/natwest_pulse` → `swedbank_pulse`. Loader constant only. Every route 200 on copied NatWest data before any Swedbank data.
2. **Scope and header.** "Swedbank · Customer Pulse · \<freeze> CET". Footer: "Retail figures: Swedbank Swedish Banking, private customers, on-topic items in the window. Baltic Banking, Sparbankerna, Swedbank Pay and other group companies are excluded." Page title "LisN · Swedbank". Page heading "Head of Customer Experience".
3. **Window and periods.** Data 22 Oct – 17 Nov 2026; freeze 17 Nov 2026 07:45 CET. Period toggle: **Morning brief · Last 7 days · Last 14 days · Full window** (Last 30 days is wider than the data; relabel, do not remove). Windows nest; "no earlier period" where the comparison window predates 22 Oct. No week-on-week trend before 29 Oct.
4. **Products (six, Swedish Banking private).** **Payments and Swish** (first: the biggest public and complaint volume) · **Everyday accounts and app** · **Cards** · **Mortgages (bolån)** · **Savings and funds** · **Consumer loans**. Module `nina_digital` for Nina and the Copilot assistant: a channel row and a module, not a card. The deep-dive worked example is **Payments and Swish** (replaces Credit cards as the one business view with the save list).
5. **Channels (CX pulse rows).** Calls · Nina · App and internet-bank messages · Email · Social · Branch (kontor).
6. **Cohorts.** Customers in a vulnerable situation · Account-measure affected (frozen or restricted under AML) · Premium and Private Banking · Recent complainants (90 days). "Owners alerted" unchanged.
7. **ARN watch** (replaces Financial Ombudsman watch). Four tiles: *First reply overdue (past 15 business days, bank standard)* · *Final decision issued, Kundombudsman appeal open* · *Unhappy with the final decision (ARN eligible)* · *Filed with ARN*. One register; filed ≤ tiles 2 + 3; ARN pace labelled assumption. At-risk by product.
8. **Register swap.** Section 6 table, applied to copy.ts, products, askAnswers, deliverables and every component; lint scope `swedbank` bans every UK term (FCA, FOS, PSR, DISP, Faster Payments, CASS, £, Cora, Secure message, Premier, NatWest, RBS, Ulster) and every India term, with fixtures. Quoted public text exempt.
9. **Service standards ledger.** Rows: Swish payment delivered (seconds, Swish rule) · First reply to a complaint (15 business days, bank standard, confirm) · Final decision (bank standard, confirm) · Unauthorised transaction refund (Payment Services Act, next business day for unauthorised, investigated for manipulated) · Account-measure review (bank standard, confirm) · Card dispute · Mortgage offer · BankID re-issue · Loan decision. "Redress" column: ARN recommendation. All others "confirm with the bank".
10. **Internal seed.** Scale to 3.8 million private customers; contacts from the 3.6 million-a-year Nuance figure grown to about 5 million a year, labelled assumption; complaints anchored to Konsumenternas 7,500 external cases as the tip (assume 40× internal), labelled; Nina share of contacts 35%; cohort sizes: vulnerable 10%, account-measure affected 1.5%, Premium and Private 6%, recent complainants derived. Volume validation file with ANCHOR / DERIVED / ASSUMPTION.
11. **Public layer.** Section 8. No synthetic public data; sentiment from review sources only (App Store, Google Play, Trustpilot, Reco.se if present); social indicative; the same n-rules as NatWest (NW-D95/D97): ≥20 reviews for a share, ≥3 items "indicative", below 3 "—". Quote slots: on-topic, first-person, product-matched, never another bank as subject. Handling of social posts from the internal social-inbox seed, tagged "Internal" (NW-D100 pattern).
12. **Outage event.** 5 November 2026 Swish disturbance is inside the window: the morning brief and the Payments card must show the contact and public spike on 5–6 Nov with the real public posts; internal seed adds a matching contact spike (labelled). This is the headline demo moment.
13. **Ask LisN.** Five persona questions: Where is NKI being lost this month? · Which journeys did the 5 Nov Swish outage hurt most? · Which complaints are ARN-eligible this week? · How many account-measure customers have no owner? · Where does Nina hand off and lose the customer?
14. **Checks and review.** Same gate as NatWest: pipeline, reconcile, nesting, volume validation, lint, PII (personnummer pattern added: YYMMDD-NNNN and YYYYMMDD-NNNN; Swedish mobiles 07x; clearing numbers), fixtures, build, routes, crawl, screenshots, then a fresh-session read-only review on the seven items, then push.

Effort: two to three days from go-ahead, since the register is smaller than NatWest's and the public data is already normalised.

## 8. Public data: what is already crawled, 22 Oct – 17 Nov 2026

The crawl is done and sits in Drive at **LiSN Fluid CX › LiSN Swedbank › data\_of\_social\_media\_oct22-nov17** (NatWest-style layout: one JSONL per channel, `records.csv`, `manifest.json`, `raw/` actor rows, plus `swedbank_collectors_stats.csv/.xlsx` and `README.md`). Window for every channel 22 Oct – 17 Nov 2026.

| Channel | Records | Oct 22–31 | Nov 1–17 | What it holds | Caveat |
| --- | --- | --- | --- | --- | --- |
| X | 237 | 51 | 186 | Keywords swedbank / swedbanks, @Swedbank mentions | Includes market news, 26 posts from @Aktiellt and about 46 Baltic-language posts; no bank replies found |
| Reddit | 66 | 31 | 35 | Posts across 8 Swedish subreddits, up to 3 comments each, plus archive comments naming Swedbank | r/sweden comments not searchable in the archive |
| Google Play | 23 | 9 | 14 | Swedbank privat, Swedish storefront, sv + en | Swedbank företag had no reviews in the window |
| Trustpilot (forums) | 15 | 4 | 11 | Both profiles (www.swedbank.se, swedbank.com), all languages | No other consumer forum covers Swedbank; Flashback, Familjeliv, Sweclockers, Reco.se not collected |
| App Store | 3 | 0 | 3 | Fallback scraper (Apple's public feed was empty) | No app version, no developer replies |
| **All** | **344** | **95** | **249** |  |  |

**What this means for the screens.** NatWest had 5,155 records over 15 weeks; Swedbank has 344 over four. After dropping @Aktiellt, Baltic-language and market-news posts, the on-topic retail set will be roughly 220–250 items, of which only about 41 are reviews. So:

- Sentiment from review sources (NW-D91 rule) will be **indicative** in the Full window (41 reviews, above the 20-review floor only across all three stores together) and **“—”** in most 7-day and Morning-brief windows. The cards must still show the item count in every window (NW-D95); the share appears only where n allows.
- Social (X + Reddit, about 300 items) is the main public signal and stays **indicative**, as on NatWest.
- The **5 November Swish disturbance** should be visible in the X daily series; the builder confirms the spike exists in the data before it becomes the headline, otherwise the headline moves to the account-measure and fraud theme, which the Trustpilot and Reddit items carry.
- Quote slots per product will be thin: Payments and Swish and Everyday accounts and app will fill; Mortgages, Savings and Consumer loans may have fewer than 3 on-topic items and show “—” with the count, not an empty slot.
- Baltic-language posts route to `group_other`; @Aktiellt and results coverage (Q3 on 21 Oct) to `investor_corporate`; neither counts in retail figures.

Ingest rules: Swedish-language classification (multilingual model or translate-then-classify) with the blind check run on the Swedish text; redact personnummer, clearing and account numbers, names; stratify by source; source start dates recorded (App Store starts 2 Nov, Trustpilot 27 Oct).

**If more volume is wanted before the demo**, the gaps are the ones the collector could not reach: Flashback and Familjeliv (Ekonomi boards), Reco.se, and r/sweden comments. One extra week of X and Reddit would add roughly 70 items; the forum boards would add the long-form complaint stories that Trustpilot only hints at.

## 9. Positioning for the Head of Customer Experience

The person is measured on NKI, and the public score just came in last. The conversation is not about a chatbot or automation; it is about seeing, this week, what the annual survey will say next September.

- **Open with SKI.** 60.3, last, under 60 is the exit-risk line; Sparbankerna 75.2 on the same app and systems. The gap is service and relationship, which is contact data, which is what LisN reads.
- **Headline is account measures and fraud handling**, not the 5 November Swish disturbance. The builder checked the X series: 4 and 3 posts on 5–6 Nov, no spike. The real public signal in the window is frozen and restricted accounts and Swish-fraud outcomes, carried by Trustpilot and Reddit; that is also the theme Finansinspektionen is asking the big four about. The X spike on 10–13 Nov is market news and a Baltic telecom data leak, routed to investor\_corporate and group\_other.
- **ARN watch** instead of the UK ombudsman: which complaints are ARN-eligible now, with the account-measure cohort separated.
- **Nina to Copilot migration**: LisN as the measurement layer that tells them whether the new assistant hands off better than the old one.
- **Do not claim** Swedish complaint volumes, Nina's current performance or Swedbank's internal contact mix; every internal figure is labelled as seeded and scaled from public anchors.
- Language: screens in English; Swedish institution names and product names (Swish, BankID, bolån, kontor) kept as proper nouns; quotes shown in the original with an English gloss.

**Pitch in one line:** LisN joins Swedbank's calls, Nina, app messages, complaints and public voice into one morning read for Swedish Banking, so the NKI and SKI numbers stop being a surprise once a year.

## Open questions

1. Who is the actual Head of Customer Experience in Swedish Banking, and does the role sit under Laurell (Swedish Banking) or under Group Channels and Technologies? The persona is built generic until the name is known.
2. Does Swedbank still run Nina, or has the Copilot assistant replaced it on swedbank.se? Decides the channel label.
3. Does Swedbank publish any complaint statistics (some Swedish banks disclose Kundombudsman volumes in sustainability reports)? Would replace the Konsumenternas-derived anchor.
4. Were the 5 November Swish disturbance and the April outage Swedbank-side or external (Swish/Getswish)? Affects how the event is captioned.
5. Is a Swedish-language sentiment classifier acceptable to the builder's pipeline, or should classification run on English translations with the blind check in Swedish?
6. Four weeks of public data: if on-topic items are under 800, do we extend collection by one week before the demo?

## Sources

- Swedbank Annual and Sustainability Report 2025 (Euronext filing) — customers, business areas, strategy, NKI targets
- Swedbank Års- och hållbarhetsredovisning 2025 and 2024 (Cision) — NKI by market
- Swedbank Group Executive Committee page; Swedbank Sweden complaints-handling page; Swedbank jobs (Conversational Banking and GenAI lead)
- Svenskt Kvalitetsindex Bank 2026 via Börskollen, nu.se, Dagens PS, Marcus Oscarsson (21 September 2026)
- Konsumenternas Bank- och finansbyrå 2025 case statistics (TT press release); E55 and Dagens PS on account closures and Finansinspektionen
- Genesys Swedbank customer story; Nuance Nina press release (April 2016); Diginomica on Swedbank self-service
- Computer Sweden on Swedbank automation (2020); AIMultiple on GAN fraud detection
- Realtid on the April 2026 outage; Swish status page (5 November 2026 disturbance)
- Konsumentverket on bank fraud; Infinity Insights on the Supreme Court Swish decision (May 2026)
- Trustpilot se.trustpilot.com/review/www.swedbank.se
- Investing.com on Q3 2026 results and the 15% ROE target; Cision newsroom on the DFS settlement

Full URLs are inline in the tables above.
