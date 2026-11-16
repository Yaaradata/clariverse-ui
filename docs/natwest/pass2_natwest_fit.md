# NatWest Pulse v1 — Pass 2: NatWest fit review and corrections

Reviewed against `qa/dashboard_inventory.md` (13 Nov 2026). Rule unchanged: same `oct13` layout, nothing added or removed. This pass changes **words, roles, cohorts, data sizing and copy** so a NatWest reader sees a NatWest product, not HDFC with a UK dictionary. Log every change as NW-D30 onward. Commit after each numbered section. Still no push until Deployment Protection is confirmed.

Legend per item: **KEEP** (right as is) · **RELABEL** (words only) · **FIX** (data or logic) · **DATA** (correct, empty until the public pull lands).

---

## 1. Global frame

| Element | Verdict | Change |
|---|---|---|
| Header "NatWest Group · Customer Pulse · <date> GMT" | KEEP | — |
| Page title "MD's office / Head of CX" | RELABEL | → **"Head of Customer Experience"** on `mds-office` and `head-cx`. NatWest has no "MD's office" concept; the persona's own title is Managing Director, Customer Experience and Engagement, and the role in our rail is "Head of Customer Experience". Subtitle → "The pulse first, then today's morning brief, product by product." |
| Period toggle, light/dark, Ask LisN bar | KEEP | — |
| Left rail: "Cards: business view" | RELABEL | → **"Credit cards: business view"** (NatWest says "credit cards", never "Cards" alone). |
| Left rail: "Action queue: escalation emails" | RELABEL | → **"Action queue: complaint escalations"**. |
| "Sample rows · 32,000 kept for drill-down" | KEEP | — |
| Watermark and footer | KEEP | Add "GMT" after the freeze time in the footer if missing. |
| "business by business" / "business" anywhere in copy | RELABEL | NatWest talks about **products** and **journeys**, not "businesses". Global swap: "business" → "product" in all on-screen copy (section titles, brief labels, Ask LisN answers, owner strings). Keep the route id `business/`. |

## 2. Home — Customer pulse

