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

# 1 Oct: fixes on the Customer pulse

## D27 · High-priority mentions: a realistic response rate

- Before, "responded" on a high-priority mention was the first response on the internal case, which is almost always
  present, so the card read 142 of 144 (99%) and made the problem look solved.
- Now a mention carries its own fact in the seed, `mention_replied`: whether the bank replied to the customer's public
  post. It is set from the record id (sha1, no random stream) at 62%, so a rebuild gives the same figures and no other
  internal figure moves (open, waiting on customer, no reply in 48h+ and RM alerts are unchanged).
- Result: full window 100 of 144 (69%); last 30 days 36 of 53 (68%); last 7 days 9 of 13 (69%). Short periods with a
  handful of mentions can sit outside the band.
- Reconcile recomputes the count and the replies from the seed for every period, and fails if the full-window rate
  leaves 55-70%.

## D28 · Colour, charts and labels on the Customer pulse

- **Colour rule.** Red, amber and green only where a direction is good or bad: no reply in 48h+ (including unanswered
  high-priority mentions), open, and negative share. Green when it fell, red when it rose, amber within 10% or with no
  earlier period. Volumes (contacts, mentions), the informational response rate and the footers are neutral. The rule
  is stated once in the section legend.
- **One chart per card.** Internal list cards: the large volume chart is gone; the one chart is the no-reply-in-48h+
  trend. External cards: Total mentions shows the negative-share trend (new series, source-weighted); High-impact shows
  its count (neutral); Bank response shows its rate (neutral); High-priority mentions shows unanswered mentions.
- **Hover.** Every custom trend chart (the area charts here and the sparkline in the Cards category table) shows the
  window and the figure with a highlighted dot: on mouse hover, on keyboard focus with the arrow keys, and on touch. The
  keyboard and touch go through an invisible range input over the chart. The Recharts charts on the older screens
  already had tooltips.
- **Comparison label.** One label for every period, "vs previous period". For the full window there is no earlier
  period of the same length, so the comparison is still second half against first half; the legend says so in
  brackets for that period only, and the exact comparison is in each figure's tooltip (`compare_detail`).
- **Ask LisN bar.** Pages have more bottom padding, and the content column has a solid strip behind the bar, so content
  fades out above the bar instead of showing behind it. At the end of every page the last line sits 62 px above the
  bar, at 1440 and 390 wide.
- **Work was done on a branch off main** (`feat/customer-pulse-fixes`), not on main itself.

# 1 Oct: internal volumes at bank scale (public_anchors_volumes.md, option 1)

## D29 · Internal volumes at bank scale

**How.** The seed still keeps about 32,000 contact rows and 5,000 customers. Each row now carries a weight `w` (how many
bank-scale contacts it stands for) and each customer a weight `cw` (how many contacting customers it stands for), set
in `scripts/hdfc_v3/scale_v3.py`. Every figure on the MD view, the Cards view and the Ombudsman watch is a weighted sum
of the kept rows for the selected period. Weights are whole numbers, so totals, channels, businesses, categories and
periods still add up exactly, and reconcile recomputes them from the rows. Nothing is stored at millions of rows.

**Weights.** Fitted by iterative proportional fitting to four margins at once (customer list, channel, complaint by
product, escalation rung), then rounded up or down by a hash of the row id. Deterministic: no random stream.

**Sample pages.** The older drill-down and customer pages (priority, customer, module, deliverables, satisfaction,
market, signal, action queue) list the kept rows themselves. Their counts stay sample counts and each page carries a
"Sample rows" label. The Cards save list says the same. Reconcile checks that those pages count the same rows, by the
same status, that the bank-scale views weight.

**Assumptions (each to confirm in discovery).** Anchors are in the anchors file; these are ours.

| # | Assumption | Value | Why |
|---|---|---|---|
| 1 | Total contacts, full window | 24 lakh | Middle of K3 (16-33 lakh). IVR bot calls sit outside it, as on the views. |
| 2 | Channel mix | Calls 56%, chat 13%, WhatsApp 7%, email 13%, branch 9%, social inbox 2% | Inside every K4 range. |
| 3 | Complaint | A contact measured against the 30-day complaint rule, as in the Ombudsman watch register | 1.1 lakh in the window (C5). |
| 4 | Product mix of complaints | Loans 31% (personal 14, home 11, auto 6), cards 26%, accounts 20%, PayZapp and UPI 11%, digital 6%, insurance 6% | K5's order; loans near O4's 29.25%. |
| 5 | Ombudsman complaints | 2,400 in the window (185 a week) | Middle of O7/O8. Internal Ombudsman 3,900 and MD's office 7,000 are ours, with no anchor. |
| 6 | Ultra HNI | 2,00,000 on the list (P1); 22.5% in contact (P2) | Middle of P2. |
| 7 | Ultra sensitive; RBI & Government | 1,800 and 3,200 on the lists; 40% and 35% in contact | P3 says low thousands; the shares are ours. |
| 8 | Contacts per contacting customer on a list | 2.5 | Ours. |
| 9 | Customers with a contact, whole bank | 10.5 lakh | Ours: 24 lakh contacts at about 2.3 each. |
| 10 | Customers with multiple relationships | 85,900 | See below. |

