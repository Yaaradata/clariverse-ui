# Changes from the 30 Sep review (Ranjith with Usha)

**Internal: YaaraLabs only.**
- **Transcript:** `review_ranjith_30sep.md`
- **Branch:** `feat/review-30sep` (from `main`, which already contains `fix/review-v3`)
- **Precedence:** where this spec conflicts with B7, the spec wins; each override is logged below and in MORNING_DECISIONS.md (D16).

**Status key:** Planned · Built · Built (partial) · Not built. Every row has a final status (30 Sep).

## Change table

| # | Screen | Change | Transcript | Status |
|---|---|---|---|---|
| S1 | Both | Build exactly two views: one combined MD's office / Head of CX view, and one business-head view for Cards | 42:56, 43:28, 43:36 | Built |
| A1 | MD / Head of CX | Global period filter: Morning brief (yesterday 08:30 to today 08:30), 7 days, 30 days, full window. Every section title shows the period, and every figure is recomputed from dated records | 10:57, 11:03, 32:11, 35:04 | Built |
| A2.1 | MD / Head of CX | "Customer pulse" at the top, replacing "Priority relationships". Lists: Ultra sensitive (was list A), RBI & Government (was list B), Ultra HNI, Customers with multiple relationships (replaces HNI) | 09:41, 16:06, 36:33 | Built |
| A2.1b | MD / Head of CX | List order: Ultra sensitive, RBI & Government, Ultra HNI, Customers with multiple relationships. The last **replaces** HNI (10:29). At 36:42 Ranjith says "on top of the HNI you'll put one more list… multi-relationship sensitive customers". That is read as the same list, not a fifth one. **Ambiguous:** confirm with Ranjith | 10:29, 36:42 | Built (ambiguity open) |
| A2.2 | MD / Head of CX | Collapsed strip per list: volume with trend vs previous period; open; not responded to in over 48 hours with a trend line. Shown as rings with the figure underneath. The 5 h / 24 h thresholds are removed | 01:38, 02:51, 05:42, 06:04, 07:28, 07:58 | Built |
| A2.3 | MD / Head of CX | Expanded view per list: the same three figures by channel (Emails, Calls, Chat, WhatsApp, Social, Branch). IVR bot removed; inbound and outbound calls merged; channels must sum to the strip, with a reconcile check | 08:05, 08:15, 08:33, 09:06 | Built |
| A2.4 | MD / Head of CX | "High-priority mentions": public posts where a listed customer tagged the bank; count, responded and not responded. Linking a public post to a listed customer needs the bank's contact data, so these are synthetic, tagged "Internal · illustrative". The linking rule is stated on screen: only via the bank's verified handles or contact records | 03:50 | Built |
| A2.5 | MD / Head of CX | Copy: "RMs have been alerted about X of Y." No mechanism on screen | 04:23, 05:12 | Built |
| A2.6 | MD / Head of CX | Remove the separate "one customer across products" section (the multi-relationship list covers it) | 36:06, 36:33, 36:57 | Built |
| A3.1 | MD / Head of CX | "CX pulse" below the Customer pulse: overall contact volume, internal vs external, with the % of each | 16:20, 35:32, 35:51 | Built |
| A3.2 | MD / Head of CX | "Internal channels" / "External channels" labels (not inside / outside the bank) | 11:15 | Built |
| A3.3 | MD / Head of CX | Internal dials: Volume, Resolved, Open, Open too long (over 48 hours, stated on screen) | 10:29, 25:26 | Built |
| A3.4 | MD / Head of CX | External: drop open and open too long. Set 1: total signals, positive/negative, responded (split by positive/negative). Set 2: high-impact signals (definition on screen), positive/negative, responded | 11:36, 11:45, 12:47, 14:16 | Built (partial): the high-impact set is posts with reach; listed customers' posts are counted in the Customer pulse, not mixed in |
| A3.5 | MD / Head of CX | Remove "Responded is not resolved" and the inside / outside · illustrative strip; keep a small provenance tag per internal tile | 14:46, 15:01 | Built |
| B1 | MD / Head of CX | Remove the one-line executive summary | 16:27, 16:43 | Built |
| B2 | MD / Head of CX | "Today's morning brief": merges "Since yesterday 8:30" and "Executive pulse". Columns: What needs you, Signals that are building, What's improving or stable. Bank-wide; each item names its business; derived from the business cards; follows the period filter | 16:49, 17:08, 17:54, 18:36, 20:25, 21:01, 21:50 | Built |
| B3 | MD / Head of CX | Six business cards (3 + 3), each with a small ring visual ("as dials", 21:01): Cards, PayZapp and UPI, Accounts and deposits, Personal loans, Home loans, Insurance. Each shows volume with trend, negative share, open / open too long (internal), responded (external), top issue and one short redacted anecdote. Cards links to the Cards view | 21:01, 21:50, 22:30 | Built |
| B4 | MD / Head of CX | "Reputation pulse by product" follows the period. Columns: overall volume, negative internal, negative public, trend, open / open too long, top issue, escalation language in public. Deliverables and "public posts describing a delay" removed. Cards row opens the Cards view; others go to a "coming soon" page | 31:34, 32:11, 33:22, 34:02, 34:24, 35:04 | Built |
| B5 | MD / Head of CX | Remove Deliverables, the three drill-downs and the retention watch from the view; Deliverables leaves the navigation (route kept, unlinked) | 29:27, 29:58, 32:08, 37:42, 39:51 | Built |
| B6 | MD / Head of CX | "Actions to take" left as is | 30:43 | Built (labelled full window) |
| C1 | Cards | Follows the period filter | 31:34 | Built |
| C2 | Cards | "Issue pulse: Cards": internal (volume, resolved, open, open over 48 h) and external (volume, positive/negative, responded, high impact, high-impact positive/negative, high-impact responded), in parallel blocks | 24:58, 25:18, 25:26, 25:53, 26:12, 27:34 | Built |
| C3 | Cards | Issue categories as an accordion, largest first. Subcategories inside; per row the metrics, a trend line, escalations and an owner role. TAT-related categories come in from Deliverables, without TAT compliance | 28:22, 28:54, 28:57, 29:58, 30:30 | Built (partial): subcategories are LisN themes; finer splits such as "value and devaluation" vs "caps" need a sub-classifier |
| C4 | Cards | Moved in, scoped to Cards: mood, the market view, service, friction drivers, themes by trust pillar, journey stage ("where contacts come from"), top complaints / feature requests / feedback on existing features per store, volume by channel, volume by customer list | 37:42, 38:09, 38:44, 39:07, 39:51, 40:46, 41:26, 41:48 | Built (1 Oct: the three drill-downs rebuilt in full for Cards, under their own headers) |
| C5 | Cards | No Deliverables or retention watch; keep "Actions to take" | 29:58, 39:51 | Built |
| D1 | All | Everything reconciles for the selected period; check_reconcile covers the new structure, per period | 08:15, 08:33 | Built (376 checks, 33 fixtures) |
| D1b | All | Morning brief is anchored to the last date in the data (28 Sep 08:30 to 29 Sep 08:30), not the real clock, and the dates are shown on screen | 16:49 | Built |
| D1c | All | Short periods (Morning brief, 7 days) use the source-weighting fix: the capped X run dominates the last week. A check fails if one source is more than 60% of a short period's public items and a share or trend is shown unweighted | — (earlier review) | Built |
| D2 | All | Earlier guarantees kept: no names or post URLs in payloads, one store per rating comparison, no internal labels; lint, PII and fixture tests pass | — | Built |

