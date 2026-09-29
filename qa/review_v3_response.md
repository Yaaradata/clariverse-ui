# Response to the independent review (qa/independent_review_v3.md)

- **Branch:** `fix/review-v3`
- **Commits, in order:**
  - review baseline
  - step 1: names
  - step 2: labels
  - step 3: "promise"
  - step 4: one internal dataset
  - step 5: mood and trends
  - step 6: checks
  - step 7: MORNING_DECISIONS
  - step 8: this file and the remaining findings
- **Checks** (`bash scripts/hdfc_pipeline/run_all.sh`, which runs the checks after the pipeline): reconcile 0 failures, lint 0 hits, PII 0 hits, PII fixtures 8 of 8, check fixtures 18 + 8 of 8.
- **Frontend:** `next build` passes, Biome passes on the V2 scope, and all 82 V2 routes return 200.

**Status key**
- **Fixed:** changed and verified.
- **Deferred:** not done, with the reason and who unblocks it.
- **Disagree:** the finding's proposed fix was not taken, with the reason.

## Blockers

| # | Finding | Status | What was done, or why not |
|---|---|---|---|
| 1 | Full bundle, with 358 quotes and real names, serialised into every page | **Fixed** | Pages pass `sliceBundle()` output (`frontend/lib/hdfc-v3/slice.ts`). A page ships only the evidence it renders: 0–6 summary-only items, 37 on market, and 5 full quotes on a signal page. Verified with a grep of every page payload and of `.next`: zero hits for every name in the review. V1 pages carry no names but still ship V1's full evidence set (see the V1 row under "Also noted"). |
| 2 | Real names, handles and a defamatory allegation render on signal pages | **Fixed** | Redaction now happens in the pipeline (`scripts/pii_names.py`, used by `normalise.py` and `classify.py`, plus `redact_batches.py` for the committed batches). Quotes that allege something against, or complain about, a named person are never evidence. The footer now states exactly what is redacted. `check_pii.py` has a name and handle rule; `test_check_pii.py` proves it fails on seeded names. **Limit:** spaCy NER cannot run on this machine (application-control policy), so detection is rule-based, and names in non-Latin scripts or rare names with no cue can slip through. |
| 3 | "V2 · after Vidya call" in every header | **Fixed** | Version switch removed from both headers. Role-menu names are neutral. The lint now flags people's names and internal references. |
| 4 | "Re-promise" renders on D1 and signal pages | **Fixed** | Changed at source (taxonomy) and in all components. The lint whitelist is removed and every form of "promise" is flagged. |
| 5 | Two internal datasets on screen | **Fixed** | V2 no longer loads `internal.json` or `joined.json`. MD mail, satisfaction and the D1 lower half come from internal_v3, and 13 new reconcile checks tie them together. |

## Major