**"Customers with multiple relationships" was redefined.** It was every listed or HNI customer with two or more
products, which takes in almost all of the Ultra HNI list and the HNI tier, so it could not sit between the small lists
and Ultra HNI. It is now the bank's deepest listed relationships: customers on one of the three lists holding four or
more products. Its size is worked out from its own members (each contacting member stands for 1 / share-in-contact
customers), which gives 85,900. This changes who is on the list in the sample, so its figures moved on every screen.

**Pending complaints follow C2, not a literal 3-4% of the window.** C6 is pending at year-end over a year's intake
(16,133 of 4.42 lakh). Against one quarter's intake the same stock is about 15%. Holding pending at 3-4% of the 13-week
intake would mean about 4,000 pending, a quarter of the published stock. Ours is 21,094 pending (1.31x C2), which is
4.8% of annualised intake. The validation table carries both rows.

**Weights are level across time.** They do not depend on status or date, so each period is the same slice of a steady
flow: about 26,000 contacts and 1,200 complaints a day.

**Small-period caveat.** Rows on the small lists carry weights of 2 to 4 and Ultra HNI rows about 160, so a short
period's list figures move in steps, and a rate over a handful of rows (for example high-priority mentions in 7 days)
can sit well away from the full-window rate.

**Validation.** `qa/volume_validation.md` is rewritten by `scripts/hdfc_v3/volume_validation.py` on every run: 49 rows,
each against its anchor. It fails the run if a row is more than 2x off without a stated reason.

## D30 · Granularity, the Ombudsman share of pending, and RMs alerted (1 Oct, follow-up to D29)

**What was wrong.** With one weight per kind of row, small figures moved in steps: an Ultra HNI row stood for about 160
contacts, so "no reply in 48h+" read 3, 3, then 318 across periods, and "RMs alerted" was always a multiple of 16.

**Fix: more kept rows where the figures are small.**
- The seed now draws listed customers more often for the kept sample (Ultra sensitive 4.2x, RBI & Government 2.6x,
  Ultra HNI 9x). The sample is still 32,000 rows; the two small lists now hold about as many rows as they have
  contacts, so their rows carry a weight of about 1, and an Ultra HNI row about 29 instead of 160.
- Every row starts between 0.6 and 1.4 times the average before the fitting, and every customer between 0.5 and 1.5
  times its stratum's average, so rows of one kind no longer share one weight.
- The calibration was re-run: the totals still hit the anchors (24,00,418 contacts, 1,10,192 complaints, the channel
  and product mixes, 2 lakh Ultra HNI with 22% in contact). `qa/volume_validation.md`: 48 of 49 rows OK.
- New reconcile check: of the internal figures under 500 on the MD and Cards views, across all four periods, no more
  than 30% may share a common factor above 5. Today the worst is 21% (divisible by 7), across 191 figures.
- This redraws the sample, so every internal figure moved a little from D29 (pending 20,254, was 21,094; multiple
  relationships 85,000, was 85,900).

**Ombudsman watch against pending.** "On the brink" (2,707) and "already eligible" (6,621) are both complaints still
waiting for a reply, so together (9,328) they are a subset of pending (20,254): 46%. That is plausible for a 30-day
rule: about a third of pending is past day 30, and an eighth is within 10 days of it. Reconcile now checks the subset
for the bank and for Cards in every period, and that the bank share stays between 15% and 75%. "Unhappy with the reply"
is outside pending by definition: those complaints were answered.

**RMs alerted, at bank scale.** Y is the listed customers with an alert due in the selected period: a contact from the
period still open with the bank that is negative, high impact or more than 5 hours old (the same RM rule as before),
for customers who have an RM. A sample customer stands for its customer weight, but never for more customers than the
due contacts it carries, so Y never exceeds the open contacts beside it (reconcile checks this). X is those whose RM has
been alerted. Full window: Ultra sensitive 7 of 49, RBI & Government 16 of 79, Ultra HNI 381 of 1,880, multiple
relationships 242 of 1,055. "Customers in contact" uses the same cap.

**High-priority mentions.** The public reply is now spread evenly through time at bank scale (about 62% answered), so
the rate is steady across periods: 63% full window, 64% for 30 days, 72% for 7 days.

## D31 · Reject rate, Internal Ombudsman, negative share, social inbox and "unhappy with the reply" (1 Oct)

All rates below are ours unless an anchor is named. They live in `scripts/hdfc_v3/complaint_rules.py` and
`scripts/hdfc_v3/scale_v3.py`; figures are for the full window.

**1. Reject rate and the Internal Ombudsman: one register.**
- A complaint ends partly or fully rejected with probability 10.5% (12.3% when the contact is negative), 60% of those
  partly. A reply inside two days is always a resolution, since a rejection has to pass the Internal Ombudsman first.
  Result: 9.4% of complaints, 10,370, in line with peer bank disclosures (6-10%).
