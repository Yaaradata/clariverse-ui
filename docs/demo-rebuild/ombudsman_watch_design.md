# Ombudsman watch: design

- **Request (Ranjith):** "How many internal complaints are on the brink of going to the Ombudsman?"
- **Where it shows:** the MD's office / Head of CX view, and each business-head view. Cards is the only one built.
- **Branch:** `feat/ombudsman-watch`, from `feat/review-30sep`.

## The rules we build on (and nothing else)

| # | Rule | How it is used |
|---|---|---|
| 1 | The bank has **30 days** to reply to a complaint. The customer becomes eligible to approach the RBI Ombudsman if the bank has not replied within 30 days, or at any point if they are unhappy with the reply. | Countdown, "already eligible", "unhappy with the reply" |
| 2 | RB-IOS 2026 applies from **1 July 2026**, replacing the 2021 scheme. | Named in the rules line. The whole data window (1 Jul to 28 Sep) falls under it. |
| 3 | After the reply, or after day 30 with no reply, the customer has **90 days** to file. | An eligible complaint stays counted until its 90-day window closes |
| 4 | Awards up to **₹30 lakh** for financial loss plus **₹3 lakh** for harassment and time lost. | Stated as a rule, per complaint. Never summed into an exposure figure (see concept 6). |
| 5 | A complaint the bank partly or fully rejects must be reviewed by its **Internal Ombudsman** before the final reply. | "Awaiting IO review". Timings shown as "IO timeline: confirm with the bank". |
| 6 | Each request type has its own product TAT. We don't have HDFC's. | Any figure that would need one shows "Bank TAT: confirm with the bank". The watch itself uses only the 30-day rule. |
| 7 | There is no RBI rule on acknowledgement speed, or on email or social replies. | No acknowledgement or social-reply figure is shown as a breach |

**Framing everywhere:** "eligible to approach the RBI Ombudsman" and "at risk". We never predict that a customer will file.

## 1. Concepts

**Common data need:** a complaint register with received date, final reply date, reply outcome, IO status, the customer's reaction after the reply, and escalation-language flags. The sample has none of this today; step 2 adds it (see "Data" below).

### 1. Countdown to day 30
- **What it shows:** open complaints with no reply, grouped by days left before day 30 (8–10, 4–7 and 0–3 days left), plus "already eligible" (past day 30 with no final reply). It is one horizontal bar that fills towards day 30.
- **Why a banker acts:** it is the only part of the risk the bank still fully controls. A reply before day 30 closes the no-reply route. The 0–3 bucket is today's call list.
- **Data:** received date and final reply date.
- **Effort:** low.

### 2. Unhappy with the reply
- **What it shows:** complaints eligible whatever their day, because the customer has contested the reply.
- **Definition (testable):** a complaint is *unhappy with the reply* on date T if:
  1. a final reply was sent on or before T;
  2. T is within 90 days of that reply;
  3. between the reply and T, at least one of these happened:
     - (a) the customer reopened the complaint;
     - (b) the same customer contacted the bank again on the same issue (same theme, any channel);
     - (c) any contact from the customer used escalation language: RBI or Ombudsman named, consumer court or legal notice.
- **Why a banker acts:** these are eligible now. The reply did not land, and a second, better reply is the only lever left.
- **Data:** the reaction events after the reply.
- **Effort:** medium.

### 3. IO queue
- **What it shows:** complaints the bank has decided to partly or fully reject that are awaiting Internal Ombudsman review. Under rule 5, the final reply cannot go out until that review is done.
- **Why a banker acts:** a slow IO queue pushes rejected complaints past day 30 and makes them eligible on the no-reply route as well.
- **Data:** decision date, outcome, IO review date.
- **Effort:** low. The IO timeline is not confirmed, so we show counts, not durations.

### 4. Escalation-risk score
- **What it shows:** a per-complaint score for ordering the work, never shown as a probability. It adds up these signals:
  - days left: 0–3 days scores 50 (a reply today still prevents eligibility); past day 30, 40; 4–7 days, 35; 8–10 days, 20;
  - unhappy with the reply: 35;
  - repeat contacts on the issue: 8 each, up to 3;
  - channel hops: 5 for each extra channel, up to 15;
  - escalation language: 15;
  - on one of the bank's own lists: 10;
  - a public post that reached the bank's social inbox: 10.
- **Why a banker acts:** it orders the save list. Every point comes from a signal LisN already has.
- **Data:** the register plus contacts, lists and channels.
- **Effort:** medium.

### 5. Save list
- **What it shows:** the top 10 at-risk complaints to call today. Each row has the reason in words, the days left (or "eligible"), and an owner role (the category owner, or the Internal Ombudsman office while a review is pending).
- **Why a banker acts:** it turns a count into a morning's work. Ten is a list a team can finish.
- **Data:** the score (concept 4).
- **Effort:** low once the score exists.

### 6. Exposure *(rejected)*
- **What it would show:** the count eligible now, times the award ceiling.
- **Why not:**
  - Rule 4 is a cap per complaint. Multiplying it by the eligible count gives a crore figure that no real outcome approaches, and a banker would read it as a forecast.
  - **Shipped instead:** the eligible count is on the dials, and the award ceiling is stated as a rule.

