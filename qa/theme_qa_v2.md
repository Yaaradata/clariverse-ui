# Light and dark theme QA (V2 only)

- **Scope:** `/hdfc-pulse/v2/*` only. V1 and the other demos are not touched.
- **Toggle:** a "Light" / "Dark" button in the V2 header, next to Ask LisN.
- **Default:** dark, exactly as before.
- **Persistence:** the choice is saved in the browser (`localStorage`, key `lisn-v2-theme`). It carries across pages and reloads. The saved theme is applied before first paint, so there is no dark flash when light is saved.

## How it works

- Every V2 colour is now a CSS variable (`frontend/lib/hdfc-v3/theme.ts`). `C` in `primitives.tsx` points at those variables.
- The light and dark palettes are served by `app/hdfc-pulse/v2/layout.tsx`.
- Translucent tints use `color-mix`.
- **Dark palette:** the original values, unchanged.
- **Light palette:** keeps the same five meanings (red, amber, green, cyan, violet) in darker shades that stay readable on white.
- **Hard-coded colours removed:**
  - header backdrop;
  - chart tooltips and hover cursor;
  - lavender icons;
  - neutral sentiment segment;
  - `${C.brand}NN` alpha suffixes.

## Automated check (every route, both themes)

`scripts/qa_theme_v2.mjs` (Playwright) loads each page with the theme set and inspects every rendered element under the V2 root. It flags:
- **dark-block:** in light, any box larger than 20×20 px whose background is near-black. This is the "bar stays dark" case.
- **light-block:** in dark, any such box that is near-white.
- **dark-svg:** in light, any chart bar, area or ring filled near-black.
- **low-contrast:** any text below 3:1 against its effective background, including chart labels.

| Run | Pages | Light issues | Dark issues |
|---|---|---|---|
| 1440 px, every prerendered V2 route (exec views, 8 business views, modules, deliverables, action queue, satisfaction, market, priority, 12 customer trails, every signal page) | 82 | **0** | 1 (existing) |
| 390 px (MD's office, priority, deliverables, market, digital module, Persona 1) | 6 | **0** | 0 |

**Found and fixed during QA:** in light, the satisfaction chart legend used pale blue and violet (contrast 1.7–2.8 on white). The light chart series are now darker shades that clear 3:1 on white, and the re-run is clean.

**Left as is (dark, existing):** the "Wealth" legend label on the satisfaction chart is deep violet on black, 2.7:1. It is the original dark palette, which was to stay unchanged. Say if it should be lifted to a lighter violet.

## Interactive states (`scripts/qa_theme_v2_states.mjs`)

| Check | Result |
|---|---|
| First visit, nothing saved | Dark; button reads "Light" |
| Click the toggle | Whole page goes light (canvas `rgb(244,245,248)`); button reads "Dark" |
| Go to another V2 page | Still light |
| Toggle back | Dark again (`rgb(13,13,13)`) |
| Open V1 with light saved | V1 unchanged (dark); the V2 theme cannot reach it |
| Sidebar expanded, Ask LisN drawer, chart tooltip, header, in light | All light; see `states/` |

## Screenshots

`qa/screens_theme_v2/`:
- `light/` and `dark/`: full-page JPEGs of every screen template at 1440 px (21 pages: the 17 main screens including all 8 business views, 3 signal pages and Persona 1) and of the six key pages at 390 px.
- `states/`: the interactive states above.
- `qa-1440.json`, `qa-390.json`: the raw per-route results.

## Rerun

Build and start the app on port 3100. Run the scripts with a Node that has `playwright` (routes come from `frontend/.next/prerender-manifest.json`):

```
node scripts/qa_theme_v2.mjs routes.json qa/screens_theme_v2 shots.json 1440
node scripts/qa_theme_v2_states.mjs qa/screens_theme_v2
```