- Of complaints still open after two days, the same share already carry a decision to reject and are waiting for IO
  review: 2,454 awaiting; 7,916 reviewed; 10,370 sent in all.
- The outcome rules are in one module used by both the seed and the register. A contact sits at the ladder's IO rung
  exactly when it is a complaint with a decision to reject; the old independent IO rung (3,900, our earlier guess) is
  gone. Reconcile checks the ladder rung, the queue and "awaiting IO review" against the register.
- The RBI Ombudsman rung now also comes from the register: only a complaint that is at risk can reach it (40% of those
  unhappy with the reply, 12% of those past day 30 without a reply; more for loans, which are few in the sample). The
  total is still held at 2,400 (O7/O8), split by the complaint mix so loans lead (31%), then cards (26%).

**2. Negative share.** 12.2% of internal contacts are negative (was 41%, inherited from the sample). Complaints are 85%
negative; queries and requests about 9%. By product: personal loans 16%, cards 15%, home and auto loans 15%, PayZapp
and insurance 11%, accounts 9.5%, digital 9%. The product mix of contacts is held at the sample's own mix. The business
cards and the Cards issue pulse show these shares. The sample pages still count the kept rows, where the share is higher.

**3. Social inbox.** 1% of contacts (24,000), the low end of K4's 1-3%. Chat 13.5% and WhatsApp 7.5% take up the
difference; calls 56%, email 13%, branch 9% are unchanged. The inbox is still larger than the public mentions collected
(17,193): it counts every message to the bank's handles, including direct messages, and the public figure is a sample.
The External channels block carries one (i): "Public figures are the collected sample."

**4. Unhappy with the reply.** Derived from the reply's outcome, not from later contacts: 30% of partly or fully
rejected complaints come back (40% reopen, the rest contact again on the issue), and 2.2% of resolved ones do. Result:
2,921. Total at risk (on the brink 2,974 + already eligible 7,124 + unhappy 2,921) is 13,019, against about 2,400
Ombudsman complaints: 5.4 at risk for each one filed. Brink plus eligible is 51% of pending (19,882) and stays a
subset of it.

**Walkthrough.** `scripts/hdfc_v3/walkthrough.py` now writes the walkthrough from the Full-window figures on every
pipeline run, so its numbers cannot go stale.

**Not changed.** The unlinked sample pages keep their own ladder and sample counts.


# IndusInd V1

Judgement calls on the IndusInd build (`feat/indusind-v1`). Briefs: `docs/indusind/` (IND-B2, IND-B3, IND-B4); plan and
conflicts: `docs/indusind/build_plan.md`. Precedence: IND-B4 on screens, IND-B3 on data, IND-D1 on numbers, IND-B2 on
wording.

- **IV-01 · Base branch.** `release/vidya-demo` does not exist; `main` holds the latest HDFC build (bank-scale volumes
  merged). `feat/indusind-v1` is cut from `main`, with the one `chore/qa-setup` commit cherry-picked so the repo's QA
  commands (`qa_routes_v2.mjs`, `qa_overflow.mjs`, the AGENTS.md QA section) exist on the branch.
- **IV-02 · IND-D1 missing.** It was not in the zips and is not in the repo. The register keeps every ID, label, period
  and basis from IND-B3 §2 with the figure stripped; `value` is `null`, `d1` is `"missing"`, and screens show "pending
  verification". Ten held items from IND-B3 §2 are entries H01–H10 with `status: held`. Nothing is filled from IND-B3's
  tables, the research or memory. Dates of regulations and penalties are register values too, so they are pending as
  well; countdowns read "pending verification".
- **IV-03 · Owners reference.** IND-D1 §8 holds the names; it is absent, so the file lists roles only. Names are never
  rendered (DEC-9).
- **IV-04 · Data freeze.** DEC-8 sets no preview date. The freeze is provisionally 2 Oct 2026, 18:00 IST in
  `config/indusind.yaml` (`data_freeze_provisional: true`), and "This week" is the seven days to it. It is shown on
  screen as the freeze. Re-set it when Ranjith fixes the preview date.
- **IV-05 · Complaint counts withheld until N31.** The user rule is that no count may imply an annual complaint rate
  more than 2x off IndusInd's FY25 disclosure (N31). N31 is pending, so the check cannot run. The seed keeps absolute
  counts at an internal working scale, but page payloads and screens carry only shares (open, waiting, over 30 days,
  rejected, referred to the IO, as a share of received) and volumes as an index (Q1 weekly average = 100). When N31
  lands, the pipeline scales counts to it and the screens show counts.
- **IV-06 · Seed shape.** `scripts/seed_indusind.py` (path from IND-B3 §6), fixed seed 20261002, 27 weeks ending on
  the freeze (back to early April, so Q1 gives the index baseline). Complaints are generated case by case with no
  customer identifier and aggregated to `complaints_weekly`; the Ombudsman watch reads the case rows. Deposits and Cards
  are aggregate only.
