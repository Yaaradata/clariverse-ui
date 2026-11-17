# NatWest Pulse v1: independent review (HL-11), round 3, review of record

Reviewed: `main` at 2f8b5c2, production build on port 3100 (already running, not rebuilt). Read-only; nothing in the repo
changed. Earlier review files were not read before this report was finished.

**Method.** All 85 routes in `scripts/routes_natwest.json` rendered with Playwright at 1536×864 and 390×844, dark and
light (340 page loads). Captured: HTTP status, redirects, console and page errors, visible text, full-page screenshots,
sideways scroll and text cut off at the right edge. On `mds-office` all 19 Ask LisN suggestions were clicked at both
widths and the answers and links captured. On `/market` the "Show group-company apps" box was ticked. Text was scanned
with a regex list for items 2–4 and 7, then read page by page for item 5. Section anchors behind Ask links were checked
in the DOM.

**Inputs.** Read: brief.md, pass2_natwest_fit.md, pass3_scope.md, carry_forward_from_hdfc.md, and NW-D01 to NW-D65.
**`docs/natwest/research_pack.md` does not exist in the repo** (NW-D01 says the same).

Evidence (scratch): `crawl.mjs`, `results.json`, `text/*.txt`, `ask_answers__w1536.json`, `shots/`, `crops/`.

---

## Summary

| # | Check | Result | FAILs |
|---|---|---|---|
| 1 | Routes 200, no client error, both widths | **PASS** | 0 |
| 2 | HDFC / India wording, internal ids | **FAIL** | 4 |
| 3 | NatWest Group / RBS / Ulster outside exempt lines | **PASS** | 0 |
| 4 | Pass 2 §15 banned words | **FAIL** | 1 |
| 5 | Figures a UK retail banker would question | **FAIL** | 13 |
| 6 | 390px layout | **FAIL** | 1 |
| 7 | Brief coverage, empty text, Ask links | **FAIL** | 9 |

---

## 1. Routes: PASS (0)

- 340 of 340 loads returned 200. The first run had 4 loads with `net::ERR_NETWORK_CHANGED` (a host network blip) on
  `signal/app_login_biometrics` and `signal/care_unreachable`. Re-running both routes at both widths and themes gave 200
  with no errors.
- No `pageerror` and no console errors anywhere. Light and dark themes both applied (`data-lisn-theme` matched on all 340).
- Redirects: `/natwest-pulse` → `/natwest-pulse/v1/mds-office`; `/natwest-pulse/v1` → `/v1/mds-office` (accepted,
  NW-D58); `/v1/service-promise` → `/v1/deliverables` (kept as the brief asks).
- `<title>` is "LisN · NatWest". `X-Robots-Tag: noindex, nofollow, noarchive` is present.

## 2. HDFC / India wording and internal ids: FAIL (4)

Clean (0 hits): RBI, IO, UPI, NEFT, IMPS, KYC, PAN, Aadhaar, EMI, TAT, lakh, crore, ₹, PayZapp, INDIE, RM, RELM,
grievance, nodal, list A/B, HDFC, IndusInd, IST, Indian place names, NW-D/HL-/L2- ids, version tags, people's names.
Complaint ids (CMP-) and masked ids (XXXX) appear only on the save list, the customer page and the /priority table,
which NW-D60 accepts. "Persona 1–12" are labelled fictional.

1. **Bare "Ombudsman".** Pass 2 §4 renamed the section because bare "Ombudsman" is ambiguous. These still use it:
   - Ask (mds-office): "How many complaints are on the brink of going to the Ombudsman?" · "Which product has the most
     Ombudsman risk?" · "Are customers on our lists at risk of going to the Ombudsman?" · link "Open the Ombudsman
     watch" (the section is "Financial Ombudsman watch").
   - /business/cards: "The at-risk pill counts complaints on the Ombudsman watch (internal, illustrative)".
   - /deliverables: "CLIMB RISK: THEMES CLOSEST TO THE OMBUDSMAN RUNG".
   - /module/cards: "0 public cards items name a regulator, court or ombudsman".
   - Accepted: the tile "Referred to the Ombudsman" (the brief names it, and it sits under "Financial Ombudsman watch").
