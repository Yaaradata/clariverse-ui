# Public anchors for internal volumes: LisN HDFC demo

**Internal: YaaraLabs only.**
- **Purpose:** calibrate the synthetic internal layer (`data/seed/internal_v3`) so contact, complaint and cohort volumes sit at a believable scale for HDFC Bank.
- **Compiled:** 1 Oct 2026, from public sources.
- **Tags:** every figure below is one of:
  - **ANCHOR**: published figure, with source
  - **DERIVED**: arithmetic on an anchor
  - **ASSUMPTION**: our planning figure, to confirm in discovery

---

## 1. Bank scale

| # | Metric | Value | Tag | Source |
|---|---|---|---|---|
| A1 | HDFC Bank customer base (post-merger) | ~12 crore (120 million) | ANCHOR | Wikipedia, HDFC Bank |
| A2 | HDFC Bank credit cards in force | 2 crore+ (first Indian bank to cross 2 crore, Jan 2024) | ANCHOR | 5paisa, Jan 2024 |
| A3 | HDFC Bank employees | ~2.11 lakh (FY25) | ANCHOR | Wikipedia, HDFC Bank |
| A4 | Ultra-HNI customers at the bank | ~2 lakh "at the bare minimum" | ANCHOR (sponsor call, not public) | Vidya Pradeep, call of 25 Sep. Treat as directional |

## 2. Complaints

| # | Metric | Value | Tag | Source |
|---|---|---|---|---|
| C1 | HDFC Bank complaints, "other" category, FY25 (BRSR) | 4.42 lakh (down from 4.70 lakh in FY24) | ANCHOR | GoodReturns; Angel One (both citing HDFC BRSR FY25) |
| C2 | HDFC Bank complaints pending at FY25 year-end | 16,133 | ANCHOR | same as C1 |
| C3 | Complaints per day | ~1,210 | DERIVED | C1 / 365 |
| C4 | Complaints per week | ~8,500 | DERIVED | C1 / 52 |
| C5 | Complaints in a 13-week window (our "full window") | ~1.1 lakh | DERIVED | C3 × 91 |
| C6 | Pending share at year-end | ~3.6% of annual intake | DERIVED | C2 / C1 |
| C7 | HDFC Bank grievances via National Consumer Helpline, 1 Jan–10 Sep 2025 | Top ground "Delay / denial of services" 822; "Amount debited without consent" 494; "Account block / hold" 406; "Rewards / loyalty / cash-back" 118 | ANCHOR | consumerhelpline.gov.in company dashboard |

**Caveat on C1:** BRSR reports by category, and the press reported only the "other" bucket for HDFC. HDFC's total complaints may be higher. Its RBI-format disclosure (complaints received, maintainable complaints from the Ombudsman, top five grounds) is in the annual report's notes on complaints; **fetch it before the Anjani meeting** and replace C1 with it if it differs.

## 3. Ombudsman (industry context)

| # | Metric | Value | Tag | Source |
|---|---|---|---|---|
| O1 | All complaints under RB-IOS, FY25 (CRPC + ORBIOs) | 13.34 lakh, up 13.55% | ANCHOR | RBI Annual Report of Ombudsman Scheme 2024-25 (via Outlook Money, MediaNama) |
| O2 | Complaints received at ORBIOs, FY25 | 2,96,321 | ANCHOR | same |
| O3 | Share of ORBIO complaints against banks | 81.53% (2.41 lakh) | ANCHOR | MediaNama |
| O4 | Top ground at ORBIOs | Loans and advances, 29.25%; credit cards second | ANCHOR | RBI report; MediaNama |
| O5 | ORBIO complaints per lakh accounts | 7.7 (down from 8.9) | ANCHOR | RBI report |
| O6 | Maintainable complaints from the Ombudsman, peer banks | IndusInd 6,563 (FY25), 8,374 (FY26); Canara 4,983 (FY25), 5,650 (FY26); IDFC First 3,682 (FY25), 4,824 (FY26) | ANCHOR | each bank's complaint disclosure |
| O7 | HDFC maintainable complaints from the Ombudsman | Not found in public search. Planning range 7,000–12,000 a year (bank size vs peers in O6) | ASSUMPTION | replace with HDFC's own disclosure |
| O8 | HDFC Ombudsman complaints per week | ~135–230 | DERIVED | O7 / 52 |

## 4. Contacts (not published; planning assumptions)

No Indian bank publishes total contact-centre or email volumes. Use these planning figures and label them "illustrative until discovery".