- **IV-07 · Two datasets added to IND-B3's core four.** `contacts_weekly` (week × product × channel: contacts, negative,
  complaints) so the negative share of contacts can be shown and checked (about 12%, user rule); complaints are a subset
  of negative contacts. `complaints_weekly` gains `waiting_on_customer` and `escalated_grievance`, so resolved + open +
  waiting = received and the pulse can show "escalated to a grievance desk" (IND-B4 §2.2).
- **IV-08 · Rates (illustrative, ours).** Reject rate 8% of replied complaints (peer disclosures 6-10%); every rejection
  passes the Internal Ombudsman first, so IO referrals, the IO queue and "awaiting IO review" come from the one case
  register. Unhappy with the reply: 30% of rejected, 2% of resolved. Reply time lognormal, median 8.5 days. Escalated to
  a grievance desk 8.5%; escalation language 6%. Contacts per complaint 21 (inside the 15-30x planning range).
  Complaint mix by product leads with loans and cards. Result at the freeze: reject 8.1%; pending 18% of 13 weeks'
  intake; on the brink + eligible 18% of pending; negative share of contacts 12.1%.
- **IV-09 · Ombudsman states.** Pending = no final reply yet, or replied and the customer came back unhappy within 90
  days. On the brink: no reply, 20-30 days old. Eligible: no reply, more than 30 days old. Every at-risk state is a
  subset of pending. The 30-day and 90-day timelines are RB-IOS rules that are not register entries: the screens say
  "RB-IOS timelines: confirm with the bank".
- **IV-10 · No causal story.** Deposit flows for every slab, region and branch type share one rhythm (month-end lift,
  a gentle wave) with their own noise; no cell is made to lead. Balances are null: they come only from the register's
  period-end figures (N03-N06, D03-D04), which are pending.
- **IV-11 · Lint.** The 26 rules of IND-B3 §8 live in `scripts/lint_indusind.py` and run inside `scripts/lint_terms.py`,
  over the IndusInd UI copy, register, seed, payloads (including the Ask LisN answer bank) and built pages. Rows and
  columns do not exist in plain text, so "in a peer column", "on an IndusInd row" and "in the home or Micro loans rows"
  are read as "in the same string" (stricter than the brief). Rule 18 checks that every payload display holding a digit
  sits in an object with an id, and that no component types a figure. Rule 21 reads both `scripts/lint_local_terms.txt`
  (IND-B3's name) and the repo's existing `scripts/lint_terms_local.txt`, both untracked. Register build notes (for
  example 'Never "quarterly root-cause"') are kept in a `build_note` field that is never rendered or linted.
- **IV-12 · Reconcile and privacy.** `scripts/check_indusind.py` checks every L1 figure against the register, business
  row = module and = the home pulse for that business, resolved + open + waiting = 100%, Ombudsman at-risk within
  pending, balances bound to the right register entries, the sanity ratios and the payload privacy grep. Each check
  has a fixture that must fail it (`scripts/test_checks.py`). `check_pii.py` now also scans the IndusInd files.
- **IV-13 · Selection in the URL, sliced on the server.** View, window and business live in `?v=&w=&b=`. Each page
  reads its own payload on the server and sends the browser one window, one business and one view: CEO's office does
  not receive the channel table or the owners table it does not render.
- **IV-14 · Arithmetic in words.** Sensitivity formulas reach the screen as `formula_text`, with each register ID
  replaced by its label and period. Instructions in sensitivity notes ("Add the derivation to IND-D1 v1.1") moved to
  `build_note`; the on-screen basis note keeps only the basis.
- **IV-15 · Biome scope.** `npm run lint` (repo-wide `biome check`) already fails on main with 2,586 errors in files
  outside this work. The IndusInd gate is `biome check` on `components/`, `app/` and `lib/indusind-v1` plus the shared
  files changed here; it must be clean. `next.config.mjs` keeps its existing style (two pre-existing warnings).
- **IV-16 · Rule 18 and CSS.** A layout value in a style prop (`translateX(-50%)`, `calc(100% + 6px)`) is geometry, not
  a figure. The rule now skips strings whose every word is CSS; fixtures check both that CSS passes and that a figure
  inside CSS-looking text still fails.
- **IV-17 · Internal labels in payloads.** Register periods read "date per IND-D1" and reached the screen. They now read
  "date pending verification". `check_indusind.py` gained an internal-label check (brief, decision, track, screen and
  register IDs, "V1") over every payload string except id and build-note fields, with a fixture. It also caught the
  approvals list carrying a raw `{N36}` title template, now built from the card's title parts.
- **IV-18 · Seed account counts.** Weekly savings opens and closures rounded to zero per cell, so the closures and
  new-money indices were blank. Counts now use their own account base per cell (100,000 × the cell weight).
- **IV-19 · Definitions behind the (i).** Definitions carry numbers ("over 30 days", "Q1 weekly average = 100"), so they
  live in `config/indusind.yaml` (`copy.defs`) and reach the page through `common.json`; no figure is typed in a component.
- **IV-20 · Home layout.** Improving, peer moves and horizon sit three across; the checked-and-within-range item is one
  thin line under them (a tile of its own was mostly empty). Ombudsman "eligible" is red (the reply rule is already
  breached); the other states amber; volumes neutral.
- **IV-21 · Weekly complaint register as stock and flow.** The first build measured each week's own intake at that
  week's end, so "over 30 days" was always 0% and about 82% read as "pending". The register now reads as a bank MIS does:
  received and closed in the week as indices on the Q1 weekly intake, the pending stock in weeks of intake, the share of
  pending over 30 days, and rejected, reopened and IO referrals as shares of the week's final replies. It shows the
  last 13 weeks in every window.
- **IV-22 · Business filter scope.** On the home page the business filter changes the customer pulse and the Ombudsman
  watch. The pulse-by-business table, the four cards and the strips stay bank-wide (the table already has a row per
  business; the selected one is highlighted). Deposits and Cards have their own screens; other businesses show
  "Module next".
- **IV-23 · Views.** CEO's office and Head of CX change the home page only (summary vs channel table, gauges, evidence
  open, owners table). The other screens are the same in both views; screenshots are still taken in both.
