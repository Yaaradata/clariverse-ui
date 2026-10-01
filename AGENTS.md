# Agent instructions

## QA

- Before any push, run the `eng-qa` skill, then `ui-qa` if any screen changed.
- Apply `demo-content-rules` to every figure and label on screen.
- When a reviewer gives feedback, add it as a rule to `docs/FEEDBACK_LOG.md` (see `stakeholder-feedback-log`).
- If the Claude skills aren't available (for example in Cursor), follow `docs/QA_RULES.md`.

### eng-qa commands for this repo

Run from the repo root, in this order; stop at the first failure. Python 3; on Windows run the `.sh` with Git Bash
(`"C:\Program Files\Git\bin\bash.exe"` or your Git install), not WSL bash.

| # | Check | Command |
|---|---|---|
| 1 | Data pipeline (rebuilds the V2 data, then runs checks 2–4) | `bash scripts/hdfc_pipeline/run_all.sh` |
| 2 | Reconcile checks | `cd scripts/hdfc_v3 && python check_reconcile_v3.py` |
| 3 | Internal-names lint / personal-data check | `python scripts/lint_terms.py` · `python scripts/check_pii.py` |
| 4 | Test fixtures | `python scripts/test_check_pii.py` · `python scripts/test_checks.py` |
| 5 | Lint and format (Biome) | `cd frontend && npm run lint` |
| 5 | Typecheck (no npm script) | `cd frontend && npx tsc --noEmit -p .` |
| 6 | Build | `cd frontend && npm run build` |
| 7 | Every V2 route ends in 200 | `cd frontend && npx next start -p 3100`, then `node scripts/qa_routes_v2.mjs http://localhost:3100 scripts/routes.json` |

There is no `test` script in `frontend/package.json`; the Python fixtures in step 4 are the tests. `lint_terms.py` and
`check_pii.py` also scan `frontend/.next`, so run them again after the build. Restart the port-3100 server after every
rebuild.

ui-qa scripts (need `playwright` plus `@fontsource/outfit` and `@fontsource/jetbrains-mono` installed in a scratch
folder, with `FONTSOURCE_DIR=<scratch>/node_modules/@fontsource`; the server on port 3100):

- Screens, one per screen: `node scripts/qa_screens_v2.mjs <route> <light|dark> laptop125 qa/screens/<theme>`
- Gaps and stretched tiles: `cd scripts && node qa_gaps_v2.mjs routes.json 24 ../qa/gaps.json`
- Overflow and ellipsis, 1536@1.25 and 390: `node scripts/qa_overflow.mjs http://localhost:3100 <route> [...]`
- Theme and contrast, both themes: `node scripts/qa_theme_v2.mjs scripts/routes.json qa/screens_theme_v2 <shots.json> 1536`

## CodeGraph

Indexed locally in `.codegraph/`. For callers/callees/symbols:

- Use `codegraph_callers`, `codegraph_search`, etc. with **`limit: 100`**
- Do not grep before or after for the same question

## KGS build — knowledge base

