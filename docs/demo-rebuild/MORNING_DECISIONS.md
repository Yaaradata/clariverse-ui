# Morning decisions: V3 build (B7)

Judgement calls made while building V3. Each has a default that shipped and options for Ranjith to confirm or change.
Internal only.

## D1 · "How will LisN know who is RBI?" (manager ask vs B7 §E2)

The manager's note asks the customer view to call out celebrities, ultra-HNIs and RBI officials, and asks how the system
would know who is who. B7 says never to label a cohort by occupation or name a real person. B7 wins where they conflict.

**Shipped:** the answer is that LisN never works out who a customer is. It reads lists the bank already keeps:
1. **Relationship tier** from core banking (ultra-HNI, HNI).
2. **The bank's own priority lists** (Vidya's "red book"). The bank puts anyone on them for any reason, whether an
   official, a public figure or a long-standing client. LisN reads the list but does not store why a customer is on it.
   These show on screen as Priority list A and B until the bank's own name is confirmed.
3. **Complaint-level high impact**, marked on the message and never on the person: a regulator or ombudsman named,
   legal language, a public post with reach, a third contact, or **a message sent from an official or regulator email
   domain**. This last one covers Vidya's case of the RBI CGM whose mail went unanswered, without labelling anyone.
4. **LisN can suggest** adding a customer to a list after a high-impact complaint. The bank confirms or declines. E2
   shows "added this week (n suggested by LisN)".

**Options:** (a) keep as shipped; (b) show a bank-defined reason code on the list (e.g. "regulatory relationship"). This
would be the bank's own label, and legal should review it; (c) drop the official-domain signal if the bank prefers.

**Talking line for Anjani:** "You already know who your sensitive customers are. It's in the red book. What you
can't see is where they are right now. LisN reads your list and listens everywhere."

## D2 · Public "responded" and "open too long" dials

**Updated 29 Sep (review fixes): retired, superseded by D13.** The original entry said the store exports carry no
developer-reply field and the dials showed "Needs reply data". That is no longer true: the Jul–Sep Play Store export
carries the bank's replies (`replyText`, `replyDate`), and "Needs reply data" is no longer on screen.
- **Now shipped:** responded 10,240 of 10,617 Play Store reviews (96.4%); 377 with no reply after 48 hours; the 48-hour
  definition is on screen. See D13 for "responded is not resolved".
- **Still true:** App Store exports carry no reply field, and bank-authored X posts were not collected, so replies are
  Play Store only, and the screen says so.

## D3 · MD view leads with complaints closed without resolution (B7 §4.2)

"Complaints closed without resolution" is now first in "What needs you" and first in Actions on both views. The app
item is second, labelled **"New mobile app release: fix list"**. The 2.4★ vs 4.4★ line is removed from the exec pages.

## D4 · "Improving" (B7 §4.3)

**Updated 29 Sep (review fixes).** The original list described the first-demo data (V1). On the Jul–Sep data none of
its items holds, so the list changed.
- **Rule now:** at least 15 items in each half; share of voice down at least 20%, source-weighted (see D6 and D15); and
  the raw count down at least 20% too. The last condition is new. Without it, a theme whose count was flat (for example
  unauthorised transactions, 16 then 15 items) showed as "down 61%", because X's collected volume grew in September.
- **Shown now:** device security blocks and false alerts (48 then 26 items; share down 25%). Login and MPIN also
  qualifies (308 then 177; down 21%), but the exec page shows one theme.
- **Dropped:** loan processing, now rising (15 then 49 items), and PayZapp on the App Store, where positive reviews fell
  from 35% to 31%. The "Play Store export starts on 31 August" note was V1; no V2 export starts then.
- **"Where customers praise us"** (renamed from "App praise") is still on the exec page. Its status is decided with
  finding #11 in qa/review_v3_response.md.

## D5 · "Re-promise" action chip

Because of "promise → deliverables", the chip now reads **"Set a new date"**. The underlying data value is unchanged.
"Brand promise gap" on the market view is now **"What we say vs what customers hear"**.

## D6 · Mood (B7 §4.4)

**Updated 29 Sep (review fixes): the headline is now +3 pts, not −22.** The −22.6 was mostly collection, not mood:
- **X:** collected in weekly capped runs. The 20–27 Sep run hit its 1,000-item cap, so X is 66% of the last 7 days
  against 20% of the window, and X is the most negative source.
