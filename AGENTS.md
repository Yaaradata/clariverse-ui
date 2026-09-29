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
