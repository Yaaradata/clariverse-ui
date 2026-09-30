# Layout QA: V2 on a Windows laptop screen

## How the screenshots are taken now

`qa/screens_win_v2/{light,dark}/<page>-NN.jpg` shows each V2 page one screen at a time, as a Windows Chrome user sees it. The capture settings match the ones signed off on 29 Sep:

| Setting | Value |
|---|---|
| Display | 1920×1080 at 125% Windows scaling |
| Browser area | 1536×730 CSS px at 1.25× (captured as 1920×912) |
| Fonts | Outfit and JetBrains Mono. The earlier screenshots used a fallback font, so wrapping differed from Windows. |
| Sidebar | Closed. The mouse is parked away from it, since it opens on hover. |
| Scroll | One screen at a time, with 60 px of overlap. Smooth scrolling is turned off only in the capture, so no frame is taken mid-scroll. The last screen sits at the bottom of the page. |

- **Pages:** 20 pages in each theme: both exec views, all 8 business views, priority, Persona 1, both modules, deliverables, action queue, satisfaction, market, and 2 signal pages. That makes 104 screens per theme.
- **Replaced:** the old full-page ("elongated") screenshots in `qa/screens_theme_v2/light|dark` have been removed.

## Blank space inside tiles

`scripts/qa_gaps_v2.mjs` finds tiles that share a row and measures the largest empty band inside each one. That is the space a short tile gets when the grid stretches it to match a taller neighbour. The figures are the worst tile per page, at 1536 px wide.

| Page | Before | After | What changed |
|---|---|---|---|
| Satisfaction | 266 px | 0 | Tier table and tier bars merged into one table, with the bar as a column. Sentiment trend is full width, with the chart beside its source table. "Strain and friction" has its own row. The duplicate link list under "Repeat contact" is gone. |
| MD's office / Head of CX | 152 px | 42 px | The three question cards use CSS subgrid, so title, answer, headline, stats, quote and tags line up across cards. The long mood caption is now one line. The executive pulse columns end with their content. |
| Deliverables | 114 px | 40 px | "Closure intent" ends with a customer quote, like "Cure watch". "Top service failures" shows 5 rows, matching the 5-stage dispute funnel. |
| Priority | 107 px | ~50 px (visual) | "High-impact complaints" and "How a customer gets on a list" are 5:2 wide, not 1:1. |
| Action queue | 71 px | 0 | The email body takes the spare height, so backend status and "Show draft reply" line up across each row. |
| Persona 1 | 63 px | 0 | The customer strip is five labelled fields. The person icon no longer sits on its own line. |
| Market | 57 px | 57 px | Left as is. App cards hold different amounts of real content (fix lists of 2 to 5 items), and a grid of equal cards is the right layout. |

## Other fixes found in the screen-by-screen review

- **Priority cohort cards:**
  - The four stat boxes were too narrow, so labels wrapped over three lines and the numbers sat at different heights.
  - "Customers with an open issue" is now a sentence above three boxes. Each box pins its number to the bottom, so the numbers line up.
- **"Repeat contact" chart (satisfaction):** the axis labelled only every other bar. Every bar is now labelled, and the chart height follows the number of themes.
- **"What customers are saying" (satisfaction):** the same quote appeared under two themes. A post can carry up to three themes, so each theme now shows a quote not already shown.
- **Escalation table (deliverables):** one row had a blank target. It now reads "Target not named" and sorts last.
- **Privacy (market):**
  - A Play Store review shown as an app-card example named a branch clerk.
  - Redaction now treats "clerk", "cashier" and "teller" before a name as a staff role. The name is replaced with [staff member], and the quote, which accuses the named person, is no longer used as an example.
  - `test_check_pii.py` seeds this exact case.

## Known remainders

- **Priority list A:** about two lines shorter than the other cohort cards, because it has fewer products (data).
- **Head of CX, "Who should hear what":** the RM card has one theme, against three for the others (data).
- **Market app cards:** see the table above.