2. **Indian English.** /action-queue, Bucket 4 customer email: "The status page says under process."
3. **"Attorney" (US/Indian usage; a UK bank would say solicitor, or someone with power of attorney).** /priority, Persona 9:
   "Email from the customer's attorney: the account was moved to a packaged account…". /priority, How a customer gets on
   a list: "Linked contacts: a carer or attorney writing on the customer's behalf…".
4. **HDFC collection history shown as NatWest fact.** No NatWest public data is loaded, yet these lines describe HDFC's
   collectors:
   - /satisfaction and /market: "Reddit is left out: its collector changed on 1 Sep." and "Reddit (collector changed 1 Sep)".
   - /module/cards: "so the capped late-September X run cannot swing it".
   - /market: "No baseline: the exports hold no history before August."
   - /module/cards and /module/cora_digital: "App Store exports carry no reply field; bank-authored X posts were not
     collected." and "No Google Play reviews are tagged to this product… where bank replies were not collected."
   - Ask "Did the bank respond to public posts?": "Google Play replies are collected; the other sources are
     illustrative." This one also breaks HL-15: no public source is illustrative, and nothing is collected.

## 3. NatWest Group / Royal Bank of Scotland / RBS / Ulster: PASS (0)

- "NatWest Group" 0; "RBS" 0.
- "Royal Bank of Scotland" and "Ulster" appear only in the footer exclusion sentence (every page) and in the /market
  toggle list "Excluded brands, not loaded: Royal Bank of Scotland · Ulster Bank · Coutts · Mettle".
- With the box ticked, the toggle shows exactly that line.

## 4. Pass 2 §15 banned words: FAIL (1)

Clean (0): business (as a product word; only "10-business-day" appears), business head, MD's office, relationship tier,
deliverable, timeline, compensation, closure intent, backend, revert, listed customer, data intimacy, household, Private.

1. **Bare "cards" as a product word (lower case):**
   - /module/cards: "0 public cards items name a regulator…" and "Public mentions count theme tags on cards items".
   - /business/cards: "Owners are roles in the cards team."
   - /deliverables and /service-promise: "Service, payments, loans and cards themes with the most negative public items".

## 5. Figures a UK retail banker would question: FAIL (13)

**These hold:**
- Weekly change on all four Ombudsman tiles is within ±10% (+6 / −32 / +14 / −58).
- Referred (1,177) is at most past 8 weeks plus unhappy (384 + 2,613).
- Referral pace: the tile gives about 147 a week (1,177 over 8 weeks) and the bank ladder about 135 a week (1,985 over
  14.7 weeks). Both are near 150.
- Regulatory clocks are right: PSRs 2017 refund by the end of the next business day; FCA DISP 8 weeks; 15 business days
  for payment services (35 exceptional); PSR 5 business days; Faster Payments same day.
- Totals reconcile:
  - Owners alerted: 3,501 of 7,309 equals the four cards.
  - CX pulse: the six rows sum to volume, open and too long.
  - The six product cards sum to 417,454.
  - At risk by product sums to 3,296, column by column.
- Sample labels are on /priority, the retention watchlist and the ledger.
- Cora open too long is below Calls in every period (14 / 21 / 22% against 22 / 43 / 47%).
- Cohorts against 13m: 1.78m (13.7%), 750k, 758,300, 43,000. Plausible, but labelled only by the global "illustrative"
  watermark, not as assumptions.
- "15 weeks" is right for 1 Aug–12 Nov.

**Each FAIL is an unlabelled error unless marked otherwise:**

1. **Closed complaints counted as open.**
   - Ask, "on the brink": "That is 3,296 at risk of 6,213 open complaints".
   - The home tiles show 5% / 6% / **42%** / **19%** of that same 6,213 base, with no label for the base.
   - "Unhappy with the final response" (2,613) and "Referred" (1,177) have already had a final response, so they are not
     open complaints.
2. **Credit-card ladder contradicts the credit-card Ombudsman tile.**
   - /business/cards/service (last 7 days): "Complaint 152 · Complaints team 12 · Final response 12 · Financial
     Ombudsman Service 0".
   - The same week on /business/cards: "Referred to the Ombudsman 164 (▼ −4)", which implies about 20 new referrals a
     week, and "Unhappy with the final response 516".
   - Twelve final responses a week cannot feed 516 unhappy customers.
   - Complaints team / complaint is 8% here against 49% on the bank ladder (30,050 / 61,219).
   - 152 complaints a week is about a fifth of credit cards' share of 49,200 in the window.
