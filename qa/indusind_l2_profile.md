# IndusInd · public voice (L2) profile

Raw scrape: outside the repo (`INDUSIND_L2_RAW`, default `../indusind_inputs/social_raw/IndusInd-jul1st26-sept30th26`), never committed. Window: 1 Jul 2026 to the data freeze (2 Oct 2026, 18:00 IST). This file holds counts and dates only: no text, handle or URL.

## 1. Inventory

| Source | App or site | Bank | Bucket | Rows | Earliest (IST) | Latest (IST) | Collector |
|---|---|---|---|---|---|---|---|
| Google Play | INDIE by IndusInd Bank | indusind | core | 5000 | 2026-08-10 | 2026-09-30 | dami_studio/google-play-reviews-scraper |
| Apple App Store | INDIE by IndusInd Bank | indusind | core | 281 | 2026-07-01 | 2026-09-26 | steadyscrape/app-store-reviews-scraper |
| consumercomplaints.in | — | indusind | core | 3 | 2026-07-04 | 2026-07-30 | local:forums:consumercomplaints |
| Google Play | INDIE For Business | indusind | excluded | 707 | 2026-07-01 | 2026-09-30 | dami_studio/google-play-reviews-scraper |
| Google Play | IndusInd Insurance | indusind | excluded | 338 | 2026-07-01 | 2026-09-30 | dami_studio/google-play-reviews-scraper |
| Google Play | BHIM IndusPay | indusind | excluded | 114 | 2026-07-04 | 2026-09-29 | dami_studio/google-play-reviews-scraper |
| Google Play | IndusDIRECT Corporate | indusind | excluded | 51 | 2026-07-02 | 2026-09-25 | dami_studio/google-play-reviews-scraper |
| Apple App Store | IndusInd Insurance | indusind | excluded | 18 | 2026-07-01 | 2026-09-27 | steadyscrape/app-store-reviews-scraper |
| Google Play | INLIC Customer Connect | indusind | excluded | 15 | 2026-07-02 | 2026-09-28 | dami_studio/google-play-reviews-scraper |
| Google Play | Video Branch | indusind | excluded | 15 | 2026-07-06 | 2026-09-30 | dami_studio/google-play-reviews-scraper |
| Google Play | IndusInd Gift City | indusind | excluded | 3 | 2026-07-09 | 2026-09-14 | dami_studio/google-play-reviews-scraper |
| Google Play | Indus PayWear | indusind | excluded | 1 | 2026-08-19 | 2026-08-19 | dami_studio/google-play-reviews-scraper |
| Google Play | IndusFX Card | indusind | excluded | 1 | 2026-09-20 | 2026-09-20 | dami_studio/google-play-reviews-scraper |
| Apple App Store | INLIC Customer Connect | indusind | excluded | 1 | 2026-07-24 | 2026-07-24 | steadyscrape/app-store-reviews-scraper |
| TechnoFino | — | indusind | out | 419 | 2026-07-02 | 2026-09-30 | local:forums:technofino |
| Trustpilot | — | indusind | out | 10 | 2026-07-05 | 2026-09-22 | local:forums:trustpilot |
| X | — | indusind | pending | 2235 | 2026-07-01 | 2026-10-01 | kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest |
| Reddit | — | indusind | pending | 1497 | 2026-07-01 | 2026-10-01 | automation-lab/reddit-historical-archive-scraper, maximedupre/reddit-historical-archive-scraper |
| MouthShut | — | indusind | pending | 3 | 2026-08-06 | 2026-09-22 | local:forums:mouthshut |

Every row is an IndusInd query; the pull holds **no peer-bank items** (the IND-B3 peer query set was not collected), so `bank` is `indusind` throughout and peer voice stays not loaded.

Fields present, per source:

- **Apple App Store:** actor_id, actor_run_id, app.country, app.name, app.store_id, app.version, author.display_name, author.followers, author.id, author.username, author.verified, channel, collected_at, created_at, created_at_raw, engagement.helpful, engagement.likes, engagement.quotes, engagement.replies, engagement.reposts, engagement.score, engagement.upvotes, engagement.views, id, lang, native_id, org, org_reply, parent_id, query_matched, rating, raw_ref, record_type, text, thread_id, title, url
- **consumercomplaints.in:** actor_id, actor_run_id, app, author.display_name, author.followers, author.id, author.username, author.verified, channel, collected_at, created_at, created_at_raw, engagement, id, lang, native_id, org, org_reply, parent_id, query_matched, rating, raw_ref, record_type, text, thread_id, title, url
- **MouthShut:** actor_id, actor_run_id, app, author.display_name, author.followers, author.id, author.username, author.verified, channel, collected_at, created_at, created_at_raw, engagement, id, lang, native_id, org, org_reply, parent_id, query_matched, rating, raw_ref, record_type, text, thread_id, title, url
- **Google Play:** actor_id, actor_run_id, app.country, app.name, app.store_id, app.version, author.display_name, author.followers, author.id, author.username, author.verified, channel, collected_at, created_at, created_at_raw, engagement.helpful, engagement.likes, engagement.quotes, engagement.replies, engagement.reposts, engagement.score, engagement.upvotes, engagement.views, id, lang, native_id, org, org_reply, org_reply.replied, org_reply.replied_at, org_reply.reply_id, org_reply.response_time_minutes, org_reply.text, parent_id, query_matched, rating, raw_ref, record_type, text, thread_id, title, url
- **Reddit:** actor_id, actor_run_id, app, author.display_name, author.followers, author.id, author.username, author.verified, channel, collected_at, created_at, created_at_raw, engagement.helpful, engagement.likes, engagement.quotes, engagement.replies, engagement.reposts, engagement.score, engagement.upvotes, engagement.views, id, lang, native_id, org, org_reply, parent_id, query_matched, rating, raw_ref, record_type, text, thread_id, title, url
- **TechnoFino:** actor_id, actor_run_id, app, author.display_name, author.followers, author.id, author.username, author.verified, channel, collected_at, created_at, created_at_raw, engagement, id, lang, native_id, org, org_reply, parent_id, query_matched, rating, raw_ref, record_type, text, thread_id, title, url
- **Trustpilot:** actor_id, actor_run_id, app, author.display_name, author.followers, author.id, author.username, author.verified, channel, collected_at, created_at, created_at_raw, engagement, id, lang, native_id, org, org_reply, parent_id, query_matched, rating, raw_ref, record_type, text, thread_id, title, url
- **X:** actor_id, actor_run_id, app, author.display_name, author.followers, author.id, author.username, author.verified, channel, collected_at, created_at, created_at_raw, engagement.helpful, engagement.likes, engagement.quotes, engagement.replies, engagement.reposts, engagement.score, engagement.upvotes, engagement.views, id, lang, native_id, org, org_reply, parent_id, query_matched, rating, raw_ref, record_type, text, thread_id, title, url

## 2. Licence check (IND-B3 §7 sources table)

| Source | Bucket | Reason | Rows |
|---|---|---|---|
| Google Play | core | allowed in core | 5000 |
| Apple App Store | core | allowed in core | 281 |
| consumercomplaints.in | core | allowed in core | 3 |
| Google Play | excluded | bank app outside the IND-B3 list (INDIE only) | 892 |
| Google Play | excluded | group-company insurance app, not the bank | 353 |
| Apple App Store | excluded | group-company insurance app, not the bank | 19 |
| TechnoFino | out | TechnoFino: out under IND-B3 (terms) | 419 |
| Trustpilot | out | Trustpilot: out under IND-B3 (terms) | 10 |
| X | pending | X: scraper actor, not a named paid X API tier | 2235 |
| Reddit | pending | Reddit: archive scraper actors, not the official API | 1497 |
| MouthShut | pending | MouthShut: not in the IND-B3 sources table | 3 |

**Pending licence decision: 3,735 rows** (X 2,235, Reddit 1,497, MouthShut 3). Not on any screen. Collection method recorded in the scrape: X via an Apify tweet-scraper actor; Reddit via two Apify archive-scraper actors; MouthShut via a local forum scraper. Ranjith decides; if X moves to a named paid API tier and Reddit to the official API, re-pull rather than reuse these rows.

**Out:** TechnoFino and Trustpilot rows are dropped at ingest and never stored.

## 3. Counts per source × week (week to Friday 18:00 IST)

| Week to | Apple App Store (core) | consumercomplaints.in (core) | Google Play (core) | MouthShut (pending) | Reddit (pending) | X (pending) |
|---|---|---|---|---|---|---|
| 3 Jul | 12 | 0 | 0 | 0 | 50 | 28 |
| 10 Jul | 9 | 1 | 0 | 0 | 72 | 175 |
| 17 Jul | 2 | 1 | 0 | 0 | 75 | 62 |
| 24 Jul | 0 | 0 | 0 | 0 | 91 | 322 |
| 31 Jul | 29 | 1 | 0 | 0 | 117 | 107 |
| 7 Aug | 136 | 0 | 0 | 1 | 112 | 99 |
| 14 Aug | 26 | 0 | 383 | 0 | 127 | 105 |
| 21 Aug | 34 | 0 | 510 | 0 | 154 | 89 |
| 28 Aug | 14 | 0 | 660 | 1 | 141 | 99 |
| 4 Sep | 14 | 0 | 934 | 0 | 100 | 91 |
| 11 Sep | 4 | 0 | 878 | 0 | 115 | 118 |
| 18 Sep | 0 | 0 | 673 | 0 | 124 | 58 |
| 25 Sep | 0 | 0 | 599 | 1 | 135 | 222 |
| 2 Oct | 1 | 0 | 363 | 0 | 84 | 660 |

Core counts above are INDIE only for Play and the App Store.

## 4. Counts per source × product (rule tagging, before review)