## Missed by spec (in the transcript, not in the spec)

1. **A 48-hour period.** At 05:12 and 05:42 Ranjith asks for volume "in the last one week" *and* "in the last 48 hours". The spec's filter has Morning brief / 7 / 30 days / full window; there is no 48-hour option. Not built. The 48-hour idea is kept as the "not responded to in over 48 hours" figure.
2. **The threshold should follow the bank's TAT.** At 02:51 Ranjith says "first see what is the TAT"; at 25:51 he calls 48 hours "an example". 48 hours is used everywhere and is stated as a working threshold until the bank gives its TATs.
3. **The morning meeting's questions** (23:15): how is each business doing, is there a threat to reputation, are operations going well, what needs fast-tracking. These shape how the brief's rules are written (see the note on screen); they are not separate sections.
4. **External signals by intent** (27:34): "you can give by intent… break down by the different reasons". Covered on the Cards view through the issue categories. The MD view's external dials are not split by intent.
5. **Owner with a name** (28:57): Ranjith suggests "put a name". The no-real-names rule wins: owners are roles ("Cards · Rewards lead").
6. **Whether the MD needs the pulse-by-product table** (34:24, "we'll wait for Vidya"). Kept, as the spec says; open for Vidya.
7. **Whether "Actions to take" stays at all** (30:43, "we'll ask"). Left as is (B6); open.
8. **MD-marked mail and "Who should hear what"** (the MD-only and Head-of-CX-only blocks). The transcript and spec are silent. With one merged view, MD-marked mail is kept, follows the period and sits above the actions. "Who should hear what" is dropped: the business cards and the brief now say which business owns what.
9. **Other V2 screens** (priority, customer trail, modules, satisfaction, market, deliverables, action queue). Not in the two-view scope. Routes are kept and return 200; only the two views and the action queue stay in the navigation.

