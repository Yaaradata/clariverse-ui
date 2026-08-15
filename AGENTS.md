# Agent instructions

## CodeGraph

Indexed locally in `.codegraph/`. For callers/callees/symbols:

- Use `codegraph_callers`, `codegraph_search`, etc. with **`limit: 100`**
- Do not grep before or after for the same question

## Cursor Cloud specific instructions

- The application is a single **Next.js 16** app living in `frontend/` (all commands run from there). It is a static/client-side dashboard: there are no API routes, no env vars, and no database — the `mongodb` dependency in `package.json` is unused, so no service/secrets are required to run it.
- Package manager is **npm** (`frontend/package-lock.json` is the maintained lockfile; a stale `pnpm-lock.yaml` also exists — ignore it). The update script runs `npm install` in `frontend/`.
- Commands (from `frontend/`, defined in `package.json`): dev = `npm run dev` (Next dev + Turbopack on port 3000), build = `npm run build`, start = `npm start`, lint = `npm run lint` (`biome check`), format = `npm run format`.
- `npm run lint` currently reports thousands of pre-existing Biome formatting/lint errors and exits non-zero. This is the repo's existing state — do not treat a nonzero lint exit as an environment problem, and do not mass-reformat unrelated files.
- Entry route is `/` (client picker). Client dashboards live under routes like `/standard-chartered`, `/swedbank`, `/hdfc`, `/flipkart`, and `/role-based`; sub-views (e.g. `/standard-chartered/main-page`) switch via in-page tabs.