| Element | Verdict | Change |
|---|---|---|
| Four cohort cards, layout | KEEP | — |
| Cohort "Financially vulnerable (Consumer Duty)" 1,200,000 | FIX | Resize to **2.6 million (13% of 20m)**, labelled assumption. NatWest's own Contact Lens work identified 4× more vulnerable conversations; FCA Financial Lives puts vulnerability characteristics far higher than 6%. |
| Cohort "Recent complainants (90 days)" 43,000 | KEEP | Derived from the return; correct. |
| Cohort "Premier and Private" 800,000 | RELABEL + FIX | → **"Premier and Coutts"** (NatWest's premium tiers are Premier (NatWest/RBS) and Coutts for private). Size 1.1 million, labelled assumption. Note: Coutts is excluded from retail figures in the scope note; keep the cohort for "customers holding a Premier relationship", drop "Private". |
| Cohort "Multi-product households" | RELABEL | → **"Multi-product customers"** (NatWest reports per customer, not household). |
| Cohort text "Owners alerted X of Y" | KEEP | — |
| External channels "Public data not yet loaded" | DATA | Correct behaviour. |
| Subtitle "Listed customers on the bank's own channels" | RELABEL | → "Customers on the bank's own channels, then public voice." ("Listed" is an HDFC priority-list term.) |

## 3. Home — CX pulse

| Element | Verdict | Change |
|---|---|---|
| Channel rows Calls · Cora · App chat · Email · Social · Branch | RELABEL | Rename **"App chat" → "Secure message"** (NatWest's in-app messaging is "secure messages"); keep Cora separate. Order: Calls · Cora · Secure message · Email · Social · Branch. |
| "Open too long (over 48 hours)" | KEEP | 48h is a sensible internal SLA; label it "over 48 hours (bank SLA, illustrative)". |
| Internal/external split | KEEP | — |

## 4. Home — Ombudsman watch

| Element | Verdict | Change |
|---|---|---|
| Section title "Ombudsman watch" | RELABEL | → **"Financial Ombudsman watch"** (UK readers say "the FOS" or "the Financial Ombudsman"; "Ombudsman" alone is ambiguous with the Pensions/Legal Ombudsman). |
| Four tile labels | KEEP | Already FOS states. |
| Tile 4 "Referred to the Ombudsman" count | FIX | Cap at ≤ tile 2 (past 8 weeks); referrals are a subset of past-deadline or final-response-issued cases. Target referral rate 4–5% of complaints (research pack: 5,935 FOS cases / ~130k complaints over 9 months). |
| "At risk, by business" list includes "Overdrafts" and "Cora and digital assistant" | FIX | Overdrafts is not a NatWest product line (it is a current-account feature) and Cora is a channel. List becomes the six products only: Credit cards · Payments and fraud · Current accounts and app · Personal loans · Mortgages · Savings. Fold overdraft themes into Current accounts; fold Cora themes into the product the query was about. |
| (i) note "LisN does not predict who will refer" | KEEP | — |

## 5. Home — Morning brief and six product cards

| Element | Verdict | Change |
|---|---|---|
| "What needs you / Signals that are building / What's improving or stable" | KEEP | — |
| "Bank-wide, built from the six businesses below" | RELABEL | → "Group retail, built from the six products below." |
| Card order | FIX | NatWest order by customer count: **Current accounts and app · Payments and fraud · Credit cards · Savings · Mortgages · Personal loans**. Credit cards first was HDFC's revenue framing. |
| Card field "negative % public" blank | DATA | Correct until pull. |
| "Top issue" examples: "Credit limit", "Faster Payments or Open Banking failure" | KEEP | UK themes; fine. |
| Quote slot "No quotable public post in this period" | DATA | Correct. |
| Five cards open "Coming soon" | KEEP (inherited) | `oct13` has only the Cards business view. Accept for v1; note in the demo script that Credit cards is the worked example. |

## 6. `/satisfaction` — Are customers satisfied with their journey?

| Element | Verdict | Change |
|---|---|---|
| Tiers "Standard · Packaged · Premier · Private" | RELABEL | → **"Select · Reward · Premier · Coutts"**? No — Coutts is excluded from retail. Use NatWest's actual current-account tiers: **"Select · Reward · Premier Select · Premier Reward"**, with Premier rows grouped. (Select = free account; Reward = packaged; Premier = premium.) |
| "Trust pillars: Availability · Experience · Data intimacy · Security" | RELABEL | "Data intimacy" is not a UK phrase. → **Consumer Duty outcomes: "Products and services · Price and value · Consumer understanding · Consumer support"**. Same four-column structure, UK regulator's own words. This is also how Consumer Duty gets on screen without adding a section. |
| "Retention watchlist · Customers with closure intent · Owner: Relationship managers (Premier)" | RELABEL | Owner → **"Premier banking managers"**; "closure intent" → **"switching intent"** (UK customers "switch" via the Current Account Switch Service; they don't "close"). |
| Journey stages "Open · Activate · Everyday use · Service requests · Disputes and fraud · Close" | RELABEL | → **"Open · Activate · Everyday banking · Service requests · Disputes and fraud · Switch or close"**. |
| "Repeat contact by theme and business" | RELABEL | business → product. |

## 7. `/market` — What is the market saying about us?

| Element | Verdict | Change |
|---|---|---|
| All sections | DATA | Empty until pull; structure correct. |
| "App pulse" apps: NatWest app, Royal Bank of Scotland app, Ulster Bank app; toggle "Show group-company apps" | KEEP | Correct. Group-company toggle shows Coutts and Mettle. |
| "What we say vs what customers hear" promise list | FIX | Replace the generic promises with NatWest's own public service lines (from the research pack and natwest.com): "Cora is available 24/7", "Report fraud in the app in minutes", "Switch to us in 7 days", "Same-day Faster Payments", "Mortgage decision in principle online". Owners: product owners. |
| Peers column, RBS app finding, brand comparison | ACCEPT GAP | `oct13` has no section for it. Logged NW-D27. Raise with Ranjith: if he wants the brand split it is one extra column on the "All themes" table, not a new section. |

## 8. `/business/cards` and its three tiles

| Element | Verdict | Change |
|---|---|---|
| Title "Credit cards: business view · For the head of Cards" | RELABEL | → "Credit cards: product view · For the credit cards product owner". |
| Owners "Credit cards · Rewards lead / Disputes lead / Pricing lead / Credit policy lead / Acquisition lead / Fulfilment lead / Retention lead / Service lead / Fraud lead / Digital lead; Final-response team" | KEEP | Role-based, UK-neutral. Rename "Fulfilment lead" → "Card delivery lead". |
| Categories list | KEEP | UK-appropriate. Rename "Upgrades, variants and eligibility" → **"Eligibility and card changes"** (NatWest has few card variants; "variant migration" was an HDFC story). |
| Save list "ID · masked customer · state · category · why · owner" | KEEP | — |
| Tile "Are we keeping our timelines?" | RELABEL | → **"Are we meeting our service standards?"** ("timelines" is the HDFC TAT word). |
| "Closure intent" | RELABEL | → "Switching intent". |
| "Escalation ladder (who they name)" rungs | KEEP | Voice → Repeat → Complaint → Head of CX → Final response → Financial Ombudsman Service → Public. Rename "Head of CX" rung → "Complaints team". |

## 9. `/priority` — Priority relationships

| Element | Verdict | Change |
|---|---|---|
| Page title "Priority relationships" | RELABEL | → **"Priority customers"**. "Relationships" is HDFC/wealth language. |
| Cohort blocks include both "Premier and Private" and "Premier" | FIX | Duplicate. Keep one: "Premier" (per section 2). |
| 12 fictional customers, all Private or Premier | FIX | Re-mix the personas: 4 Financially vulnerable (Consumer Duty), 3 Recent complainants, 3 Premier, 2 Multi-product. Cities are fine. Names must stay masked ids. |
| Columns "Customer · Cohort · Products · Latest signal · Oldest open · Owner · Owner status" | KEEP | — |
| "High-impact complaints" reasons | KEEP | "regulator or ombudsman named" → "FCA or Financial Ombudsman named". |
| "How a customer gets on a list: Relationship tier · the bank's priority lists · linked contacts" | RELABEL | → "Consumer Duty vulnerability flag · Premier relationship · linked contacts · recent complaint". |

## 10. `/action-queue` — Escalation email triage

| Element | Verdict | Change |
|---|---|---|
| Subtitle "20 synthetic second-line escalation emails" | RELABEL | → "20 illustrative complaint escalations". UK complaints arrive by secure message, letter, phone and email; say "escalations", not "emails", in titles; the rows can still be emails. |
| Six buckets | KEEP | Rename "Reply with backend status" → "Reply with case status"; "Call today (deliverable breaking)" → "Call today (service standard at risk)"; "Escalate (no backend movement, deliverable broken)" → "Escalate (no progress, standard missed)". |
| Draft replies in UK terms | KEEP | Check each draft says "final response" and "Financial Ombudsman Service" with the 6-month wording; never "we will revert". |

## 11. `/deliverables` — Are we meeting our deliverables?

| Element | Verdict | Change |
|---|---|---|
| Page title | RELABEL | → **"Are we meeting our service standards?"**; "Deliverables ledger" → **"Service standards ledger"**. "Deliverables" is not UK banking language. |
| "Compensation" column | RELABEL | → **"Redress"** (the FCA word). Rows: FOS can award up to £445,000 (2025/26 limit) — put that in the Final-response row only; others "—". |
| 13 rows: first three sourced, ten "confirm with the bank" | KEEP | Correct per HL-27. Add register ids to the three sourced rows once the research pack is bound. |
| "Deliverables met, by product" includes Overdrafts and Cora | FIX | Six products only (see section 4). |
| "Why disputes breach SLA" | RELABEL | → "Why disputes miss the standard". |

## 12. `/module/cora_digital`

| Element | Verdict | Change |
|---|---|---|
| Currently "No app data" | FIX (within layout) | The `oct13` module layout has an issue table with "Inside: interactions · Open / open too long" columns that are **internal**. Populate those from the internal seed so the module is not empty: rows = Cora themes (Cora unresolved, had to call · Cora gave wrong answer · Cora hand-off lost context · Could not reach a person), internal counts only, public columns "not yet loaded". That gives the Cora leakage story inside the existing layout. |

## 13. Ask LisN

| Element | Verdict | Change |
|---|---|---|
| Suggested questions | RELABEL | "business" → "product" throughout; "most sensitive customers" → "financially vulnerable customers"; "Which Cards …" → "Which credit card …"; "Are customers saying they will close their card?" → "…switch or close their card?". |
| Five persona questions | KEEP | Make sure all five are in the suggestion list, not only the answer bank. |

## 14. Data sizing (internal seed) — assumptions to re-state

| Figure | Now | Set to | Basis |
|---|---|---|---|
| Group retail customers | 20m | 19m | Adobe/NatWest "19 million customers" for retail; 20m is group incl. commercial |
| Contacts in window (103 days) | 9m | 8.5m | 25m calls/yr ≈ 7m in window + Cora/secure message; label assumption |
| Cora share of contacts | 30% | 30% | 12.9m Cora conversations vs ~25m calls per year; keep, labelled |
| Financially vulnerable | 1.2m | 2.6m | section 2 |
| FOS referred | ~5% | 4–5%, capped ≤ past-8-weeks | section 4 |
| Complaints in window | 49,200 | keep | from 86,498 per half-year |

## 15. Words that must not appear anywhere on a NatWest screen (add to lint)

`business head`, `MD's office`, `relationship tier`, `deliverable`, `TAT`, `timeline` (as a service word), `compensation`, `closure intent`, `backend`, `revert`, `listed customer`, `data intimacy`, `household`, `Private` (as a tier), `Cards` (bare, as a product name), `lakh`, `crore`, `RBI`, `Internal Ombudsman`, `IO`.

## 16. Order of work
1. Sections 1, 2, 3, 4, 5 (home screen and global copy) — one commit.
2. Sections 6, 7 — one commit.
3. Sections 8, 9, 10, 11 — one commit.
4. Section 12 (Cora module from internal seed) — one commit.
5. Sections 13, 14, 15 and the lint additions — one commit; re-run pipeline, reconcile, volume validation, lint, PII, routes, crawl, screenshots.
6. Report in under 15 lines with any word you could not place.
