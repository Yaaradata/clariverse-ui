# LisN · HDFC demo · B3b — Data Pipeline Brief for Claude Code

**How to use.** Save this as `docs/demo-rebuild/B3b_data_pipeline.md` in the repo, together with B1, B2 and B3a. Then start Claude Code with:

> Read `docs/demo-rebuild/B3b_data_pipeline.md` and execute it stage by stage. Stop after Stage 2 and show me `data/out/profile.md` before classifying.

---

## 0. Context (read first)

LisN is being demoed to HDFC Bank's Head of CX and the MD's office. This pipeline turns **public** customer voice (X, Reddit, Play Store, App Store, consumer forums) into:
- themes
- escalation, promise-break and transparency signals
- app-release pulse
- a daily mood index

Every figure on screen must trace back to source items. **Recall first:** keep the long tail, keep single-source themes, never silently drop items. Mine each source on its own, then merge at theme level.

**Language rules for any text output:** British spelling, rupees, no exclamation marks, business register.

## 1. Inputs

> **Superseded:** the inputs section in `RUNBOOK_overnight.md` is authoritative. The table below describes the first dump only.

- Download the Google Drive folder (right-click → Download) and unzip it to `data/raw/hdfc/`, keeping the subfolders. ICICI goes to `data/raw/icici/` later, same structure.
- Source formats observed (confirm on load; don't assume):

| Folder | Format | Fields seen |
|---|---|---|
| `X/august`, `X/september` | JSON array, plus `collection_meta.json` | `tweet_id, username, display_name, text, timestamp, url, profile_url, likes, replies, retweets, views, mentioned_accounts, month, role, source, social_context`. The meta records the queries, excluded bank handles, and `coverage_status: best_effort`. |
| `Reddit/august`, `Reddit/september` | JSON array, plus `collection_meta.json` | `post_id, url, user_posted, title, description, …`. Check for comments nested inside posts and flatten them with `parent_id`. |
| `Consumer_forum_AugtoSep` | CSV (UTF-8 with BOM) | `id, source, posted_date, title, text, llm_product, llm_post_class, llm_issue_type, url`. The `llm_*` columns are prior labels: keep them as `prior_labels` hints, never as ground truth. |
| `playstore`, `appstore` | XLSX exports (ExportComments) | About 7 header rows to skip (the "Source URL" row holds the app id); columns `Author, Author Description, Date, Rating, Helpful count, Review, Picture included, Language`. No app version. |

## 2. Stages

### Stage 1 · Normalise
Write `scripts/normalise.py`. It outputs `data/out/normalised.jsonl`, one record per item, using the B3a schema:

`id, bank, source, url, created_at (ISO, IST offset), text, title, parent_id, lang, author_hash, author_followers, engagement{likes,replies,reposts,upvotes,views,helpful}, rating, app_name, app_id, app_version, entity, query_matched, prior_labels, collected_at`

Rules:
- **`author_hash`:** SHA-256 of the username or author name. Drop raw names and handles from every output.
- **`entity`:** tag group companies separately from the bank: `hdfc_bank` · `hdfc_securities` · `hdfc_life` · `other_group`. Default aggregates are **`hdfc_bank` only**.
- **Duplicates:** remove exact duplicates on `id` only. Keep reposts and near-duplicates.
- **Flattening:** Reddit comments and X replies become their own records, linked by `parent_id`.

### Stage 2 · Redact and profile
Write `scripts/redact.py`, then `scripts/profile.py`.

**Redaction** removes personal data from `text` and `title`:
- phone numbers (Indian formats)
- account numbers, card numbers, card fragments (keep last 4 only if written as "ending xxxx")
- email addresses
- registration or complaint numbers of 6+ digits
- UPI IDs
- Aadhaar and PAN patterns
- personal names addressed in text where detectable

Replace each with a tag such as `[phone]` or `[account]`. Keep the pre-redaction text out of every output file.

**`data/out/profile.md`** must report, per source and entity:
- record count
- actual date range, earliest to latest
- items per week
- share with engagement data
- language mix
- coverage gaps

State plainly where a source covers only a few days. For example, the store exports may hold only the latest reviews rather than two months.

**STOP HERE.** Show the profile to Ranjith and wait before Stage 3.

### Stage 3 · Theme discovery, per source (recall first)
For each source separately, read a stratified sample (every week and every rating) and propose themes bottom-up. Write `data/out/themes_by_source.md` listing:
- each source's themes
- 2–3 paraphrased examples per theme (no personal data)
- themes found in one source only, marked as such

Then merge at theme level into `data/out/taxonomy.json`. **Merge, don't drop:** a theme seen once still gets an entry.

Seed themes (extend freely):
- **App and digital:** new app speed or launch · login and MPIN · false security alerts ("risky app", "potential security risk") · custom keyboard · crashes and maintenance · feature gaps (e.g. IPO ASBA, credit-card-only login)
- **Payments:** UPI failures · failed-transaction reversal · PayZapp
- **Cards:** variant migration and forced upgrade · rewards and devaluation · fees and charges · limit · application rejection and verification · dispatch and delivery · closure
- **Service:** dispute and chargeback · refunds · statements · customer care unreachable · branch service · repeated complaints
- **Loans:** processing and disbursal · EMI · foreclosure · recovery calls
- **Security:** fraud and scam calls · unauthorised transactions · phishing
- **Credit reporting:** CIBIL and credit-report correction
- **Other:** KYC, account opening and closure · mis-selling · praise

### Stage 4 · Classify every item (multi-label)
Write `scripts/classify.py`. Use the Anthropic API if a key is available: batch 20–50 items per call, with a JSON-only response and a fixed system prompt holding the taxonomy and definitions below. If there's no key, classify in batches within Claude Code and save progress incrementally.

Output `data/out/classified.jsonl` with these fields:

| Field | Values |
|---|---|
| `relevant` | `on_topic` · `mention_only` · `off_topic` (keep all; aggregates use `on_topic`) |
| `business` | retail_banking · cards · loans · payments · wealth · sme_merchant · corporate · group_company |
| `pillar` | availability · experience · data_intimacy · security (Anjani's four trust pillars) |
| `themes` | 1–3 theme ids from `taxonomy.json` |
| `sentiment` | positive · neutral · negative, plus `intensity` 1–3 |
| `escalation_intent` | true if it mentions RBI, the ombudsman, consumer court or forum, legal action, "complaint number", "third time", or tags @RBI or ministers; plus `escalation_target` |
| `promise_break` | true if the customer states an elapsed timeline or broken commitment; plus `request_type` (card_delivery, refund, reversal, dispute, closure, loan_disbursal, credit_report, kyc, other) and `days_elapsed` if stated |
| `status_seeking` | true for "where is my…", "no update", "still waiting", "status" |
| `cure_watch` | true if it follows a decline or failure the bank could have fixed proactively (declined payment, failed UPI, blocked card, limit) |
| `closure_intent` | true if the customer says they will close or have closed an account or card |
| `switching` | `to` / `from` plus the named bank, if it mentions moving between banks |
| `repeat_contact` | true for "already raised", "multiple times", "no response" |
| `feature_request` | true, plus a short label |
| `owner` | cx · digital · cards · retail · loans · payments · fraud_cyber · compliance · operations · rm · product |
| `summary` | 20 words or fewer, paraphrased, no personal data, British spelling |

Validation: re-run a random 5% sample and report the agreement rate in `profile.md`.

### Stage 5 · Aggregate for the app
Write `scripts/aggregate.py`. Outputs go to `data/out/app/`:

| File | Content |
|---|---|
| `themes.json` | theme, pillar, owner, business; count; weekly series; by-source split; share negative; share with escalation intent; 3–5 exemplar ids |
| `signals.json` | counts and weekly series for escalation_intent, promise_break (by request_type), status_seeking, cure_watch, closure_intent, switching, repeat_contact |
| `app_pulse.json` | per app: rating distribution, share positive, top issues with exemplar ids, date coverage |
| `mood.json` | daily and 7-day net sentiment, (pos − neg) / on_topic items, against the full-window baseline; plus the definition text |
| `evidence.json` | id → {source, created_at, url, summary, redacted_text} for every exemplar |
| `meta.json` | window, record counts per source, coverage notes, "Public · live" provenance label |

Every count must be reproducible from `classified.jsonl`. Add `scripts/check_reconcile.py`, which asserts that the totals in `app/` match `classified.jsonl`.

### Stage 6 · Report
`data/out/findings.md`:
- top 10 themes by volume and by rise
- top escalation themes
- promise breaks by request type
- status-seeking share
- cure-watch examples
- app pulse per app
- 3 "where HDFC is praised" themes
- data caveats

Paraphrase throughout, no personal data. Ranjith uploads `findings.md` and `data/out/app/*.json` to the Claude chat for B3 (headlines and on-screen figures).

## 3. ICICI
When `data/raw/icici/` arrives, run the same stages with the **same taxonomy file** (extend it if needed, and re-apply to HDFC). Write outputs to `data/out/icici/`. Never mix HDFC and ICICI records in one file. The comparison uses shares normalised to each bank's own `on_topic` volume.

## 4. Guardrails
- No personal data in any output file.
- No invented counts. Anything uncertain goes in `profile.md`.
- Don't discard items: exclusions are flags, not deletions.
- Keep the scripts rerunnable end to end: `make data` (or `python scripts/run_all.py`).
