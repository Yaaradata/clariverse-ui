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