- **IV-24 · Rates side by side.** With the manual read not logged, the peer rates P10–P17 are listed (pending) with one
  line saying IndusInd's own rate for the same band appears once the read is logged. No comparison is drawn.
- **IV-25 · Routes and screenshots.** IndusInd routes live in `scripts/routes_indusind.json` (HDFC's `routes.json` is
  unchanged). Full-page screenshots hide the floating Ask bar (a fixed bar lands mid-page in a full-page capture); a
  second end-of-page shot per screen shows the bar clear of the footer, and the script asserts it.

## IndusInd V1 · public voice (L2)

- **IV-26 · Licence buckets.** Core (on screen): INDIE on Google Play and the App Store, consumercomplaints.in. Pending
  (counted, never shown): X (2,235; an Apify tweet-scraper actor, not a named paid X API tier), Reddit (1,497; Apify
  archive-scraper actors, not the official API), MouthShut (3; not in the IND-B3 sources table). Out (dropped, never
  stored): TechnoFino (419), Trustpilot (10). The collection-method line in the request was left blank; the method was
  read from the scrape's own actor ids.
- **IV-27 · Apps.** IND-B3 names INDIE only, so INDIE for Business, BHIM IndusPay, IndusDIRECT Corporate, Video Branch
  and the small bank apps are excluded (892 Play rows). The IndusInd Insurance and INLIC apps belong to group insurance
  companies, not the bank (372 rows): excluded.
- **IV-28 · Raw outside the repo; no free text committed.** The scrape stays in `../indusind_inputs/social_raw/`.
  The committed store (`data/processed/indusind_l2/items.jsonl`) holds labels, hashes and glosses only. Redacted text
  and post URLs go to the gitignored `_audit/` folder: reviews name staff and family members in ways no pattern
  fully catches. Redaction still runs before storage (phones, 12–19-digit numbers, emails, PAN, URLs, @handles,
  self-introduced names and the repo's name detector). Hashes are base32 so they never read as phone numbers.
- **IV-29 · Tagging.** Deterministic keyword rules (English, Hindi and Hinglish) for product, topic and theme, with the
  method on every item. A store review with no product word is `app_digital` (it is about the app). Recovery-agent
  allegations need both a who (recovery or collection staff) and a what (harassment, threats, abuse): "threat
  detected" is the app's security error. "Scam" as an insult is not customers-targeted fraud. Sentiment on store
  reviews comes from the star rating. 29 Devanagari items glossed by hand; three are Marathi (language `mr`).
- **IV-30 · Themes.** Hand-written labels and paraphrases (`config/indusind.yaml`, `l2.themes`) after reading the items.
  A theme counts only non-positive items (its paraphrase describes a complaint) and needs 15 items. The account-opening
  rule was narrowed after reading its 15 items (half were "don't open an account here" warnings).
- **IV-31 · Thresholds and states.** A claim needs 15 items in the window, else "Not enough public items this window".
  A source above 60% of a scope's items is footnoted with its share (Google Play is 95–100% everywhere). Play reviews
  start 10 Aug (the collector hit its 5,000 cap), so the weekly series is a share and windows before 10 Aug carry a
  coverage footnote. Negative share is left out of every payload until a person sets `sentiment_check_passed`.
- **IV-32 · Cards sub-line.** Cards leads the product businesses on public items but Digital (the app) has far more,
  and the home table shows both, so the sub-line stays "Business view: Cards".
- **IV-33 · What stays not loaded.** Peer rate cards, ads and press are captures, not voice; none are in the zip, so
  those slots still say "Public data not yet loaded". The pull holds no peer-bank items.
- **IV-34 · INDIE rating.** The Play run returned dated listing metadata: 4.5 from 8,17,954 ratings, scraped 1 Oct
  2026. Shown once, one store, dated. The App Store run returned no listing metadata.
- **IV-35 · Peer apps.** IND-B3 wants the core peers' retail apps on Play and the App Store. The pull holds none: every
  app's developer is IndusInd Bank Ltd. or a group insurer. The ingest now has a `peer` bucket (Federal, Yes, IDFC
  First retail apps, tagged by bank, deposit topics and peer voice only, never in IndusInd totals) for when they are
  pulled. Counts: peer 0; IndusInd apps outside the B3 list 892 and group insurers 372, both still excluded.
