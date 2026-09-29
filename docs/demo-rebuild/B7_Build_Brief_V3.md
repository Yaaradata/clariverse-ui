# B7 · LisN HDFC demo V3: build brief and tracks
**Internal: YaaraLabs only. Safe to commit to the private build repo. Don't send it to the bank.**
v1.1 applies an independent review: the scope is cut to a **core** that fits about 5 days for two people plus Claude Code, plus a **stretch** tier.
Inherits: B1, B2 (language), B4 (build rules: provenance, reconcile, lint), D-11 (TATs), and the Vidya call-2 findings summarised in §0a. Where they conflict, **this brief wins.**
Target: ready for Vidya's review after 30 Sep, then the Anjani joint meeting.

## 0. What V3 must prove, in one sentence
LisN shows the bank its numbers first, product by product. It remembers each customer across every product and channel, and puts the most sensitive customers first, with every item routed to an owner.

## 0a. What Vidya asked for (25 Sep), in short
1. Numbers first: dials and a short table (total, closed or responded, open, open too long), inside and outside the bank's systems.
2. An overall pulse, then **product by product** (cards, PayZapp, accounts, loans, insurance…), the way the morning review works.
3. **Customer memory across products and channels.** A flag follows the customer, including mail from assistants writing on their behalf.
4. **Priority relationships first:** ultra-HNI, HNI and the bank's own priority lists, with issues open more than 5 or 24 hours.
5. **RM alerts** at customer level.
6. A modular demo: app-level depth for cards (PayZapp later).
7. MD and Head of CX views need not differ much. Business-head views come next.
8. "Deliverables" preferred over "promise".

## 1. Screen plan (V3)

| # | Screen | Change from V2 | Priority |
|---|---|---|---|
| E1 | **Exec page** (one layout; a view toggle for MD's office or Head of CX with small differences, plus a **product filter** that turns it into the business-head view) | Add the dials row, the per-product pulse table, and the priority-relationships strip. Keep the exec summary and pulse. | **Core** |
| E2 | **Priority relationships** | New | **Core** |
| E3 | **Customer signal trail** ("one customer, every channel") | New | **Core** |
| M1 | **Digital: HDFC Bank app** module | Keep the deep dive; fix the method issues | **Core** |
| M2 | **Cards** module | New, at the same depth as M1 | **Core** |
| M3 | **PayZapp** module | New, at the same depth as M1 | Stretch |
| D1 | **Deliverables ledger** (was the service promise view) | Rename; add columns per product | **Core** |
| B1 | **Business head view: Cards** | **No separate screen:** E1 with the product filter set to Cards. Vidya defines the rest at the next review. | **Core** (as a filter) |
| A1 | **Action queue: escalation email triage** | New; the "Act" pillar. **Core = a static mock of 20 emails in 6 buckets.** The full version is stretch. | Core (mock) |
| — | Satisfaction and market drill views | Keep; language and QA fixes only | Core (fixes only) |

### E1 · Exec page layout, top to bottom
1. **Header:** HDFC Bank · Customer Pulse · date · view toggle · Ask LisN.
2. **Dials row** (four dials plus a one-line table), split into *Inside the bank* (internal, illustrative) and *Outside* (public, live): Total signals; Closed or responded; Open; **Open too long** (beyond deliverable or TAT).
   **Public "responded":** use the **developer replies** in the Play Store and App Store data. Use X reply threads only if they come through a permitted route.
   **Public "open too long":** a review or post with no bank reply within 48 hours (state the definition on screen). Show counts and percentages.
3. **Priority relationships strip:** for each cohort, open, open too long (over 5 hours or over 24 hours), and negative mentions anywhere. Links to E2.
4. **Executive summary:** one line. No mixed-store rating comparison.
5. **Executive pulse:** needs you, where to focus, improving (only real improvements; minimum 15 items per half).
6. **Pulse by product table:** Cards, PayZapp, Accounts and deposits, Personal loans, Home loans, Auto and two-wheeler loans, Insurance (bank-sold, where tagged), Digital (app and NetBanking). Group-company apps stay excluded. Columns: negative signals (count, with trend); open / open too long (illustrative); deliverables met / outside (illustrative, plus public promise-break counts); top issue; escalation language. Each row opens its module (M1–M3) or a generic product page.
7. **Actions to take:** 3 on the MD view, 5 on the Head of CX view.
8. **MD-marked mail:** keep.
9. **Footer:** "Runs inside the bank, on the bank's approved models." **Never show internal programme names.**

**MD vs Head of CX:** the same blocks. The MD view shows 3 actions and puts cohorts first. The Head of CX view shows 5 actions plus "who should hear what".

### E2 · Priority relationships
- **Cohorts,** from the bank's own relationship tiers and lists only (synthetic in the demo): priority relationships tier A, tier B (neutral labels until the bank's own term is confirmed); ultra-HNI; HNI.
- **High-impact complaints** sit on a separate panel. It's a property of the **complaint**, **never a flag on the person**.
- **Never** label a cohort by occupation (e.g. "RBI officials"). Never name any real person.
- **Purpose line on screen:** "Flags prioritise service. They never restrict or downgrade it."
- **Per cohort:** customers with an open issue; open over 5 hours or over 24 hours; negative mentions by channel; products affected; RM notified yes or no.
- **List of customers:** fictional personas with a masked ID, cohort, products, latest signal, age, owner and RM. Each row opens E3.
- **The cohort is appendable:** the bank adds to it and LisN appends as signals arrive. Show "added this week: n".