### 7. Hotspots
- **What it shows:** which businesses, and within Cards which categories and subcategories, feed the at-risk count.
- **Why a banker acts:** it is the root-cause view. If a category keeps producing at-risk complaints, the cause sits upstream of complaint handling.
- **Data:** product and theme on each complaint.
- **Effort:** low. It uses the existing business list and the Cards accordion.

### 8. Priority-list overlap *(added)*
- **What it shows:** how many at-risk complaints come from customers on the bank's own lists (Ultra sensitive, RBI & Government, Ultra HNI).
- **Why a banker acts:** the same Ombudsman eligibility is a relationship problem for these customers, and the RM should hear first.
- **Data:** customer list membership.
- **Effort:** low.

### 9. Became eligible in this period *(added)*
- **What it shows:** complaints whose eligibility began inside the selected period, by either route.
- **Why a banker acts:** the dials are a snapshot as of the period end, so this is the flow that makes the period filter meaningful. It tells the MD whether the pipeline is filling or draining.
- **Data:** the register.
- **Effort:** low.

## 2. Chosen design

### MD's office / Head of CX
An **"Ombudsman watch"** tile, right after the CX pulse, containing only:
1. Four dials: on the brink (10 days or fewer left), already eligible, unhappy with the reply, awaiting IO review. Each shows the change against the previous period's snapshot.
2. "At risk, by business" on the right: a small bar for each business. Cards opens the Cards view; the others open their "coming soon" page.
3. The definitions and the RBI rules (30 days, RB-IOS 2026, 90-day filing window, award caps, "IO timeline: confirm with the bank") sit behind an ⓘ next to the table title, not on the tile.
4. **Morning brief:** when the risk is material (any complaint with 3 days or fewer left, or more complaints already eligible than at the previous snapshot), "What needs you" gets a bank-wide Ombudsman item first.

**Why:** the MD needs the size of the risk, whether it is moving, and where it sits. Review (Ranjith, 30 Sep): "just the dials and table on right"; the text below was too much for the MD/CX. So the countdown bar, the at-risk / became-eligible line, the lists line and the rules paragraph were removed from the tile. Their figures stay in `periods.json` and in Ask LisN (the countdown buckets and the lists question).

### Cards business view
Review (Ranjith, 30 Sep): the business head's view shows only their own business.
1. The same tile, scoped to Cards: the four dials and "At risk, by category". No bank-wide figure.
2. An **Ombudsman risk** pill on every category and subcategory in the issues accordion (concept 7).
3. The **save list**, top 10 (concepts 4 and 5).
4. Ask LisN answers on this view use Cards figures only.

**Why:** the head of Cards owns the fixes. The accordion shows where risk is coming from, and the save list shows whom to call.

### Ask LisN
Four suggested questions per view, answered from the same precomputed figures.

## 3. Metric definitions, as shown on screen

- **As of:** every risk figure is a snapshot at the end of the selected period (29 Sep 2026, 08:30 in the demo data). Changes compare it with the snapshot at the end of the previous period.
- **Complaint:** a contact the bank logged as a formal complaint, i.e. one measured against the 30-day complaint-resolution rule. IVR bot calls are not counted.
- **Open complaint:** a complaint with no final reply yet, or one the customer has contested after the reply (within the 90-day filing window).
- **Days left:** 30 minus the full days since the complaint was received.
- **On the brink:** an open complaint with no final reply and 10 days or fewer left. Buckets: 0–3, 4–7 and 8–10 days left.
- **Already eligible:** past day 30 with no final reply, and within the 90 days the customer has to file.
- **Unhappy with the reply:** a final reply was sent, and afterwards the customer reopened the complaint, contacted the bank again on the same issue, or used escalation language (RBI or Ombudsman named, consumer court, legal notice). This counts at any point within 90 days of the reply.
- **Awaiting IO review:** the bank has decided to partly or fully reject the complaint, and the Internal Ombudsman review is not complete, so the final reply cannot go out. IO timeline: confirm with the bank.
- **At risk:** on the brink, already eligible, or unhappy with the reply (each complaint counted once).
- **Became eligible in this period:** complaints whose eligibility began in the period (day 30 passed with no reply, or the first sign of an unhappy customer).
- **On the bank's lists:** at-risk complaints from customers on the bank's Ultra sensitive, RBI & Government or Ultra HNI lists.
- **Provenance:** every figure is tagged "Internal · illustrative". LisN flags and recommends; people act. It makes no contact with customers.

## Data (step 2)

- **Complaint register:** `data/seed/internal_v3/complaints.jsonl`, built by `scripts/hdfc_v3/seed_complaints_v3.py`. It is deterministic, using the fixed seed and a per-complaint hash.
  - **Base:** the formal complaints already in the sample. Their received date and channel come from the contact itself.
  - **Final reply:** the date the thread was closed or a resolution was sent.
  - **Outcome, decision and IO review dates:** synthetic, from the assumptions logged in MORNING_DECISIONS (D26).
  - **Reaction after the reply:** real repeat contacts and escalation-language contacts from the same customer, plus synthetic reopenings.
- **Period figures:** the per-period figures, both snapshots and the Cards detail, are written by `periods_v3.py` into `periods.json`. Nothing is computed in the browser.