## Conflicts with B7, and how they were resolved (spec wins)

| B7 | This spec | Resolution |
|---|---|---|
| §1 E1: one layout with an MD / Head of CX toggle (3 vs 5 actions; "who should hear what" on Head of CX) | One merged view, no toggle | Toggle removed. `/head-cx` renders the same merged view. Actions: the MD's three, pinned (B6 "as is"). |
| §1 E2: cohort labels "Priority list A / B, neutral labels until the bank's own term is confirmed"; "never label a cohort by occupation (e.g. 'RBI officials')" | Lists named "Ultra sensitive" and "RBI & Government" | Renamed as specified. **Risk logged:** "RBI & Government" is an occupation-type label, the thing B7 and D1 ruled out. Membership still comes only from the bank's list, never from public data, and the purpose line stays. Confirm the bank's own term with Vidya before Anjani sees it. |
| §1 E2: open over 5 h / 24 h per cohort | Volume, open, not responded to in over 48 h | 5 h / 24 h removed everywhere on the view. |
| §1 E2: HNI cohort | "Customers with multiple relationships" | New bank-supplied list (synthetic): customers on the HNI tier or any list who hold 2+ products. HNI no longer shown. |
| §1 E1.2: dials "Inside the bank / Outside"; public open and open too long (no reply in 48 h) | "Internal / External channels"; no open or open too long for external | As specified. External responded comes from Play Store replies, the only store with reply data, and says so. |
| §1 E1.2: internal "open too long" = past the deliverable | Open too long = over 48 hours | As specified: open more than 48 hours at the end of the period. |
| §1 E1.4: one-line executive summary | Removed | Removed. |
| §1 E1.5: executive pulse by theme (needs you / where to focus / improving) | Morning brief by business, "Signals that are building" | Rebuilt from the six business cards; each item names its business. |
| §1 E1.6: pulse-by-product columns incl. deliverables met / outside and public posts describing a delay | Those columns removed; overall volume and internal / public negatives added | As specified. |
| §1 D1: deliverables ledger (Core) | Removed from the view and the navigation | Route kept, unlinked. TAT-related issues become categories in the Cards issue pulse, without compliance figures. |
| §1 B1: business-head view = E1 with a product filter, for every product | Cards only, its own layout | `/business/cards` is the new Cards view; other products show "coming soon". |
| §1 E1 / E3: customer memory ("one customer, every product") on the exec page | Removed from the exec view | Removed; the multi-relationship list covers it. The E3 route stays. |
| §4.4: mood on the exec page | Mood moves to the Cards view | Moved (Cards-scoped, source-weighted as before). |
| §1 M2: Cards module | Superseded by the Cards business-head view | Module route kept, unlinked. |
| §1 E1: channels include IVR bot | IVR bot removed | Removed from every internal count on both views, so channels always sum. |

## Decisions made while building (not in the spec)

- **Default period:** 7 days, the period Ranjith used when describing the strip (05:42–07:58). The choice is in the page URL (`?period=`), so links keep it.
- **Period boundaries:** every period ends at 29 Sep 08:30, the last date in the data, not the real clock. Public data ends 28 Sep 23:59, so for the Morning brief the external figures cover 28 Sep 08:30 to midnight, and the screen says so.
- **"Open" vs "over 48 hours":** "Open" is the share of the period's volume still open at the period end. "Not responded to in over 48 hours" and internal "Open too long" are the backlog at the period end: items with no response, or still open, for more than 48 hours, whatever their start date. This is the only reading that works for the 24-hour Morning brief. Each is labelled.
- **High-impact external signals:** public posts with reach, defined as an X post from an account with 10,000+ followers or with 50+ likes or 20+ reposts, a Reddit post with 50+ upvotes, or a store review 20+ people found helpful. Posts by listed customers are bank-linked internal records and are counted in the Customer pulse ("High-priority mentions"), not mixed into the public count.

---

# Round 2 (Karthik review, 30 Sep)

Second review the same day, with Karthik (external advisor), Ranjith and Usha. This round builds on the table above;
where the two conflict, this round wins (overrides are logged in MORNING_DECISIONS.md, "Round 2").

**Transcript not in the repo.** `docs/demo-rebuild/review_karthik_30sep.md` was not present when this round was built,
so the table is taken from the change spec and its timestamps. "Missed by spec" cannot be filled in until the transcript
is added.

