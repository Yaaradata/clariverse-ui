# Swedbank pulse: public layer notes (SW-D11)

Builder notes for the public pipeline: `scripts/swedbank_pulse/{normalise,classify,taxonomy,aggregate,public_v3,public_gate,method,l2_sample,public_provenance}.py`
and the checked-in labels `scripts/swedbank_pulse/public_labels.jsonl`. Window 22 Oct – 17 Nov 2026, freeze 17 Nov 07:45 CET
(held as `2026-11-17T06:45:00+00:00`).

## Inputs: one window file per source

| Source | File read | Records | Start date (tiles) |
|---|---|---:|---|
| App Store | `appstore/2026-11-17/swedbank_appstore_2026-10-22_2026-11-17.jsonl` | 3 | 2 Nov |
| Google Play | `playstore/2026-11-17/swedbank_playstore_2026-10-22_2026-11-17.jsonl` | 23 | 23 Oct |
| X | `x/2026-11-17/swedbank_x_2026-10-22_2026-11-17.jsonl` | 237 | 22 Oct |
| Reddit | `reddit/2026-11-17/swedbank_reddit_2026-10-22_2026-11-17.jsonl` | 66 | 22 Oct |
| Trustpilot | `forums/2026-11-17/swedbank_forums_trustpilot_2026-10-22_2026-11-17.jsonl` | 15 | 27 Oct |
| **All** | | **344** | |

`records.jsonl`, `records.csv` and `raw/` duplicate the window file and are never read. The Reddit threads file holds 38
records, all already in the Reddit window file (posts and comments whose post is in the data): it is never counted;
normalise.py fails if it ever holds a record the window file lacks.

## Scope: what is dropped before counting

Every raw record has one row in `public_labels.jsonl` (read in full, in Swedish, by the multilingual model). A raw
record without a label, or a label without a record, stops normalise.py.

| Source | On topic | investor_corporate | group_other | mention only / another bank / off topic | after freeze |
|---|---:|---:|---:|---:|---:|
| X | 18 | 105 | 82 | 28 (20 / 2 / 6) | 4 |
| Reddit | 21 | 15 | 0 | 30 (29 / 1 / 0) | 0 |
| Google Play | 23 | 0 | 0 | 0 | 0 |
| Trustpilot | 13 | 0 | 2 | 0 | 0 |
| App Store | 2 | 0 | 1 | 0 | 0 |
| **All** | **77** | **120** | **85** | **58** | **4** |

- investor_corporate: @Aktiellt research posts, results day (22 Oct), forecasts (Swedbank Economic Outlook, PMI),
  Fokusportfölj, price targets, share talk, Swedbank's own holdings, layoffs, leadership and politics about the group.
- group_other: Baltic Banking (Latvian, Lithuanian, Estonian, Russian posts; English posts about Swedbank in the Baltics;
  the CSC Telecom SMS-provider leak in Latvia, 11–15 Nov), business and association customers (the Swedbank företag
  App Store review, a UF company-account application on Trustpilot, an association account and a shop's KYC forms on
  X), and one Trustpilot review titled "Sparbanken" (Sparbankerna are out of scope).
- On X and Reddit an item counts only when Swedbank (Swedish retail) is its subject (NW-D92): named as the subject,
  addressed to the bank, or a comment in a thread about a Swedbank product. Fund-picking and portfolio chatter that only
  names a Robur fund is a passing mention.
- On-topic total is **77**, not the 220–250 the brief expected: X is almost all market news and Baltic posts, and Reddit
  is mostly fund and share talk. Reviews: **38** (App Store 2, Google Play 23, Trustpilot 13), not 41.

## Product routing (total: SW-D15 point 9)

| Product | Items | By source |
|---|---:|---|
| Payments and Swish | 2 | Trustpilot 1, X 1 |
| Everyday accounts and app | 43 | Google Play 22, Trustpilot 11, X 7, App Store 2, Reddit 1 |
| Cards | 4 | Reddit 4 |
| Mortgages (bolån) | 15 | X 8, Reddit 6, Trustpilot 1 |
| Savings and funds | 13 | Reddit 10, X 2, Google Play 1 |
| Consumer loans | 0 | — |
| nina_digital (module) | 0 | — |
| **All** | **77** | |

Every on-topic item carries exactly one product; classify.py and public_v3.py exit 1 on an unrouted item, and
public_v3 fails if the rows do not add up to the on-topic total. The routing table follows the brief (Step 4) in this
order: Nina words → nina_digital; privatlån, blancolån → Consumer loans; bolån, amortering, bindningstid, ränterabatt,
lånelöfte → Mortgages; fonder, ISK, sparkonto, Robur → Savings and funds; Swish, Bankgiro, betalning, överföring,
bedrägeri, spärrat kort → Payments and Swish; kreditkort, Mastercard, kort → Cards; bare ränta → Mortgages; everything
else (konto, app, BankID, inloggning, spärr, frysta, stängt konto, kundtjänst, kontor) → Everyday accounts and app. The
keyword rules agree with the labels on 65 of 77 items; the labels decide.