| Product | Apple App Store | consumercomplaints.in | Google Play | MouthShut | Reddit | X |
|---|---|---|---|---|---|---|
| micro_loans_rural | 0 | 0 | 0 | 0 | 0 | 25 |
| vehicle_loans | 0 | 0 | 0 | 0 | 4 | 16 |
| home_loans | 1 | 0 | 1 | 0 | 3 | 2 |
| personal_loans | 0 | 1 | 1 | 0 | 6 | 1 |
| cards | 35 | 0 | 139 | 0 | 537 | 199 |
| nri | 5 | 0 | 2 | 1 | 1 | 4 |
| fd_rd | 2 | 0 | 13 | 0 | 5 | 16 |
| deposits_savings | 10 | 0 | 57 | 0 | 36 | 36 |
| app_digital | 228 | 1 | 4782 | 1 | 86 | 211 |
| other | 0 | 0 | 0 | 1 | 815 | 1409 |

## 5. Gaps and artefacts

- **Apple App Store (core):** 281 rows; first item 1 Jul; 42 zero days in 1 Jul–30 Sep; empty runs of a week or more: 18 Jul–25 Jul, 7 Sep–25 Sep
- **consumercomplaints.in (core):** 3 rows; first item 4 Jul; 89 zero days in 1 Jul–30 Sep; empty runs of a week or more: 5 Jul–12 Jul, 14 Jul–29 Jul, 31 Jul–30 Sep
- **Google Play (core):** 5,000 rows; first item 10 Aug; 40 zero days in 1 Jul–30 Sep; empty runs of a week or more: 1 Jul–9 Aug
- **MouthShut (pending):** 3 rows; first item 6 Aug; 89 zero days in 1 Jul–30 Sep; empty runs of a week or more: 1 Jul–5 Aug, 7 Aug–24 Aug, 26 Aug–21 Sep, 23 Sep–30 Sep
- **Reddit (pending):** 1,497 rows; first item 1 Jul; 1 zero days in 1 Jul–30 Sep
- **X (pending):** 2,235 rows; first item 1 Jul; 0 zero days in 1 Jul–30 Sep
- **Google Play, INDIE: capped run.** The collector stopped at its 5,000-review cap (newest first), so INDIE Play covers 10 Aug–30 Sep only. 1 Jul–9 Aug is missing: a mid-window start. Play series are plotted as shares, and every Play count for a window that starts before 10 Aug is footnoted.
- **Apple App Store: thin September.** 210 INDIE reviews in August, 16 in September (two collector slices). Read as a collection artefact until re-pulled.
- **Sudden jumps.** X: 660 items in the week to 2 Oct and 322 in the week to 24 Jul, against about 100 in a typical week (event or campaign spikes; pending anyway). App Store: 136 in the week to 7 Aug against 0–35 in the other weeks (a collector slice boundary).
- **Data ends 30 Sep.** The freeze is 2 Oct, 18:00 IST; "this week" (26 Sep–2 Oct) holds five days of data.
- **Play reply dates.** Some bank replies are dated before the review (Play keeps the first reply date when a review is edited). `responded` uses the reply flag only, not the gap.
- **No reply data** for the App Store, X, Reddit or the forums: `responded` is not available there.
- **Out-of-window dates:** 0 rows.
- **Duplicates (text hash, items of 30+ characters):** 104 repeat rows within a source; 0 texts appear on more than one platform; 6 texts posted by three or more authors (copy-paste or bot pattern).
- **Heavy posters (15+ items from one author):** X 9 authors, Reddit 2 authors. None is the bank's own handle (it has no posts in the pull). X and Reddit are pending, so no heavy poster reaches a screen.
- **Off-topic (rules):** consumercomplaints.in homonym 1, Google Play homonym 1, Google Play investor 4, Reddit investor 3, Reddit jobs 1, X homonym 17, X investor 296, X jobs 3.
- **Very short core items (<15 characters, e.g. "good"):** 2,257. Kept for counts and ratings; never used as an example or theme evidence.

## 6. Schema map (IND-B3 §7 field → raw field)

| IND-B3 field | Play | App Store | consumercomplaints.in | X / Reddit (pending) |
|---|---|---|---|---|
| bank | derive (query set: IndusInd only) | derive | derive | derive |
| language | derive from script (raw `lang` is the request language) | derive | `lang` | `lang` (X); derive (Reddit) |
| product | derive (rules) | derive (rules) | derive (rules) | derive (rules) |
| topic_tags | derive (rules) | derive (rules) | derive (rules) | derive (rules) |
| peer_mentioned | derive | derive | derive | derive |
| reach | not available | not available | not available | `engagement.views` (X only); followers never used |
| responded | `org_reply.replied` | not available | not available | not available |
| on_topic | derive (rules) | derive | derive | derive |
| english_gloss | written for Hindi items | — | — | — |
| appVersion | `app.version` | `app.version` | — | — |
| rating | `rating` | `rating` | — | — |
| author handle | hashed (`author.id`) | hashed | hashed | hashed |
| post URL | audit file only, gitignored | audit only | audit only | audit only |

## 7. Listing metadata (LIVE-01)

The Play run returned dated INDIE listing metadata (score, ratings count, review count, last update) with the scrape time (1 Oct 2026). It is used for the INDIE Play rating, dated to the scrape. The App Store run returned no listing metadata.

