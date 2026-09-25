# LisN · HDFC demo · B3a — Data Intake Spec (for the dev team)

**The ask: raw, normalised, un-clustered.** Do not cluster, filter, sentiment-score or summarise. Those steps happen in B3 against one shared taxonomy, so that every figure on screen traces back to a source item.

## 1. Files

Deliver one file per bank per source:
```
hdfc_x.jsonl · hdfc_reddit.jsonl · hdfc_playstore.jsonl · hdfc_appstore.jsonl · hdfc_forums.jsonl
icici_x.jsonl · icici_reddit.jsonl · …   (same set, same window, same query logic)
queries.md                               (exact search terms, subreddits, apps and forum URLs used, per source)
```
JSONL (one record per line) is preferred; CSV is acceptable. **Keep HDFC and ICICI in separate files. Never merge them.**

## 2. Record schema

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Stable, unique: source plus native ID |
| `bank` | yes | `hdfc` or `icici` |
| `source` | yes | `x`, `reddit`, `playstore`, `appstore`, `forum:<site>` |
| `url` | yes | Permalink to the item (used for evidence drill-down) |
| `created_at` | yes | ISO 8601 with timezone, e.g. `2026-08-14T21:32:00+05:30` |
| `text` | yes | Full original text, untruncated, no cleaning |
| `title` | if any | Reddit and forum titles |
| `parent_id` | if any | Replies and comments: the ID of the post they answer (threads matter) |
| `lang` | if known | Leave blank if unsure; Hinglish is expected |
| `author_hash` | yes | SHA-256 of the handle. **Do not deliver raw handles**; keep the mapping private on your side |
| `author_followers` | if any | X; for reach |
| `engagement` | if any | `{likes, replies, reposts, upvotes, views}` as available |
| `rating` | stores | 1–5 |
| `app_name` | stores | e.g. MobileBanking, PayZapp |
| `app_version` | stores | Needed for availability-by-release analysis |
| `query_matched` | yes | Which search term or rule found this item |
| `collected_at` | yes | When scraped |

## 3. Do

- **Exact-duplicate removal only** (same `id`). Keep near-duplicates and reposts: repetition is itself signal.
- **Keep everything the queries matched,** including off-topic and noise. Relevance filtering happens in B3.
- **One line of counts per source in `queries.md`:** records, date range, and any gaps (rate limits, blocked periods).

## 4. Quick wins to thicken the data (if there's time before handover)

1. **App stores: extend back 6–12 months.** Store reviews carry history cheaply, and this gives a baseline plus release-by-release comparison.
2. **Consumer forums: extend back 12 months.** Complaint forums keep history.
3. **Reddit: extend back as far as search allows.**
4. **Broaden query terms** for both banks, with identical logic for each:
   - product and app names: Infinia, Regalia, Millennia, Diners, Swiggy HDFC, Tata Neu, PayZapp, MobileBanking, NetBanking; ICICI equivalents such as iMobile, Amazon Pay ICICI, Sapphiro, Coral
   - common misspellings, and Hinglish phrasing
5. **X stays at the current window.** State that plainly on screen.

## 5. Handover

- **If the zipped dump is under about 30 MB:** upload it to this chat and the analysis runs here.
- **If larger:** place it in the repo under `/data/raw/`. B3 will specify a classification script for Claude Code to run locally.