**Consequence of the brief's routing.** "Frysta / spärr / stängt konto" go to Everyday accounts and app, so the locked
accounts and blocked BankID on Trustpilot land there, while the deep-dive category "Account measures and blocked
payments" (common.CARDS_CATEGORIES) sits under Payments and Swish. Payments and Swish, the worked deep dive, therefore has
2 public items (a declined card purchase on X, AML questions about giving money away on Trustpilot): its quote slot and
share read the count and "—". If the deep dive should carry the account-measure items, the routing needs a decision
(move account_freeze and identity_checks themes to Payments and Swish).

## Themes (primary theme, on topic)

Mortgage rate and amortisation 12 · Funds and investments (Robur, ISK) 11 · App praise 9 · New app and update experience 8 ·
App login and BankID 5 · Branch (kontor) service 4 · Could not get through 4 · App outages, speed and crashes 2 ·
Account charges and fees 2 · Account measures: frozen or restricted accounts 2.

The Swedish register (brief Step 7) is applied to every theme label, definition and rung (ARN for the former ombudsman
rung, Nina for Cora, owner labels from common.OWNER_LABEL). Outcome-group ids are unchanged; their labels are Products
and services · Price and value · Clear information · Customer support.

## Headline check: account measures and fraud

Not carried by the public data at the strength the brief assumed. Items touching account measures, KYC/AML questions
or fair treatment: 7 on topic (Trustpilot 3: accounts locked and BankID blocked after a fund withdrawal; AML questions
before giving money away; an elderly customer's loan rewrite; X 4: a declined purchase, KYC questions that cannot be
answered in the app, a lawsuit over refused accounts, a rate-cut complaint). Reddit has none. No manipulated-transfer or
Swish-fraud item exists. Two more AML items are out of scope (Sparbanken, a small business). The largest negative
cluster in reviews is the app update (new design, login, crashes): 13 of 25 Google Play and App Store reviews are
negative, which is why the release pulse ranks top.

## Sentiment (NW-D91, SW-D11)

Review sources only, pooled across App Store, Google Play and Trustpilot. n-rules: 20 or more reviews give a share, 3–19
a figure marked indicative, fewer than 3 "—"; the count always shows. Reviews per window: Morning brief (16 Nov) 1 → "—";
Last 7 days 10 → indicative; Last 14 days 20 → share; Full window 38 → share. Social (X, Reddit) is indicative
throughout and never in a share or the mood.

Gate (SW-D15 point 8): public_gate.py nulls every public sentiment share and the mood figures unless
`scripts/swedbank_pulse/blind_check_result.json` records review-source agreement of at least 90%.

Blind check: the on-topic set is 77 items, so the sample is the whole set (`data/out/swedbank_pulse/work/blind_sample.jsonl`:
id, source, redacted text, no labels; reviews first, 38 items, then Reddit 21 and X 18). The builder's labels for the
same ids are in `blind_labels_builder.jsonl`. Two reviews disagree with their star rating (a 1-star review with neutral
text, a 5-star review saying the account disappeared after the update); the labels follow the text.

## Quotes and the screens contract

Quote rule: on topic, first person, product-matched, never another bank as subject, never naming or alleging against a
person. Each eligible label holds the Swedish excerpt (must be a substring of the redacted text, checked in classify.py)
and an English gloss. 33 items are quote-eligible. Every evidence row carries `"lang"` ("sv" or "en") and `"gloss"`
(English; null when the original is English); aggregate.py fails on a Swedish evidence row without a gloss. Classified
rows carry `lang`, `gloss`, `quote_ok`, `product` and `first_person` for periods_v3.

## Replies

There are no bank replies on X, Reddit, Trustpilot or the App Store. Google Play has 4 real replies from the bank (of 23
reviews, median about 73 hours): responses.json counts them as Public · live. The social "Handled n of m" comes only
from the internal social-inbox seed.

## Provenance (SW-D15 point 7)

`public_provenance.py`: `check(out_dir)` returns errors, `main()` exits 1 on any. It re-derives the redacted text of
every classified row from the raw record, checks the source counts, the on-topic totals in themes, meta and products,
every public record id in every payload, and every quote with a public platform (evidence and periods.json) against the
raw corpus. `--self-test` plants a fabricated evidence row, a fabricated classified row and an altered quote; all three
fail.

## PII (SW-D15 point 10)

normalise.py redacts links, e-mails, IBANs (an Estonian IBAN is in X), card numbers, personnummer, Swedish and
international phone numbers, clearing and account numbers, long numbers, handles (institutions kept as a plain name),
people named in the crawl, Swedish given-name + surname pairs, "called <name>", and the reviewer's own first name.
Authors are hashed. The Swedish rules in check_pii.py find nothing in the public outputs.