| # | Screen | Change | Transcript timestamp | Status |
|---|---|---|---|---|
| K1.1 | MD view · Customer pulse | The four list cards show the bank's own channels only. The "High-priority mentions" block (posts by listed customers) is removed from the section. | 29:55–31:39 | Done |
| K1.2 | MD view · Customer pulse | "RBI & Government" label kept. | 29:55–31:39 | Done (unchanged) |
| K1.3 | MD view · Customer pulse | Every figure shows its change against the same previous period: volume (%), open and no reply in 48 h (count, with direction and colour). | 30:38 | Done |
| K1.4 | MD view · Customer pulse | One line on every internal card: "RMs alerted: X of Y" (per list). Not on external cards. | 31:39–33:06 | Done |
| K2.1 | MD view · Social pulse (new) | New section below the Customer pulse: total mentions, high-impact mentions (rule on screen), bank response as a %. | 24:23–24:37, 27:49 | Done |
| K2.2 | MD view · Social pulse | Response rate labelled informational, with "Response here means acknowledged and routed to an official channel." | 33:47–34:29 | Done |
| K2.3 | MD view · Social pulse | Top 5 trending posts by engagement: anonymised text, platform and date, engagement, responded / not responded. | 33:47–34:29 | Done. Reply data exists for Play Store only; other platforms show "Replies not collected" rather than "Not responded". |
| K2.4 | MD view · Social pulse | One example marked "Good response", with the bank's reply, redacted. | 33:47–34:29 | Done |
| K2.5 | MD view · Social pulse | No post links in payloads; framed as what LisN adds beyond the bank's own systems, not a KPI. | 33:26–33:43 | Done (reconcile fails on any link in the block) |
| K3 | MD view · business cards | A coloured "Deep dive" button on each business card. | 37:49–38:16 | Done. The card itself is no longer one big link. |
| K4.1 | Cards view | Sticky header "Cards · Business view" stays on screen while scrolling (also on the drill-down pages). | 45:06 | Done |
| K4.2 | Cards view · issue table | Separator between the Internal and External column groups; each group has its own tint and heading. | 45:43–46:36 | Done |
| K4.3 | Cards view · issue table | Escalations split: internal under Internal, external under External. | 45:43–46:36 | Done |
| K4.4 | Cards view | "Open 48h+" renamed "Not responded to in 48h+" (table and issue pulse). | 46:36–47:20 | Done. The figure is now first-reply wait over 48 hours, to match the label. |
| K4.5 | Data and both views | New status "Waiting on customer": the bank has sent a resolution or proposed one; not counted as open or as not responded. Every figure recomputed and reconciled. | 48:02–48:26 | Done |
| K4.6 | Cards view | Internal and external stay side by side; no toggle. | 43:01 | Done (unchanged) |
| K4.7 | Cards view | At most five panels below the issue pulse. | 50:21, 52:12 | Done (list of what was cut is below) |
| K5.1 | Every screen | Ask LisN is a pinned question bar, "Ask LisN about your business", visible on every screen. | 52:12–56:41 | Done |
| K5.2 | Every screen | On focus: ten suggested questions for the current view, and recent questions. | 52:12–56:41 | Done |
| K5.3 | Every screen | A suggested question returns a short answer and a small table built from the page's period figures. Tagged as precomputed; no live model call. | 52:12–56:41 | Done |
| K5.4 | My view (new) | "Pin to my view" adds an answer as a panel on a "My view" screen. Session memory only. | 55:36 | Done (stretch) |
| K5.5 | Cards view | One suggested question asks about another business and is refused: "You're not authorised to see this. Answers follow your bank's role-based access." | 57:39 | Done |
| K6 | All | Reconcile, lint_terms, check_pii, fixture tests, Biome and next build pass; every V2 route returns 200. | | Done |

## Cards view: what stays and what was cut (K4.7)

Below the issue pulse and the issue table, the page keeps five panels:

1. Are my customers happy? (question card; opens its drill-down)
2. What is the market saying about us? (question card; opens its drill-down)
3. Where contacts come from (journey stage)
4. Repeat contact by category
5. Top complaints and feature requests (by store)

Moved out of the page, and reachable through Ask LisN (each is a suggested question on the Cards view):

- "Are we keeping our timelines?" question card. The drill-down page still exists at `/business/cards/service`; Ask LisN links to it.
- Volume by channel.
- Actions to take.
- Escalation ladder, closure intent and the dispute funnel were already on the service drill-down only; they are now also Ask LisN questions.

## Missed by spec (round 2)

Not filled in: the Karthik transcript is not in the repo. Add `review_karthik_30sep.md` and this section can be completed.