### E3 · Customer signal trail
- Timeline for one fictional ultra-HNI customer across products and channels: a card decline, a bot call that didn't resolve it, an email to care, a repeat call, a public post, the RM not informed.
- **Sensitivity flag** set in cards, then shown when the same customer appears in accounts.
- **Proxy senders:** one touchpoint from the customer's assistant, linked through the bank's own contact records.
- **Public post in the trail:** only when it comes through a channel the bank already links. The rule is stated on screen.
- **Recommended actions:** alert the RM (CRM task or internal email mock, not WhatsApp), a callback within the deliverable, routing to the account owner.
- **Before and after:** "Without LisN: 6 touchpoints, 3 teams, no one saw the pattern. With LisN: flagged at touchpoint 2."

### M1–M3 · Product modules (one template)
Sections: What · Is it real · The fix list or issue list · Where · How high · Owner and action · Evidence.
- **M2 Cards** issues: variant migration and forced upgrade; upgrades and downgrades; application rejection and verification; rewards value and caps; fees and charges; limits; disputes and chargebacks; closure (7-working-day rule).
- **M3 PayZapp** (stretch): device security blocks; speed and crashes; login and MPIN; UPI failures (T+1, T+5).
- **Method fixes:** series whose source starts mid-window are plotted as share negative, or start at the export date. Never raw counts across a start date. Rating comparisons within one store only, with counts. "Customers ask for" derived per theme and must match the row.

### D1 · Deliverables ledger
- Rename "promise" to "deliverables" everywhere in the UI.
- Rows: each deliverable, by product. Columns: TAT (RBI where verified, otherwise "Bank TAT: confirm in discovery"), compensation, met, outside deliverable, open too long, public posts describing a delay, owner, action.
- Keep the escalation ladder.

### A1 · Action queue: escalation email triage
- Core: a static mock of 20 synthetic L2 escalation emails. Buckets: reply with backend status; call today (deliverable breaking); escalate (no backend movement, deliverable already broken); proactive status message; close with confirmation; route to another product owner.
- Show counts per bucket, the draft reply for bucket 1 (human approves), time saved, and projected time to resolve against the illustrative baseline. LisN recommends; people send.

## 2. Synthetic internal data
`data/seed/internal_v3/`, deterministic with a fixed seed, reconciling with the public theme mix: customers 5,000; interactions 20,000 over 8 weeks; 20 hand-written escalation emails (1,500 stretch); 500 bot calls; derived RM notifications. Theme shares per product within ±20% of public; every total reconciles; no value reused across unrelated metrics; 12 hand-written fictional priority personas; every internal tile tagged `Internal · illustrative until discovery`.

## 3. Public data sourcing
S1 (core) store reviews with full history, app version and developer replies · S2 (stretch) X reply threads via a permitted route · S3 (core) annual report complaint disclosures · S4 (core) RBI Ombudsman annual report · S6 (stretch) Reddit history · S8 (core) bank product catalogue and TATs. Dropped: Google Maps, consumer courts, ICICI. Do not use authenticated portals, profile named individuals, or scrape sites whose terms prohibit it.

## 4. QA fixes carried over
1. Remove the 2.4★ vs 4.4★ comparison from the exec pages; on M1 compare within one store only.
2. MD view leads with complaints closed without resolution; the app fix list second, labelled "New mobile app release: fix list".
3. "Improving": no items with fewer than 15 per half. Rename "App praise" to "Where customers praise us".
4. Mood: change against the window average, "public voice skews negative". No raw −54.
5. Remove every internal programme name from every screen.
6. Theme groups on exec pages; hand-verified headline themes.
7. D-11 TATs in the deliverables ledger.

## 5. Tracks
T1 decisions (Ranjith) · T2 data and pipeline (Claude Code) · T3 screens (Claude Code plus dev) · T4 crawls (dev) · T5 public research (Claude chat) · T6 deck · T7 final QA.