## Rerun

Build the app, start it on port 3100, then run:

```
npm i playwright @fontsource/outfit @fontsource/jetbrains-mono   # in any scratch folder
FONTSOURCE_DIR=<that folder>/node_modules/@fontsource node scripts/qa_screens_v2.mjs /hdfc-pulse/v2/mds-office light laptop125 qa/screens_win_v2/light
FONTSOURCE_DIR=<that folder>/node_modules/@fontsource node scripts/qa_gaps_v2.mjs routes.json 40 gaps.json
```

Run `qa_gaps_v2.mjs` from the `scripts/` folder.

## Run 2: the 30 Sep views (1 Oct)

The two views from the 30 Sep review (`/mds-office` = `/head-cx`, and `/business/cards`) replaced the exec page and the
product business views, so this pass re-applied the rules to their rows. Same capture settings; screens in
`qa/screens_win_v2/{light,dark}` (108 per theme, 22 pages). Raw scans: `qa/layout_gaps_v2_before.json`,
`qa/layout_gaps_v2_after.json`.

| Page | Before | After | What changed |
|---|---|---|---|
| MD's office / Head of CX | 303 px | 0 (largest under 40) | CX pulse: the internal dials and their channel table share one full-width row (5:2 flex, rule A4) with the definitions note inside the dial box; the two external sets sit side by side. Morning brief columns end with their content (rule C). The six business cards use CSS subgrid (rule B), three per row, with the quote as the last row of every card. |
| Cards business view | 216 px | 0 (largest under 40) | The three drill-downs were rebuilt for Cards (see below), and their rows were laid out to match: chart beside table (SPLIT) for the sentiment trend, escalation ladder, missed timelines and volume by channel; paired tiles with equal row counts (journey 6 vs lists 5, funnel 4 vs failures 4); the three service tiles (closure, cure, transparency) each end with a Kpi, a sentence and a two-line quote; quote cards and top-six theme cards use subgrid (rule B). |
| Priority (unlinked) | 74 px | 74 px | "How a customer gets on a list" already 5:2 from run 1; the cohort cards no longer stretch (`alignItems: start`, the fifth list made the old 73 px). Left as is: the page is not in the navigation. |
| Market (unlinked) | 57 px | 57 px | Known remainder from run 1 (app cards hold different amounts of real content). |
| Deliverables (unlinked) | 40 px | 40 px | Known remainder from run 1 (dispute funnel beside top service failures). |
| Every other page | ok | ok | Unchanged. |

### Customer pulse restyle (no figures changed)

- Each list card now leads with the volume as one large figure with its trend beside it, then two labelled rings
  (Open with the closed count; No reply in 48 h with its trend line) side by side, then the channel expander.
  The three stacked rings with wrapped captions are gone. Four lists across at laptop width.

### The three drill-downs, on the Cards view

Rebuilt for Cards only and for the selected period, each under its own header:

1. **Are my customers happy?** Sentiment by source (table with a sentiment bar, source weights shown), sentiment trend
   (chart beside its table), what customers are saying (one anonymised quote per top negative theme), themes by trust
   pillar, where contacts come from, contacts by customer list (with sentiment), repeat contact by category.
2. **What is the market saying about us?** All Cards themes in public voice (share of voice change), top six themes as
   weekly share-of-voice bars, rising themes, safety and reputation watch, voices with reach (counts only, no
   accounts), app pulse by store (one store at a time).
3. **Service.** How contacts were handled, escalation ladder (internal rungs beside public targets), closure intent,
   cure watch, transparency gap, dispute recovery funnel, top service failures, timelines customers say were missed.
   No TAT compliance figures.

Every figure comes from `data/out/app_jul_sep/periods.json`; the reconcile check ties the Cards view to the Cards card on
the MD's view for every period (internal and external volume), and the categories and subcategories to the issue pulse.