| # | Metric | Value | Tag | Reasoning |
|---|---|---|---|---|
| K1 | Total service contacts per complaint | 15–30× | ASSUMPTION | Most contacts are queries and requests, not complaints. Confirm in discovery |
| K2 | Total service contacts per day | ~18,000–36,000 | DERIVED | C3 × K1 |
| K3 | Contacts in a 13-week window | ~16–33 lakh | DERIVED | K2 × 91 |
| K4 | Channel mix | Calls 50–60%, chat/WhatsApp 15–25%, email 10–15%, branch 5–10%, social inbox 1–3% | ASSUMPTION | Typical for a large Indian retail bank; confirm |
| K5 | Product mix of complaints | Lead with loans and cards, matching O4; then accounts, UPI/PayZapp, insurance | DERIVED | O4 plus the C7 grounds |

## 5. Priority lists

| # | Metric | Value | Tag | Reasoning |
|---|---|---|---|---|
| P1 | Ultra-HNI list size | ~2 lakh | ANCHOR (sponsor) | A4 |
| P2 | Ultra-HNI customers with any contact in 13 weeks | 15–30% of the list (~30,000–60,000) | ASSUMPTION | Confirm |
| P3 | "Ultra sensitive" and "RBI & Government" lists | Much smaller than ultra-HNI: low thousands at most | ASSUMPTION | The bank's own lists; confirm |

---

## 6. Where the current demo sits (from screens of 1 Oct, full window)

| Metric | Demo | Anchor-based | Ratio | Verdict |
|---|---|---|---|---|
| Total contacts, full window | 46,311 | ~16–33 lakh (K3) | ~35–70× too low | **Fix**: rescale, or label it a sample |
| Complaints alone, full window | (below 46,311) | ~1.1 lakh (C5) | Contacts are lower than complaints alone | **Fix** |
| Ultra-HNI customers with contacts | 151 | ~30,000–60,000 (P2) | ~200–400× too low | **Fix** |
| Ultra-HNI contacts | 1,551 | scales with P2 | — | Rescale with P2 |

**Two ways to fix it, for Ranjith to choose:**
1. **Bank scale.** Rescale every figure to the anchors above. Numbers look real, but the seed gets large; precompute aggregates and keep only sample rows for drill-downs.
2. **Sample.** Keep the current size and say "Sample: 1 in N contacts" on screen. Cheaper, but the absolute numbers look small to someone who knows the bank.

Option 1 fits Ranjith's ask ("as realistic as possible for Anjani").

---

## Sources
- [GoodReturns: bank complaints in FY25 BRSR](https://www.goodreturns.in/news/rbi-ombudsman-report-fy25-sbi-faces-maximum-customer-grievances-axis-bank-highest-among-private-pl-011-1450243.html)
- [Angel One: SBI highest complaints FY25, HDFC figures](https://oga-prod.angelone.in/news/market-updates/sbi-receives-the-highest-number-of-customer-complaints-in-fy25-while-axis-bank-tops-among-private-sector-lenders)
- [National Consumer Helpline: HDFC Bank grievance dashboard](https://consumerhelpline.gov.in/public/dashboard/sectorcompanyNatureWise/3/280)
- [RBI: Annual Report of Ombudsman Scheme 2024-25](https://rbi.org.in/scripts/PublicationsView.aspx?id=23441)
- [Outlook Money: RBI Ombudsman FY25](https://www.outlookmoney.com/banking/rbi-ombudsman-disposal-falls-to-93-in-fy25-when-to-approach-for-complaint-redressal)
- [MediaNama: RBI Ombudsman FY25 breakdown](https://www.medianama.com/2025/12/223-rbi-ombudsman-14-banking-complaints-fy25-private-banks/)
- [IndusInd complaint disclosure FY25](https://indie.indusind.com/content/dam/regulatoryDisclosure/others/Links/Complaints-Analysis-FY-2024-25.pdf), [FY26](https://www.indusind.bank.in/content/dam/regulatoryDisclosure/grievanceRedressal/complaint-analysis-FY-25-26.pdf)
- [Canara Bank complaint disclosure](https://www.canarabank.bank.in/documents/d/guest/disclosure-of-complaints-march-2026)
- [IDFC First complaint data FY25](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/grievance-redressal/Complaints-Data-FY-2023-24.pdf), [FY26](https://www.idfcfirst.bank.in/content/dam/idfcfirstbank/grievance-redressal/Complaints-Data-FY-2025-26.pdf)
- [Wikipedia: HDFC Bank](https://en.wikipedia.org/wiki/HDFC_Bank)
- [5paisa: HDFC Bank crosses 2 crore credit cards](https://sandbox.5paisa.com/news/hdfc-bank-becomes-1st-bank-to-have-2-crore-credit-cards)
