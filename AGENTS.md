# Agent instructions

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