- **IV-36 · Sharper themes.** "Cards in the app" and "Deposits in the app" were replaced by concrete sub-themes read from
  the items: Cards (card missing from the app; card-only sign-up; bill payment) and Deposits (debit card set-up; fixed
  deposits; frozen accounts; account opening; savings account missing; charges). The largest with 15 non-positive
  items wins; otherwise "Not enough public items this window". Card missing from the app fits about 28 of its 35
  items; the debit-card paraphrase was widened after reading (renewal and charges as well as PIN and limits).
- **IV-37 · 10 Aug cut.** Every public figure for a window reaching back before the first Google Play review counts
  from 10 Aug; App Store items before that are shown apart ("not added in"). The weekly series starts at a marker.
  "Responded" is "Play Store · bank replied" with n, Play only. The listing rating is "all-time, as of" its scrape
  date and sits apart from the window's figures.
- **IV-38 · Card G trigger.** IND-B4 gives none. Used: in a week, at least 15 security-block reviews, at least 10% of
  the week's app reviews, and a share on the newest releases at least 5× the previous stable release's. It fired in
  the four weeks to 28 Aug, 4, 11 and 18 Sep (release 2.5.0) and is not firing in the week to the freeze. Written to
  `docs/indusind/card_g_candidate.md`; not swapped in (Ranjith's call).
- **IV-39 · App Store drop.** 210 INDIE reviews in August, 16 in September. Not a slice boundary (both runs agree);
  Play rose over the same weeks. Read as a collection gap and footnoted wherever App Store items count.
- **IV-40 · Seed artefacts.** Cards categories each follow a seeded trend (slope signs alternate) and show their change
  as share points, which removes the month-end swing every category shares; a check fails if more than 80% move one
  way. Pending IO reviews are now timed like replied ones, so they no longer bunch into the last week; IO referrals run
  6.3–10.2% of a week's replies, the one 10.2% week being within weekly noise (about 0.8 points on some 1,100
  replies). Card A shows "Savings balances and term deposits, Mar to Jun 2026" until N04 and D08 are verified.