| # | Finding | Status | What was done, or why not |
|---|---|---|---|
| 6 | Mood −23 is a source-mix artefact | **Fixed** | Source-weighted mood (`scripts/hdfc_pipeline/method.py`): **+3.1 pts**. The unweighted figure (−37.5) and the reason are on screen, with a per-source table on the satisfaction page. |
| 7 | Reddit collector change creates false trends | **Fixed** | Reddit is split at 1 Sep and out of trend basis. Trends are source-weighted and weekly series are shares. Cards trend: **+2.2%** (was +18%). |
| 8 | "Closed or responded" ring shows 95% under a 99.9% number | **Fixed** | Ring matches its number. The sub-line says "still open but already answered". |
| 9 | Outside dials mix denominators; open = open too long | **Fixed** | Each reply dial states "of 10,617 Play Store reviews". The open-too-long ring is a share of reviews, and a note explains when every unanswered review is over 48 hours old. The table shows a percentage. |
| 10 | MD actions drop the app fix list and ignore cohorts | **Fixed** | MD: complaints, app fix list, then a new priority-relationships action ("60 issues open over 24 h; RMs told about 9 of 64"). Head of CX: the same three, then two more. |
| 11 | "Where customers praise us" counted as improving | **Fixed** | Shown for balance as "Watching", not counted as improving. Improving also needs the raw count to fall at least 20%. |
| 12 | "New HDFC Bank app" applied to all-version counts | **Fixed** | Pipeline adds version-11 figures. Screens now say 1,188 negative reviews of version 11 and 31% positive, against 73% on earlier versions, with all-version counts labelled. Ask LisN is updated too. |
| 13 | Mixed-store rating comparisons | **Fixed** (one remainder labelled) | The exec gauges and the market app cards compare apps on the Play Store only, with counts. **Remainder:** the market "By version" line still pools both stores and says so; the one-store version tables are on M1. |
| 14 | "Acknowledged" and "Awaiting owner" for the same theme | **Fixed** | One routing list (`common.py` ROUTING); themes that were not routed read "Not routed yet". |
| 15 | Copy overstates escalation counts | **Fixed** | Now reads "escalation language" everywhere. |
| 16 | B1 outside reply dials blank with a false message | **Fixed** | Replies computed on the Play Store reviews tagged to each product (Cards: 131 of 133 answered, median 24 min). The message for products with none is accurate. |
| 17 | B1 actions cite bank-wide counts | **Fixed** | Actions cite the product's own issue counts. |
| 18 | Cards ledger shows loan and debit-freeze rows | **Fixed** (by grouping, not by changing the seed) | Rows outside a product's remit (`DELIVERABLE_REMIT`) are grouped as "Other deliverables (n types)", with a note naming them, so totals still reconcile. The seed was **not** changed to forbid cross-product themes: B7 §2 requires each product's internal theme mix to follow its public mix, and the public mix itself has cross-product themes. |
| 19 | RM-notified status contradicts itself | **Fixed** | One RM rule feeds cohorts, personas and `rm_notifications.json`. Personas with nothing due read "no alert due". A reconcile check and a fixture enforce this. |
| 20 | 12-row list not reconciled to cohort counts | **Fixed** | Labelled as twelve fictional examples, oldest open first; the tiles count everyone. |
| 21 | "Suggested by LisN" on core-banking tier tiles | **Fixed** | "Added this week" shows on list tiles only. Tier tiles say LisN never adds anyone to a tier. |
| 22 | Persona 1: bot call green "Closed", 2 teams, touchpoint count | **Fixed** | The bot call reads "Closed, unresolved" in amber. The social inbox is owned by social care (CX), giving 3 teams truthfully. Copy: "6 touchpoints (1 system event and 5 contacts)". |
| 23 | Proxy linking asserted, not modelled | **Fixed** | Customers with a proxy carry a masked contact record, and every proxy message references it. A reconcile check enforces the link, and E3 shows the contact id. |
| 24 | Sample is 32,000 over 13 weeks, not B7's 20,000 over 8 | **Fixed on screen and in docs; Deferred on B7** | The screen states 5,000 customers, 32,000 interactions and 13 weeks. D8 is updated. **Ranjith decides** whether B7 changes or the sample is cut back. |
| 25 | Forced-open persona records keep a closing time; breach wrong | **Fixed** | Generator corrected. Breach is recomputed in the check, with a fixture. |
| 26 | Theme-mix check circular; hand-set mixes undisclosed | **Fixed / Disagree in part** | The check recomputes from records, reports the thin-public products, and has a fixture. The auto-loan and insurance business views disclose the hand-set mix. **Not taken:** enforcing ±20% against the raw public mix for those two products. With 14 and 70 public theme tags, that mix is noise. |
| 27 | "First response" deliverable measured on closure | **Fixed** | Measured on the first response. Open-too-long is now 341. |
| 28 | D1 lower half says "To verify"; cites B2 §7; duplicate id | **Fixed** | Uses the ledger's TATs, drops the internal reference, and renames the id. |
| 29 | "Customers ask for" empty on every row | **Fixed** | Column removed; a note says why. |
| 30 | Pillar level outside both halves | **Fixed** | Level and halves are on the same source-weighted basis. |
| 31 | Market "top ten" shows 6; counts vs bars | **Fixed** | Now "Top six", plotted as shares; the partial last week is dropped. |

## Minor

| # | Finding | Status | What was done, or why not |
|---|---|---|---|
| 32 | M3 PayZapp returns 404 | **Deferred** | Stretch; not touched, as instructed. The PayZapp row still opens its business view. |
| 33 | "Negative mentions anywhere" counts internal channels only | **Fixed** | Relabelled "negative contacts in the bank's channels since 1 Jul". Public mentions per cohort need linked channels (discovery). |
| 34 | E2 headline uses two denominators | **Fixed** | "RMs have been told about 9 of the 64 customers with an RM alert due." |
| 35 | Median reply time rounded to 0.1 h | **Fixed** | Computed in minutes: 10 min bank-wide (was shown as 12), 5 min for the HDFC Bank app. |
| 36 | E3 callback owner chip wrong for 5 personas | **Fixed** | Owner of the oldest open item's product. "Route to the account owner" goes to the RM. |
| 37 | "Sensitivity flag" reads as a person flag | **Fixed** | "Priority-list context from the bank's own list … never a new label on the person." |
| 38 | D11 target shown as fact | **Fixed** | "Working priority target, to confirm with the bank", shown only for list customers with something open. |
| 39 | Red on nearly every D1 cell | **Fixed** | The met-% matrix uses amber for under 75% only; red is reserved for past-TAT counts. |
| 40 | D1 action identical on every row; holidays; T+5 ATM | **Fixed in part; Deferred in part** | The action is now a stated rule per row. **Deferred:** bank-holiday calendar and T+5 for ATM reversals. Both need the bank's calendar and a channel split in discovery; the note says holidays are not modelled. |
| 41 | A1 "this morning" and wrong "today" dates; no Approve control | **Fixed** | The headline shows the received range (25–28 Sep). L2-06 (TAT ended 28 Sep) moved to Escalate. L2-09's TAT ends 30 Sep. L2-03 no longer says "our director". A visible, disabled "Approve and send (agent)" control has been added. |
| 42 | "Who should hear what" labels and scope | **Fixed** | Counts say "theme mentions"; RMs are included. |
| 43 | Channel sub-label omits WhatsApp | **Fixed** | WhatsApp added. |
| 44 | Sticky header takes about 150 px on a phone | **Fixed** | Header is static below 640 px. |
| 45 | Satisfaction coverage note is false | **Fixed** | The note states the Reddit collector change and the capped X run. |