3. **Window volume differs by screen.**
   - Home, Full window: "Overall contact volume 5,801,539".
   - /satisfaction tier table ("1 Aug to this morning, bank scale"): 3,530,118 + 1,831,684 + 449,630 + 427,882 =
     **6,239,314**.
   - /deliverables ladder: "Voice · internal, illustrative, bank scale 6,239,314".
4. **Journey answer contradicts the journey table.**
   - Ask "Which journey is leaking most customers this week?": "Everyday banking: 1,295 of the 1,308 switching-intent
     contacts" (99%).
   - /satisfaction journey stages: Everyday banking 26 of 79 (33%), Switch or close 22.
5. **Recent complainants smaller than the complaints inside them.**
   - Ask "Are customers on our lists…": "Recent complainants (90 days) 113" at-risk complaints.
   - The brink tile alone holds 299 complaints made in the last 10 weeks, and all of them are in the 90-day register.
   - Home "Recent complainants · OPEN 244" against "6,213 open complaints".
6. **Premier over-weighted.**
   - "Premier 2,048" of 3,296 at-risk complaints (62%), from 5.8% of customers.
   - 9 of 10 credit-card save-list rows are "· Premier".
   - /priority: "Premier … 836 customers in the sample" against "Financially vulnerable … 503 customers in the sample",
     although the vulnerable cohort is 2.4× larger.
7. **/priority headline does not match its tiles.**
   - Headline: "Owners have been told about 9 of the 33 customers with an owner alert due" and "63 customers on the bank's
     priority lists have an issue open".
   - The four tiles give 7/24 + 2/9 + 43/217 + 21/103 = **73 of 353**, and 54 + 9 + 220 + 117 = 400 with an open issue.
   - The headline counts two lists only.
8. **Owners-alerted numerator does not move with the period.**
   - Financially vulnerable: "1,325 of 2,747" (7 days), "1,325 of 4,296" (30 days), "1,325 of 4,399" (Full window).
   - Recent complainants: "30 of 30" (Morning brief), "30 of 244" (7 days), "30 of 284" (30 days).
9. **Backlog deltas.**
   - CX pulse "37,122 OPEN ▼ −36,994 vs previous period": the backlog halves in a week while volume is −2%.
   - Financially vulnerable "OPEN 5,614 ▼ −8,987".
   - Full window: "▲ +10% vs previous period" and "OPEN ▼ −55,594 vs previous period", with no data before 1 Aug.
   - "Open", a stock at the freeze, reads 7,167 / 37,122 / 46,278 / 48,821 depending on the period.
10. **Negative shares.**
    - Home, 7 days: Savings "Negative internal: 24%", Personal loans "19%". HL-19 band is 9–16% by product.
    - Morning brief: Personal loans "Negative internal: 94%" (937 contacts, ▼ −84%); Mortgages "41%".
11. **Owners and tiers on personas.**
    - All 12 /priority personas show owner "Premier banking manager", including 4 financially vulnerable and 3 recent
      complainants who are not Premier. NW-D63 says recent complainants go to the complaints lead.
    - Persona 2 (Financially vulnerable): "The relationship manager (Premier) called back".
    - /customer/XXXX4821: "RELATIONSHIP Premier relationship, 14 years" with "COHORT Financially vulnerable", while
      /priority does not list it as Premier.
12. **Synthetic public figure.** /priority High-impact complaints: "Public post with reach 43" while no public data is
    loaded (HL-15).
13. **Product mapping (minor).** /deliverables by product: "Mortgage redemption statement" shows in the LOANS column (94%),
    and the ledger owner is "Loans".

## 6. 390px: FAIL (1)

- Page-level sideways scroll: 0 of 170 loads at 390.
- No text runs past the viewport outside a scroll box.
- Data tables scroll sideways inside their own boxes, as in oct13: home CX pulse, /deliverables, /business/cards,
  /satisfaction tiers, /module/cards. On home this hides the "Waiting" and "Too long" columns until scrolled. Noted,
  not counted.
- NW-D65's "Repeat contact by category" box is accepted.

