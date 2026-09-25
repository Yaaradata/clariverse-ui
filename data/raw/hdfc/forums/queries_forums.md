# queries_forums.md

Window: 2026-08-01 to 2026-09-24 (inclusive, IST calendar date).
Bank: hdfc. Mode: RAW B3a (no LLM, no product tagging, no complaint filter, no entity drops).
PII: mask card numbers (keep last 4), bank account numbers, Aadhaar and PAN. Names, phones, emails and vehicle numbers are left as-is.
Query scope: "hdfc…" search terms and HDFC pages only. The broadened product/app terms from the spec (Infinia, Regalia, Millennia, Diners, Swiggy HDFC, Tata Neu, PayZapp, MobileBanking, NetBanking, misspellings) were not used in this run.

## complaintsboard
Seeds:
- `https://www.complaintsboard.com/hdfc-bank-b103657`
Counts: records=2; earliest=2026-08-20T13:34:00+05:30; latest=2026-08-29T13:33:00+05:30; gaps: comment/response endpoints returned HTTP 410, so replies and company responses were not collected

## consumercomplaints
Seeds:
- `https://www.consumercomplaints.in/hdfc-bank-limited-b100164`
- `https://www.consumercomplaints.in/bycompany/hdfc-credit-card-a566474.html`
- `search:hdfc`
- `search:hdfc bank`
- `search:hdfc credit card`
- `search:hdfc home loan`
- `search:hdfc personal loan`
- `search:hdfc car loan`
- `search:hdfc netbanking`
- `search:hdfc debit card`
- `search:hdfc loan`
Counts: records=7; earliest=2026-08-09T00:00:00+05:30; latest=2026-09-16T00:00:00+05:30; gaps: date-only timestamps (T00:00:00+05:30); company pages crawled only when the URL slug contains hdfc/credila; search hits kept even when filed under other companies

## technofino
Seeds:
- `https://technofino.in/community/tags/hdfc/`
- `https://technofino.in/community/forums/hdfc-bank-credit-card.43/?order=last_post_date&direction=desc`
Counts: records=792 (first posts and replies; older threads included where they have replies in the window); earliest=2026-08-01T00:02:57+05:30; latest=2026-09-24T21:37:58+05:30; gaps: site search not used, so threads only on other tags/sub-forums are not covered

## mouthshut
Seeds:
- `https://www.mouthshut.com/product-reviews/hdfc-bank-reviews-925004501`
- `https://www.mouthshut.com/product-reviews/hdfc-home-loan-reviews-925979273` (found via search)
- `search:hdfc`
- `search:hdfc bank`
- `search:hdfc credit card`
- `search:hdfc loan`
- `search:hdfc home loan`
- `search:hdfc personal loan`
- `search:hdfc car loan`
- `search:hdfc netbanking`
- `search:hdfc debit card`
Counts: records=5; earliest=2026-08-13T18:16:40+05:30; latest=2026-09-21T18:45:20+05:30; gaps: none

## trustpilot
Seeds:
- `https://www.trustpilot.com/review/hdfcbank.com?sort=recency`
Counts: records=53; earliest=2026-08-01T16:18:48+05:30; latest=2026-09-23T21:44:29+05:30; gaps: none

## complaintboardin
Seeds:
- `https://www.complaintboard.in/complaints-reviews/hdfc-bank-credit-card-l13482.html`
- `https://www.complaintboard.in/?search=hdfc bank`
Counts: records=0; earliest=—; latest=—; gaps: www.complaintboard.in does not resolve (DNS); the site appears to be offline