- **Reddit:** changed collector on 1 Sep.

The method is now source-weighted (scripts/hdfc_pipeline/method.py): net sentiment is computed per source, then
weighted by each source's share of the window, and Reddit is left out.
- **Shipped:** the last 7 days are at −10.5 against a window average of −13.6, a change of **+3.1 pts**. Unweighted on the
  same basis it would read −37.5 pts. The E1 card shows the source-weighted figure with a one-line note giving the
  unweighted one.
- **Satisfaction page:** the source-weighted weekly net sentiment, plus a table by source.
- **Unchanged:** "public voice skews negative" still holds (window average −14), and no raw index is shown as the
  headline.
- **Why this matters for Anjani:** the old −22 would have told the MD mood is falling; per source, it is flat.

## D7 · Product rows and the loan split

**Updated 29 Sep (review fixes): the method is unchanged; the figures are the Jul–Sep ones.** The original figures
(4,966 items, 471 outside the table, "no bank-sold insurance items") were from the first-demo data.
- **Now:** product rows count each public item once and reconcile to the **17,193** on-topic items: 16,329 in the eight
  rows plus 864 outside the table (733 wealth, 105 SME and merchant, 26 corporate).
- **Loans:** split into personal (387), home (291) and auto (12) by the loan apps and by keyword; the screen says the
  split is approximate.
- **Insurance:** now has 48 bank-sold public items. That is too few for a trend, so its business view still leans on the
  internal layer and says so.
- **Trends:** now source-weighted (D6, D15).

## D8 · Synthetic sample scale

**Updated 29 Sep (review fixes): the sample is 5,000 customers and 32,000 interactions over 13 weeks** (1 July to
29 September 07:45), not 20,000 over 8 weeks. It was widened to match the Jul–Sep public window.
- **On screen:** it is labelled "demo sample" with its window, and it is not scaled up.
- **One dataset:** since step 4 of the review fixes, every internal figure on every screen comes from this one sample.
  The first-demo sample (18,42,000 interactions) no longer appears in V2.
- **Cohorts** are over-sampled so the demo has enough to show: 45 customers on list A, 124 on list B, 151 ultra-HNI,
  640 HNI.
- **The FY2022-23 complaints figure** (5,60,376) remains unverified, and the "86,000 in any 8 weeks" comparison no
  longer matches the window. It is withdrawn: **T5 verifies the figure before any screen or slide uses it**, and no
  comparison to the sample is made until then.
- **Open for you:** B7 §2 still says 20,000 over 8 weeks. Either update B7, or ask for the sample to be cut back to
  8 weeks.

## D9 · Deliverable TATs

TATs marked RBI in the ledger:
- failed-transaction reversal: T+1 / T+5, ₹100 a day
- credit card closure: 7 working days, ₹500 a day
- unauthorised-transaction shadow credit: 10 working days
- credit-information correction: 30 days, ₹100 a day
- property documents after loan closure: 30 days, ₹5,000 a day
- complaint resolution before ombudsman eligibility: 30 days

Everything else reads "Bank TAT: confirm in discovery". D-11 is not in the repo: **check these against D-11.**

## D10 · A1 time-saved figures

14 → 5 minutes per email and 6.5 → 3 days to resolve are illustrative assumptions, and the screen labels them as such.
Replace them with Pradeep's email-team numbers when we have them.

## D11 · Priority target on the customer trail

