# Agent instructions

## CodeGraph

Indexed locally in `.codegraph/`. For callers/callees/symbols:

- Use `codegraph_callers`, `codegraph_search`, etc. with **`limit: 100`**
- Do not grep before or after for the same question

## Cursor Cloud specific instructions

- The product is a single Next.js 16 (App Router, React 19, Turbopack) frontend located in `frontend/`. It is a purely client-side "Fluid Intelligence" CX dashboard driven by static/mock data in `frontend/lib/*` — there is **no backend, database, auth, or env vars** to run. `mongodb` is a listed dependency but is unused. Run all commands from `frontend/`.
- Package manager: use **npm**. `frontend/` contains both `pnpm-lock.yaml` and `package-lock.json`; `package-lock.json` is the currently-maintained lockfile (more recently updated), so prefer `npm install` to match it.
- Run/dev: `npm run dev` (`next dev --turbopack`) serves on http://localhost:3000. The landing page (`/`) is a client selector; dashboards live at routes like `/standard-chartered`, `/hdfc`, `/swedbank`, `/flipkart/main-page`, and `.../compliance-fci`.
- Lint: `npm run lint` (Biome). It currently reports many pre-existing errors/warnings across the repo and exits non-zero — this is baseline, not caused by your changes. Use `npm run format` to auto-format.
- Optional: the India-map components fetch GeoJSON/tiles from public URLs, so those specific views need internet; the rest of the app works offline.