## Polish

| # | Finding | Status | What was done |
|---|---|---|---|
| 46 | Footer ISO dates | **Fixed** | "1 Jul – 28 Sep" style. |
| 47 | Committed .pyc files; Biome error and warning | **Fixed** | .pyc files removed and ignored. Biome passes on the V2 scope, and .gitattributes keeps LF everywhere. |

## Also noted during the fixes

| Item | Status | Note |
|---|---|---|
| `check_reconcile` crashed on a Windows console | **Fixed** | UTF-8 stdout in every check. |
| "Can't fail by design" checks | **Fixed** | `scripts/test_checks.py`: 18 reconcile fixtures and 8 lint fixtures, each proving its check can fail. |
| `scripts/lint_terms_local.txt` (internal programme names) | **Deferred: Ranjith fills it** | Gitignored template created, plus a committed `.example`. Until it is filled, the lint prints a NOTE rather than passing silently. |
| TATs against D-11 | **Deferred** | D-11 is not in the repo; the ledger's TATs are still unverified against it. |
| V1 (`/hdfc-pulse/v1`) still ships its whole evidence set | **Deferred** | V1 is kept as first shown and is no longer linked from any header. Its three official handles are now role tags and it carries no names. Slicing V1's bundle needs changes in V1 code; say if you want it. |
| Source links on signal pages open the original, unredacted posts | **Disagree, disclosed** | Kept for provenance, and the footer says the link opens the original public post. Remove them if the bank prefers no outbound links. |
| Public figures in the model-labelling batches | **Fixed** | The committed batch files are redacted in place; all 11,741 accepted labels are unchanged. |

## Follow-up fixes

| # | Item | Status | What was done, or why not |
|---|---|---|---|
| F1 | Source links on V2 signal and evidence surfaces | **Fixed** | No link to an original post on any V2 screen. Each quote reads as a plain label: place, app and version, rating, date (e.g. "Play Store review · HDFC Bank v11.2 · 1★ · 14 Sep", "Reddit · r/CreditCardsIndia · 3 Sep", "Forum · TechnoFino · 2 Sep"). The pipeline writes `place`. `load.ts` drops `url` before any page sees it, so URLs stay only in `evidence.json` on the server, for audit. The footer now says quotes are labelled by source and date and not linked. `check_pii.py` has a source-link rule (store review links, X/Twitter status URLs, `reddit.com/r/*/comments`, the five forum domains) over the V2 UI code and the built V2 payloads and client chunks. `test_check_pii.py` seeds 10 links that must trip it, plus a clean payload. Grep of `frontend/.next` outside `hdfc-pulse/v1`: 0 hits. Replaces the "Disagree, disclosed" row on source links above. |
| F2 | Market page and other cross-store comparisons | **Fixed** | Market app cards show "By version" as two series, Play Store and App Store, each with its review counts (e.g. "v11.1.0 2.3★ (… reviews)"). The pipeline no longer writes any pooled store rating. `app_pulse` keeps a pooled review **count** only, and drops pooled `versions` and `weekly_avg_rating` for `versions_by_store`. The release pulse moves ratings and shares into `by_store`; counts still add across stores. The version-11 comparison on the exec market card, the "needs you" item and Ask LisN now reads Play Store only (v11 31% positive of 1,781 against 74% of 2,732 on earlier versions), where it had pooled both stores. The dead "vs baseline" branch on the app card, which would have pooled a baseline, is removed. New reconcile checks: no rating or share outside a per-store scope in `app_pulse`, the release pulse and `store_series`; per-store counts add to each app's total. Fixtures: "pooled store rating", "pooled release share", "per-store counts" (21 reconcile fixtures). Cross-**source** shares (e.g. theme share negative across X, Reddit and stores) are not store-rating comparisons and are unchanged. |
