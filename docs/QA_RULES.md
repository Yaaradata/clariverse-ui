# QA rules (plain text)

A summary of the four QA skills (`eng-qa`, `ui-qa`, `demo-content-rules`, `stakeholder-feedback-log`) for tools that
cannot load Claude skills, such as Cursor. If the skills are available, they win over this file. The commands for this
repo are in `AGENTS.md` under "eng-qa commands for this repo".

## Order of work

1. Before any push: run the engineering checks (section 1).
2. If any screen changed: run the UI checks (section 2).
3. Every figure and label on screen: apply the content rules (section 3).
4. Every QA run: check all active rules in `docs/FEEDBACK_LOG.md` (section 4).

Any failed check blocks the push.

## 1. Engineering QA (eng-qa): definition of done

Write it, QA it, verify the facts it shows. Nothing is done until all three pass.

While writing code:
- Read the earlier decisions, `docs/FEEDBACK_LOG.md` and the files you will touch first. Do not undo an earlier
  decision or break existing behaviour unless the task says so. If a decision conflicts with the task, stop and say so.
- Parallelise independent work where safe. Never mix long-running and short-running tasks in one thread or queue.
- Split big batches into sub-batches of about 100. Flush to disk or DB and checkpoint after each; resume from the last
  checkpoint after a crash. Log progress per sub-batch.
- Data collectors log counts per source per month and the earliest and latest dates. Fail loudly on zero rows, a
  skewed month or out-of-window dates.
- Synthetic data uses fixed seeds; log every generator and assumption.

Checks before every push, in order, stopping at the first failure:
1. Data pipeline runs clean, with source counts logged.
2. Reconcile checks: every number adds up across tiles, periods and views.
3. Internal-names lint and personal-data check.
4. Test fixtures pass.
5. Biome (lint and format) and TypeScript (`tsc --noEmit`).
6. `next build` succeeds.
7. Every V2 route returns 200.

Also: no console errors, hydration warnings or broken links. Every new figure has a reconcile check and a fixture.

Git:
- Work only on the named branch; pull it first if it changed.
- Never commit to `main`. Never merge or open a PR unless asked.
- Deploy only from a reviewed PR via the preview environment, never from someone's working copy.
- Restart the server after every rebuild, before any screenshot or route check.
- Small commits with clear messages.

Report (under 12 lines):

    ENG QA — <branch> @ <commit>
    Changed: <one line>
    Pipeline: PASS | Reconcile: PASS (<n> checks) | Lint/PII: PASS
    Fixtures: PASS | Biome/TS: PASS | Build: PASS | Routes: <n>/<n> 200
    Console/hydration/links: clean
    New figures without check/fixture: none
    UI QA: <PASS/FAIL/not needed>
    Screenshots: qa/screens/…

## 2. UI QA (ui-qa)

Run the engineering checks first, so screenshots come from a fresh, passing build. Report each check as PASS or FAIL
with a reason.

Capture:
- Viewports: Windows laptop at 125% (1536×730, device scale 1.25) and a phone at 390 wide. Add 1440 only when asked.
- One screenshot per screen, never one long full-page capture. Each tab, drill-down, modal, drawer and tooltip state
  gets its own image.
- Before capturing: close the sidebar, park the mouse away from interactive elements, turn smooth scrolling off, load
  fonts locally and wait for `document.fonts.ready`, wait for charts to finish animating.
- Both themes every time: light and dark.
- Naming: `qa/screens/<route>-<state>-<viewport>-<theme>.png`.
- Approval gate: capture 2–3 sample screens and ask "Is this framing okay?" before capturing everything. If nobody can
  answer, continue and say so at the top of the report.
- Never screenshot a stale build; restart the server after a rebuild.

Layout:
- No empty bands or gaps over 24px between sections (gap script).
- No tile stretched to match a taller neighbour.
- Buttons and links aligned at the bottom of their cards.
- No text cut off, ellipsised or wrapping awkwardly, especially at 390 (overflow script).
- Floating elements, such as the Ask LisN bar, never cover content.
- The colour theme is applied everywhere; no unstyled black-and-white components or tables.
- Colour contrast at least WCAG AA in both themes.

Density by reader (name the reader of each screen):
- MD / Head of CX: dials, one table, at most one line of text; definitions behind ⓘ.
- Business head: their own business only, never bank-wide figures.
- Analyst / drill-down: detail allowed, but each panel answers one question.
- 10-second test: the reader gets the point in 10 seconds, or FAIL and say what to cut.

Numbers on screen:
- The same metric shows the same value on every screen, tab and period.
- Parts add up to their totals.
- Periods and units labelled and consistent (MTD vs QTD, ₹ lakh vs crore, % vs pp).
- Every figure has a `data-metric="<id>"` attribute for the reconcile check.

States:
- Empty, loading and error states are designed (a period with 0 at risk shows a message, not a blank card).
- Keyboard focus is visible. Tooltips work on touch (tap or ⓘ).

Regression:
- Compare against the last approved screenshots in `qa/approved/`. List anything that changed and was not part of the task.

Report (under 15 lines, screenshots attached):

    UI QA — <branch> @ <commit>
    Viewports: 1536@1.25, 390 | Themes: light, dark | Screens: <n>
    Layout: PASS/FAIL (gaps, overflow, stretch, overlay)
    Density: PASS/FAIL (reader per screen, 10-second test)
    Numbers: PASS/FAIL (cross-screen, totals, units)
    States/contrast: PASS/FAIL
    Feedback log: <n> rules checked, <n> failed
    Regression: <changes vs approved>
    Blocking issues: <list or "none">

## 3. Demo content rules (demo-content-rules)

Data and figures:
- No personal data, no real customer names, no cohorts labelled by occupation.
- No internal programme names on screen.
- Every tile carries its source tag: Public or Internal · illustrative.
- No figure without a source. If unknown, say so on screen (for example "Bank TAT: confirm with the bank").
- No regulations from memory. Use only the rules supplied (for example the RBI rules given to us) and cite them.
- Frame figures as eligibility and risk, never as a prediction that a customer will act.
- "LisN flags and recommends; people act." Nothing contacts a customer.

Facts:
- Every number traces to a named data file or source.
- Live and modelled data are labelled as such, never mixed under one "Live" pill.
- No US or UK terms on Indian-bank screens (RBI, Banking Ombudsman, DPDP; not CFPB, FCA or RESPA).

Audience:
- Name who will see the screen and who they report to.
- Nothing may embarrass the audience or their stakeholders.
- Lead with what helps the reader act.

Copy style:
- British spelling. No "!" and no "$".
- Indian number formats: lakh and crore, ₹, Indian digit grouping (12,34,567).
- One date format: `1 Oct 2026`.
- Topic names are single plain labels, no "A / B" slash labels.
- Card text is one headline line; no paragraphs in cards.

## 4. Stakeholder feedback log (stakeholder-feedback-log)

Feedback is never given twice.

When feedback arrives:
1. Turn each comment into one testable rule.
2. Add it to `docs/FEEDBACK_LOG.md` with an ID, who said it, the date, the rule and how to check it.
3. If it changes an earlier rule, mark the old one superseded; never delete it.
4. Say in the reply which rule IDs were added.

During every QA run:
- Check every active rule. Report `<n> rules checked, <n> failed`, listing each failed ID.
- Any failed rule blocks the push.
