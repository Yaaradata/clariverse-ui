# Carry-forward rules from the HDFC demo build
Internal to YaaraLabs · 3 Oct 2026 · Safe to commit to the private build repo at `docs/indusind/carry_forward_from_hdfc.md`.

These rules come from problems found and fixed on the LisN HDFC demo (29 Sep – 1 Oct 2026). They apply to IndusInd V1 **unless IND-B2, IND-B3, IND-B4 or IND-D1 say otherwise**. If a rule conflicts with an IndusInd brief, the brief wins: log the conflict in `MORNING_DECISIONS.md`.

Seed the IndusInd feedback log from this file. Keep the IDs, and give each rule a "how checked" (a script name, or "manual").

---

## A. Privacy and leakage (blockers)

| ID | Rule | Why (what happened on HDFC) | How checked |
|---|---|---|---|
| HL-01 | **Slice data on the server, per page.** Each page receives only the items it renders. No client component receives a whole evidence or L2 bundle. | Every HDFC page sent all 358 evidence quotes to the browser, about 735 KB each, including ones it did not show. Some held real names of the bank's executives and staff. | Grep the compiled build and every route's page payload for the name denylist and for item IDs that are not rendered. Zero hits. |
| HL-02 | **Redact in the data pipeline, not in the UI.** Replace names with role tags (`[bank executive]`, `[staff member]`, `[customer]`). Drop any public item that alleges something against a named person. | UI-level masking still left the names in the payload. | `check_pii` name rule, with a failing fixture seeded with a fake name. |
| HL-03 | **No post URLs or author handles in any payload.** The source label is the platform plus the date, for example "Play Store review · 14 Sep". It is not clickable. Keep URLs server-side for audit only. | A source link reopened the original, unredacted post, so one click undid the masking. | Payload grep for Play Store and App Store review links, x.com and twitter.com status URLs, reddit.com `/comments/` and forum domains. Zero hits. |
| HL-04 | **On-screen privacy claims must be true.** | The HDFC footer said "names are redacted" while the payload still held them. | Manual check by the reviewer. |
| HL-05 | **Hosting.** Turn Deployment Protection on before the first push, because every pushed branch builds a public preview. Set `noindex`. Before sending a link outside the team, open it in a private window. | The HDFC demo URL was public with the leak live. Protection then blocked an outside reviewer the link had been sent to. | Human check before push. |
| HL-06 | **No internal labels on screen.** That means version tags ("V1", "V2 · after … call"), brief, track, decision and screen IDs (IND-B4, T3, DEC-4, S-HOME), and people's names. | Every HDFC screen showed "V2 · after [sponsor] call" in its header. | Internal-names lint, seeded automatically from the repo's docs. Never whitelist a banned word. |
| HL-07 | **Mask names in QA and review files before committing them.** Use "Person A (bank executive)". | Review files quoted the leaked names verbatim. | Manual. |

## B. Checks that can actually fail

| ID | Rule | Why | How checked |
|---|---|---|---|
| HL-08 | **Every check gets a fixture that must fail.** A check that cannot fail is not a check. | Several HDFC reconcile checks could not fail by design, and the internal-names list was empty, so it caught nothing. | Fixture tests. |
| HL-09 | **Checks must not depend on the operating system.** Use `.gitattributes` with `eol=lf`, and don't require `PYTHONIOENCODING`. | Line endings on a Windows checkout showed 43 false Biome errors. The reconcile script crashed without the encoding variable. | Run on a clean checkout. |
| HL-10 | **Restart the server after every rebuild,** before any route check or screenshot. | Stale screenshots were taken from an old server. | eng-qa step. |
| HL-11 | **Never trust the builder's own QA report.** A fresh, read-only session reviews the build. Merge only after its re-review passes. | The leaked names passed the builder's own QA. | IND-B4 §10.8. |

## C. Public data (L2) method

