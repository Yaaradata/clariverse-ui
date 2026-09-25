# HDFC B3a — queries.md

Bank: **HDFC only** (ICICI not included).
Window note: **X is Aug–Sep 2026 only** (current VoC window). Reddit includes whatever was in the local scrape files.

## Counts (one line per source)

| Source | Records | Date range | Gaps / notes |
|---|---:|---|---|
| x | 781 | 2026-08-01T07:33:40+05:30 → 2026-09-24T15:18:47+05:30 | Aug–Sep window only. parent_id/author_followers/engagement zeros from HDFC/X/_reply_meta.json (fetch_x_reply_meta.py). query_matched approximate (mentioned_accounts / source tag). |
| reddit | 2216 | 2026-08-01T11:36:18.193000+05:30 → 2026-09-24T16:08:21.053000+05:30 | Bright Data queue delays / some failed triggers; comments included via parent_id. |
| **all** | **2997** | — | Combined `hdfc_all.jsonl` — X + Reddit only (exact dedupe by `id`). |

## Combined file

- `hdfc_all.jsonl` — X + Reddit only; id scheme `x:…`, `reddit:…`.
- Rebuild: `python HDFC_jsonl/build_b3a_intake.py --only combine`

## X

- Method: browser X search (Latest + Top) for `@HDFCBank` and `@HDFCBank_Cares` mention/reply windows; bank-authored posts excluded; `-filter:retweets`. These are the only queries reflected in `query_matched`.
- Window: **Aug–Sep 2026** (September through collection day).
- Files: `HDFC/X/august/hdfc_x_mentions_aug_2026.json`, `HDFC/X/september/hdfc_x_mentions_sep_2026.json`.
- `url` uses `https://x.com/i/status/<id>`; no handles in URLs.
- `parent_id` = the post this one replies to (`x:<id>`); may point to posts not in this file, e.g. bank replies. Raw scrape files have no reply-target fields. Values come from `HDFC/X/_reply_meta.json` (produced by `HDFC_jsonl/fetch_x_reply_meta.py`: X API v2 when `X_BEARER_TOKEN` is set, else fxtwitter status API).
- `_reply_meta.json`: Last filled 2026-09-24T17:16:06.482631+00:00 via `fxtwitter` (772/781 tweets). Prefer X API v2 when `X_BEARER_TOKEN` is set.
- `author_followers` likewise from `_reply_meta.json` (API `user.fields=public_metrics` or fxtwitter `author.followers`). Raw scrape has no follower counts.
- Engagement: likes/replies/reposts/views from scrape strings; empty string → null; explicit 0 kept as 0. Overlay `public_metrics` from `_reply_meta.json` when present. `upvotes` is always null for X.
- `query_matched` is **approximate**: raw files do not store which search string returned each post. Labels are taken from scrape `mentioned_accounts` when present, else the scrape `source` tag (`x_search` / `x_curated_thread_merge`). No phrase-search labels (`"HDFC Bank"`, `"HDFC credit card"`) appear in this delivery.

## Reddit

- Keywords:

  - `HDFC`
  - `HDFC Bank`
  - `HDFC credit card`
  - `HDFC card`
  - `HDFC loan`
  - `HDFC personal loan`
  - `HDFC home loan`
  - `HDFC car loan`
  - `HDFC banking`
  - `HDFC app`
  - `Infinia`
  - `Regalia`
  - `Millennia`
  - `Diners Club Black`
  - `HDFC debit`
  - `PayZapp`
  - `HDFC NetBanking`
  - `HDFC UPI`
  - `HDFC customer care`
  - `SmartWealth`
  - `HDFC Life`
  - `HDFC ERGO`
  - `HDFC insurance`
  - `HDFC Securities`
  - `SmartHub`

- Subreddits (HDFC text filter `(?i)hdfc`):

  - `r/CreditCardsIndia`
  - `r/IndianCreditCards`
  - `r/CreditCardIndia`
  - `r/CardMaximiser`
  - `r/personalfinanceindia`
  - `r/IndiaInvestments`
  - `r/IndiaFinance`
  - `r/IndianStreetBets`
  - `r/IndianStockMarket`
  - `r/hdfcbank`
  - `r/IndianbankHomeLoans`
  - `r/InsuranceIndia`

- Provider: Bright Data Reddit dataset; exact-duplicate removal by post/comment id only.
- Files: `HDFC/Reddit/august/reddit.json`, `HDFC/Reddit/september/reddit.json`.
- Posts and kept top-level comments are both emitted (comments use `parent_id`).

## Schema notes

- `author_hash`: SHA-256 of lowercased handle (no raw handles in delivery files).
- Private map (do not ship): `HDFC_jsonl/_private/author_handle_map.jsonl`.
- Exact-duplicate removal only (same `id`). Near-duplicates kept.
- Combined file: `hdfc_all.jsonl` (X + Reddit only, same ids, deduped by `id`).