1. **/priority "Priority customers this morning".** The Products column wraps one word per line and is cut at the box
   edge ("Credit / cards, / Curren / accour / and ap / Payme / and frc"). Each row is about 280px tall
   (`crops/priority_3.png`).

## 7. Brief coverage, empty text, Ask links: FAIL (9)

**Present and correct:**
- Header, title, watermark and footer (Pass 3 §1–3).
- Four cohorts with sizes; six product cards in Pass 2 order; Cora as a CX row and module only.
- Channel rows Calls · Cora · Secure message · Email · Social · Branch; "over 48 hours (bank SLA, illustrative)".
- Financial Ombudsman watch with the four brief tiles.
- Tiers Select · Reward · Premier Select · Premier Reward; Consumer Duty outcomes; "Switching intent"; journey stages.
- NatWest service lines on /market; NatWest app only, with the excluded-brands toggle.
- Credit-card product view, owners and categories.
- "Priority customers" with a 4/3/3/2 persona mix.
- Action-queue buckets and final-response / 6-month wording; "Service standards ledger" and "Redress".
- Cora fix list.
- All five persona Ask questions, including the Pass 3 journey question; no brand-gap question.

**Absent, as ruled:** RBS and Ulster apps, Overdrafts and Cora as product rows, "Private", "MD's office". "undefined",
"NaN", "null" and "[object" appear 0 times.

1. **Ask links that miss their section.**
   - "Open the Ombudsman watch" → `/mds-office#ombudsman`, but the section id is `ombudsman-watch`, so the link lands at
     the top of the page.
   - "Open the CX pulse" → `/mds-office?period=7d` has no anchor (`#cx-pulse` exists).
2. **Empty sentences.**
   - /satisfaction: "In public voice, 0 posts say the customer will switch, close or has closed an account or card. For
     example:" Nothing follows.
   - /satisfaction: "Unweighted, the last 7 days would read — against the window average, because one source's share
     jumped; source-weighted, the change is —."
   - /deliverables: "0 request types missed their service standard in public voice this window; service requests drives
     the most; 0% of posts are customers asking where something is."
   - /business/cards: "Net sentiment of credit card public voice is — (— vs previous period), source-weighted."
3. **Zeros shown as figures with no data (HL-15).** /business/cards: "0% Google Play 4–5★ share · 0 reviews", "0% App
   Store", "0% Positive share", "0% Asking status".
4. **Removed story still on screen.**
   - /module/cards headline: "Eligibility and upgrades leads." That row is all "—".
   - /module/cards action: "Set a date on eligibility and upgrade requests".
   - Signal page title: "Credit card eligibility and upgrades". NW-D40 renamed this to "Eligibility and card changes";
     NW-D54 removed the variant story.
5. **Wrong footnote.** /priority Multi-product block ends "A Premier relationship from core banking. LisN reads it; it
   never adds anyone to Premier." This is the Premier block's text.
6. **Untrue footer claim (HL-04).** Every page: "Public figures from NatWest and regulator disclosures as dated in the
   research pack". The research pack is not in the repo, register values are pending (NW-D01), and "research pack" is an
   internal term.
7. **Ask answer omits a list.** "Are customers on our lists at risk…" shows 3 of the 4 lists (Multi-product is missing).
   It also says "The Owner should hear first."
8. **Cora return figure missing.** Brief Step 5.11 asks for "resolved by Cora, back as a call or complaint within 7
   days". It is not on `/module/cora_digital`. The Ask answer says it "needs Cora logs joined to call records", so the
   gap is labelled on screen but has no NW-D entry.
9. **Inconsistent date and copy.**
   - Ask uses "As at 2026-11-12" (ISO date) and "As of 12 Nov, 07:45" in the same answer set.
   - /market subtitle lists "X, Reddit, consumer forums, Google Play and App Store" without Trustpilot, which the sources
     line includes.
   - /deliverables note says "Bank standard: confirm in discovery", but the rows read "confirm with the bank".

---

**Verdict: NOT DEMO-READY.** Single most important fix: put every complaint figure on one register a banker can follow
across screens. Stop counting final-response and referred complaints as "open" (Ombudsman tile percentages, "3,296 at
risk of 6,213 open complaints"). Make the credit-card ladder (152 complaints, 0 referrals this week) agree with the
credit-card Ombudsman tile (164 referred, 516 unhappy).