- The ONLY knowledge base for the Kidde Global (KGS) dashboard is `frontend/Carrier KiddeGlobal/` (quote the path; it contains a space).
  - Research: 4 Stage 0 dossiers + MERGED-Stage0 dossier, 5 Stage1-*.md files, Kartik Kumar Carrier.pdf
  - Build spec: `LiSN_KGS_Demo_DevBrief_v1/` (00–08, CONTEXT.md, REVIEW_NOTES.md, mock/, ref/*.png)
  - Visual reference: `Screens for CardsHead/*.pdf` and `LiSN_KGS_Demo_DevBrief_v1/ref/*.png`
- Do not use outside knowledge or web search for KGS facts, figures or copy. If the KB does not say it, it does not go on screen; ask instead.
- Precedence: mock/data/*.json + 04 + 05a > 02 (value figures, exec copy) > 03 (visual tokens only) > Stage 1 > Stage 0.
- Never edit files in the KB, except to write the build notes (CONTEXT_DIGEST.md, REPO_MAP.md, BUILD_PLAN.md, QA_REPORT.md, DRIVER_NOTES.md) into `LiSN_KGS_Demo_DevBrief_v1/`.
- Never import from the KB at runtime. Copy the mock data into `lib/role-based-dashboard/kgs/`; the KB folder is reference only.

## KGS v2 build — Regional GM, India & Southeast Asia
- On screen, call the region "India & Southeast Asia" (short: "India & SEA"), never "Asia ex China".
- Sources: "frontend/Carrier KiddeGlobal/v2/SPEC.md" (source of truth for v2) and "frontend/Carrier KiddeGlobal/v2/CALL_TRANSCRIPT.md" (the reason behind every change). SPEC wins over the v1 brief.
- v1 (President card) stays untouched. Never edit files in `components/role-based-dashboard/kgs/` or `lib/role-based-dashboard/kgs/`. Import v1 components from there. If a component needs changes, copy it into `kgs-v2/` and change the copy.
- v2 code: `components/role-based-dashboard/kgs-v2/{shell,overview,promise,recurring,install,partner,shared}/`. Entry component: `kgs-v2/KgsAsiaRegionalDashboard.tsx`.
- v2 data: `lib/role-based-dashboard/kgs-v2/{data/*.json, types.ts, lib/demoState.ts, checks.ts}`, alias `@kgs2/*`. Reuse v1 types and the `fmt()`/`label()` helpers from `@kgs/lib/label`.
- v2 has its own DemoProvider (role, approvals, loop states, view). Do not change v1 `demoState`.
- Navigation: SPEC routes become views held in state (`overview`, `promise`, `promiseHero`, `recurring`, `recurringTheme`, `install`, `partner`). No new Next.js pages.
- Every number and data string comes from v2 JSON through `useLabel()`. No figures typed into JSX.
- Copy: follow SPEC section 11 (use / never use / remove / rename). No currency anywhere. No firmware, defect, batch, release, separation, carve-out, TSA or Carrier wording. Roles only, never a real person's name (no "Amit", no "Kartik" on screen).
- Competitors: on cards, tables, quotes and data always "Competitor A/B". The ONLY place a real competitor name may appear is the Partner view subtitle (Pass 5).
- Look: match the final v1 look after review: head_cards-style cards, little text per card, plain coloured deltas ("+1 vs last week" as text, no chip boxes), clean area charts (one series, gradient fill, no dashed or white lines), Signal Wall in the head_cards "AI Summary Wall" style with an in-place detail panel, severity as word + colour (S2 red, S3 amber, S4 soft amber, improving green).
- Human gate: nothing is sent or actioned automatically. Approve works only for the owner role; otherwise `aria-disabled` with a tooltip naming the owner. Approval time = live click time in IST, captured once, shown on banner, toast, audit log and the overview card.
- Badge on every view, drawer and modal: "SYNTHETIC SCENARIO — illustrative data, not KGS data". Fixed footer.

### v2 design rules (learned from v1 — mandatory)
- Every drill page starts with BackToOverviewHeader (v1, "← Back to Overview" + H1 question + one-line subtitle). Hero and theme pages use the same header with "← Back to {parent page}".
- Each drill page copies a v1 drill layout, so the three drills look different:
  Promise → v1 InstalledBaseView layout. Recurring → v1 SeparationView layout. Install → v1 ChannelView layout.
- Signal Wall on drill pages = v1 kgs/drill/SignalWall.tsx look (right column, fixed height, scroll, severity-tinted cards with body + metric + trend, click opens the in-place detail panel). Never a row of tiny cards.
- Exec, not operational: no internal IDs on screen (PR-01, RC-03, IN-01, SIG-…). Show the signal title instead. Distributor IDs read as "Distributor N-04" (anonymise → "Partner P-04"). No monospace for text; mono only for numbers.
- Tables: max 6 rows visible, then a "Show all N" toggle. No table with 1 row; use a stat tile instead.
- No Approve / draft / send buttons on overview or drill pages. They live only on the hero (promise) and theme deep dives.
- Text limits: card title ≤ 2 lines; insight/callout ≤ 2 lines (~25 words); table cell ≤ 1 line; channel lists ≤ 2 items ("+2" for more).
- Metrics are numbers: "88% → 71%" with a coloured ▲/▼ delta, never "Before/After" text.
- Charts: one highlighted series, others grey; y-axis fitted to the data (not 0–100 by default); height ≤ 260px on drill pages; no dashed lines except a target line; end value labelled.
