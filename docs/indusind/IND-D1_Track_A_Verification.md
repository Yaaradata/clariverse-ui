# IND-D1 Track A verification: IndusInd MD and CEO demo figures

**Run date:** 2 October 2026. **Inputs:** IND-R1 and IND-R2 Stage 1 merged files (1 October 2026). **Method:** each claim checked against the issuer's or regulator's own document wherever one could be reached; otherwise the best secondary source is named with its class.

## Summary

67 claims were checked across the 12 priority items. **40 are VERIFIED**, one of them as arithmetic on primary figures. **10 engine conflicts are resolved** from primary documents, or in two leadership cases from dated secondary reports. **10 claims are CORRECTED**, the most material being: ₹31,417 crore is the Rural Banking segment, not microfinance; the SFIO letter is dated 23 December 2025, not 24 December; the DPDP phase dates run from the gazette date of 13 November 2025; and several peer rate cards have moved since the engines read them. **4 claims are UNVERIFIABLE (secondary only)** and **3 are NOT FOUND**. Access limits: the sandbox's own network calls were blocked for every host. BSE corporate-filing PDFs (bseindia.com, including beta) returned 403 to the fetch tool, and the rbidocs PDF returned a CAPTCHA. IndusInd's own PDFs, NSE archives, rbi.org.in press-release and notification pages, peer IR PDFs, MeitY and CRISIL were reachable. Rate tables on the IndusInd and IDFC First pages are drawn by script and could not be read. One caveat applies to every primary row: the fetch tool returns a machine extraction of each PDF, not the image of the page. Chart values on one IndusInd slide (Rural Banking, slide 15) came back garbled, so every figure below was cross-checked between the presentation and the analyst-call transcript, and is marked VERIFIED only where the two agree or the value sits in a plain table.

## Verification table

Status key: VERIFIED · CORRECTED · CONFLICT RESOLVED · UNVERIFIABLE — secondary only · NOT FOUND.

