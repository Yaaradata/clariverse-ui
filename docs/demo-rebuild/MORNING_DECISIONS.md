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

The store exports carry no developer-reply field, and bank-authored X posts were excluded at collection. Play Store and
App Store are blocked from this build environment, so S1 could not be re-crawled here.
**Shipped:** the outside dials show the definition ("no bank reply within 48 hours") and "Needs reply data".
`public_v3.py` reads `replyContent`/`repliedAt` (Play) and `developerResponse` (App Store) automatically once the dev's S1
re-crawl lands. **Options:** (a) keep until S1 lands; (b) run the crawl through a paid scraping service (cost, and it
needs your approval); (c) hide the outside row until then.

## D3 · MD view leads with complaints closed without resolution (B7 §4.2)

"Complaints closed without resolution" is now first in "What needs you" and first in Actions on both views. The app
item is second, labelled **"New mobile app release: fix list"**. The 2.4★ vs 4.4★ line is removed from the exec pages.

## D4 · "Improving" (B7 §4.3)

Rule: at least 15 items in each half of the window. Shipped items:
- **Loan processing and disbursal:** share of public voice down 28% (38 then 43 items).
- **PayZapp on the App Store:** positive reviews rose from 14% to 39% (108 and 75 reviews). App Store only: the Play
  Store export starts on 31 August.
- **"Where customers praise us"** (renamed from "App praise").

NetBanking was dropped (15 items in total).

## D5 · "Re-promise" action chip

Because of "promise → deliverables", the chip now reads **"Set a new date"**. The underlying data value is unchanged.
"Brand promise gap" on the market view is now **"What we say vs what customers hear"**.

## D6 · Mood (B7 §4.4)

The headline is now the change against the window average (−22 pts), with "public voice skews negative". The raw −54
is not shown.

## D7 · Product rows and the loan split

Product rows use item-level counts (each public item once), so they reconcile to the 4,966 on-topic items. 471
wealth, SME and corporate items sit outside the table. Loans are split into personal, home and auto by the loan apps and
by keyword, and the screen says the split is approximate. Insurance has no bank-sold public items in the window, so its
row and business view lean on the internal layer and say so.

## D8 · Synthetic sample scale

The internal layer is a **demo sample**: 5,000 customers and 20,000 interactions over 8 weeks. The screens label it
"demo sample" and do not scale it up. For reference, the search surfaced 5,60,376 complaints received by the bank in
FY2022-23, from its published complaints analysis. That is roughly 86,000 in any 8 weeks. **T5 should verify this figure
before any screen or slide uses it.** Priority cohorts are over-sampled so the demo has enough to show: 45 customers on
list A, 124 on list B, 151 ultra-HNI, 640 HNI.

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
