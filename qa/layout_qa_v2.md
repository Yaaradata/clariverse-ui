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