- **IV-41 · Role-based home.** The screens moved from `/indusind-v1` to `/role-based/indusind_bank/customer-pulse` and
  appear as two roles on the Indus Ind Bank page (CEO's office; Head of CX, opening the Head of CX view), beside the
  existing Head of Cards role. The shell copies the role-based layout (icon rail with "Y" back to roles, title bar,
  as-of pill). `/indusind-v1/*` redirects; noindex moves with the routes.
- **IV-42 · Carry-forward file.** `docs/indusind/carry_forward_from_hdfc.md` was not found in the working tree, any
  local or remote branch, or under `D:\office`. The HL rules quoted in the requests (HL-03 and the rules listed in the
  first IndusInd request) are applied; the rest wait for the file.
- **IV-43 · Carry-forward rules applied (`docs/indusind/carry_forward_from_hdfc.md`).** Rules found already met and how
  they are checked are listed in `docs/indusind/feedback_log.md`. Gaps closed on this round:
  - HL-01: a check now fails if any public item id reaches a page payload (with a fixture).
  - HL-02: public items that allege something against a named person are dropped at ingest, not redacted (2 dropped).
  - HL-06: the internal-names lint is seeded from the briefs (Owner and Who columns, less any word the config uses),
    with internal ids (IND-, DEC-, S-, CF-, IV-, HL-, V1, T1–T6); fixtures for both.
  - HL-09: IndusInd writers write LF; the repo's `.gitattributes` already sets `eol=lf`; scripts run without
    `PYTHONIOENCODING`.
  - HL-18: `qa/indusind_anchors.md` (ANCHOR, DERIVED, ASSUMPTION; stock versus flow for N32).
  - HL-19: negative share of contacts now varies by product inside 9–16% (it was a flat 12%); the social inbox is 1% of
    contacts (it was 2%) and 1% of complaints (it was 4%); checks with fixtures.
  - HL-20: a lumpiness check over the small integers shown (fixture).
  - HL-22: tile subtitles ≤6 words and theme paraphrases ≤12 words are linted (fixtures); source notes now sit behind an
    (i); the Deposits "Is it real" line is cut to one short sentence.
  - HL-23: every Cards section title carries "Cards".
  - HL-28: a lint for "16 Jan 2026" (fixture).
  - HL-33: screenshots add 1536×730 at 1.25, with local fonts, mouse parked and smooth scroll off
    (`scripts/qa_screens_indusind.mjs`).
  Still open: HL-11 (independent review, IND-B4 §10.8) and HL-18 anchors that wait on IND-D1 (N31, N32) or on a source
  for Ombudsman filings. No HL rule conflicted with an IndusInd brief.
- **IV-44 · Head of Cards.** The role opened the earlier cards demo (hard-coded figures, not built to IND-B4 §7). It now
  opens S-CARDS (`/role-based/indusind_bank/customer-pulse/cards`). The earlier demo keeps its route
  (`/role-based/indusind_bank/head_cards`) but is unlisted on the role page.
- **IV-45 · Check scope.** lint_terms, check_pii, the rendered-page grep, the watermark check and noindex now cover every
  route reachable from `/role-based/indusind_bank` (crawled by `scripts/qa_indusind_routes.mjs`: the role page, the
  customer-pulse screens and every view, window and business link). noindex covers `/role-based/indusind_bank/*`,
  which includes the unlisted earlier demo; its content is not crawled because nothing on the role page links to it.
  The IndusInd role page shows the watermark.

## IndusInd V1 · independent review fixes (`qa/review_indusind_v1_response.md`)

- **IV-46 · Earlier cards demo redirected (review finding 1).** `/role-based/indusind_bank/head_cards` now redirects on
  the server (`next.config.mjs`) to the Cards business view. So do the three role ids, and any other single segment under
  the IndusInd role page goes back to the role page. No IndusInd URL renders the shared `[roleId]` page or carries its
  bundle (the earlier demo's ₹9,760 Cr, co-brand partner names and "mis-selling claims"). The component code
  (`CardsPortfolioV2Dashboard`, `IndusIndCardsCustomerPortfolioDrill`) and the registry entry are kept; nothing is
  deleted. Open question for the decision owner: is the earlier demo still needed anywhere else?
- **IV-47 · Check scope is every route under `/role-based/indusind_bank/` (review finding 1, IV-45 replaced).**
  `scripts/indusind_route_checks.mjs` enumerates the routes from the route files, linked or not: every `page.tsx` under
  `app/role-based/indusind_bank/`, every IndusInd role id the shared `[roleId]` route would resolve (constants and
  registry entries, unlisted ones included), every redirect source under the root in `next.config.mjs`, a probe for
  the catch-all, and the view, window and business variants. `qa_indusind_routes.mjs` checks each (status after
  redirects, final URL still under the root, noindex, watermark, footer, rendered grep including the earlier demo's
  strings) and follows links as before; its `pages.json` feeds `lint_terms.py` and `check_pii.py`, so lint and PII
  cover the same set. Fixtures in `scripts/test_qa_indusind_routes.mjs` (run by `run_all.sh`), including "an unlinked
  route without a watermark fails".
- **IV-50 · Register filled from IND-D1.** `scripts/fill_register_indusind.py` copies every value from IND-D1 (2 Oct 2026)
  and recomputes D01–D11 and S01–S07 from the verified inputs, failing if any differs from the v1.1 addendum. Result: 59
  verified, 11 derived, 10 held (H01–H10: peer sizes, VF slippage, distribution fees, total assets, IndusInd and IDFC
  First rate tables, the IRDAI penalty, 30 Sep and 31 Dec balances, the ECL date, peer conduct penalties, AU VF).
  - **Differences from IND-B3: none.** Every IND-B3 §2 figure already carried IND-D1's verified value (checked by
    script, 70 rows). IND-D1's corrections were against the research files: ₹31,417 crore is Rural Banking, not
    microfinance; cost of funds 5.05% (5.68% was the Q1 FY26 cost of savings); Federal cost of deposits 5.21% (not
    5.25%); RBL CASA 25.2% is an average; credit cards ₹9,418 crore and personal loans ₹9,930 crore; the SFIO letter is
    dated 23 Dec 2025; DPDP phases are November 2026 and May 2027 (month only); the IO duty is quarterly pattern analysis,
    not root-cause; peer rate cards moved (Federal card 29 Sep 2026, Federal savings 16 Jul 2026, Yes FD peak 7.25% from
    2 Jun 2026, Yes savings 7 Apr 2026, RBL 1-year FD 6.90%); the INDIE Play rating is 4.5 from 8.19 lakh reviews.
  - **entity_basis:** IND-D1 does not say standalone or consolidated, so every entry stays `as_presented`.
  - **Held:** FY26 complaint counts are not in the register (IND-D1: NOT FOUND); IndusInd and IDFC First rate tables and
    the IRDAI penalty (UNVERIFIABLE) stay held.
  - **Precedence (IND-B2 wins on whether a figure is shown):** N15 keeps `display_default: false` (DEC-3) and is not in
    any payload; no personal names (DEC-9), linted; N17 is in the register only, never in copy; Federal CASA reads "up
    188 bp YoY" only; Yes savings shows the 2.50% and 3.50% bands only; peer rate rows are not sent until IndusInd's own
    rates are read (`manual_read_logged`).
  - **LIVE-01:** "4.5 from 8.19 lakh reviews, India listing, as of 2 Oct 2026" (IND-D1's read), all-time and apart from
    the window's figures. The bank's 4.6 is never shown as a store rating.
  - **Computed views:** days to go (from the freeze), Card C's "4% below a year ago" (the March-quarter change stays in
    the drawer) and the Improving pair "6.44% → 5.95%" are recomputed from the register by `check_indusind.py` (fixture).
- **IV-48 · DEC-7 on IndusInd pages (review findings 3, 4, 29).**
  - The role page has its own route (`app/role-based/indusind_bank/page.tsx`). It has no "Back to industries" link and
    does not load the shared registry or the industries list. It carries the watermark and the footer, and every link
    stays under the IndusInd root.
  - The root layout's sidebar (with other clients' logos and names) is now loaded only where it is rendered, so
    IndusInd pages no longer ship it.
  - The bank's name is "IndusInd Bank" everywhere (`INDUSIND_BANK_NAME`). The role copy has one source,
    `INDUSIND_ROLE_COPY`, used by the registry and the role page.
  - Lint rule IND-DEC7: no name from `scripts/indusind_other_clients.json` in IndusInd UI copy, payloads, built pages
    or crawled text (with a fixture).
  - The route checks also fail on such a name in the JS a page loads, and on any link that leaves the IndusInd pages.