### 1. IndusInd Q1 FY27 (Apr–Jun 2026) deposit base

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| Total deposits, 30 Jun 2026 | ₹4,14,766 crore | ₹4,14,766 crore (Q4 FY26 ₹3,99,931 crore; Q1 FY26 ₹3,97,144 crore) | VERIFIED | [Investor Presentation Q1 FY27](https://www.indusind.bank.in/content/dam/indusind-corporate/investors/investor-presentation/FY2026-2027/Investor-Presentation-Q1-FY26-27.pdf) (22 Jul 2026) | BSE copy blocked (403); bank's own copy used. +3.7% QoQ, +4.4% YoY by arithmetic. |
| Current-account deposits | ₹34,620 crore | ₹34,620 crore (Q4 FY26 ₹35,034 crore) | VERIFIED | Same | Down 1.2% QoQ. |
| Savings deposits | ₹87,440 crore | ₹87,440 crore (Q4 FY26 ₹89,899 crore; Q1 FY26 ₹91,113 crore) | VERIFIED | Same | SA fell 2.7% QoQ and 4.0% YoY. |
| CASA ratio | 29.43% | 29.43% derived ((34,620 + 87,440) ÷ 4,14,766); deck prints the ratio rounded to 29% | VERIFIED | Same | Show as 29.4%. Deck does not print two decimals; the figure is derived from disclosed balances. |
| Cost of deposits | 5.95% | 5.95% (Q4 FY26 6.07%; Q1 FY26 6.44%) | VERIFIED | Same; [Q1 FY27 analyst call transcript](https://www.indusind.bank.in/content/dam/indusind-corporate/investors/QuarterFinancialResults/FY2026-2027/Quarter1/IndusInd-Bank_Analyst-Call_Q1FY27_20260722.pdf) (22 Jul 2026) | Call: improved 12 bp QoQ. |
| Cost of funds | 5.05% or 5.68% | **5.05%** (Q4 FY26 5.14%; Q1 FY26 5.69%) | CONFLICT RESOLVED | Investor Presentation Q1 FY27 | 5.68% is the Q1 FY26 cost of savings, not a cost of funds. |
| Cost of savings | 4.72% | 4.72% (Q4 FY26 4.89%; Q1 FY26 5.68%) | VERIFIED | Same | Labelled "Cost of SA" in the deck. |
| Q4 FY26 deposits | ₹3,99,931 crore | ₹3,99,931 crore | VERIFIED | Same (comparative column) | — |
| Q4 FY26 CASA ratio | 31.24% | 31.24% derived ((35,034 + 89,899) ÷ 3,99,931) | VERIFIED | Same | CASA ₹1,24,933 crore. |
| LCR retail deposits | ₹1,90,166 crore, 49.5%; average or period-end? | ₹1,90,166 crore, 49.5% share, **quarterly average** | VERIFIED | Same; Q1 FY27 call | Deck labels it an average under LCR definitions. The call calls it the highest share yet, up 4% QoQ. Do not present it as period-end. |

### 2. The MD's deposit-cost gap and peer comparators

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| MD's "~150 bp" gap to closest peer | ~150 bp, measure and peer unclear | Rajiv Anand, answering Kunal Shah (Citigroup): "cost of deposits gap between us and our closest peer, it's about 150 basis" | VERIFIED | [Q1 FY27 analyst call transcript](https://www.indusind.bank.in/content/dam/indusind-corporate/investors/QuarterFinancialResults/FY2026-2027/Quarter1/IndusInd-Bank_Analyst-Call_Q1FY27_20260722.pdf) (22 Jul 2026), p.8 of the extract | The measure is **cost of deposits**. **No peer is named.** He framed closing it as a medium-term aim. |
| Is 150 bp reproducible from disclosed peers? | 70–74 bp to Federal | Federal 74 bp (5.95 − 5.21); Yes 55 bp (5.95 − 5.4) | VERIFIED (arithmetic on primary figures) | Federal and Yes rows below | Neither disclosed peer cost of deposits gives 150 bp. IDFC First and Kotak disclose cost of funds only. The 150 bp comparator cannot be identified from public data. |
| Federal Bank cost of deposits, Q1 FY27 | 5.21% or 5.25% | **5.21%**, down 57 bp YoY | CONFLICT RESOLVED | [Federal Bank Q1 FY27 press release](https://www.federal.bank.in/documents/10180/1148302360/Press+Release+Q1+FY+27.pdf/7e534416-1740-8651-83ae-bb60f04ca961?t=1784277402845) (17 Jul 2026) | Federal's call transcript extract attaches 5.25% to cost of funds after a 21 bp fall, but the extraction is ambiguous. Use the press release's 5.21% cost of deposits. |
| Federal CASA ratio and direction | 32.23% | 32.23%, up 188 bp **YoY**; CASA ₹1,03,163 crore, +18.3% YoY | VERIFIED | Same | QoQ direction not confirmed from primary. Say "up YoY" only. |
| Yes Bank CASA and cost, Q1 FY27 | CASA 32.7%; CoD 5.4% | CASA 32.7% (Q4 FY26 35.1%; Q1 FY26 32.8%); cost of deposits 5.4% (−50 bp YoY, −10 bp QoQ); cost of funds 5.7% | VERIFIED | [YES BANK Q1 FY27 press release and presentation, NSE](https://nsearchives.nseindia.com/corporate/YESBANK_18072026134956_SE_Intimation_Press_Release_Investors_Presentation_18072026_Signed.pdf) (18 Jul 2026) | CASA fell 240 bp QoQ and was broadly flat YoY. |
| IDFC First CASA and cost, Q1 FY27 | CASA 50.8%; CoF 5.96% | CASA 50.8% (Mar 2026 49.8%; Jun 2025 48.0%); cost of funds 5.96% (−46 bp YoY, −4 bp QoQ); customer deposits ₹2,99,405 crore | VERIFIED | [IDFC FIRST Investor Presentation Q1 FY27](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/pdf/financial-results/Investor-Presentation_Q1FY27_2507_Final.pdf) (25 Jul 2026) | No cost of deposits is printed. Do not compare its 5.96% with IndusInd's 5.95% cost of deposits. |
| RBL CASA, Q1 FY27 | 25.2% or 29.21% | 25.2% is the **average** CASA ratio (primary). A period-end ratio of 29.2% is reported by Business Standard. | CONFLICT RESOLVED | [RBL Investor Presentation Q1 FY27](https://webassets.rbl.bank.in/ir_admin/financial_highlights/InvestorPPTQ1FY27.pdf) (17 Jul 2026); [Business Standard](https://www.business-standard.com/amp/markets/capital-market-news/rbl-bank-q1-pat-rises-27-yoy-to-rs-254-crore-126071800309_1.html) (18 Jul 2026, REPORTED) | Different bases, not a conflict. 29.21% to two decimals was not found in any primary text. RBL cost of deposits was not reliably extracted. |

### 3. The microfinance book

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| Microfinance book = ₹31,417 crore (C, G) | ₹31,417 crore | ₹31,417 crore is **"Rural Banking"**, a loan-mix segment (10% of book; −26% YoY, −2% QoQ) | CORRECTED | [Investor Presentation Q1 FY27](https://www.indusind.bank.in/content/dam/indusind-corporate/investors/investor-presentation/FY2026-2027/Investor-Presentation-Q1-FY26-27.pdf), loan-mix slide (22 Jul 2026) | Rural Banking also holds merchant, Kisan credit and affordable-housing books. |
| Microfinance book = ₹16,305 crore (P, X) | ₹16,305 crore | ₹16,305 crore, called the **"micro loans book"** on the call, −3% QoQ; about 74% under CGFMU guarantee | VERIFIED | [Q1 FY27 analyst call transcript](https://www.indusind.bank.in/content/dam/indusind-corporate/investors/QuarterFinancialResults/FY2026-2027/Quarter1/IndusInd-Bank_Analyst-Call_Q1FY27_20260722.pdf) (22 Jul 2026) | The deck footnotes "Micro Loan Book" as including RBI-definition microfinance **plus other inclusive-banking loans**, so it is not pure MFI. Investing.com reports −43% YoY (REPORTED; the YoY figure was not cleanly extracted from the deck). |

### 4. Consumer product lines and other Q1 FY27 book figures

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| Which line is ₹9,418 crore? | cards, PL or home loans | **Credit cards** ₹9,418 crore, −3% QoQ, −15% YoY | CONFLICT RESOLVED | Q1 FY27 call (says it outright); deck consumer slide | Call and deck series (₹11,059 → ₹9,418 crore) agree. |
| Which line is ₹9,930 crore? | cards, PL or home loans | **Personal loans** ₹9,930 crore, −4% QoQ, −7% YoY | CONFLICT RESOLVED | Same | — |
| Home loans | not settled | ₹6,889 crore, +38% YoY, +6% QoQ | VERIFIED | Same | Fastest-growing consumer line. Other retail ₹5,381 crore. Consumer Banking segment ₹31,617 crore. |
| Vehicle finance book | ₹99,718 crore | ₹99,718 crore, +3% YoY, 31% of loans | VERIFIED | Deck loan-mix slide; Q1 FY27 call | — |
| VF disbursements | ₹10,832 crore vs ₹12,665 crore in Q4 FY26 | ₹10,832 crore vs ₹12,665 crore (Q1 FY26 ₹11,298 crore) | VERIFIED | Deck VF slide; call confirms ₹10,832 crore | −14% QoQ and −4% YoY by arithmetic. The deck extraction swapped the YoY and QoQ labels; the arithmetic is unambiguous. |
| Wholesale book | ₹1,20,227 crore | ₹1,20,227 crore, +11% QoQ, +1% YoY, 37% of loans | VERIFIED | Deck loan-mix slide | Large corporates ₹54,187 crore; institutional and government ₹34,601 crore; mid-market ₹31,439 crore. |
| Net advances | ₹3,26,274 crore | ₹3,26,274 crore ("Overall Loan Book"), −2% YoY, +3% QoQ | VERIFIED | Same | — |

### 5. RoA, guidance and the 60/40 split

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| Reported RoA, Q1 FY27 | 0.78% | 0.78%, annualised (RoE 6.26%) | VERIFIED | [Investor Presentation Q1 FY27](https://www.indusind.bank.in/content/dam/indusind-corporate/investors/investor-presentation/FY2026-2027/Investor-Presentation-Q1-FY26-27.pdf) (22 Jul 2026) | — |
| Normalised RoA | 0.63% | 0.63% excluding one-off gains | VERIFIED | [Q1 FY27 analyst call](https://www.indusind.bank.in/content/dam/indusind-corporate/investors/QuarterFinancialResults/FY2026-2027/Quarter1/IndusInd-Bank_Analyst-Call_Q1FY27_20260722.pdf) (22 Jul 2026) | The one-off is a ₹284 crore interest recovery on an income-tax refund. The deck shows NIM 3.57% reported and 3.35% excluding one-offs. |
| Exit-FY27 ~1% RoA ambition | ~1% exit RoA | MD on the call: "grow in line with market this year with an exit ROA of 1%"; opening remarks call 1% the "immediate target" | VERIFIED | Same | Said by Rajiv Anand on the 22 Jul 2026 call. He hedged the word "guidance" and said the bank stands by it. |
| 60/40 split | 60% operating profit / 40% credit cost | CFO Viral Damania: "60 from PPOP, 40 from credit cost" on the path to 1% | VERIFIED | Same | Investing.com's slide summary agrees (REPORTED). |
| FY27 guidance as stated | — | Loan growth in line with the market; exit RoA of 1%. No numeric deposit-growth, credit-cost or NIM guidance found in the transcript extract. | VERIFIED | Same | Do not show numeric FY27 guidance beyond these two points. |

### 6. Complaints

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| BRSR FY25 complaints | 80,062 received; 15,811 pending; reclassification footnote | 80,062 received and 15,811 pending at year-end (FY24: 42,330 and 2,555). The footnote says the complaint classification was broadened for FY25. | VERIFIED | [IndusInd BRSR FY2024-25, NSE filing](https://nsearchives.nseindia.com/corporate/INDUSINDBK1_07082025225746_SEIntimationforBRSRmergedsigned.pdf) (7 Aug 2025) | The FY24 to FY25 rise is not like-for-like. No category split is given. |
| BRSR FY26 complaints | 1,22,331 received; 25,616 pending | Not confirmed in any source reached | NOT FOUND | BRSR FY26 filed on BSE on 5 Aug 2026 ([BSE copy](https://www.bseindia.com/xml-data/corpfiling/AttachLive/6fcf32cc-e690-4eb7-ad34-0c7a1fbd6f53.pdf), blocked 403) | The engine's secondary source (Investor Feed) returned no readable body. TipRanks, Investywise and ScanX coverage of the filing gives no complaint counts. |
| Annual Report FY26 RBI-format complaints table (received, disposed, maintainable from Ombudsman, top grounds) | sought | Not reached | NOT FOUND | [Integrated Annual Report 2025-26](https://www.indusind.bank.in/content/dam/indusind-corporate/investor-resource/latest-annual-report/annual-report-2025-2026.pdf) | The fetch truncates at about p.67; the statutory section (from about p.167) was not reachable. The FY25 table (69,204 received; 14,904 pending) remains the latest RBI-format figure in the research. |

### 7. Rates on the banks' own pages (read 2 October 2026)

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| IndusInd savings slabs, effective 1 Mar 2026 | 2.50% / 3.00% / 4.00% / 5.00% / 7.05% / 7.00% | Bank page shows only the headline "up to 4%"; the slab table is script-drawn and unreadable. Goodreturns gives effective 1 Mar 2026: up to ₹1 lakh 2.50%; ₹1–25 lakh 3.00%; ₹25 lakh–₹5 crore 4.00%; ₹5–100 crore 5.00%; ₹100–150 crore 7.05%; ₹150–1,400 crore 7.00%. | UNVERIFIABLE — secondary only | [IndusInd savings rate page](https://www.indusind.bank.in/in/en/personal/accounts/savings-account-interest-rate.html) (read 2 Oct 2026); [Goodreturns](https://www.goodreturns.in/personal-finance/indusind-bank-s-savings-bank-account-interest-rates-revised-now-earn-as-high-as-7-05-1493441.html) (3 Mar 2026, REPORTED) | Retail-relevant slabs top out at 4% below ₹5 crore. |
| IndusInd FD schedule (effective 24 Jul or 1 Jun 2026?): 1-year and 2–3-year regular rates | 1y 6.75%; 2–3y 7.00% (X) or 6.90% (C) | Bank page shows headlines only: "up to 7%" regular and "up to 7.75%" senior. fi.money (page dated 1 Sep 2026): 1y to <1y6m 6.75%; 1y7m to 3y 6.90%; peak 7.00% at 1y6m to <1y7m. | UNVERIFIABLE — secondary only | [IndusInd FD rate page](https://www.indusind.bank.in/in/en/personal/fixed-deposit-interest-rate.html) (read 2 Oct 2026); [fi.money](https://fi.money/deposits/fd-interest-rates/indusind-bank) (1 Sep 2026, REPORTED); [Outlook Money](https://www.outlookmoney.com/retirement/idfc-first-bank-and-indusind-bank-revise-fd-rates-seniors-can-earn-up-to-775-per-cent) (25 Jul 2026, REPORTED) | The effective date stays unresolved: 1 Jun, 24 Jul and 1 Sep 2026 all appear in secondaries. Outlook Money reports a 24 Jul revision, but its table appears to be senior rates. Only the 1-year 6.75% is consistent across readings. |
| RBL savings slabs | 3% / 5% / 6% | Page shows effective **1 Oct 2026**: up to ₹5 lakh 3.00%; ₹5–10 lakh 5.00%; ₹10 lakh–₹3 crore 6.00%; ₹3–25 crore 5.00%; above ₹25 crore 4.00% | VERIFIED | [RBL interest rates](https://www.rbl.bank.in/interest-rates) (read 2 Oct 2026) | The rates match the research, but the 6% band now ends at ₹3 crore, not ₹7.5 crore (Feb 2026 card). |
| RBL headline FD | 1y–500d 7.00% (2025 card) | Page shows effective 1 Oct 2026: 365–500 days 6.90%; peak 7.00% for 18 months to under 60 months | CORRECTED | Same | The 1-year rate is 6.90%, not 7.00%. |
| Federal FD | 1y 6.25%; card 17 Aug 2026 (reported) | Page shows effective **29 Sep 2026**: 1 year 6.25%; peak 6.70% at 48 months; >1y to <15m 6.55% | CORRECTED | [Federal deposit rates](https://www.federal.bank.in/deposit-rate) (read 2 Oct 2026) | The 1-year rate and peak are unchanged; the card date and the >1y band (6.40% → 6.55%) changed. |
| Federal top savings rate | 5.50%; effective 16 Jun 2026 | Page shows effective **16 Jul 2026**: 2.50% below ₹10 crore; 4.00% on ₹10 crore to <₹50 crore; 5.50% on ₹10 crore to <₹200 crore for ₹50–200 crore balances | CORRECTED | [Federal savings rates](https://www.federal.bank.in/savings-rate) (read 2 Oct 2026) | The date is 16 July, not 16 June. Retail customers earn 2.50%. |
| Yes FD | 2025 card: 12m 6.65%; peak 7.00%; or 7.25% from 2 Jun 2026 (reported) | Card w.e.f. **2 Jun 2026**: 12 months 6.65%; peak 7.25% at 18m1d to <24m | CORRECTED | [YES BANK all rates and charges PDF](https://www.yes.bank.in/sites/web/content/published/api/v1.1/assets/CONT13C66A7E18434B48BC40248F6202F4A4/native/allratesandcharges_pdf.pdf?download=false) (read 2 Oct 2026) | Confirms C's reported June move; the engines' latest primary card was stale. |
| Yes top savings rate | slabs w.e.f. 22 Jul 2025, top 5.00% | Card w.e.f. **7 Apr 2026**: 2.50% below ₹25 lakh; 3.50% for ₹25 lakh to <₹100 crore; 7.00% at ₹100 crore and above (as extracted) | CORRECTED | Same | Re-check the ₹100 crore+ line visually before any display. |
| IDFC First headline 1-year FD and top savings rate | FD card 10 Jun 2026 (1y 6.50%; peak 7.35%); savings top 6.50% | Bank pages are script-drawn; only the headline "up to 7%" savings is visible. Secondaries conflict: fi.money (1 Sep 2026) 1y 6.30%, peak 7.00%; Business Today (13 Aug 2026) peak 7.25%. | UNVERIFIABLE — secondary only | [IDFC FIRST interest-rate page](https://www.idfcfirst.bank.in/interest-rate) (read 2 Oct 2026); [fi.money](https://fi.money/deposits/fd-interest-rates/idfc) (REPORTED); [Business Today](https://www.businesstoday.in/personal-finance/investment/story/fd-rates-bandhan-bank-offers-7-45-idfc-first-7-25-how-much-more-can-you-earn-than-sbi-548883-2026-08-13) (13 Aug 2026, REPORTED) | Needs a manual browser read. |

### 8. Leadership: current holders

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| Head of Business Transformation | Pankaj Sharma or Shiv Kumar Bhasin | **Pankaj Sharma**, appointed Head, Business Transformation in Oct 2025. Bhasin (Chief Transformation Officer since Aug 2023) resigned effective 16 Jan 2026. | CONFLICT RESOLVED | [Business Standard](https://www.business-standard.com/companies/news/indusind-bank-strengthens-leadership-team-with-key-appointments-125100901179_1.html) (9 Oct 2025, REPORTED); [MarketScreener on Bhasin's resignation](https://www.marketscreener.com/news/indusind-bank-limited-announces-resignation-of-shiv-bhasin-as-chief-transformation-officer-and-senio-ce7d50d3df8ef325) (Jan 2026, REPORTED) | Sharma is not on the 30 Apr 2026 senior-management list or the FY26 annual-report leadership page. His Oct 2026 incumbency is secondary only. |
| Head of Strategy | Indrajit Yadav: IR only, or IR and Strategy? | **Indrajit Yadav, "Head, Investor Relations and Strategy"** | CONFLICT RESOLVED | [Q1 FY27 call, management roster](https://www.indusind.bank.in/content/dam/indusind-corporate/investors/QuarterFinancialResults/FY2026-2027/Quarter1/IndusInd-Bank_Analyst-Call_Q1FY27_20260722.pdf) (22 Jul 2026) | He was removed from the senior-management list on 30 Apr 2026 for a reporting-hierarchy change, so he likely sits a layer below the MD or CFO. |
| CRO | Saurav Saha or Vivek Bajpeyi | **Saurav Saha**, CRO; appointment approved 24 Feb 2026; Bajpeyi stayed until superannuation on 31 Mar 2026 | CONFLICT RESOLVED | [Senior-management list, NSE](https://nsearchives.nseindia.com/corporate/INDUSINDBK2_30042026155748_ChangeinSMP_.pdf) (30 Apr 2026); FY26 annual report leadership page | Appointment detail from [Investywise](https://www.investywise.com/indusind-bank-key-senior-management-appointments/) (24 Feb 2026, citing the BSE filing). |
| Chief Compliance Officer | Sunil Kumar Singh or Sachin Patange | **Sunil Kumar Singh**, effective 30 Apr 2026 for three years; Patange ceased at close of 29 Apr 2026 | CONFLICT RESOLVED | [IndusInd filing on CCO change, NSE](https://nsearchives.nseindia.com/corporate/INDUSINDBK1_24042026164645_3_SECCO_signed.pdf) (24 Apr 2026) | — |
| Head of Retail Assets | Sunit Madan or Ejaz Nazeer | **Sunit Madan, Head – Retail Assets** | CONFLICT RESOLVED | [Integrated Annual Report 2025-26](https://www.indusind.bank.in/content/dam/indusind-corporate/investor-resource/latest-annual-report/annual-report-2025-2026.pdf), leadership page (2026) | Nazeer does not appear in any primary source reached. |
| Corporate and Institutional Banking | Niraj Shah, still in role? | **Niraj Shah, Head – Corporate & Institutional Banking**, on the FY26 annual-report leadership page | VERIFIED | Same | He left the regulatory senior-management list on 28 Jan 2026 for a reporting-hierarchy change (ScanX, REPORTED). He now reports below the ED, Wholesale Banking (Ganesh Sankaran). |
| CFO and start date | Viral Damania; 22 Sep 2025 or Oct 2025 | **Viral Damania**, CFO and KMP; appointed effective 22 Sep 2025 | VERIFIED | 30 Apr 2026 senior-management list (incumbency); [Angel One](https://www.angelone.in/news/market-updates/indusind-bank-appoints-viral-damania-as-cfo-effective-september-22-2025) (22 Sep 2025, REPORTED, for the date) | October 2025 was the leadership announcement, not the start. |
| Chief Data Officer | Balaji Narayanamurthy | **Balaji Narayanamurthy**, CDO | VERIFIED | 30 Apr 2026 senior-management list; FY26 annual report | — |
| CIO | Ravi Pangal | **Ravi Pangal**, Chief Information Officer | VERIFIED | 30 Apr 2026 senior-management list | — |
| Head of Consumer Banking | Jagdeep Mallareddy | **Jagdeep Mallareddy**, Executive Director (designate on 30 Apr 2026), "Head, Consumer Banking" | VERIFIED | 30 Apr 2026 senior-management list; Q1 FY27 call roster (22 Jul 2026) | — |
| Head of Cards / Business Head, Credit Cards (title only) | not found | No such title appears in the Jan or Apr 2026 senior-management lists, the FY26 annual-report leadership page or the Q1 FY27 call roster | NOT FOUND | Same set | The role is below the disclosed tier. Per the brief, the individual was not researched. |

### 9. Enforcement

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| RBI penalty, 14 Aug 2026 | ₹59.20 lakh | ₹59.20 lakh, press release 2026-2027/897 (prid 63374). Grounds: interest paid on certain current-account deposits, and activity in the nature of synthetic securitisation, breaching the directions on Interest Rate on Deposits and Securitisation of Standard Assets. Inspection reference date 31 Mar 2025. | VERIFIED | [RBI press release](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=63374) (14 Aug 2026); [IndusInd disclosure](https://www.indusind.bank.in/content/dam/indusind-corporate/corporate-announcement/Others/Imposition_of_penalty_by_RBI-14.08.2026.pdf) (14 Aug 2026) | The [rbidocs PDF](https://rbidocs.rbi.org.in/rdocs/PressRelease/PDFs/PR897B40BBE4EF2564AF088AB2D24B8511D52.PDF) returns a CAPTCHA; the HTML page works. Imposed under s.47A(1)(c) read with s.46(4)(i) of the BR Act. |
| RBI penalty, Dec 2024 | ₹27.30 lakh | ₹27.30 lakh, press release 2024-2025/1753 (prid 59351), 20 Dec 2024; order dated 18 Dec 2024. Grounds: savings accounts opened in the names of ineligible entities, under the Interest Rate on Deposits Directions, 2016. | VERIFIED | [RBI press release](https://www.rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx?prid=59351) (20 Dec 2024); [IndusInd disclosure](https://www.indusind.bank.in/content/dam/indusind-corporate/corporate-announcement/Others/SEintimationPenaltybyRBI20122024%20signed.pdf) (20 Dec 2024) | Both RBI penalties concern deposit rules. |
| IRDAI penalty, Sep 2026 | ₹1 crore | ₹1 crore; order dated 10 Sep 2026; penalty under Reg. 20(1) of the Corporate Agents Regulations 2015 for lacking a dedicated policyholder grievance-redressal framework (a test complaint drew no acknowledgement). Other observations drew cautions or advisories only. | UNVERIFIABLE — secondary only | [TaxGuru summary of the order](https://taxguru.in/corporate-law/irdai-imposes-rs-1-crore-penalty-indusind-bank-corporate-agent-regulatory-violations.html) (10 Sep 2026, REPORTED) | The BSE disclosure exists but is blocked (403); the IRDAI order itself was not located. |
| SFIO letter of 24 Dec 2025 | letter dated 24 Dec 2025 | The SFIO letter is **dated 23 Dec 2025** (investigation under s.212 of the Companies Act); the bank disclosed it to exchanges on **24 Dec 2025** | CORRECTED | [Business Standard](https://www.business-standard.com/industry/banking/sfio-launches-probe-into-affairs-of-indusind-bank-125122400944_1.html) (24 Dec 2025, REPORTED, quoting the filing); [Business Today](https://www.businesstoday.in/latest/corporate/story/sfio-launches-probe-into-indusind-bank-over-accounting-and-derivative-issues-508107-2025-12-24) (24 Dec 2025) | The exchange filing itself was not reached. Scope reported: derivative accounting, unexplained other assets and liabilities, and microfinance interest and fee income. |

### 10. Regulatory dates

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| RBC Second Amendment Directions 2026 | issued 15 or 16 Jun 2026; effective 1 Jan 2027 | RBI/2026-27/115, **issued 15 Jun 2026, effective 1 Jan 2027**. Where mis-selling is established, the bank must refund the entire amount paid, plus compensation under its approved policy. | VERIFIED | [RBI notification](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13485) (15 Jun 2026) | 16 June was the press date. It also bars compulsory bundling of third-party products and requires explicit consent. |
| Internal Ombudsman Directions 2026: quarterly root-cause requirement | quarterly root-cause analysis | RBI/CEPD/2025-26/381, 14 Jan 2026, immediate effect; clauses 7(2), 14(2) and 14(4) by 30 Jun 2026. **Cl. 12(6)**: quarterly analysis of complaint patterns by product, category, customer group and geography. **Cl. 12(7)**: the IO suggests action on the root cause of similar or repeat complaints, with no stated frequency. | CORRECTED | [RBI notification](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13271&Mode=0) (14 Jan 2026) | The quarterly duty covers pattern analysis; the root-cause duty sits in a separate clause. The IO reports functionally to the Customer Service Committee of the Board. |
| Governance Amendment Directions 2026 | effective 1 Oct 2026 | RBI/2026-27/177, issued 14 Jul 2026, **effective 1 Oct 2026** | VERIFIED | [RBI notification](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13555&Mode=0) (14 Jul 2026) | The board must set out matters reserved to it, and delegation appendices are added. |
| DPDP Rules 2025 dates | notified 14 Nov 2025; phases 14 Nov 2026 and 14 May 2027 | G.S.R. 846(E), **published in the Gazette on 13 Nov 2025** (PIB release 14 Nov 2025). Rule 4 (Consent Managers) commences one year after publication, i.e. 13 Nov 2026. Rules 3, 5–16, 22 and 23 commence after 18 months, i.e. 13 May 2027. | CORRECTED | [DPDP Rules 2025, MeitY Gazette copy](https://www.meity.gov.in/static/uploads/2025/11/53450e6e5dc0bfa85ebd78686cadad39.pdf) (13 Nov 2025); [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014) (14 Nov 2025) | The 14th-of-month dates count from the PIB release. No amending instrument has been found (dpdprules.org, checked 2 Oct 2026). On screens, say "November 2026" and "May 2027". |

### 11. INDIE app

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| Google Play rating and review count | 4.5 and 8.11 lakh (C); 4.7 and 7.51 lakh (X) | **4.5 stars, 8.19 lakh reviews, 1 crore+ downloads**; listing updated 18 Sep 2026; listed as "IndusInd Bank: Savings A/C, FD" | CORRECTED | [Google Play, India listing](https://play.google.com/store/apps/details?id=com.indusind.indie&hl=en_IN&gl=IN) (read 2 Oct 2026) | Ratings vary by locale; this is the India listing. Date-stamp it on any screen. |
| Bank's claimed rating | 4.6 | Deck shows INDIE rating 4.6, with no store named; INDIE for Business also 4.6 | VERIFIED | [Investor Presentation Q1 FY27](https://www.indusind.bank.in/content/dam/indusind-corporate/investors/investor-presentation/FY2026-2027/Investor-Presentation-Q1-FY26-27.pdf), digital slide (22 Jul 2026) | It differs from the 4.5 read on Play; attribute it to the bank. |
| MAU | 2.6 million+ | 2.6 million+ monthly active INDIE users, as of 30 Jun 2026 | VERIFIED | Same | — |
| App FD/RD in Q1 FY27 | ₹6,800 crore+ | ₹6,800 crore+ of FDs and RDs opened, cumulative for Q1 | VERIFIED | Same | It is a flow for the quarter, not a balance. |

### 12. Rating action

| Claim | Value in research | Verified value | Status | Primary source | Note |
|---|---|---|---|---|---|
| CRISIL outlook to Stable, 19 Aug 2026 | Stable from Negative; AA+ | Outlook **revised to Stable from Negative**; long-term AA+ reaffirmed; CDs A1+. Top-20 depositors about 15% of deposits at 30 Jun 2026. | VERIFIED | [CRISIL rating rationale](https://www.crisil.com/mnt/winshare/Ratings/RatingList/RatingDocs/IndusIndBankLimited_August%2019_%202026_RR_402664.html) (19 Aug 2026) | India Ratings stayed at AA+/Negative on 2 Jul 2026 (not rechecked). |

---

## Safe to show on a demo screen

Each line gives the wording and label to use. Source tags go in small type under the figure.

1. **Deposits:** "Total deposits ₹4,14,766 crore, 30 Jun 2026 (+3.7% QoQ)". Source: IndusInd Q1 FY27 investor presentation.
2. **CASA:** "CASA ratio 29.4% (Jun 2026) vs 31.2% (Mar 2026)". Label: "derived from reported CA and SA balances".
3. **Savings balances:** "Savings deposits ₹87,440 crore, down 2.7% QoQ".
4. **Funding cost:** "Cost of deposits 5.95% (Q1 FY27), from 6.07% in Q4 FY26". "Cost of SA 4.72%". "Cost of funds 5.05%".
5. **Retail granularity:** "Retail deposits (LCR definition, quarterly average) ₹1,90,166 crore, 49.5% of deposits". Keep "quarterly average" in the label.
6. **MD's framing:** "MD and CEO, Q1 FY27 call: cost-of-deposits gap to closest peer about 150 bp". Label: "management estimate; peer not named".
7. **Disclosed peer gaps:** "Cost of deposits, Q1 FY27: IndusInd 5.95% · Federal 5.21% · Yes 5.4%". Label: "each bank's own Q1 FY27 disclosure".
8. **Peer CASA:** "CASA ratio, 30 Jun 2026: IDFC First 50.8% · Yes 32.7% · Federal 32.23% · IndusInd 29.4%". Footnote: "RBL reports 25.2% on an average basis; not comparable".
9. **Micro loans:** "Micro loans book ₹16,305 crore (−3% QoQ)". Label: "includes RBI-definition microfinance and other inclusive-banking loans".
10. **Rural segment:** "Rural Banking ₹31,417 crore, 10% of loans". Never label it microfinance.
11. **Consumer lines:** "Credit cards ₹9,418 crore (−3% QoQ, −15% YoY) · Personal loans ₹9,930 crore (−4% QoQ) · Home loans ₹6,889 crore (+38% YoY)".
12. **Vehicle finance:** "Vehicle finance book ₹99,718 crore (31% of loans) · Q1 disbursements ₹10,832 crore vs ₹12,665 crore in Q4 FY26 (−14% QoQ)".
13. **Book:** "Loans ₹3,26,274 crore (+3% QoQ) · Wholesale ₹1,20,227 crore (+11% QoQ)".
14. **Profitability:** "RoA 0.78% reported · 0.63% excluding one-offs (Q1 FY27, annualised)".
15. **Ambition:** "Management target: exit-FY27 RoA of 1%, about 60% from operating profit and 40% from lower credit cost". Source: Q1 FY27 call, 22 Jul 2026.
16. **Complaints, FY25:** "Consumer complaints FY25: 80,062 received, 15,811 pending at year-end (BRSR)". Label: "classification broadened in FY25; not comparable with FY24".
17. **Enforcement:** "RBI penalty ₹59.20 lakh, 14 Aug 2026: interest on certain current accounts; synthetic securitisation". "RBI penalty ₹27.30 lakh, 20 Dec 2024: savings accounts opened for ineligible entities".
18. **Regulatory calendar:** "RBI Governance Amendment Directions in force from 1 Oct 2026" · "Responsible Business Conduct Second Amendment (mis-selling, full refund) in force from 1 Jan 2027" · "Internal Ombudsman: quarterly complaint-pattern analysis (Directions of 14 Jan 2026)" · "DPDP: Consent Manager rules from November 2026; main obligations from May 2027".
19. **Rating:** "CRISIL outlook revised to Stable from Negative, 19 Aug 2026 (AA+ reaffirmed)".
20. **App:** "INDIE: 2.6 million+ monthly active users; ₹6,800 crore+ of FDs and RDs opened in Q1 FY27 (bank-reported)". "Google Play rating 4.5 from 8.19 lakh reviews, as of 2 Oct 2026".
21. **Peer rate cards (with their dates):** "Federal 1-year FD 6.25% (card effective 29 Sep 2026)". "Yes 12-month FD 6.65%; peak 7.25% at 18m1d–<24m (w.e.f. 2 Jun 2026)". "RBL 365–500-day FD 6.90%; savings 6% on ₹10 lakh–₹3 crore (page dated 1 Oct 2026)".
22. **People (names and titles):** MD and CEO Rajiv Anand · CFO Viral Damania · CRO Saurav Saha · Chief Compliance Officer Sunil Kumar Singh · CDO Balaji Narayanamurthy · CIO Ravi Pangal · ED and Head, Consumer Banking Jagdeep Mallareddy · ED and Head, Wholesale Banking Ganesh Sankaran · Head – Retail Assets Sunit Madan · Head – Corporate & Institutional Banking Niraj Shah · Head, Investor Relations and Strategy Indrajit Yadav.

## Do not show

1. **₹31,417 crore labelled as microfinance.** It is the Rural Banking segment. Using it as MFI doubles every microfinance sizing.
2. **Any named "closest peer" for the 150 bp gap.** The MD named none, and no disclosed peer cost of deposits reproduces 150 bp (Federal 74 bp, Yes 55 bp). Show it only as the MD's own estimate.
3. **Rupee sizing built on 150 bp** (for example about ₹6,200 crore a year at full closure). It rests on an unnamed comparator. If a sizing is needed, use a per-basis-point figure with the deposit base stated.
4. **IDFC First's 5.96% next to IndusInd's 5.95%.** One is cost of funds and the other cost of deposits.
5. **RBL "CASA 29.21%".** Not found in a primary source. The primary figure, 25.2%, is an average and is not comparable with period-end ratios.
6. **FY26 complaint counts (1,22,331 received; 25,616 pending).** Not confirmed in any source reached. Also no FY24→FY25→FY26 trend line, because the FY25 classification change breaks comparability.
7. **IndusInd's own FD and savings rate tables.** The bank pages could not be read and the secondary effective dates conflict (1 Jun, 24 Jul, 1 Sep 2026). Show only the page headlines ("up to 7%" FD, "up to 4%" savings) until someone reads the page in a browser and records the effective date.
8. **IDFC First rate cards.** Primary page unreadable; secondaries disagree on both the 1-year and peak rates.
9. **Yes savings "7.00% above ₹100 crore".** Extracted once; re-check visually first. It is irrelevant to retail customers in any case.
10. **IRDAI ₹1 crore penalty, dated and with grounds,** until the IRDAI order or the bank's exchange disclosure is read. If shown, label it "reported".
11. **"SFIO letter of 24 December 2025".** The letter is dated 23 December; 24 December is the disclosure date.
12. **DPDP dates "14 Nov 2026" and "14 May 2027".** The gazette date gives the 13th. Use month and year only.
13. **"Quarterly root-cause analysis" as an RBI rule.** The quarterly duty is pattern analysis; the root-cause duty has no stated frequency.
14. **App rating 4.7 or 4.6 as a store reading.** 4.6 is the bank's own claim, with no store named; the India Play listing reads 4.5.
15. **Pankaj Sharma as a named transformation sponsor, and any cards-head name.** Sharma's current role is secondary only, and no cards head appears in any primary disclosure. Shiv Kumar Bhasin left in January 2026 and must not appear.
16. **Federal CASA "up QoQ".** Only the YoY rise is confirmed.
17. **Numeric FY27 guidance beyond "grow in line with market" and "exit RoA of 1%".** None was given.