E3 states "first response in 5 hours, closure in 24" for priority customers (Vidya's words on the call), not a bank TAT.
Confirm with Vidya that she is comfortable with it on screen.

---

# Update 29 Sep: V2 moved to the Jul–Sep dataset

## D12 · V2 now reads the three-month public dataset
- **Raw data:** `data/raw/hdfc_jul_sep/`, from the "2ndDemoData" folder.
- **Sources:** Play Store 11,601 reviews, App Store 826, Reddit 10,826, X 3,682, consumer forums 1,570.
- **Window:** 1 July to 28 September. The brief date is Tuesday 29 September, 07:45.
- **V1 is unchanged:** it keeps its original data (`data/out/app`).
- **Pipeline:** `scripts/hdfc_pipeline/`. `run_all.sh` rebuilds everything and runs the checks.

## D13 · Public "responded" dials use the bank's Play Store replies
- **The numbers:** the bank replied to 96% of Play Store reviews, with a median reply time of about 12 minutes.
- **The catch:** 88% of its replies to negative reviews only redirect the customer to email, phone, chat or a branch, rather than answering.
- **On screen:** shown as "Responded is not resolved".
- **Coverage:** App Store exports carry no reply field, and bank-authored X posts were not collected, so X and App Store replies are out of scope. The screen says so.
- **Options:**
  - (a) keep as shipped;
  - (b) lead with the redirect figure rather than the 96%;
  - (c) collect `@HDFCBank_Cares` replies on X through a permitted route (S2) to add X.

## D14 · How social posts were classified
- **Store reviews (12,427):** classified by rules. Sentiment comes from the star rating, and the app themes are reliable.
- **X, Reddit and forums:** these needed reading. On the new data, rules alone reached only about 40–55% precision on the headline themes (e.g. "fraud" matched people calling the bank a fraud). So every social post in the window was labelled by a model, in parallel in-session batches, against the same taxonomy (`work/llm_batches/INSTRUCTIONS.md`).
- **Quality gate** (`llm_gate.py`):
  - Batches produced by a script rather than by reading are rejected chunk by chunk. The signs are copied summaries or the same summary reused across different posts.
  - Several batches were rejected and re-labelled.
  - Any post without an accepted label falls back to the rules.
- **Relevance:** posts that only mention HDFC in passing (stock chatter, lists of banks) are marked `mention_only` or `off_topic`. They are kept in the data but left out of bank-wide counts.

## D15 · Trend basis
- **Basis:** trends compare 1 Jul–14 Aug with 15 Aug–28 Sep, as a share of trend-basis items.
- **Excluded stream:** the Play Store HDFC Bank app export holds the latest 5,000 reviews (from 25 July), so it counts in totals but not in trends.
- **No baseline claims:** no export has history before July.

---

# Follow-up fixes (fix/review-v3)

## D16 · No links to original posts
- **Shipped:** quotes carry a plain place label and date; V2 never links to the post. URLs stay in `evidence.json` on the server for audit.
- **Judgement call:** the source-link rule scans the built V2 pages, so `check_pii` fails on a stale build made before this change. Run `next build` before the checks, or accept the failure until the next build. V1 is excluded (kept as first shown).
- **Judgement call:** Reddit community names (e.g. r/CreditCardsIndia) and forum names (e.g. TechnoFino) are shown. They are public community names, not people, and the brief's example label uses them.

## D17 · One store per comparison
- **Shipped:** every store rating or share is per store; counts may add across stores.
- **Judgement call:** the "new app" comparison (version 11 vs earlier versions) now uses the Play Store only (1,781 v11 and 2,732 earlier-version reviews), not both stores. The App Store figures stay in the data (`by_store.appstore`) and on the app module's per-store tables. The negative-review count for version 11 is still the two stores added together, and is labelled "across both stores".

## D18 · TATs without D-11
- **Shipped:** bank-set TATs read "Bank TAT: confirm in discovery", with no number (this replaces the working assumptions shown earlier). See `qa/tat_check.md`.
- **Judgement call:** the six RBI rows keep their numbers. They are RBI timelines, not bank TATs, so "Bank TAT: confirm in discovery" would be wrong for them. None is verified against D-11, though, and five have no in-repo source beyond the code. **Options:** (a) keep, and check against D-11 before the sponsor review; (b) show "RBI TAT: to verify" on all six until checked.
- **Judgement call:** met / outside / open-too-long on bank rows still come from the illustrative sample, measured against a placeholder that is not shown. The footnote says so. The alternative would be to blank those cells until discovery.
- **Judgement call:** L2-09 stays in "Call today". The reason is now the customer's blocked rent and EMI, not a bank TAT ending tomorrow.

## D19 · Internal-names lint
- **Shipped:** `scripts/lint_terms_candidates.txt` (committed) and `scripts/lint_terms_local.txt` (gitignored) are both read by `lint_terms.py`. The lint covers V2 UI strings, the generated payloads and the built V2 pages.
- **Judgement call:** added source-track IDs S1–S8 and the B1 KNOW-only items (IndusInd, Vishal Jha), beyond the IDs named in the instruction. They are internal labels of the same kind.
- **Judgement call:** terms match whole tokens, case-sensitively, so route paths (`/hdfc-pulse/v2`), app versions (`v2.61`) and "Priority list A" do not trip them. "Internal" on its own is not a candidate, because the provenance tag "Internal · illustrative until discovery" is meant to be on screen.
- **Judgement call:** customer quotes and their summaries are skipped in payloads, as the existing lint does: they are the customer's words.
- **Result:** no on-screen hits. Every candidate token in the V2 code is in a comment.

## D20 · Light and dark theme (V2)
- **Shipped:** a Light / Dark toggle in the V2 header. Dark stays the default and is unchanged; the choice is remembered per browser. V1 is not affected. QA: `qa/theme_qa_v2.md`.
- **Judgement call:** in light, amber, green, cyan and violet use darker shades (e.g. amber #b45309, not #f59e0b), so that numbers and labels stay readable on white. The meaning of each colour is unchanged.
- **Open:** one existing dark-mode legend label ("Wealth" on the satisfaction chart) is 2.7:1. It was left as is because dark was to stay unchanged.

## D21 · Layout pass at the Windows laptop size
- **Shipped:** screenshots now match a 1920×1080 display at 125% scaling, with real fonts and the sidebar closed, one screen at a time. Tiles that stretched to a taller neighbour have been rebalanced (`qa/layout_qa_v2.md`).
- **Judgement call:** the executive pulse columns now end with their content, rather than all stretching to the longest list.
- **Judgement call:** tiles that repeated the same numbers were merged, e.g. the relationship-tier table and bars on the satisfaction page.
- **Judgement call:** "Top service failures" shows 5 themes, not 6, to match the funnel beside it.
- **Found in review and fixed:** a staff member's name in a Play Store review shown on the market page, now redacted by the pipeline.

---

# Update 30 Sep: the review with Ranjith (changes_30sep.md)

## D16 · B7 overridden by the 30 Sep spec

The 30 Sep spec wins over B7. Each override is below; the table in `changes_30sep.md` has the transcript timestamps.
- **One view instead of two.** MD's office and Head of CX are one page. The toggle is gone and `/head-cx` shows the same
  page. Actions stay the MD's three.
- **List names.** "Ultra sensitive" (was list A), "RBI & Government" (was list B), "Ultra HNI", and a new bank-supplied
  list, "Customers with multiple relationships", which replaces HNI on screen.
  - **Risk for Ranjith and Vidya:** "RBI & Government" is an occupation-type label, the thing B7 §E2 and D1 ruled out.
    Membership still comes only from the bank's own list, never from public data, and the purpose line stays.
  - Confirm the bank's own term before Anjani sees it.
- **Thresholds.** "Over 5 hours / over 24 hours" is gone. The Customer pulse shows volume, open, and contacts that waited
  more than 48 hours for a first reply. Internal "open too long" is also a 48-hour rule now, not the deliverable TAT.
  48 hours is a working threshold until the bank gives its TATs (Ranjith, 25:51: "just choosing 48 hours as an
  example").
- **External channels.** Open and open too long are dropped, because they can't be measured in public. The page shows
  total and high-impact signals, each with positive / negative and responded. "Responded is not resolved" is removed.
- **Removed from the MD view:**
  - the one-line summary;
  - "where to focus", now "Signals that are building";
  - the deliverables ledger and the deliverables columns (route kept, unlinked);
  - customer memory, mood, market and the retention watch.
  Mood and market move to the Cards view.
- **The morning brief is by business,** derived from six business cards, not by theme.
- **Business-head view: Cards only,** with its own layout. The other products say "coming soon".
- **IVR bot calls** are not counted on either view.

## D17 · Periods and the 48-hour figures

- **Periods.** Every period ends at 29 Sep 08:30, the last moment in the data, not the real clock. The Morning brief is
  28 Sep 08:30 to 29 Sep 08:30. Public data ends 28 Sep 23:59, and the screen says so.
- **Default.** 7 days, the period Ranjith used for the strip.
- **"Waited over 48 hours" and "open too long"** are counted within the period's own contacts, as of 29 Sep 08:30, which
  matches Ranjith's "in that last one week's volume…". A 24-hour window can't hold anything 48 hours old, so the
  Morning brief shows "—" and says why.
- **The synthetic data had almost no slow replies** (63 of 31,976). Written contacts (email, WhatsApp, social) now get a
  realistic tail: 8% wait 48–144 hours, from a third fixed-seed stream, so nothing else changes.
- **Short periods are source-weighted.** The capped late-September X run is a third of the last 7 days, and Reddit is
  two-thirds of the Morning brief. check_reconcile fails if a dominant source (over 60%) leaves any short-period public
  share unweighted.
- **High-priority mentions** (listed customers tagging the bank) are synthetic and tagged "Internal · illustrative". The
  linking rule is on screen: only through the bank's verified handles or contact records.

# Round 2, 30 Sep: the review with Karthik (changes_30sep.md, "Round 2")

## D22 · Round 1 overridden by round 2

| Round 1 | Round 2 | Resolution |
|---|---|---|
| A2.4: "High-priority mentions" (posts by listed customers) inside the Customer pulse | Customer pulse is internal only | Block removed from the section. Public voice now sits in its own Social pulse. |
| One "RMs have been alerted about X of Y" line for the whole Customer pulse | "RMs alerted: X of Y" on every list card | Per-list line on each card; the section-level line is gone. |
| Customer pulse: a sparkline under "No reply in 48 h" | Every figure compared with the previous period | Sparkline replaced by the change against the previous period. |
| C3: Cards table column "Open 48 h+" (still open after 48 hours) | "Not responded to in 48h+" | Renamed, and the figure is now first-reply wait over 48 hours, so label and number agree. The Cards issue pulse dial follows. |
| C3: one "Escalations" column showing "public · internal" | Split under Internal and External | Two columns, one in each group. |
| Status: resolved + open = volume | New status "Waiting on customer" | resolved + open + waiting on customer = volume, everywhere. Open, open too long and not responded all exclude waiting threads. |
| C4: three question cards on the Cards view, then Volume by channel and Actions | At most five panels | Third question card, Volume by channel and Actions moved out; reachable through Ask LisN. |
| Ask LisN as a floating button, bottom right (request of 30 Sep, after round 1) | A pinned question bar on every screen | Button and chat window replaced by the bar. |
| B: business card is one large link | A "Deep dive" button | Button on every card; the card is no longer a link. |

## D23 · Decisions made while building round 2

- **Transcript missing.** `review_karthik_30sep.md` was not in the repo. The build follows the change spec and its
  timestamps; "Missed by spec" is open until the transcript is added.
- **Waiting on customer is synthetic.** The internal data is illustrative, so the status is too: 40% of open contacts
  that already had a first reply carry `resolution_sent_at` (set from the record id, so nothing else in the seed
  changes). Scripted persona trails stay open. check_reconcile recomputes the status from the seed for every period.
- **Comparisons are like for like.** Open and "no reply in 48 h" are compared with the previous window as it stood at
  its own end. For the full window the comparison is second half against first half, as before.
- **Social pulse response rate.** Reply data exists for Play Store reviews only. The headline is the share of Play Store
  reviews with a bank reply, labelled informational; posts on X, Reddit and forums show "Replies not collected", never
  "Not responded". High-impact counts use the existing reach rule, so the Social pulse equals the CX pulse external
  figures (checked in reconcile).
- **Trending posts** are ranked by likes + replies + reposts (upvotes and helpful votes on Reddit and the stores). Text
  is the anonymised summary; posts that name a person or make an allegation are never shown.
- **Good response** is a Play Store review whose reply gives a reference and routes to an official channel. In the
  bank's reply the customer's name becomes "[customer]", the link becomes "[official help centre link]", and an
  exclamation mark becomes a full stop (screen copy carries none). For the Morning brief, where there is none in the
  window, the most recent earlier example is shown and dated.
- **Ask LisN answers are precomputed.** No live model call is wired. Each suggested question is answered from the
  page's own period figures (`frontend/lib/hdfc-v3/askAnswers.ts`), so answers change with the period and always match
  the screen. Every answer is tagged "Precomputed from this view's data; no live model call." Typed questions go to the
  closest suggested question, then to the older full-window prompts.
- **Role-based access** is shown with one Cards question about Home loans, which is refused.
- **My view** holds pinned answers in memory for the session only; a reload clears it.
- **Other screens.** "Waiting on customer" applies to the two 30 Sep views (periods.json). The unlinked older pages keep
  their own open counts.

## D24 · Bank replies on sources where none were collected (follow-up 2)

Replies are collected for Play Store reviews only. For the other sources a reply is simulated per post, from the post id
(sha1, no random stream, so a rebuild gives the same figures). Assumptions, based on how Indian bank care handles
typically behave:

| Source | Negative posts answered | Other posts answered | Reasoning |
|---|---|---|---|
| X | 68% | 40% | The care handle is most active here and answers most complaints that tag or name the bank. |
| App Store | 45% | 30% | Developer replies exist but are sparser than on the Play Store. |
| Reddit | 14% | 6% | Banks rarely reply in threads; a few are picked up through official accounts. |
| Forums | 8% | 3% | Consumer forums are seldom answered directly. |

- Resulting full-window rates: X 62%, App Store 37%, Reddit 9%, forums 5%; Play Store 96% (collected). Combined 69%.
- Every simulated figure is tagged "Illustrative" on screen (per source and per trending post).
- The CX pulse and Cards "Responded" figures stay on the collected Play Store replies; reconcile checks that the Play
  Store row of the breakdown equals them and that the sources sum to the combined figure.
- High-priority mentions moved from the Customer pulse cards to the External channels block (round 2 had removed them
  from the view). They remain synthetic and are tagged illustrative.

## D25 · Waiting on customer everywhere (follow-up 5)

- The status is now written by the seed (`status: "waiting_on_customer"`, with `resolution_sent_at`), not derived in the
  period pipeline, so every screen that counts open items from the seed excludes it without its own rule.
- RM alerts follow the open status, so lists now show fewer customers due an alert (for example Ultra sensitive 3 of 14,
  was 4 of 18).
- Reconcile: every contact is open, waiting on customer or closed; open + waiting + closed = total; the full-window
  period figures equal the older screens' dials once the IVR bot (left out of the 30 Sep views) is set aside.
- The Karthik transcript was still missing for this pass, so "Missed by spec" (follow-up 6) is open.

## D26 · Ombudsman watch: the complaint register and its assumptions
Design and definitions: `ombudsman_watch_design.md`. Only the RBI rules listed there are used; no HDFC TAT and no acknowledgement rule.

- **Which complaints:** the formal complaints already in the sample, i.e. every contact measured against the 30-day complaint-resolution rule, less IVR bot calls. That is 2,517 complaints from 5,000 sample customers in 13 weeks. No new population is invented.
  - **Scale:** we don't scale to HDFC's real size. Figures are "Internal · illustrative" and relative, as with the rest of the sample.
- **Taken from the sample, unchanged:** received date, channel, product, and final reply (the thread closed, or a resolution sent).
- **The issue:**
  - **How it's set:** the customer's most recent earlier contact on the same product. Without one, a draw from that product's own issue mix. All Cards complaints were tagged "complaint handling", so without this the category view would show a single row.
- **Assumed:**
  - **Outcome of a reply:**
    - resolved 70%, partly rejected 18%, rejected 12%;
    - resolved 62%, partly rejected 22%, rejected 16% where the contact was negative.
    - A reply within two days is always a resolution, because a rejection first goes through Internal Ombudsman review.
  - **Rejections:** the decision falls 55–80% of the way to the reply, and the Internal Ombudsman review before the reply.
  - **Open complaints:** 24% already carry a decision to reject (30% where negative), with the Internal Ombudsman review pending.
  - **Reopening after the reply:** 2% of resolved, 12% of partly rejected and 18% of rejected complaints.
- **"Unhappy with the reply":**
  - **Signals:** a reopening; a later *negative* contact on the same issue; or escalation language on any later contact.
  - **Tuning:** counting any later contact made the figure 28% of replies, which reads as noise. Requiring the contact to be negative, and using the lower reopening rates above, brings it to about 17%.
- **Exposure:** we don't show one. The ₹30 lakh + ₹3 lakh caps are per complaint and are stated as a rule. A summed "maximum exposure" would read as a forecast.
- **What needs you:** a material Ombudsman risk takes the first slot, and the business items keep the other two. **Material:** any complaint with 3 days or fewer to go, or more already eligible than at the previous period end.
- **The bank's lists:** Ultra sensitive, RBI & Government and Ultra HNI. The derived "multiple relationships" cohort is not a list the bank keeps, so it isn't counted.
- **Confirm with the bank:** the Internal Ombudsman timeline, and HDFC's product TATs. Neither is used in any figure.