| ID | Rule | Why | How checked |
|---|---|---|---|
| HL-12 | **Stratify by source.** A capped or partial collection run, or a change of collector, creates a fake trend. | One capped X run made HDFC's mood read −23 when it was +3. A collector change turned the Cards trend from +2% into +18%. | Check: fail if one source is more than 60% of a short window without a footnote or weighting (also IND-B3 §7). |
| HL-13 | **No raw counts across a source's start date.** Use shares or a start marker. | False spikes on the dates a collector started. | Check. |
| HL-14 | **One store per rating comparison.** Show figures per app version where you can. | The combined Play Store and App Store figures broke the rule. The per-version view was the strongest finding. | Cross-store check. |
| HL-15 | **No synthetic public data.** L2 is `Public · live`: real counts or an explicit empty state, never invented posts, counts, ratings or response rates. (HDFC made an exception at Ranjith's call. It is not carried over unless he repeats it for IndusInd.) | IndusInd copy rules: counts, never incidence. | Lint plus review. |

## D. Synthetic internal data (L3)

| ID | Rule | Why | How checked |
|---|---|---|---|
| HL-16 | **Precompute every window in the pipeline.** Nothing is computed in the browser, and no figure is hard-coded per window. | It was slow, and the views disagreed. | Reconcile per window. |
| HL-17 | **"This week" is anchored to the data-freeze date, shown on screen,** never to the wall clock. | The HDFC data ended before "today", so the morning brief was empty or skewed. | Manual. |
| HL-18 | **Size against public anchors.** Keep an ANCHOR / DERIVED / ASSUMPTION file and `qa/…volume_validation.md` (metric, our figure, anchor, ratio, verdict). Anything more than 2× off is fixed or justified. **Watch stock versus flow:** pending at year-end is a stock, not a share of intake. | The first HDFC build was 35–70× too small (46,311 contacts in a quarter), and a banker would have laughed. | Volume validation file. |
| HL-19 | **Sanity ratios a banker will apply:** | These were the ratios that looked wrong on HDFC. | Reconcile and validation. |
| | • negative share of internal contacts about 12% overall (9–16% by product); complaints mostly negative, queries and requests about 9% | 41% was shown | |
| | • complaints rejected or partly rejected about 6–10% (peer disclosures); every one goes to the Internal Ombudsman review | 27% was shown | |
| | • every Internal Ombudsman figure comes from one register | the ladder and the queue disagreed | |
| | • Ombudsman "at risk" is a subset of pending, and a believable multiple of actual filings | at-risk was 19% of a quarter's complaints | |
| | • a social-inbox share of internal contacts of about 1% | the inbox was 26× the public posts collected | |
| HL-20 | **Weighted samples must not be lumpy.** Fewer than 30% of the small values shown (under 500) may share a common factor above 5. | Figures came out as 75, 150, 225 and jumped in steps. | Check. |
| HL-21 | **Status arithmetic is consistent everywhere:** resolved + open + waiting on customer = volume. | Some views had the "waiting on customer" status and some didn't. | Reconcile. |

## E. Screens and copy

| ID | Rule | Why | How checked |
|---|---|---|---|
| HL-22 | **Executive view: numbers first.** Section subtitles are at most 6 words, items at most 12 words, and no body line is over 15 words. Definitions sit behind an (i). | "The bank is obsessed with tables." Too much text was cut twice. | Text-length lint. |
| HL-23 | **The business view shows only its own business.** The business name is in every section title. Each figure equals that business's slice of the bank-level figure. | The Cards view still showed bank-wide content. | Reconcile. |
| HL-24 | **Colour.** Volume is neutral. Red, amber and green are used only on directional metrics, and red means a breach. | "Total mentions" was green while negative outweighed positive. | Manual. |
| HL-25 | **Charts.** One trend per card, on the metric that matters. Hover values work by keyboard and touch. If daily values are mostly under 5, show weekly bars. | Sparklines of 3, 3 and 7 looked alarming. | ui-qa. |
| HL-26 | **Floating elements** (the Ask LisN bar) never cover content. Add bottom padding, and check at 1440 and 390. | The bar hid a panel. | Screenshots. |
| HL-27 | **Regulatory statements** come only from the register or a cited file, never from memory. A bank-specific TAT shows "confirm with the bank". Frame figures as eligibility and risk, never as prediction. | HDFC rules held. | fact-verify. |
| HL-28 | **Copied components carry the old bank's text.** Strip every HDFC string, and re-bind every regulatory sentence to an IndusInd register ID. **Known instance:** the HDFC Ombudsman-watch spec cited the Internal Ombudsman Directions as "16 Jan 2026". IND-B3 N37 says 14 Jan 2026 (RBI/CEPD/2025-26/381). Use N37. | Copying rather than refactoring is the plan (IND-B4 §1). | Lint 20 plus a grep for `16 Jan 2026`. |
| HL-29 | **Narrative text** (the walkthrough, the "what changed" lines) is generated from data by a script, so it cannot go stale. | The HDFC walkthrough contradicted the rescaled numbers. | Pipeline. |

## F. Process

| ID | Rule |
|---|---|
| HL-30 | Use one named branch per round. Commit after each numbered step. Push, but never merge, open a PR or deploy unless asked. |
| HL-31 | **Plan before code.** Write a step table with statuses and a "Blocked on people" list, and commit it, so a new session can resume from it. |
| HL-32 | Log every judgement call, synthetic assumption and override in `MORNING_DECISIONS.md`, with IDs. |
| HL-33 | Screenshots go screen by screen, never as one long page. Take them at 1440 and 390, plus the team default of 1536×730 at 1.25 scale. Do both view states and the business filter. Close the sidebar, park the mouse, turn smooth scroll off, use local fonts. |
| HL-34 | If you see "nothing fails a check, but this number looks wrong to someone who knows the bank", report it. That self-report caught five bad HDFC figures. |

## G. Not carried over to IndusInd (removed by IND-B4 §1 or the decisions)
These are out:
- priority relationships and cohort lists, including the "RBI & Government" label;
- RM alerts;
- the customer signal trail;
- MD-marked mail and email triage;
- the deliverables ledger;
- the customer-level save list;
- HDFC's "Morning brief / 7 / 30 days / Full window" periods. IndusInd's windows are This week · Last 4 weeks · Last 13 weeks;
- HDFC's single "Illustrative" tag. IndusInd uses three tags (IND-B2 §4 rule 1).