- **IV-51 · IND-D1 "Do not show" list against the lint.** Items 1–9, 11–13 and 15 (part) were IND-B3 §8 rules 1, 3–10,
  13–16. New rules, each with a failing fixture: DN10 (the IRDAI penalty with a date or grounds), DN14 (4.6 or 4.7 as a
  store rating), DN15 (every person named in IND-D1 §8, DEC-9), DN16 (Federal CASA up QoQ), DN17 (numeric FY27 guidance
  beyond "in line with market" and "exit RoA of 1%"), DN06 (the annual report's 69,204 and 14,904; the register uses BRSR
  N31 and N32). N15 and N17 are marked `not_in_copy`: kept in the register, skipped by the lint there, and linted
  wherever they could appear on a page.
- **IV-52 · Public period labels.** Public data starts 10 Aug (the Play collector's cap) and is not re-pulled. Every public
  block now states its period; in the "Last 13 weeks" window that is "since 10 Aug", never "13 weeks". Charts keep the
  start marker; July is never drawn as zero (the series starts at 10 Aug and the earlier App Store items sit apart).
- **IV-53 · Ads.** No ad captures exist and none are invented. The Ads section on Peer and market moves is removed (no
  placeholder), and ad references are dropped from the Deposits "why" note and the home peer-moves tile. Card B carried
  no ad text (its public lines are rate offers only).

## IndusInd V1 · visual review of 3 Oct

- **IV-54 · Closure risk is an index.** "Accounts at risk of closure" is an index (Q1 weekly average = 100), not a count,
  so no scaling to the card base is needed; it is labelled "(index)" and "Illustrative" wherever shown.
- **IV-55 · IO pattern analysis date.** The Directions of 14 Jan 2026 (N37) set a quarterly analysis; the due date shown is
  the next quarter-end after the data freeze (31 Dec 2026), recomputed by the check. Month-only dates (DPDP) count days to
  the start of the month.
- **IV-56 · Peer card dates.** P10–P15 are verified pages read 2 Oct 2026. They are shown as card dates, one line per
  bank, tagged "Public · verified · page read 2 Oct 2026"; never as rate changes and never beside IndusInd rates (manual
  read not logged). "This week" = within 7 days of the freeze (Federal 29 Sep, RBL page dated 1 Oct); the Deposits "why"
  uses the 13-week window. Yes (w.e.f. 2 Jun) shows only on the Peers page.
- **IV-57 · Press list.** Each peer's Q1 FY27 release date is the earliest source date among its verified results figures
  in the register (Federal 17 Jul, RBL 17 Jul, Yes 18 Jul, IDFC First 25 Jul), plus CRISIL 19 Aug; Ratings and Press merge
  into one dated tile. Peer rows with nothing verified (AU, Bandhan, and the Kotak benchmark) are hidden behind
  one footnote, "Other peers: pending verification".
- **IV-58 · Business filter on home.** Outside = that business's public items (Cards equals the Cards page, checked).
  "What customers are doing" shows savings only under All and Deposits; Cards shows card balances (N18) and the Cards
  closure index; Vehicle, Micro and Digital show their own book or app lines.
- **IV-59 · Quiet item.** The public check (Google Play reviews this week within the range of the previous full weeks
  since 10 Aug) does not pass: 338 this week against 403–931. The internal check stays, tagged Internal · illustrative.
- **IV-60 · Readiness checklist.** Every status reads "To confirm with the bank": the bank's progress is not known.
