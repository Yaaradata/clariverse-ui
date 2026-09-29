# 06 · Cursor Build Plan — LiSN × KGS Global Commercial Fire demo

**For:** Ranjit BK (builds on 29 Sep 2026, one day, in Cursor) · **From:** Cursor Build Lead · **v1.1 · 28 Sep 2026** (pack review: paths, helper names and precedence checked against `mock/`)
**Companions:** `01_Persona_Exec_Brief.md` (who and tone) · `02_Requirements_Pain_Value.md` (values, exec copy) · `03_Look_and_Feel_Reference.md` (visuals, components) · `04_UX_Screens_Copy_Transitions.md` (screens, exact copy, behaviour) · `05a_Data_Contract.md` (data shapes) · mock data in `devbrief/mock/` (`types.ts`, `data/*.json`, `lib/label.ts`, `lib/demoState.ts`, `lib/values.ts`, `lib/data.ts`, `README_mock.md`). Start with `00_README_START_HERE.md`.

**How to use this file**
- Work top to bottom. Each step has a goal, the files, **one Cursor prompt to paste**, the expected result, acceptance checks, pitfalls and a time box.
- If a step runs more than 50% over its box, stop and apply the cut-lines in §4. Do not borrow time from the hero or the approval moment.
- Commit after every step (`git commit -m "kgs: step N — <name>"`) and push. Each push builds a Vercel preview.
- **Order of truth (pack precedence rule):** 04 + 05a + the mock data are the source of truth for screens, panel-level copy, data and behaviour · 02 for value figures (V-01…V-14) and exec-level copy (Brief, Pulse, card headlines, value ledger) — 04 and the mock already match 02 · 03 for visual tokens and components only (its example copy is illustrative; the repo's Tailwind config wins over 03's sampled hex). If a number on screen is not in the JSON, it is a bug.

---

## 0. At a glance

| Step | Clock | Box | What | Priority |
|---|---|---|---|---|
| 0 | 0:00–0:15 | 15m | Setup: branch, brief pack, mock data, rules, Vercel project | P0 |
| 1 | 0:15–0:25 | 10m | Repo recon → `REPO_MAP.md` | P0 |
| 2 | 0:25–0:50 | 25m | Data layer, `fmt()`/`useLabel()`, demo state, route skeleton, `/signals/A1` redirect | P0 |
| 3 | 0:50–1:05 | 15m | Fork components + bank-term sweep | P0 |
| 4 | 1:05–1:40 | 35m | Shell: rail, header, ContextBar, badge, anonymise, footer, DemoMenu, toast | P0 |
| 5 | 1:40–2:05 | 25m | Signal primitives: SeverityChip/Strip, ConfidenceMarker, JoinTagRow, P&L tag, owner, gate chip | P0 |
| 6 | 2:05–2:50 | 45m | Exec A: funnel, brief, pulse, three question cards | P0 |
| 7 | 2:50–3:25 | 35m | Exec B: Field Signal Monitor strip | P0 |
| 8 | 3:25–4:00 | 35m | Exec C: governed watch, evidence readiness, applied value strip + How we count | P0 |
| — | **4:00** | | **Checkpoint 1** — exec overview demo-ready | |
| 9 | 4:00–5:00 | 60m | Hero deep-dive layout + FirmwareLineageChart | P0 |
| 10 | 5:00–5:45 | 45m | Decision panel: HumanGate, "Viewing as", Approve flow, toast, audit, knock-ons | P0 |
| 11 | 5:45–6:25 | 40m | EvidenceDrawer (4 tabs) | P0 |
| 12 | 6:25–6:45 | 20m | Draft investigation brief modal | P0 |
| 13 | 6:45–7:30 | 45m | Q1 drill-down A: KPIs, tables, lineage monitor, Signal Wall, What's stable | P0 |
| — | **7:00** | | **Checkpoint 2** — full hero story end to end | |
| 14 | 7:30–8:15 | 45m | Q1 drill-down B: date-code strip, phrasing, RMA overlay, Enhanced panel, diagnosis, detail panel | P0 |
| 15 | 8:15–8:40 | 25m | Motion pass | P0 |
| 16 | 8:40–9:00 | 20m | P0 QA sweep + preview deploy | P0 |
| 17 | 9:00–9:30 | 30m | Q2 `/channel` | P1 |
| 18 | 9:30–10:00 | 30m | Q3 `/separation` | P1 |
| — | **10:00** | | **Checkpoint 3** — P0 + P1 deployed | |
| 19 | +30m | | P1 extras: bar interaction, lifecycle table, filters, intro | P1 (only if ahead) |
| 20 | +45m | | P2: Ask LiSN panel, presenter shortcuts, talk-track stepper | P2 |

---

## 1. Setup (15 min)

### 1.1 Branch strategy — recommendation: **new branch `kgs-commercial-fire` + its own Vercel project**. Not a `/kgs` route group on `main`.

| Why | Detail |
|---|---|
| The bank demo stays untouched | The KGS build renames strings and changes shared chrome (logo, rail, header, severity chips). On `main` that risks the live bank demo. On a branch, `main` is frozen and tagged. |
| No cross-client leakage | A `/kgs` route group ships both demos in one deployment: a KGS link can reach bank routes, and bank names sit in the same JS bundle (readable in DevTools). The reverse is true for the bank. |
| URLs stay neutral | Vercel preview URLs embed the project name. A KGS preview built under the bank's Vercel project would carry that project's name. A separate project gives a neutral domain. |
| Routes match 04 | 04 §1.1 uses root routes (`/`, `/installed-base`, …). A branch keeps them as written. |
| Trade-off | Fixes do not flow back to `main`. Acceptable for a one-day demo. If both demos later need to live together, extract a shared design-system package then. |

On the branch: the bank's **page files** move into a non-routable folder (`src/app/_bank_ref/` — App Router ignores `_`-prefixed folders) in Step 2, so nothing bank-side is reachable while the code stays available for reference. **Original bank components are never edited;** KGS copies live in `src/components/kgs/`.

### 1.2 Commands (adjust `npm` to the repo's package manager; `$PACK` = the folder you received containing `devbrief/` and `demo_ref/`)

```bash
git checkout main && git pull
git tag bank-demo-freeze-2026-09-29 && git push origin bank-demo-freeze-2026-09-29
git checkout -b kgs-commercial-fire

# brief pack (markdown only; never the PDFs)
mkdir -p docs/kgs-brief/ref
cp $PACK/devbrief/00_README_START_HERE.md $PACK/devbrief/01_Persona_Exec_Brief.md $PACK/devbrief/02_Requirements_Pain_Value.md \
   $PACK/devbrief/03_Look_and_Feel_Reference.md $PACK/devbrief/04_UX_Screens_Copy_Transitions.md \
   $PACK/devbrief/05a_Data_Contract.md $PACK/devbrief/06_Cursor_Build_Plan.md docs/kgs-brief/
cp $PACK/demo_ref/*.png docs/kgs-brief/ref/

# mock data, copied as a unit
mkdir -p src/mock/kgs
cp -R $PACK/devbrief/mock/. src/mock/kgs/
#  → src/mock/kgs/types.ts · src/mock/kgs/data/*.json (9 files)
#    src/mock/kgs/lib/{label,demoState,values,data}.ts · src/mock/kgs/README_mock.md
#    (generate_mock.py, check_mock.py, check_report.txt come along; dev-only, never imported)

# Cursor rules (paste §2 of this file into it)
mkdir -p .cursor/rules && touch .cursor/rules/kgs-demo.mdc

# .cursorignore — keep build output and PDFs out of the index
printf ".next/\nout/\nnode_modules/\n**/*.pdf\n" >> .cursorignore

npm install && npm run dev      # confirm the bank demo boots BEFORE any change
git add -A && git commit -m "kgs: brief pack, mock data, cursor rules" && git push -u origin kgs-commercial-fire
```

### 1.3 Where things go

| What | Path | Note |
|---|---|---|
| Brief pack | `docs/kgs-brief/` | Committed. **Never under `public/`** (anything in `public/` is served to the world). Repo must be private; if it is not, keep `docs/kgs-brief/` out of git and attach files by drag-drop instead. |
| Reference screenshots | `docs/kgs-brief/ref/*.png` | PNG only. The PDFs are 2 MB each and add nothing. |
| Mock data | `src/mock/kgs/` | 05a says `src/data/kgs/`. Same content, different folder: **use `src/mock/kgs/`** unless the repo already has a data/mocks convention (then use that and change only the alias). |
| Import alias | `@kgs/*` → `src/mock/kgs/*` | Added in Step 2. All prompts use `@kgs/...` in code and `@src/mock/kgs/...` in Cursor context. |
| KGS routes | `src/app/(kgs)/…` | Route group; URLs stay at the root per 04 §1.1. |
| KGS components | `src/components/kgs/{shell,shared,exec,signal,drill}/` | Forks of bank components plus 03 §6 new ones. |
| Repo map | `docs/kgs-brief/REPO_MAP.md` | Written by Cursor in Step 1; referenced by every later prompt. |

### 1.4 Screenshots as Cursor context
- In Agent chat, **drag the PNG into the message box** (or paste it). Recent Cursor versions also accept `@docs/kgs-brief/ref/<file>.png`; if the reply shows the model did not see it, drag it in.
- Use a vision-capable model. Attach at most 2–3 images per prompt.
- The screenshots are the **bank** demo. They are for layout, spacing, density and chart style only. The rules file tells the agent never to copy their text.

| Screen being built | Attach |
|---|---|
| Exec overview | `Head_of_Cards_Exec-1.png` |
| Q1 drill-down, hero panels, Signal Wall, detail panel | `Cards_Journey-1.png`, `Cards_Journey-2.png` |
| EnhancedPanel, DiagnosisBox, aged watchlist, KPI tiles, funnel | `ServicePromise-1.png`, `ServicePromise-2.png` |
| Promise-gap table, tabs, rankings table (Q2) | `Market_saying-1.png`, `Market_saying-2.png` |

### 1.5 Cursor settings (2 min)
- Settings → Rules: confirm `.cursor/rules/kgs-demo.mdc` shows as **Always**. On an older Cursor without `.cursor/rules`, paste the same body (without the `---` front-matter) into `.cursorrules` at the repo root.
- Settings → Indexing: re-index after the copy so `docs/kgs-brief/` and `src/mock/kgs/` are searchable.
- New chat per step keeps context clean. 04 and 05a are large (~20k tokens each): prompts name the section; if the agent misses copy, paste that section's text into the chat.

### 1.6 Vercel project (5 min now; details in §6)
- Vercel → Add New → Project → import the **same repo** → project name neutral, e.g. `lisn-cf-demo` (no client or bank name) → Settings → Git → **Production Branch = `kgs-commercial-fire`**.
- Settings → Analytics / Speed Insights: **off**. Deployment Protection: leave Standard Protection on.
- Every push to the branch now deploys. You present from your own logged-in browser, so protection does not get in the way.

---

## 2. Cursor project rules — full text of `.cursor/rules/kgs-demo.mdc`

Paste verbatim. The helper names below match what the mock actually exports: `src/mock/kgs/lib/label.ts` → `fmt(str, anon)` (whole-string token resolver), `label(kind, key, anon)` (one key), `roleLabel`, `withRole`, `withTs`, `fmtDemoTime`; `src/mock/kgs/lib/demoState.ts` → `DemoProvider`, `useDemo`, `useLabel`; `src/mock/kgs/lib/values.ts` → `VALUES`, `methodFor`, `money`, `unitCosts`, `valueStatements`, `neverOnScreen`; `src/mock/kgs/lib/data.ts` → typed `meta`, `exec`, `monitor`, `signalFw41`, `installedBase`, `channel`, `separation`, `anonymise`, `askLisn`, `signalById`.

```markdown
---
description: LiSN × KGS Global Commercial Fire demo — stack, house style, non-negotiables
globs:
alwaysApply: true
---

# LiSN × KGS demo — rules for every change

You are turning an existing, working LiSN demo (built for a bank "Head of Cards") into a demo for the President, Global Commercial Fire at KGS, on branch `kgs-commercial-fire`. The brief pack is in `docs/kgs-brief/`. Read the sections a prompt names before writing code. The screenshots in `docs/kgs-brief/ref/` show the bank demo: copy their layout, spacing and chart style, never their text.

## Order of truth
1. `src/mock/kgs/data/*.json` (+ `src/mock/kgs/lib/values.ts`) — every number and every data string.
2. `docs/kgs-brief/04_UX_Screens_Copy_Transitions.md` — screens, behaviour, priority, and exact UI copy (strings in "double quotes" are verbatim). 04, 05a and the mock win on screens, panel copy, data and behaviour; `02_Requirements_Pain_Value.md` owns value figures and exec-level copy, and 04 and the mock already match it.
3. `docs/kgs-brief/03_Look_and_Feel_Reference.md` — visuals and component anatomy. Where 03's hex values disagree with the repo's Tailwind config or CSS variables, the repo wins.
4. `docs/kgs-brief/05a_Data_Contract.md` and `src/mock/kgs/types.ts` — data shapes.
5. `docs/kgs-brief/REPO_MAP.md` — which existing component to reuse for each 03 component.

## Stack constraints
- Use the repo's existing framework, router, Tailwind config, fonts (Outfit for text, the repo's mono for numbers), chart library, icon set, animation library, toast and UI primitives. Do NOT add any UI kit, chart library, state library, CSS framework, font or icon set that is not already in package.json. Ask me first if you think one is needed.
- Reuse before build: find the bank component in REPO_MAP.md, copy it into `src/components/kgs/<shell|shared|exec|signal|drill>/`, type its props from `@kgs/types`, rebind data. Keep markup and classes; do not restyle the copy.
- Never edit an original bank component or anything under `src/app/_bank_ref/`.
- Build new components only for 03 §6 items (and the few 04 §0.2 marks NEW), using 03 §2 tokens mapped to existing Tailwind classes.
- No backend, API routes, fetch, auth or env-driven data. Static JSON imports only.
- Client state lives only in the KGS DemoProvider from `@kgs/lib/demoState` (anonymise, viewingAs, approvals, decisionRequested, drawerOpenedAt), mounted in `src/app/(kgs)/layout.tsx`. In memory only: no localStorage, sessionStorage, cookies or URL persistence (reload = reset). Only `?anon=1` and `?intro=0` are read from the URL.
- TypeScript: import types from `@kgs/types`; no `any` on data.
- Page files select data; components are presentational.

## Data and labels
- Every number and data string comes from `@kgs/data/*.json` (typed via `@kgs/lib/data`) or `@kgs/lib/values`. Never type a figure into JSX. Never recompute, round, sum or re-format a figure that exists as display text; render the text field. Plain integers without display text may be formatted with `toLocaleString('en-GB')` only.
- Every data string is rendered through the label helper: `const L = useLabel();` then `{L(item.title)}`. `useLabel` (from `@kgs/lib/demoState`) wraps `fmt(str, anon)` from `@kgs/lib/label`; `L.one(kind, key)` resolves a single key (e.g. a filter option). Never pass a whole string to `label(kind, key, anon)`; it resolves one key only. Role-typed fields go through `roleLabel(role, anon)`. This includes chart ticks, legends, tooltips, `aria-label`, `title` attributes, breadcrumbs and `document.title`. Unknown tokens render their key and log a console warning; they never crash.
- Runtime timestamps come only from `fmtDemoTime(new Date())` (`@kgs/lib/label`; "DD Mon HH:MM UTC", UTC getters), captured ONCE in the click handler and stored in demo state (`approve()` and `requestDecision()` in `@kgs/lib/demoState` already do this and return the ts). The gate, the audit entry, the toast and the draft chip read that same stored string. Never call `Date` during render. Static times ("8h 46m", "16 Sep 06:10 UTC") come from JSON and are never computed from now.
- If a string or number the brief needs is missing from the JSON, add it to the right JSON file using the exact text from 04/02, not to the component, and list it in your reply.
- Money: render the display text followed by `<IllustrativeChip />`. Never add USD and GBP. Never total unlike exposures. Money is never coloured green or red.

## House style (every visible string)
- "LiSN" exactly — never "Lisn", "LisN" or "LISN". Never put CSS `uppercase` on an element that renders "LiSN"; write caps labels literally ("LiSN INSIGHT").
- British spelling: anonymise, prioritise, organisation, programme, colour, centre, behaviour, licence (noun).
- No exclamation marks. Calm, numbers before adjectives, question form for pain.
- LiSN "aids resolution": it reads, ranks, drafts, suggests and routes. Owners decide and approve. Never "resolves", "fixes", "has notified", "sent", "auto-".
- "Candidate, not cause". Never "root cause" (sole exception: "LiSN does not determine cause").
- "above threshold this week", never "crossed a threshold this week".
- Retired — must not appear in any UI string: FCI, Conversation AI, AI Risk Spike Monitor, AI Summary Wall, AI Dispute Diagnosis, Real-time, Live (pill), HSHF, HSLF, LSHF, LSLF, cardholder(s), credit card(s), Head of Cards, chargeback, MCC, merchant, EMI, CSAT, NPS, sentiment, churn, customer journey, hashtags, social reach, index, health score, score (as a KPI), pts, predict(s), resolve(s)/resolved, cheap, 300K, "Click for details", competitor names (use "[competitor]"), the bank's name or logo, the "Y"/"V" logo mark. "Dispute" is allowed only for KGS invoice disputes.

## Non-negotiables (a step is not done if any fails)
1. SyntheticBadge "SYNTHETIC SCENARIO — illustrative data, not KGS data" is visible on every route (sticky ContextBar), in the hero header, the evidence drawer header and every modal header, with a z-index above drawer and modal backdrops. FixedFooter on every route.
2. Severity always renders as "S# · word" plus a glyph: S1 ◆ "Life-safety / regulatory", S2 ▲ "Material impact", S3 ● "Operational", S4 ― "Efficiency". Compact "S2 ▲" only where the word appears elsewhere on the same card. Type as word + glyph ("Cliff", "Slope"). Incident flag as "On"/"Off". Direction as ▲/▼ + "Rising / Easing / Stable". Never colour alone.
3. Every signal surface (monitor card, wall card, detail panel, hero) shows severity (class, type, blast radius, incident), a ConfidenceMarker with the Known vs Inferred split, a JoinTagRow ("JOINED ON"; first 3 tags on cards), a P&L destination tag, the routed owner (roles only, never names) and the human-gate state.
4. Human gate: nothing is sent, notified or actioned automatically. No enabled "Send", "Notify", "Auto-fix", "Auto-report" or "Export" control anywhere. Approve is enabled only when "Viewing as" equals the owner role; otherwise it is `aria-disabled` (not `disabled`) with a tooltip naming the owner.
5. Anonymise: toggle in the ContextBar, default OFF, `?anon=1` forces ON, forced ON on `beforeprint`. When ON, no real brand, platform, firmware, partner, region or place name appears in DOM text, SVG text, `aria-label`, `title` or `document.title`, and the "ANONYMISED" chip and diagonal watermark are visible. The governed Safety & Cyber tile never shows a platform, firmware or country in either mode.
6. No banking leftovers; no logos except the LiSN monogram placeholder ("Li"); every firmware version, serial range, date code, SKU family and partner ID carries "(synthetic)" where 04 shows it.
7. No USD + GBP sums; "Exposure in view" (AV-4) renders three separate lines. No revenue, savings, ROI or payback on screen.

## Accessibility and legibility (03 §7)
- Minimum text: body 15px, labels 12px, micro 11px (raise the bank's 9–10px), table cells 14px, chips 12px bold, big numbers ≥ 36px.
- Contrast: small text no darker than neutral-400 (#a3a3a3) on #252525 or #0d0d0d; violet text uses violet-400 (#a78bfa), never #5332ff; small red text on exec cards uses red-400.
- `tabular-nums` on every metric. Mono only for numbers and IDs; sans for words.
- Exec card titles may wrap to 2 lines; no `truncate`.
- Chart strokes ≥ 2px; dashed lines ≥ 1.5px with a 4/4 dash. No meaning carried by a 1px hairline or a 10% tint alone.
- Focus ring `ring-2 ring-violet-400 ring-offset-2 ring-offset-black` on cards, tabs and buttons. Esc closes drawers, modals and popovers. Drawers trap focus.
- Motion per 03 §4 and 04 §6: no bounce or spring; count-ups ≤ 700ms; `prefers-reduced-motion` → opacity only; nothing auto-scrolls.

## File layout
- Routes: `src/app/(kgs)/page.tsx` (/), `installed-base/page.tsx`, `installed-base/signal/fw-4-1/page.tsx`, `channel/page.tsx`, `separation/page.tsx`. Redirect `/signals/A1` → `/installed-base/signal/fw-4-1`.
- Components: `src/components/kgs/{shell,shared,exec,signal,drill}/`.
- Data: `src/mock/kgs/{types.ts,data/*.json,lib/label.ts,lib/demoState.ts,lib/values.ts,lib/data.ts}` via `@kgs/*`.
- Anchors: `#field-signal-monitor`, `#governed-watch`, `#date-code`, `#why-late`, `#esd-se-07`, `#backorder`, each with a scroll margin that clears the sticky header.

## How to work
- Small, reviewable diffs. Touch only the files the prompt names, plus imports and wiring.
- End every reply with: (1) files changed, (2) anything in the brief you could not bind to mock data, (3) any rule you had to bend and why.
- Do not rewrite `docs/kgs-brief/*` or `src/mock/kgs/data/*.json`, except to add a missing FIXED field that the brief specifies.
```

---

## 3. Build sequence

**Prompt conventions.** Agent mode (formerly Composer), strongest vision model available, new chat per step. Paste the prompt, attach the listed PNGs, let it run, read the diff, run the acceptance checks, then commit. Run `npx tsc --noEmit && npm run lint` after Steps 5, 8, 12 and 14 to catch type errors early. If the agent types a number into JSX, reply: "Every figure must come from @src/mock/kgs/data/<file>.json via useLabel; remove the literals."

---

### Step 1 — Repo recon → `REPO_MAP.md` (10 min)

**Goal:** know the real stack and where each 03 component lives, so later prompts reuse rather than rebuild.
**Files:** creates `docs/kgs-brief/REPO_MAP.md` only.

```text
Agent mode. Step 1 — repo recon. Do not change any source file in this step. Create only docs/kgs-brief/REPO_MAP.md.

Context: @docs/kgs-brief/03_Look_and_Feel_Reference.md (the "find in repo" strings at the top, §3 component inventory, the Appendix matrix) and @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§0.2 component names, §1.1 route map).
Attached: Head_of_Cards_Exec-1.png, Cards_Journey-1.png, ServicePromise-1.png (the current bank demo).

Write docs/kgs-brief/REPO_MAP.md with these sections:
1. Stack: framework + version; router (App / Pages / react-router / other); styling (Tailwind version, config path, custom colours, fonts, shadows); chart library + version; icon library; animation library; UI primitives available (popover, dialog/sheet, tooltip, toast, tabs, switch, segmented control — name the package); state management; TS or JS; package manager; build/lint/typecheck scripts; any analytics or third-party scripts (Vercel Analytics, Speed Insights, GA/GTM, Sentry, Hotjar) and where they are mounted; how fonts load; any `output: 'export'` or basePath in next.config.
2. Routes: every bank route → page file → layout chain.
3. Component map: one row per 03 component (LeftRail, DrillHeader, BackToOverviewHeader, FloatingAIButton, Tabs, ExecBriefBar, PulseStrip/PulseCard, QuestionCard, ScoreDelta, SemiGauge, AreaTrend, MiniKPI, InsightBox, SectionHeader, RiskSpikeCard, MetricBeforeAfter, RecommendationBox, Panel, KpiTile, SegmentTable, StackedSentimentBar, TopIntent, LineMonitor, AISummaryWall/WallCard/WallFooterCounts, Watchlist, FrictionTable, StackedBarWithDetailPanel/DetailPanel, JourneyStageTable, PromiseGapTable, MomentumTile, EngagementCard, RankingsTable/AINote, EnhancedPanel, StuckDriverBars, ChipGroups, AgedCaseWatchlist, DiagnosisBox, RankedFailureList, Funnel) with: file path · exported name · props in one line · where its data comes from today (inline constant, data file, props). Locate them with the "find in repo" strings. Write "not found" honestly.
4. Bank-specific strings and assets: every file containing FCI, Conversation AI, HSHF, HSLF, LSHF, LSLF, cardholder, Credit Card, Head of Cards, chargeback, MCC, Merchant, EMI, CSAT, NPS, sentiment, churn, Real-time, Live, hashtag, the bank's name; plus the logo mark, favicon, OG image, <title>/metadata, web manifest.
5. Risks for the KGS build: components with hard-coded data, `truncate` on card titles, CSS `uppercase` on labels, text below 11px, charts with categorical x-axes, anything that would break if the bank page files move.

Done when REPO_MAP.md exists and every 03 component has a row.
```

**Expected:** a 1–2 page map. **Acceptance:** open it; spot-check three rows (QuestionCard, RiskSpikeCard, AISummaryWall) by opening those files; fix any wrong path by hand.
**Pitfalls:** the agent starts "helpfully" editing — stop and revert. If the repo is not Next.js App Router, read §7 now before Step 2.

---

### Step 2 — Data layer, `fmt()`/`useLabel()`, demo state, route skeleton (25 min)

**Goal:** the app boots on KGS data with an in-memory demo state and every P0/P1 route resolving.
**Files:** `tsconfig.json`, `next.config.*`, `src/mock/kgs/checks.ts`, `src/components/kgs/shell/DemoProvider.tsx` (thin re-export), `src/app/(kgs)/layout.tsx` + 5 pages, bank page files → `src/app/_bank_ref/`. Already in the mock (read, do not recreate): `src/mock/kgs/lib/{label,demoState,values,data}.ts`.

```text
Agent mode. Step 2 — wire the KGS mock data and demo state. No visual work yet.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/05a_Data_Contract.md (§1 conventions, §2 interfaces, §3 tokens, §4 file list, §6 generator checks) @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§1.1 route map, §4.9 time format, §7 demo-mode controls) @src/mock/kgs/README_mock.md @src/mock/kgs/types.ts @src/mock/kgs/lib/label.ts @src/mock/kgs/lib/demoState.ts @src/mock/kgs/lib/values.ts @src/mock/kgs/lib/data.ts @src/mock/kgs/data/meta.json @src/mock/kgs/data/exec.json @src/mock/kgs/data/anonymise.json

Do:
1. tsconfig: add path alias "@kgs/*" → "src/mock/kgs/*" (respect the existing baseUrl) and ensure "resolveJsonModule": true. 05a mentions src/data/kgs/ — in this repo the data lives in src/mock/kgs/; do not move it.
2. Read src/mock/kgs/lib/label.ts and src/mock/kgs/lib/demoState.ts; do not reimplement or rename anything in them. label.ts exports fmt(str, anon) (the {{kind:key}} whole-string resolver; unknown token → render the key + console.warn once), label(kind, key, anon) (ONE key only — never alias fmt to label), roleLabel(role, anon), withRole(str, role), withTs(str, ts) and fmtDemoTime(date) ("DD Mon HH:MM UTC" from UTC getters). demoState.ts exports DemoProvider, useDemo() → { state, setViewingAs, setAnonymise, toggleAnonymise, approve(signalId) → ts (captured once), requestDecision(signalId) → ts, drawerOpened(), reset(), isApproved(signalId) } and useLabel() → t(str) with t.one(kind, key). ?anon=1 is already read on load and after reset.
3. Create src/components/kgs/shell/DemoProvider.tsx as a thin 'use client' re-export — `export { DemoProvider, useDemo, useLabel } from '@kgs/lib/demoState';` — so later prompts can import from the shell folder. Add nothing else; no persistence of any kind.
4. Values: src/mock/kgs/lib/values.ts already re-exports valueRegister (VALUES, methodFor), unitCosts, money, valueStatements and neverOnScreen (02 asks for a single values module). Components import value figures from @kgs/lib/values only; do not create a second values module. Typed data comes from the @kgs/lib/data barrel.
5. Create src/mock/kgs/checks.ts implementing the 05a §6 checks 1–10 as console.assert calls with readable messages (the full set, plus arithmetic checks, already passes offline: see src/mock/kgs/check_report.txt). Call it once from the (kgs) layout only when process.env.NODE_ENV !== 'production'.
6. Routes per 04 §1.1: create src/app/(kgs)/layout.tsx that wraps children in DemoProvider, and pages for "/", "/installed-base", "/installed-base/signal/fw-4-1", "/channel", "/separation". Each page renders only an <h1> with its title from JSON through useLabel (hero: signal.headline). Add a permanent redirect /signals/A1 → /installed-base/signal/fw-4-1 in next.config.
7. The bank's own page files also claim these URLs. Move the bank route folders and page files (NOT components) into src/app/_bank_ref/ with git mv, fixing their relative imports so they still type-check. If the root layout renders bank-only chrome (rail, header), move that chrome into the KGS-free _bank_ref reference and keep the root layout to html/body/fonts/theme only.
8. DemoProvider must sit in a layout, not a page, so state survives client-side navigation.

Done when: the dev server runs; the five routes render their H1; /signals/A1 redirects; the console shows no assertion failures from checks.ts; flipping anonymise (temporarily via a button or React DevTools) turns the hero H1 into "Panel platform A · firmware A.4.1 (synthetic) — …".
```

**Expected:** blank-but-working KGS routes; bank pages unreachable.
**Acceptance:** visit each route; `/signals/A1` lands on the hero; console clean apart from the dev check log; `http://localhost:3000/<old bank route>` → 404.
**Pitfalls:** JSON imports typed as wide literals — import from the existing `@kgs/lib/data` barrel instead of raw JSON; demoState reads `?anon=1` from `window` in its initial state, so if `/?anon=1` shows a hydration warning, mount the provider client-only or apply the flag in a `useEffect`; `useSearchParams` without Suspense breaks `next build`; provider placed in a page resets state on navigation; if `_bank_ref` fights the type-checker and you are past the box, delete it (it lives on `main` and the freeze tag).

---

### Step 3 — Fork components + bank-term sweep (15 min)

**Goal:** KGS copies of every reused component, with bank strings gone and legibility fixes applied.
**Files:** `src/components/kgs/**` (copies only).

```text
Agent mode. Step 3 — fork the reusable bank components into src/components/kgs/ and sweep bank terms. No new layouts yet.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/03_Look_and_Feel_Reference.md (§5 renames and removals, Appendix matrix) @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§0.1–§0.2)

Do:
1. For each component REPO_MAP.md lists that the 03 Appendix marks for EX, Q1 or SD (● or ○), copy it into src/components/kgs/{shell|exec|drill|signal|shared}/ under its 03/04 name, e.g. AISummaryWall → drill/SignalWall.tsx, RiskSpikeCard → exec/SignalMonitorCard.tsx, StackedSentimentBar → drill/StackedRatioBar.tsx, JourneyStageTable → drill/LifecycleStageTable.tsx. Keep markup and classes identical. Change only: props typed from @kgs/types, bank data and bank strings removed, text passed in as props.
2. In the copies only, apply 03 §5.1 renames: "CONVERSATION AI"/"AI INSIGHT" → "LiSN INSIGHT"; "AI Summary Wall" → "LiSN Signal Wall"; "AI note" → "LiSN note"; "Click for details →" → "Open signal →"; "Live" pill → static "Data as of 25 Sep"; "RECOMMENDATION" → "RECOMMENDED ACTION"; DiagnosisBox lead-ins → "Main signal:" / "What changed:" / "Decide first:" (04 §3.11); "ROOT CAUSE" tag removed; Positive/Negative/Neutral → Easing/Rising/Stable.
3. Remove CSS `uppercase` from any element that will render "LiSN" (write caps literally). Replace `truncate` on QuestionCard titles with line-clamp-2. Raise any text below 11px to 11px.
4. Replace the bank's severity chips (Critical/High/Watch/Medium/High Impact) in the copies with a `severity` prop placeholder; the real SeverityChip arrives in Step 5.
5. Do NOT edit original bank components or anything in src/app/_bank_ref/.
6. Run and show the output of:
   rg -n -i "FCI|conversation ai|risk spike|summary wall|real-time|HSHF|HSLF|LSHF|LSLF|cardholder|credit card|head of cards|chargeback|\bMCC\b|merchant|\bEMI\b|CSAT|\bNPS\b|sentiment|churn|customer journey|hashtag|click for details|root cause|resolv|predict|LisN|Lisn|LISN|cheap" src/components/kgs "src/app/(kgs)"
   Fix every user-visible hit (variable names are fine).

Done when that search shows zero user-visible hits and the project type-checks.
```

**Expected:** `src/components/kgs/` populated; nothing visible changes yet.
**Acceptance:** re-run the `rg`; `npx tsc --noEmit` passes.
**Pitfalls:** the agent "improves" styles while copying — reject any class changes in the diff; bank components that fetch or import bank data at module level — cut the import, take props.

---

### Step 4 — Shell: rail, header, ContextBar, badge, anonymise, footer, DemoMenu (35 min)

**Goal:** every route wears the KGS shell; anonymise and reset work globally.
**Files:** `src/components/kgs/shell/{LeftRail,DrillHeader,ContextBar,SyntheticBadge,AnonymiseToggle,Watermark,FixedFooter,DemoMenu,FloatingAIButton,BackToOverviewHeader,Toast}.tsx`, `src/app/(kgs)/layout.tsx`, the 5 pages.

```text
Agent mode. Step 4 — KGS shell on every route.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§1.1–§1.5, §7) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§3A shell, §6.10 badge and watermark, §6.11 anonymise, §6.13 ContextBar) @src/mock/kgs/data/meta.json @src/mock/kgs/data/anonymise.json @src/mock/kgs/data/channel.json @src/mock/kgs/data/separation.json @src/components/kgs/shell/DemoProvider.tsx
Attached: Head_of_Cards_Exec-1.png and Cards_Journey-1.png — match the rail, the 80px header bar and the Back button exactly.

Build in src/components/kgs/shell/ and mount in src/app/(kgs)/layout.tsx:
1. LeftRail (fork of the bank rail): LiSN monogram placeholder tile "Li" (36px, brand-tint bg, violet-300 text, Outfit 800, title "LiSN") replacing the bank mark; remove the two amber squares; nav exactly per 04 §1.2 — Activity "/", Cpu "/installed-base", Handshake "/channel", Split "/separation", divider, Lock → "/#governed-watch", bottom ArrowLeft history.back(), SlidersHorizontal opens DemoMenu. Tooltips are the 04 strings. The Installed base item stays active on the hero route.
2. DrillHeader: title + breadcrumb from meta.json by pathname (hero title "Signal #1 of 5 — firmware 4.1 cohort"); replace "{role}" with demo.viewingAs; all text via useLabel.
3. ContextBar (sticky, 56px, under the header): Brand "All ▾" (meta.filters.brand), Region "All ▾", Period "26 weeks to 25 Sep 2026 ▾" with "13 weeks" and "52 weeks — Discovery" disabled, "Data as of 25 Sep 2026 18:00 UTC", AnonymiseToggle "Anonymise names", SyntheticBadge. Filters open a menu but do nothing in P0.
4. SyntheticBadge per 03 §6.10 (FlaskConical icon, "SYNTHETIC SCENARIO — illustrative data, not KGS data", 12px/800, yellow-300 text, yellow-500/10 bg, 1px dashed yellow-500/50, pill) with meta.badgeTooltip. Export it for reuse in the hero header, drawer and modals. Its z-index sits above every drawer and modal backdrop.
5. AnonymiseToggle (03 §6.11) + "ANONYMISED" chip beside the badge when ON + Watermark (fixed, full-screen, pointer-events-none, repeated diagonal meta.demo.watermark at 6% white, −30°) when ON. Force ON on window beforeprint; restore on afterprint.
6. FixedFooter (24px, #0d0d0d, top border #1f1f1f, 12px neutral-400, centred) with meta.footer.
7. DemoMenu popover from the rail: "Reset demo" → reset() (clears approvals and decision requests, viewingAs → President, anonymise → OFF unless ?anon=1, closes overlays), navigate to "/", toast meta.demo.resetToast; "Anonymise names" mirror switch; footer "Demo controls — not part of the product."
8. FloatingAIButton (fork, same look): tooltip "Ask LiSN (P2 — canned answers)"; click opens a small popover "Ask LiSN — canned questions in this demo".
9. BackToOverviewHeader (fork): props label (default "Back to Overview"), href, h1, subtitle.
10. Toast: use the repo's toast if REPO_MAP lists one, else a minimal top-right toast under the ContextBar (4 s, dismissible). Export showToast({ title, body }).
11. document.title = L(meta.title), updated when anonymise changes.
12. Pages: /installed-base, /channel, /separation get BackToOverviewHeader with title and subtitle from installedBase.json, channel.json, separation.json so no route is empty; the hero gets BackToOverviewHeader label "Back to installed base" → /installed-base, and its H1 = signal.headline.

Done when: every route shows rail, header + breadcrumb, sticky ContextBar with the badge, and the footer; Anonymise ON shows the chip and watermark and the hero breadcrumb reads "… Panel platform A · fw A.4.1 (synthetic)"; ?anon=1 loads ON; Reset returns to "/" with the toast "Demo reset"; print preview is anonymised.
```

**Expected:** shell identical in feel to the bank demo, with KGS text.
**Acceptance:** click every rail icon; scroll a long page — ContextBar and badge stay; toggle anonymise on each route; Ctrl/Cmd+P shows anonymised text + watermark.
**Pitfalls:** `position: sticky` fails inside an `overflow-hidden` parent — check the layout wrappers; the watermark must be `pointer-events-none` or clicks die; badge hidden under the drawer backdrop later (set its z-index now, e.g. above `z-50`).

---

### Step 5 — Signal primitives (25 min)

**Goal:** the building blocks every signal surface needs, built once.
**Files:** `src/components/kgs/shared/{SeverityChip,DomainChip,SeverityStrip,ConfidenceMarker,JoinTagRow,PnLDestinationTag,IllustrativeChip,RoutedOwner,GateChip,EmptyScope}.tsx`; `tailwind.config` (only missing tokens).

```text
Agent mode. Step 5 — shared signal primitives.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/03_Look_and_Feel_Reference.md (§2.3, §2.4, §2.7 Tailwind extension, §6.1–§6.6, §6.13 EmptyScope) @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§1.6) @src/mock/kgs/types.ts @src/mock/kgs/data/signal_fw41.json @src/mock/kgs/data/monitor.json

Build in src/components/kgs/shared/, typed from @kgs/types, all text via useLabel:
1. SeverityChip {cls, word?, compact?} — 03 §6.1 table: glyphs ◆ ▲ ● ―, colours, always "S# · word"; compact "S2 ▲" with the word in title and tooltip.
2. DomainChip {domain} — neutral outline pill, 6px dot (Quality orange · Channel teal · Separation sky · Supply violet-300 · Safety/Cyber red-400) + the word.
3. SeverityStrip {severity, variant: 'full' | 'compact'} — full per 03 §6.1 (segments SEVERITY · TYPE · BLAST RADIUS · INCIDENT in a #131313 bar, second line = severity.escalationRule); compact = severity.compact on one 13px line. Cliff = step glyph, Slope = TrendingUp, always with the word; incident Off = hollow circle + "Off", On = filled red-500 + "On".
4. ConfidenceMarker {confidence?, short?, variant} — full per 03 §6.2 (caps "CONFIDENCE", level pill + 3 shape pips, K solid / I hatched split bar sized by counts, legend "K 15 known — …" / "I 8 inferred — …", source-independence row, tooltip "K = joined, verified records. I = text-extracted or imputed. Kept separate on every signal."); compact = short text + 48px mini bar (omit the bar when only `short` text exists).
5. JoinTagRow {tags, max?} — 03 §6.3 with a Link2 icon and caps "JOINED ON"; overflow "+n" chip expands inline.
6. PnLDestinationTag {pnl, variant, onMethod?} — full per 03 §6.4 and 04 §4.7 (primary, secondary, exposure lines, italic caption, sub-tiles, "Method ⓘ"); compact one line. IllustrativeChip after every money figure. Money is never green or red.
7. IllustrativeChip — "ILLUSTRATIVE", 11px caps, neutral-400, 1px dashed #4a4a4a, r=4.
8. RoutedOwner {owner, cc, reason} — 03 §6.5 (initials circle, roles only).
9. GateChip {state: 'awaiting'|'approved'|'draft'|'not_sent'|'requested', text} — amber ⏱ / green ✓ / neutral; always icon + text.
10. EmptyScope — "No signal above threshold in this scope", dashed #2a2a2a border.
11. Tailwind: add to theme.extend ONLY the tokens from 03 §2.7 that the repo lacks (sev colours, glow-orange / glow-teal / glow-amber / drawer shadows).
12. Temporarily render every primitive with fw-4-1 data at the bottom of the hero page inside a clearly marked block {/* TEMP primitives — remove in Step 9 */}.

Done when: the hero page shows every primitive with fw-4-1 data; with DevTools → Rendering → "Emulate vision deficiency: achromatopsia", S1–S4 are still distinguishable by glyph and word; anonymise swaps the join-tag values.
```

**Expected:** a primitive gallery on the hero page.
**Acceptance:** compare with 03 §6.1–§6.6; K/I bar reads 15 : 8; P&L shows "To date ≈ $12k · projected ≈ $0.15m …" + ILLUSTRATIVE.
**Pitfalls:** hatched pattern invisible on projectors — keep the 1px `#737373` outline on the Inferred segment; don't colour the S-chip text only — the glyph must be present.

---

### Step 6 — Exec overview A: funnel, brief, pulse, question cards (45 min)

**Goal:** top half of `/` identical in rhythm to the bank exec screen.
**Files:** `src/app/(kgs)/page.tsx`, `src/components/kgs/exec/{FunnelStrip,ExecBriefBar,PulseStrip,QuestionCard,WhatsCountedPopover,AreaTrend,SemiGauge,MiniKPI,InsightBox}.tsx`.

```text
Agent mode. Step 6 — exec overview part A: FunnelStrip, ExecBriefBar, PulseStrip, three QuestionCards.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§2.1–§2.5) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§1.3 exec layout, §3B, §5.4 visuals only — figures come from JSON) @src/mock/kgs/data/exec.json @src/mock/kgs/data/signal_fw41.json (lineage series) @src/mock/kgs/data/channel.json (partnerTimeline) @src/mock/kgs/data/separation.json (cutoverTimeline) @src/components/kgs/exec/ @src/components/kgs/shared/
Attached: Head_of_Cards_Exec-1.png — match spacing, card anatomy, gauge and area-trend styling exactly.

In src/app/(kgs)/page.tsx build rows B–E of 04 §2.1 (leave empty anchored sections id="applied-value", id="field-signal-monitor", id="governed-watch" for the next steps):
1. FunnelStrip (new; 36px row, 13px, numbers mono 600) from exec.funnel: "233,900 interactions read (26 weeks; ~9,000 this week) · 1,640 candidate clusters · 212 suppressed ⓘ · 5 signals above threshold · 2 governed watch items". "212 suppressed" opens a popover titled "Suppressed this window — not signals" listing suppressedReasons with counts and suppressedFooter. "5 signals above threshold" scrolls to #field-signal-monitor; "2 governed watch items" scrolls to #governed-watch.
2. ExecBriefBar (fork): "✨ EXECUTIVE BRIEF" + exec.brief.
3. PulseStrip (fork): three cards from exec.pulse. Title "1. What's critical" etc. (replace the bank orb emojis with a neutral dot), body text, chip row = chips[0] as severity/domain text chip, chips[1] as owner chip, chips[2] as GateChip. Whole card links to linkTo. Card 1's gate chip shows chipAfterApprove ("Investigation approved", green) when demo.approvals['fw-4-1'] exists.
4. QuestionCard (fork) ×3 from exec.questionCards, per 04 §2.5:
   - header: icon tile (Cpu / Handshake / Split), title (2 lines allowed), caption, chevron.
   - ScoreDelta: count (40px/700, tabular) with countLabel beneath; delta chip (mono; amber when deltaLabel starts with "+", neutral otherwise); fourWeekLabel micro line; severityMix 12px; ⓘ opens WhatsCountedPopover (title "What's counted", counted[] rows each linking to that signal's route, notCounted line, countedFooter).
   - left: AreaTrend (fork; Recharts area, no axes) plus a dashed neutral-500 baseline line. Q1 = fw 4.1 rate vs 4.0 from signal_fw41 lineage (4.1 from W23); Q2 = ESD-SE-07 friction vs baseline from channel.partnerTimeline; Q3 = UK-EU remit-to series vs control from separation.cutoverTimeline.
   - right: 2 × SemiGauge (fork) — pct text always shown, label, sub, tone colour backed by the text; 2 × MiniKPI (sans for words, mono for numbers, IllustrativeChip after money).
   - InsightBox: label literally "LiSN INSIGHT" + insight text.
   - Borders: Q1 orange 2px + glow-orange (highlighted); Q2 teal 1px/30% + faint glow; Q3 sky-400 1px/30% + faint glow. Whole card is a link to route; hover lift −2px, 150ms.

Done when: the cards read 2 / 2 / 1 with "0 vs last week", "+1 vs last week", "0 vs last week"; gauges 98% · 80%, 99.8% · 71%, 75% · 8%; no "index", "score" or "pts" anywhere; the ⓘ popovers list the counted signals; at 1280px the page matches the screenshot's rhythm with KGS content.
```

**Expected:** `/` looks like the bank exec screen down to the question cards.
**Acceptance:** click Pulse 1 → hero route; click each card → its drill route; hover "212 suppressed" → 74 · 58 · 41 · 27 · 12; delta on Q2 amber, Q1/Q3 neutral; Q1 MiniKPI "PANELS EXPOSED 1,240 +5,560 eligible".
**Pitfalls:** gauges coloured red by the bank default — map tone from JSON (`green`/`amber`); Q2 "BACKLOG AT RISK $2.3m" and Q3 "£1.1m" need IllustrativeChip; the AreaTrend with `null` values for 4.1 before W23 needs `connectNulls={false}`; any "LISN INSIGHT" means an `uppercase` class survived.

---

### Step 7 — Exec overview B: Field Signal Monitor (35 min)

**Goal:** the horizontally scrolling monitor, re-skinned from the AI Risk Spike Monitor with the full signal contract on every card.
**Files:** `src/components/kgs/exec/{SectionHeader,SignalMonitorCard,MetricBeforeAfter,RecommendationBox,SuppressedEndCard,FieldSignalMonitor,DateCodeMicroStrip}.tsx`, `page.tsx`.

```text
Agent mode. Step 7 — Field Signal Monitor strip on "/".

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§2.7) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§3B SectionHeader and RiskSpikeCard, §4 strip behaviour, §6.9 micro strip) @src/mock/kgs/data/monitor.json @src/mock/kgs/data/signal_fw41.json @src/mock/kgs/data/installedBase.json (dateCode.cells) @src/components/kgs/exec/SignalMonitorCard.tsx @src/components/kgs/shared/
Attached: Head_of_Cards_Exec-1.png — the "AI Risk Spike Monitor" row is the reference.

Build inside the #field-signal-monitor section:
1. SectionHeader (fork): Activity icon (amber) · "Field Signal Monitor" · chip "5 ABOVE THRESHOLD" (neutral/amber, not red) · subtitle "Signals above threshold, ranked by severity, population and consequence. Each is routed to one owner." · italic Suppressed line per 04 §2.7 (the word Edge must be the token {{platform:Edge}} so it anonymises).
2. SignalMonitorCard (fork of RiskSpikeCard; 240px wide; S2 amber tint: near-black gradient, border amber-500/50) ×5 from monitor.cards in rank order:
   rank + title + SeverityChip full ("S2 · Material impact") + DomainChip → rows SOURCES / COHORT / WINDOW / OWNER → MetricBeforeAfter rows from metrics (label left, value right, change under it in rose-300) → compact severity line (card 1: signal_fw41.signal.severity.compact; others: blastRadius text + type word + "Incident off") → compact ConfidenceMarker (confidenceShort) → compact P&L (pnlShort + IllustrativeChip) → first 3 join tags from monitor.signals[i].joinTags (card 1 from signal_fw41) → GateChip from ownerGate → RecommendationBox labelled "LiSN suggests · owner decides" with suggestion (neutral/amber box, never a red command box) → footer link "Open signal →" to linkTo.
   Card 1's gate chip becomes gateChipAfterApprove "✓ Investigation approved" (green) once demo.approvals['fw-4-1'] exists. Card 2 (microStrip: true) shows an 8px 26-cell date-code strip from installedBase.dateCode.cells with 2611–2614 outlined. No enabled action button on any card.
3. SuppressedEndCard (RiskSpikeCard shell, neutral tint) from monitor.suppressedCard: title, 5 rows with counts, footer "Recall broad, rank severe."
4. Strip: flex gap-3 overflow-x-auto, scroll-snap-type x mandatory, 32px ghost arrow buttons left and right, right-edge fade mask, no auto-scroll. Links: card 1 → /installed-base/signal/fw-4-1; card 2 → /installed-base#date-code; card 3 → /channel#esd-se-07; card 4 → /channel#backorder; card 5 → /separation.
If monitor.signals[i].joinTags is missing for a card, do not invent tags: render the COHORT row as the join summary and list the gap in your reply.

Done when: six cards scroll in the order fw 4.1 · D-2 · ESD-SE-07 · N-3 · UK-EU · 212 suppressed; each signal card shows S2 + word, type, blast radius, K/I, P&L, joins, owner and gate; no red "CRITICAL" chip or red reco box remains.
```

**Expected:** the monitor row reads like the bank's, but calmer (amber, not red) and with more structure per card.
**Acceptance:** arrows scroll one card; card 1 metric "Contacts / 1,000 panel-weeks 2.0 → 6.2 3.1×"; card 5 "2.7× (control 1.1×)"; anonymise → card 1 title "Panel platform A fw A.4.1 …".
**Pitfalls:** 240px cards overflow with the extra rows — allow the card to grow (bank cards were ~470px tall; ~560px is fine), never shrink text below 11px; fade mask hiding the last card's arrow — put arrows above the mask.

---

### Step 8 — Exec overview C: governed watch, evidence readiness, applied value (35 min)

**Goal:** finish `/`: the value strip (row F) and the governed/enabler row (row H).
**Files:** `src/components/kgs/exec/{AppliedValueStrip,HowWeCountDrawer,GovernedWatchTile,ClockRing,EvidenceReadinessTile}.tsx`, `src/components/kgs/shared/{Drawer,Modal,Popover}.tsx` (generic; reused later), `page.tsx`.

```text
Agent mode. Step 8 — exec overview part C: AppliedValueStrip + HowWeCountDrawer, GovernedWatchTile, EvidenceReadinessTile.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§2.6, §2.8, §2.9) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§3C KpiTile, §6.7 drawer shell, §6.12 governed tile) @docs/kgs-brief/02_Requirements_Pain_Value.md (§1 value statements, §2 value register) @src/mock/kgs/data/exec.json @src/mock/kgs/lib/values.ts @src/components/kgs/shared/
Attached: ServicePromise-1.png (KPI tiles and aged-case rows are the anatomy reference).

1. Generic shared/Drawer (right overlay 520px, full height, #0d0d0d, left border #1f1f1f, shadow-drawer, backdrop bg-black/50, slide x 100%→0 in 240ms cubic-bezier(.32,.72,0,1), close 180ms, Esc and backdrop click close, focus trap, sticky header slot, sticky footer slot). Generic shared/Modal (centred, r=16, #0d0d0d, Esc closes, focus trap, header slot). Use the repo's Sheet/Dialog primitives if REPO_MAP lists them. The SyntheticBadge must render above both backdrops.
2. Section #applied-value (row F, between the question cards and the monitor): header "Applied value · this week" + chip "Synthetic scenario" + right link "How we count". Six KpiTiles from exec.appliedValue.tiles: AV-1 "21 days" (click → popover of leadList: signal, crossed date, review, lead days); AV-2 "5 → 5 owners" (click → scroll to #field-signal-monitor); AV-3 "5 awaiting owners" / sub, switching to onApprove value and sub when demo.approvals['fw-4-1'] exists; AV-4 "Exposure in view" + IllustrativeChip with the three lines stacked separately (never summed) and sub "exposure, not savings · not summed"; AV-5 "~430" + chip; AV-6 "212" (click → same suppressed popover as the funnel). Each tile's tooltip shows the method text for its methodIds from values.ts. Footnote under the strip (exec.appliedValue.footnote).
3. HowWeCountDrawer (uses Drawer): title "How we count" + SyntheticBadge; the value statements; the unit-cost assumptions from unitCosts ("tier-1 contact $25–60", "fully loaded field cost per excess fault contact $750 (truck roll $450 · Tier-3 escalation $150 · NFF return share $150)", "detector field replacement $120 per unit"); the V-01…V-14 table (figure + method) from valueRegister; footer neverOnScreen.
4. Section #governed-watch, grid 12: GovernedWatchTile (cols 1–7) per 03 §6.12 with exec.governedWatch — red-500/30 border, 32px striped header band with Lock + "RESTRICTED" + "Governed safety & cyber watch", headline "2 open watch items (restricted)", "P&L: Restricted", W-1 and W-2 rows (AgedCaseWatchlist anatomy, 3px red left bar, SeverityChip S1) with the exact row and secondLine text, content lines rendered as redaction bars, W-2 ClockRing (40px, centre mono clock.elapsedLabel "8h 46m", ticks at 24h and 72h, caption clock.caption — static text, never computed from now), footer "LiSN does not determine reportability." in bold. Click anywhere → Modal with governedWatch.modal and a single "Close" button. No hover lift. No tokens in this tile.
5. EvidenceReadinessTile (cols 8–12): SeverityChip "S4 · Efficiency" + chip "ENABLER", title "Evidence readiness", body, label "Discovery measures this first — on your data.", compact confidence, owners; click → /installed-base#why-late.

Done when: "/" is complete top to bottom (A–J of 04 §2.1); AV-4 shows three separate money lines each with ILLUSTRATIVE; How we count opens and closes with Esc; the governed tile shows W-1 "6 Sep 14:38 UTC" and the "23 Sep 10:02" chronology line, no platform, firmware or country, and opens the restricted modal; the rail Lock icon scrolls to it.
```

**Expected:** exec overview complete. **→ Checkpoint 1.**
**Acceptance:** full scroll of `/` at 1280/1440/1920; anonymise leaves the governed tile unchanged; drawer Esc closes; AV-3 still reads "5 awaiting owners" (approval comes in Step 10).
**Pitfalls:** tooltips on the ClockRing computing time from `Date.now()` — forbidden; `KpiTile` value font too large for three stacked lines on AV-4 — use 16px mono lines there; badge under the drawer backdrop — fix z-index now.

---

### Step 9 — Hero deep-dive: layout + FirmwareLineageChart (60 min)

**Goal:** the double-click page reads as evidence, top to bottom, before any interaction.
**Files:** `src/app/(kgs)/installed-base/signal/fw-4-1/page.tsx`, `src/components/kgs/signal/{SignalHeader,RankChip,WhyRankedPopover,FirmwareLineageChart,SignalChips,CounterEvidence,CohortMiniTable,RecommendedAction}.tsx`.

```text
Agent mode. Step 9 — hero deep-dive layout and the FirmwareLineageChart. No decision panel logic yet (placeholder box on the right).

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§4.1–§4.8) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§1.3 hero layout, §6.8 FirmwareLineageChart, §6.13 RankChip, SignalChips, CounterEvidence) @docs/kgs-brief/05a_Data_Contract.md (§4.4, §5.2 hero lineage) @src/mock/kgs/data/signal_fw41.json @src/components/kgs/shared/ @src/components/kgs/drill/LineMonitor.tsx
Attached: Cards_Journey-1.png (panel styling and line-chart look).

Page /installed-base/signal/fw-4-1 (remove the TEMP primitives block from Step 5):
1. Header block: BackToOverviewHeader "Back to installed base" → /installed-base; RankChip "#1 of 5" + link "Why ranked here? ⓘ" opening WhyRankedPopover (rows from signal.rankFactors with small bars; composite line "Rank score 0.84 · next: D-2 date-code window 0.71"; footnote "Ranking = severity × rate ratio × panels on version × source independence × est. field cost. The score orders signals; it is not a probability."; IllustrativeChip after the field cost); SyntheticBadge.
2. H1 = signal.headline (28–32px, max 2 lines). Metric line = signal.metric.line (mono numbers, IllustrativeChip not needed — no money). Sub-line = signal.subline.
3. SeverityStrip full, full width.
4. Grid 12. Cols 1–8: FirmwareLineageChart (h≈340) → SignalChips (signal.chips with Sparkles / Repeat / Scale icons; the third chip carries a product ↔ practice attribution bar with the dot at attributionPos 0.3) → CounterEvidence (collapsed by default, chevron, neutral box, signal.counterEvidence).
   Cols 9–12: ConfidenceMarker full → JoinTagRow (all 8, +n overflow after 5) → CohortMiniTable (cohort.regions + total row 1,240 / 610 / 9 / 23) → PnLDestinationTag full (Method ⓘ will open the drawer's Method tab in Step 11; for now a no-op) → RoutedOwner (routing) → RecommendedAction box (signal.recommendedAction, amber "awaiting VP Engineering" framing) → a placeholder <section id="decision"> for Step 10.
5. FirmwareLineageChart (Recharts ComposedChart), per 03 §6.8 and 04 §4.4, data from signal_fw41 lineage:
   - NUMERIC x-axis: dataKey week, type="number", domain [1, 28.5], ticks every 2 weeks labelled by weekStart ("30 Mar" …); this is required so fractional markers (23.4, 25.4, 28.3) land correctly.
   - 4.0: neutral-300 2px line + 20% ribbon from rateLow/rateHigh (Area with a [low, high] range dataKey), legend "4.0 (prior)".
   - 4.1: orange-500 2.5px line + gradient area (orange/30 → 0), W23–W26 only.
   - EST4 RMA rate: neutral-500 dashed 1.5px on a SECOND hidden y-axis (domain [0, 0.7]) so it sits flat mid-chart; right-end label chip "EST4 RMA rate — in control".
   - Markers from lineage markers: ReferenceLine 2 Sep (violet-400 dashed, label "2 Sep · fw 4.1 released (synthetic)"); ReferenceDot 16 Sep on the 4.1 line (8px red-400 + ping ring that pulses twice then stops; label "16 Sep · threshold crossed — third independent partner"); ReferenceLine 7 Oct dotted neutral-500 "7 Oct · next monthly RMA review"; ReferenceArea shading the future zone (x 26.5–28.5, white/[.03]); a bracket or label "21 days earlier" between 16 Sep and 7 Oct.
   - Denominator band: a separate 40px bar chart underneath with the same x domain and syncId — panels on 4.0 (neutral-700) and 4.1 (orange-900), label "Panels on version".
   - Tooltip (#1a1a1a, mono values) exactly: "Week of {weekStart} · 4.1: {rate} per 1,000 panel-weeks ({contacts} contacts / {panels} panels) · 4.0: {rate} ({contacts} / {panels}) · EST4 RMA rate {rmaRate}%", omitting the 4.1 part before W23. All tick, legend, label and tooltip text through useLabel.
   - Draw-in 900ms, left to right; markers fade in after 200ms.

Done when: the page reads top to bottom as in 03 §1.3; hovering W25 shows "4.1: 7.4 per 1,000 panel-weeks (9 contacts / 1,220 panels) · 4.0: 2.0 …"; the grey RMA line is flat and labelled "in control"; the 16 Sep dot pulses twice; anonymise changes the H1, join tags, chart labels and cohort table regions.
```

**Expected:** the "special cause under a green aggregate" picture (01 §6.1 moment 2).
**Acceptance:** markers at the right dates; "21 days earlier" visible; counter-evidence expands; the P&L caption reads "Small because it is week three."; Why ranked popover shows 0.84.
**Pitfalls:** categorical x-axis silently snaps markers to whole weeks — must be numeric; plotting the RMA % on the rate axis hugs zero — use a second y-axis; `ReferenceDot` ping via CSS `animation-iteration-count: 2`; the chart re-animates on every anonymise toggle — set `isAnimationActive` only on first mount (store a ref).

---

### Step 10 — Decision panel: HumanGate, "Viewing as", Approve flow (45 min)

**Goal:** the approval moment (01 §6.1 moment 4) with a live timestamp and every knock-on.
**Files:** `src/components/kgs/signal/DecisionPanel.tsx`, `src/components/kgs/shared/{HumanGateStatus,ApproveButton}.tsx`, DemoProvider (only if an action is missing), the Pulse / monitor / AV-3 components (read-only state hooks).

```text
Agent mode. Step 10 — the hero Decision panel and the approval transition.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§4.9 in full, §6 approval motion) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§6.6 HumanGateStatus + ApproveButton, §4 approval transition) @docs/kgs-brief/02_Requirements_Pain_Value.md (HS-8, HS-9) @src/mock/kgs/data/signal_fw41.json (signal.gates, gateFooter) @src/mock/kgs/lib/demoState.ts @src/components/kgs/shell/DemoProvider.tsx @src/app/(kgs)/installed-base/signal/fw-4-1/page.tsx

Build DecisionPanel in the #decision placeholder (cols 9–12), title "Decision":
1. HumanGateStatus (03 §6.6 styles by state) for gate-fw41-brief: awaiting title "Draft investigation brief — awaiting VP Engineering approval", audit line from gate.auditLine. Below it the not_sent line for gate-fw41-kin: "Draft known-issue note for tech-support agents — not sent".
2. Local segmented control "Viewing as: President | VP Engineering" bound to demo.viewingAs (the breadcrumb already follows it).
3. Buttons: ApproveButton "Approve investigation" — when viewingAs is President: aria-disabled (NOT the disabled attribute, so it stays focusable), Lock icon, tooltip "Approval sits with VP Engineering"; when VP Engineering: enabled, brand gradient. Secondary outline buttons "View draft" (opens the modal in Step 12; no-op for now) and "Evidence · 23" (opens the drawer in Step 11; no-op for now).
4. President-only button "Ask VP Engineering for a decision" (decisionRequest.buttonLabel): click → requestDecision('fw-4-1') → chip "Decision requested by President", audit entry "{ts} · President requested a decision from VP Engineering" (ts from state), button disables with label "Decision requested". Hide it after approval.
5. Approve (VP Engineering view), in this order: button spinner + "Approving…" for 500ms → approve('fw-4-1') captures ts ONCE → HumanGateStatus morphs amber → green (300ms colour crossfade, check icon draws 250ms) with title onApprove.title "Investigation approved by VP Engineering · reproduction on candidate configuration" → audit line slides in (200ms) "Approved · investigation opened · audit logged {ts}" → open lines appear: "Rollout decision: pending — VP Engineering" and "LiSN keeps watching: the 4.1 rate is re-measured daily against 4.0." → known-issue line becomes "Awaiting VP Service & Tech Support approval — not sent" → toast title "Investigation opened", body "Approved by VP Engineering · audit logged {ts} · nothing sent outside LiSN" → button becomes "Approved" (green outline, Check icon, disabled).
6. Knock-ons (read demo.approvals['fw-4-1'] wherever needed): Pulse card 1 chip → "Investigation approved"; monitor card 1 chip → "✓ Investigation approved"; AV-3 → "4 awaiting owners" / "7 drafts · 1 approved · 0 sent · 0 automatic actions"; the P-J recommended-action box on /installed-base turns green (Step 14 reads the same flag); the drawer audit tab and the draft modal chip will read the same ts (Steps 11–12).
7. Switching back to President keeps the approved state. Reload or "Reset demo" clears it.
8. Footer always: gateFooter "LiSN aids resolution. Nothing is sent until the owner approves." No "sent" or "notified" wording anywhere, and no Send / Notify button.
9. Wrap the transitions so prefers-reduced-motion gets opacity only.

Done when: as President, Approve is locked and its tooltip shows on hover and keyboard focus; switch to VP Engineering → Approve → the same "DD Mon HH:MM UTC" string appears on the gate audit line and in the toast; back on "/" Pulse 1, monitor card 1 and AV-3 have updated; Reset demo restores everything.
```

**Expected:** a calm, legible state change with a live clock.
**Acceptance:** compare the timestamp in the toast and the gate line character by character; approve twice is impossible; the breadcrumb says "VP Engineering" while viewing as VP Engineering.
**Pitfalls:** `disabled` swallows hover so the tooltip never shows — use `aria-disabled` + `onClick` guard; computing `fmtDemoTime` in render gives three different minutes — store once; the 500ms spinner blocking a second click — guard with state; toast library defaulting to 3s — set 4s.

---

### Step 11 — EvidenceDrawer, 4 tabs (40 min)

**Goal:** every number opens to the calls behind it (01 §6.1 moment 3).
**Files:** `src/components/kgs/signal/{EvidenceDrawer,SnippetCard,LinkedRmaList,CohortTab,MethodAuditTab}.tsx`, hero page wiring, DecisionPanel "Evidence · 23" and P&L "Method ⓘ".

```text
Agent mode. Step 11 — EvidenceDrawer on the hero.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§4.10 in full) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§6.7) @docs/kgs-brief/05a_Data_Contract.md (§4.4, §4.4.1 evidence table) @src/mock/kgs/data/signal_fw41.json (evidence, rmas, rmaNote, cohort, method, audit, auditRuntime, drawer) @src/components/kgs/shared/Drawer.tsx @src/components/kgs/shell/DemoProvider.tsx
Attached: Market_saying-1.png (tabs with counts — style reference only).

Build EvidenceDrawer using shared/Drawer (520px):
1. Sticky header: "Evidence · 23" (20px/800) + SyntheticBadge (small) + ×. Tabs (repo Tabs style, violet active): "Snippets 23" · "Linked RMAs 2" · "Cohort" · "Method & audit". Props: open, initialTab.
2. Snippets: "Featured" (featured: true, in featuredOrder 1–5) then "All 23" (chronological). SnippetCard (#131313, r=12, p=14): channel icon (call Phone, case FileText, email Mail, rma RotateCcw, afterHours Moon) + "{channelLabel} · {partnerId} · {place} · {localDateLabel}" (13px neutral-400) + K/I pill right ("K" solid neutral; "I" hatched, tooltip "Inferred — firmware imputed from {imputedFrom}"); quote 15px/1.6 in curly quotes with the matched phrase highlighted (bg-violet-500/20 + 1px bottom border violet-400); optional note line (e.g. the 15 Sep ET → 16 Sep UTC note); footer "Open source interaction" disabled with tooltip "Disabled in demo".
   IMPORTANT: apply useLabel to BOTH the text and the highlight before splitting, so highlighting still works when anonymised ("4.0" → "A.4.0").
3. Linked RMAs: rows "RMA-S-2609-0142 · NFF · 16 Sep · {partner} · serial E4-S-25184417 (synthetic)" (ID mono, "NFF" neutral chip), then rmaNote.
4. Cohort: "1,240 panels on fw 4.1 · serial range E4-S-2403xxxx to E4-S-2611xxxx (synthetic)", the region table with total, "Eligible not yet upgraded: 5,560", "Export list" button aria-disabled with tooltip cohort.exportTooltip.
5. Method & audit: method k/v list; then "Audit log" newest first — runtime entries prepended in this order when present: approval entry onApprove.auditEntry with the stored ts, decision-request entry with its ts, and auditRuntime.drawerOpen "President · just now" (added the FIRST time the drawer opens this session via drawerOpened() from useDemo()); then the static audit[] labels.
6. Sticky footer: drawer.footer.
7. Wiring: DecisionPanel "Evidence · 23" opens Snippets; PnLDestinationTag "Method ⓘ" opens Method & audit. Esc and backdrop close; focus returns to the opener.

Done when: 23 snippets render (5 featured first); snippet 1 highlights "Rolled one panel back to 4.0"; with anonymise ON it reads "Partner P-07 · State 1" and highlights "A.4.0"; the audit tab shows "President · just now" once, and after an approval the approval line with the same ts as the toast; the badge stays visible over the backdrop.
```

**Expected:** a drawer that feels like a case file, not a chat log.
**Acceptance:** tab counts; K/I counts across All 23 = 15 K / 8 I; channel mix 7 call · 8 case · 4 email · 2 RMA · 2 after-hours; Esc returns focus to "Evidence · 23".
**Pitfalls:** highlight split breaking on anonymise (see prompt); drawer header hidden under the sticky ContextBar — drawer sits above it with its own badge; scrolling the page behind the drawer — lock body scroll while open.

---

### Step 12 — Draft investigation brief preview modal (20 min)

**Goal:** "drafts, people approve" made tangible.
**Files:** `src/components/kgs/signal/DraftPreviewModal.tsx`, DecisionPanel "View draft".

```text
Agent mode. Step 12 — DraftPreviewModal ("View draft").

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§4.11) @docs/kgs-brief/05a_Data_Contract.md (§4.4.2 draftBrief) @src/mock/kgs/data/signal_fw41.json (draftBrief, evidence featured, rmas) @src/components/kgs/shared/Modal.tsx

Build DraftPreviewModal (760px wide, read-only, scrollable body):
1. Header: chip draftBrief.chipPending "DRAFT — not sent" (neutral/amber) — after approval chipApproved "APPROVED · {ts}" (green) using the stored ts — + SyntheticBadge + ×.
2. Title draftBrief.title; meta line draftBrief.meta.
3. Sections from draftBrief.sections in order: headings bold; body paragraphs; section 2 with attachFeatured also lists the 5 featured snippets (quote + channel/partner/date) and the 2 RMA IDs; section 5 renders items H1–H3 each on its own block, splitting "For:", "Against:", "Test:" onto separate lines with bold lead-ins, then its footer "LiSN does not determine cause. Engineering decides."; section 6 is an ordered list + footer; section 7 body.
4. Footer: draftBrief.footer. Only a "Close" button — no Send, Approve or Export here.
5. Wire DecisionPanel "View draft" to open it. Esc closes; focus returns.

Done when: the modal shows seven sections with the three candidate causes labelled "candidate, not cause"; after approval the chip reads "APPROVED · <same ts as the toast>"; anonymise changes the title to "… Panel platform A firmware A.4.1 (synthetic)".
```

**Expected:** a readable engineering brief. **Acceptance:** no Send button; British spelling; the modal scrolls within 90vh. **Pitfalls:** very long modal on a 720p share — cap height to 85vh with internal scroll.

**→ Checkpoint 2 falls here (7:00).**

---

### Step 13 — Q1 drill-down A (45 min)

**Goal:** the contradiction before the detail (HS-2): "2 signals above threshold" beside "EST4 RMA rate 0.28% · in control", hero first on the wall.
**Files:** `src/app/(kgs)/installed-base/page.tsx`, `src/components/kgs/drill/{Panel,KpiTile,SegmentTable,StackedRatioBar,LineMonitor,SignalWall,WallCard,WallFooterCounts,Watchlist}.tsx`.

```text
Agent mode. Step 13 — Q1 drill-down /installed-base, part A (rows 0–3 of the 04 §3.1 grid).

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§3.1–§3.5, §3.9, §3.13) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§1.2, §1.3 Q1 layout, §3C panels) @src/mock/kgs/data/installedBase.json @src/components/kgs/drill/ @src/components/kgs/shared/
Attached: Cards_Journey-1.png — match the grid, panel chrome, table rows, line chart and wall exactly.

Page /installed-base under the existing BackToOverviewHeader:
1. P-0 KpiTile row ×4 (cols 1–12) from kpis in 04 §3.2 order: "SIGNALS ABOVE THRESHOLD 2" · "FIRMWARE COHORTS IN CONTROL 45 / 46" · "EST4 RMA RATE 0.28% · in control" (sub "limit 0.35%") · "FIRMWARE RECORDED ON EST4 TROUBLE CASES 38%".
2. P-A (cols 1–4): big-gradient KpiTile "QUALITY INTERACTIONS · THIS WEEK 5,480" + emerald chip "▲ +312 vs last week"; SegmentTable columns "BRAND · PLATFORM · INTERACTIONS · WoW · RATE vs OWN BASELINE" from interactionsTable.rows (ratio printed with "×"; ≥1.2 amber, ≥1.5 orange; ▲/▼ + % in WoW); footnote below.
3. P-B (cols 5–8): StackedRatioBar "Above-baseline clusters by severity" from clustersBySeverity — rows S1 (hatched + lock, "1 cluster · contents restricted"), S2, S3, S4 split cliff / slope / spread / novel with a legend in words. Clicking the S2 bar briefly pulses wall cards 1–2.
4. P-C (cols 5–8): LineMonitor "12-week cohort monitor — contacts per 1,000 panel-weeks" + sub, from lineageMonitor (W15–W26 x-axis numeric, 4.1 orange from W23, 4.0 neutral-300, others muted, aggregate RMA grey dashed, release marker). Clicking the 4.1 line or its legend item routes to /installed-base/signal/fw-4-1.
5. P-G (cols 9–12, rows 1–3): SignalWall (fork of AI Summary Wall) — header ✨ "LiSN Signal Wall", subtitle signalWall.subtitle, pill "Data as of 25 Sep" (no Live dot). WallCards from signalWall.cards: SeverityChip + DomainChip (or the status chip text such as "Easing"/"Suppressed"), rank chip "#1 of 5", title, body, metric line, trend line with ▲/▼ + word, compact ConfidenceMarker + owner line, link "Open signal →" (card 1 → hero; card 2 → #date-code; card 3 → hero). Footer WallFooterCounts from signalWall.footer ("0 S1 · Life-safety", "2 S2 · Material impact", "1 S3 · Operational", "1 Easing").
6. P-K (cols 1–4): Watchlist fork, green tint, title "What's stable", stable.rows each with the word "Stable", footer "Shown so you can see what LiSN did not escalate."
Leave anchored placeholders for Step 14: id="date-code", id="why-late", and slots for P-E, P-F, P-I, P-J.

Done when: the page matches the bank grid; the 4.1 line and wall card 1 open the hero; the EST4 row shows "1.3×" with the footnote explaining why the platform average hides the cohort; anonymise swaps brand/platform names in table, chart legend and wall.
```

**Expected:** Q1 top half. **Acceptance:** wall card 1 first, "#1 of 5"; footer counts in words; P-0 tiles in order. **Pitfalls:** the wall's bank "Live" dot and "Real-time" subtitle surviving the fork; the wall's own scroll area clipping the footer — keep footer outside the scroller.

---

### Step 14 — Q1 drill-down B (45 min)

**Goal:** the full-width evidence panels, including the date-code window and the "why late" join panel.
**Files:** `src/components/kgs/drill/{DateCodeHeatStrip,EmergingPhrasingTable,ContactsRmaOverlay,EnhancedPanel,StuckDriverBars,AgedCaseWatchlist,DiagnosisBox,StackedBarWithDetailPanel,DetailPanel}.tsx`, Q1 page.

```text
Agent mode. Step 14 — Q1 drill-down /installed-base, part B (rows 2–6 of the 04 §3.1 grid).

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§3.6–§3.8, §3.10–§3.12) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§3C EnhancedPanel, StuckDriverBars, AgedCaseWatchlist, DiagnosisBox, StackedBarWithDetailPanel; §6.9 DateCodeHeatStrip) @src/mock/kgs/data/installedBase.json @src/components/kgs/drill/ @src/components/kgs/shared/ @src/components/kgs/shell/DemoProvider.tsx
Attached: Cards_Journey-2.png (stacked bar + detail panel) and ServicePromise-1.png (enhanced panel, driver bars, aged watchlist, diagnosis box).

1. P-E (cols 1–4): "New phrasing & emerging failures" + right "9 phrasings merged into 3 signals" + sub; table from emergingPhrasing (columns per 04 §3.7; status as a chip with text: "SIGNAL #1", "WORKAROUND · on #1", "SIGNAL #2", "WATCH · unsized", "WATCH · practice-leaning", "SUPPRESSED · adoption, not fault").
2. P-F (cols 5–8): ContactsRmaOverlay "Contacts lead, RMAs lag — {{platform:EST4}}" from contactsVsRma: weekly trouble bars with an orange top segment for fw41 in W23–W26; RMA rate % line on a second axis with dashed limit 0.35 labelled lineLabel; ghost zone to 9 Oct with marker "7 Oct · next monthly RMA review"; caption.
3. P-J (cols 1–12): StackedBarWithDetailPanel "Trouble conditions by platform" from symptomStack (8 bars stacked by platform, legend in a bordered box). DetailPanel open on defaultOpen "loop-mapping" (static in P0): title + SeverityChip S2, big "412" "contacts" "+14% WoW", KPI grid (6 cells), "LiSN INSIGHT" box + compact ConfidenceMarker, action box labelled "RECOMMENDED ACTION — awaiting VP Engineering" in amber, turning green with "RECOMMENDED ACTION — approved by VP Engineering" framing when demo.approvals['fw-4-1'] exists, "PHRASINGS" chips, link "Open signal →" to the hero. Add a first-3 JoinTagRow under the KPI grid.
4. P-D (cols 1–12, id="date-code"): DateCodeHeatStrip "Date-code window under a green aggregate" + SeverityChip S2 + DomainChip Quality + chip "Cliff on the serial axis": 26 cells 2601–2626 (24×40, r=4, single-hue orange opacity by relativeRisk, mono labels every second code), window 2611–2614 outlined 2px white with bracket text; hover tooltip code/units/contacts/ratio; right 35% mini p-chart (SKU return rate line, dashed "0.30% limit", current dot 0.21%, caption "SKU return rate 0.21% — inside limit"); stats row (exposure + IllustrativeChip, containable, ConfidenceMarker compact, component lot, RoutedOwner, GateChip with the containment-memo gate, lead line); caption "The aggregate is green by construction. The window is not."
5. P-H (cols 1–12, id="why-late"): EnhancedPanel (fork) "✨ Why field issues surface late", badge "Joined with RMA & firmware data" (amber-400 on #2b2412), JoinTagRow under the subtitle (enhanced.joinTags or the hero's first 5), violet line, right meta, StatStrip of 6, StuckDriverBars "Why signals arrive late" (5 rows, chip text High/Medium/Watch), AgedCaseWatchlist "Cohorts on watch" (4 cards, SeverityChip compact, age right, Stage/Blocker lines, tags).
6. P-I (cols 1–12, inside or under P-H): DiagnosisBox titled diagnosis.title ("LiSN evidence summary", ✨ icon) + compact ConfidenceMarker "M 0.70"; three columns with bold lead-ins from meta.labels.diagnosisRows ("Main signal:" / "What changed:" / "Decide first:").
7. Anchors: every anchored section gets scroll-margin-top clearing the sticky header + ContextBar; on mount, if location.hash is set, scrollIntoView after first paint (links arrive from "/" and the evidence-readiness tile).

Done when: /installed-base#date-code and /installed-base#why-late land on the right panel from the exec links; the detail panel shows "412" with "RECOMMENDED ACTION — awaiting VP Engineering" and turns green after an approval on the hero; the heat strip window is outlined and labelled with the ratio (not colour alone).
```

**Expected:** Q1 complete for P0. **Acceptance:** from `/`, click monitor card 2 → lands on the heat strip; evidence-readiness tile → lands on "Why field issues surface late"; bars sum visibly (loop mapping tallest). **Pitfalls:** hash navigation across routes in the App Router is unreliable — the mount-time `scrollIntoView` fixes it; heat-strip opacity alone carrying meaning — keep outline and bracket text.

---

### Step 15 — Motion pass (25 min)

**Goal:** executive, subtle motion; nothing delays a number by more than 0.7s.
**Files:** `src/components/kgs/shared/{CountUp,Motion}.tsx`, touched components.

```text
Agent mode. Step 15 — motion pass across KGS screens.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§6 table and rules) @docs/kgs-brief/03_Look_and_Feel_Reference.md (§4 transitions table) @docs/kgs-brief/REPO_MAP.md (animation library)

Use the repo's animation library if REPO_MAP lists one (framer-motion or similar); otherwise CSS transitions/keyframes. Implement only the P0 rows of 04 §6:
1. Route change: enter opacity 0→1 + y 8→0, 220ms cubic-bezier(.2,.8,.2,1); exit 150ms (template.tsx or a wrapper in the (kgs) layout).
2. Card hover on QuestionCard, SignalMonitorCard, WallCard and clickable tiles: translateY(-2px), border to accent/60, glow +50%, 150ms ease-out.
3. CountUp (shared): first mount only, 700ms easeOut, tabular-nums, renders the FINAL formatted value on the server and for reduced motion; applied to the question-card counts, funnel numbers, KPI values and the hero "6.2 vs 2.0". It animates only numeric strings from JSON and always ends on the exact JSON text.
4. Gauges and progress bars grow from 0 in 600ms, starting 100ms after the count-up.
5. Charts: draw-in 900ms on first mount only (not on anonymise toggles); lineage markers fade in after 200ms; the threshold dot pings twice.
6. Popovers (What's counted, Why ranked, Suppressed): scale .98→1 + fade, 150ms.
7. Drawer slide already done (check timings 240ms in / 180ms out).
8. Anonymise: 150ms text crossfade on swapped labels (key on the anonymise flag), watermark fades in 200ms.
9. Approval sequence per 04 §6 (verify it matches Step 10).
10. prefers-reduced-motion: reduce → opacity only, no transforms, count-ups show the final value instantly.
No bounce, no spring overshoot, no confetti, no auto-scrolling.

Done when: with DevTools → Rendering → "Emulate prefers-reduced-motion: reduce" nothing moves except opacity; without it, the exec page settles within ~1s of load and toggling anonymise does not replay chart animations.
```

**Acceptance:** load `/` three times — numbers land on the exact JSON text; anonymise toggle is a soft crossfade. **Pitfalls:** CountUp producing "233900" without separators mid-animation — format each frame with `en-GB`; hydration warnings from animated text — render final value on the server.

---

### Step 16 — P0 QA sweep + preview deploy (20 min)

Run §5.1 (automated checks) and §5.2 items 1–8 on the P0 routes, fix what fails, then push and open the Vercel production URL of the new project in a browser **not** logged into Vercel to see what a recipient sees. No Cursor prompt needed; if the sweep finds hits, paste them into a new Agent chat with: "Fix these per @.cursor/rules/kgs-demo.mdc; change copy only where the brief gives the exact string."

---

### Step 17 — P1: Q2 `/channel` (30 min)

**Goal:** same method on the channel hat (moment 5). **Files:** `src/app/(kgs)/channel/page.tsx`, forks: `RankingsTable` → `PartnerLeagueTable`, `PromiseGap`/`Funnel` only if time.

```text
Agent mode. Step 17 — Q2 drill-down /channel (P1). Reuse Q1 components; build nothing new unless listed.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§5.1) @docs/kgs-brief/05a_Data_Contract.md (§4.6, §5.6) @src/mock/kgs/data/channel.json @src/components/kgs/drill/ @src/components/kgs/shared/
Attached: Market_saying-1.png (tabs + table), Market_saying-2.png (rankings table).

Build in this order and stop at the time box — each item must be complete before the next:
1. C-0 KpiTile row (6 tiles; money with IllustrativeChip; "BACKLOG AT RISK $2.3m" sub "2.4% of ~$95m open backlog").
2. C-I LiSN Signal Wall (cards "#3 of 5" ESD-SE-07, "#4 of 5" N-3, S3 WATCH switching language, "Suppressed" credit-hold dip; footer "0 S1 · 2 S2 · 1 S3 · 1 Suppressed") and C-J DiagnosisBox ("Main signal:" / "What changed:" / "Decide first:").
3. C-B Partner league (id="esd-se-07"): RankingsTable fork with columns PARTNER · TERRITORY · TIER · FRICTION vs OWN · RECONTACT · SELL-IN vs LY · CERTIFIED · COMPETITOR NAMED · STATUS; status as SeverityChip + words ("Within band", "S3 · watch"); competitor always "[competitor]"; row click selects the partner for C-C.
4. C-C Partner timeline: LineMonitor fork, dual axis — weekly friction vs baseline band, EST4 sell-in vs last year dashed; markers "W16 · friction above own baseline", "W22 · 2 certifications lapsed", "11 Sep · above threshold"; caption; value line + IllustrativeChip; ConfidenceMarker compact; GateChip "Partner-recovery brief — awaiting Regional GM approval · no outreach sent".
5. C-D Backorder (id="backorder"): StackedBarWithDetailPanel "Backlog at risk by SKU family" with toggle "vs revised promise / vs original promise" flipping "OTD 94%" ↔ "OTD 71%"; DetailPanel N-3 per 04 §5.1 (big "$2.3m" + chip, grid, LiSN INSIGHT, "RECOMMENDED ACTION — awaiting VP Supply Chain", PHRASINGS, lead line).
6. C-G EnhancedPanel "Why partners drift" (badge "Joined with ERP orders, LMS & backlog", StatStrip, StuckDriverBars, AgedCaseWatchlist "Partners on watch"), C-H What's stable, C-E certification table, C-F switching language table.
Anchors get scroll-margin; mount-time hash scroll as on Q1.

Done when: exec monitor cards 3 and 4 land on #esd-se-07 and #backorder; no competitor name appears; no enabled outreach or send control exists; "419 / 420" is visible.
```

**Acceptance:** "−22%" sell-in and "3.1×" friction on the ESD-SE-07 row; toggle flips OTD. **Pitfalls:** dual-axis charts misread on a projector — label both axes in words.

---

### Step 18 — P1: Q3 `/separation` (30 min)

```text
Agent mode. Step 18 — Q3 drill-down /separation (P1). Reuse Q1/Q2 components; build nothing new unless listed.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/REPO_MAP.md @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§5.2) @docs/kgs-brief/05a_Data_Contract.md (§4.7, §5.7) @src/mock/kgs/data/separation.json @src/components/kgs/drill/ @src/components/kgs/shared/
Attached: ServicePromise-1.png, ServicePromise-2.png.

Build in this order and stop at the time box:
1. S-0 KpiTile row (6; "INVOICES IN DISPUTE £1.1m / 212" + IllustrativeChip; "DSO TOP-10 UK-EU +6 days" sub "≈ £1.0m cash tied up" + chip). GBP only on this page — never add to any USD figure.
2. S-I LiSN Signal Wall (footer "0 S1 · 1 S2 · 1 S3 · 3 Clean") and S-J DiagnosisBox.
3. S-B Cutover timeline: LineMonitor fork, numeric x-axis, three series (UK-EU remit-to & entity orange, UK-EU portal login amber, control grey dashed), cutover markers 14 Jul · 4 Aug · 12 Aug · 1 Sep and "10 Sep · above threshold"; caption.
4. S-C Cutover scorecard table (ServiceBreaksTable fork): three rows "Clean vs control", UK-EU row S2 with owners.
5. S-F Gates: three HumanGateStatus blocks ("Separation defect ticket — awaiting CIO triage", "Distributor notice (corrected remit-to) — awaiting Regional GM UK-EU approval · not sent", "Dunning pause on disputed invoices — CFO decision"); any send-type button aria-disabled with the owner named in its tooltip.
6. S-D Topic stack + DetailPanel "Invoice entity mismatch" (big "142", grid incl. "Value £0.46m" + chip, LiSN INSIGHT, "RECOMMENDED ACTION — awaiting CIO triage", PHRASINGS); S-E defect vs communicated split bar with counts 118 / 180 and caption.
7. S-G EnhancedPanel "Why invoices go into dispute" (badge "Joined with AR & invoice data", StatStrip, StuckDriverBars, AgedCaseWatchlist "Aged disputes"); S-H legacy residue watchlist + gate "Evidence-preservation request — awaiting Legal".

Done when: exec monitor card 5 and Pulse 2 open this page; three cutovers read "Clean vs control"; no USD+GBP sum exists; every gate names an owner and nothing can be sent.
```

**Acceptance / pitfalls:** as Step 17; check the `£` glyph renders in the mono font.

**→ Checkpoint 3 (10:00).**

---

### Step 19 — P1 extras (only if ahead; 30 min box)

```text
Agent mode. Step 19 — P1 extras. Do them in this order; stop when the box ends.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§1.4 filters, §3.12 P1 interaction, §3.14 lifecycle, §6 panel stagger and chip pulse, §6.1 intro, §8.1 P1 list) @src/mock/kgs/data/installedBase.json @src/mock/kgs/data/monitor.json @src/mock/kgs/data/meta.json

1. P-J interactive: clicking a bar selects it (2px white outline) and crossfades the DetailPanel (150ms) to that bar's detail; × closes the panel and the chart expands.
2. P-L Lifecycle stage table on /installed-base: caps title "WHERE DOES IT SURFACE? — SIGNAL CONCENTRATION BY LIFECYCLE STAGE", rows from lifecycle, "Signals" column number + ▲ marker.
3. Functional Brand / Region filters in the ContextBar: re-scope monitor cards and wall cards by their joinTags (BRAND / REGION); empty tiles show EmptyScope; counts never recomputed — hidden cards simply disappear.
4. Panel stagger (40ms, max 8, fade-up 6px) and a single chip pulse on "5 ABOVE THRESHOLD" and "New phrasing".
5. Intro (≤1.5s, once per load, skipped by ?intro=0 or any click): skeletons + mono meta.demo.introLine counting up, then introLine2, then tagline.
```

---

### Step 20 — P2: Ask LiSN panel + presenter shortcuts (45 min; after 10h or next morning)

```text
Agent mode. Step 20 — P2: Ask LiSN canned panel, presenter shortcuts, talk-track stepper.

Context: @.cursor/rules/kgs-demo.mdc @docs/kgs-brief/04_UX_Screens_Copy_Transitions.md (§2.10, §6.2) @src/mock/kgs/data/askLisn.json @src/components/kgs/shell/FloatingAIButton.tsx @src/components/kgs/signal/EvidenceDrawer.tsx @src/components/kgs/shell/DemoProvider.tsx

1. FloatingAIButton opens a 420px panel: header "Ask LiSN" + sub "Answers cite the interactions behind them. LiSN drafts; people decide." + SyntheticBadge small. Three canned question buttons from askLisn.json; clicking shows the answer (through useLabel) after a 400ms typing shimmer, with citation chips: a route cite navigates; an evidenceId cite opens the EvidenceDrawer on Snippets scrolled to that snippet. No free-text input (a disabled field reading "Canned questions in this demo" is fine).
2. Presenter shortcuts (global keydown; ignored when focus is in an input): A anonymise · E evidence drawer (on the hero) · P view draft · V toggle Viewing as · 0 / 1 / 2 / 3 routes (/, /installed-base, /channel, /separation) · H hero · Shift+R reset · Esc close · → / ← talk-track steps.
3. Talk-track stepper: the 11 steps in 04 §6.2 as an array of { route, anchor?, action? }; → goes to the next step (navigate, scroll, open drawer, switch Viewing as), ← goes back. Show a tiny step indicator "Step 4 / 11" in the DemoMenu only, never on the main canvas.
```

---

## 4. Checkpoints and cut-lines

### 4.1 What "demo-ready" means

| Checkpoint | Demo-ready means | If you had to present now |
|---|---|---|
| **4h** (end of Step 8) | `/` complete: shell, badge, footer, anonymise, funnel + suppressed popover, brief, pulse, three question cards with counts and What's counted, applied value strip + How we count, Field Signal Monitor 5 + suppressed card, governed tile + modal, evidence readiness. All numbers from JSON, sweep clean. | Exec overview only; hero link lands on a headline page. Not enough — keep going. |
| **7h** (mid Step 13) | The **full hero story end to end**: `/` → Pulse 1 or monitor card 1 → hero (headline, metric line, severity strip, lineage chart with markers, chips, counter-evidence, confidence, joins, cohort, P&L, owner) → "Evidence · 23" drawer (4 tabs, live audit line) → "View draft" modal → Viewing as VP Engineering → Approve (live timestamp on gate, audit, toast) → back to `/` shows the knock-ons → Reset. `/installed-base` exists with at least the KPI row and the Signal Wall. | **This is the minimum shippable demo.** Moments 1–4 of 01 §6.1 are covered. |
| **10h** (end of Step 18) | Q1 complete (P-0 to P-K, P-J static), motion pass done, QA §5 passed, deployed to the new Vercel project; Q2 and Q3 at least KPI row + Signal Wall + Diagnosis + one detail panel each, and every exec link lands on something real. | Full P0 + P1. Moment 5 covered. |

### 4.2 If behind — drop in this order (first line goes first)

| # | Drop | Fallback |
|---|---|---|
| 1 | All P2: Ask LiSN panel, shortcuts, stepper, global role switcher, `/signal/:id`, v2 teaser | FloatingAIButton keeps its tooltip and one-line popover |
| 2 | P1 extras (Step 19): bar interaction, lifecycle table, live filters, intro, stagger, chip pulse | Static detail panel; filters open but do nothing |
| 3 | Q3 then Q2 detail panels | **Thin drill**: KPI row + Signal Wall + DiagnosisBox (+ the three gates on Q3). Monitor card links point to the page top instead of anchors. |
| 4 | Q1 secondary panels: P-B, P-E, P-F, P-K | Keep P-0, P-A, P-C, P-G, P-D, P-H/P-I, P-J. If P-D goes, retarget monitor card 2 to `/installed-base`. If P-H goes, retarget the evidence-readiness tile. |
| 5 | HowWeCountDrawer, AV-1 and AV-3 popovers | Method text in tooltips on each tile |
| 6 | Count-ups, chart draw-in, gauge growth | Static values; keep route fade, drawer slide and the approval morph |
| 7 | Draft modal sections 2–4 | Keep Summary, Candidate causes (with "candidate, not cause") and Requested decision; the modal itself stays |
| 8 | Drawer Cohort and Method tabs as rich layouts | Plain text blocks; keep all four tabs and the audit list with live entries |

**Never drop:** the exec overview · the hero double-click (monitor card 1 / Pulse 1 / Q1 wall card 1 → hero) · the approval moment (Viewing as, Approve with live timestamp, toast, audit line, knock-on to Pulse and monitor card) · the evidence drawer (featured snippets, linked RMAs, audit) · the synthetic badge and footer. Also keep, because they are quick to keep and contractual: the anonymise toggle, severity words on every chip, and the absence of any enabled send/notify control.

---

## 5. QA and rehearsal checklist

### 5.1 Automated checks (run from the repo root)

```bash
# 1. Retired / banned strings in KGS source and data (review hits; identifiers are fine, visible strings are not)
rg -n -i "FCI|conversation ai|risk spike|summary wall|real-time|\bLive\b|HSHF|HSLF|LSHF|LSLF|cardholder|credit card|head of cards|chargeback|\bMCC\b|merchant|\bEMI\b|CSAT|\bNPS\b|sentiment|churn|customer journey|hashtag|click for details|root cause|resolv|predict|\bindex\b|health score|\bpts\b|cheap|300K|crossed a threshold this week|LisN|Lisn|LISN" src/components/kgs "src/app/(kgs)" src/mock/kgs/data

# 2. Exclamation marks in visible text (JSX text nodes and JSON strings)
rg -n --glob '*.tsx' '>[^<{]*![^<{]*<' src/components/kgs "src/app/(kgs)"
rg -n '": "[^"]*!' src/mock/kgs/data

# 3. Hard-coded numbers in JSX text (every hit must be justified or moved to JSON)
rg -n --glob '*.tsx' '>[^<{]*[0-9][^<{]*<' src/components/kgs "src/app/(kgs)"

# 4. US spellings in strings
rg -n -i "['\">][^'\"<]*(organiz|prioritiz|analyz|anonymiz|behavior|favor|color:)" src/components/kgs "src/app/(kgs)" src/mock/kgs/data

# 5. Type-check, lint, production build (catches Suspense / hydration issues)
npx tsc --noEmit && npm run lint && npm run build
```

Anonymise leak check — paste into the browser console on every route with Anonymise ON (and with the drawer, modal and popovers open once):

```js
(() => {
  const named = ['Edwards','Kidde Commercial','Aritech','EMS','GST','AirSense','EST4','EST3','Edge','iO','Evolve','VM/VS','2X','FireCell','SmartCell','ModuLaser','ESD-','DIST-','DLR-','US-SE','US-SW','US-NE','US-MW','US-W','Canada','UK-EU','Florida','Texas','Ontario','Georgia','Arizona','Alabama','Houston','Kidde FX','KESMobile','ConnectedSafety+'];
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const text = [document.title, document.body.innerText,
    ...[...document.querySelectorAll('svg text, svg tspan')].map(n => n.textContent),
    ...[...document.querySelectorAll('[title],[aria-label]')].map(n => `${n.getAttribute('title')||''} ${n.getAttribute('aria-label')||''}`)
  ].join('\n');
  const hits = named.filter(w => new RegExp(`(^|[^A-Za-z0-9])${esc(w)}`).test(text));
  console.log(hits.length ? ['LEAKS', hits] : 'Anonymise clean on ' + location.pathname);
})();
```
Accepted exception (05a §6.8): the Region filter option values ("NA", "UK-EU") inside the closed ContextBar menu. If the menu is open during the check, close it and re-run.

### 5.2 Manual checklist

| # | Check | Pass when |
|---|---|---|
| 1 | Visual parity with the bank demo | Side by side with each reference PNG at 1280px: same rail width, header height, panel radius/borders, card rhythm, chart styling. KGS content, bank look. |
| 2 | Widths 1280 / 1440 / 1920 | No horizontal page scroll (the monitor strip scrolls on its own); exec cards do not truncate titles; the hero right column does not squeeze below ~320px. |
| 3 | Projector / screen-share legibility | Present at 1440–1920 with browser zoom 110–125%; share to a second device over Zoom/Teams at 720p and read: micro text (11px), K/I bar, severity chips, chart markers, the badge. |
| 4 | Anonymise on/off sweep | Leak check clean on `/`, `/installed-base`, hero (with drawer + modal open), `/channel`, `/separation`; chip + watermark visible; governed tile identical in both modes; `?anon=1` loads ON; print preview anonymised. |
| 5 | Badge and footer | Visible on every route, above the drawer and every modal backdrop. |
| 6 | Signal contract | Every monitor card, wall card, detail panel and the hero shows severity class + word + type + blast radius + incident, K/I confidence, join tags, P&L, owner, gate. |
| 7 | Human gate | No enabled Send/Notify/Auto/Export anywhere; Approve locked as President with tooltip on hover and keyboard focus; the approval timestamp is identical on gate, audit, toast and draft chip. |
| 8 | Money | Every $/£ followed by ILLUSTRATIVE; AV-4 three separate lines; no $ + £ anywhere; no revenue, savings or ROI. |
| 9 | No console errors | Each route with DevTools open: zero errors, zero hydration warnings, zero "unknown token" warnings; dev checks from `checks.ts` pass. |
| 10 | Fast load | `npm run build` succeeds; production build first load of `/` feels instant on a normal connection (Lighthouse performance ≥ 85 on desktop); no remote images; fonts via the repo's loader (next/font self-hosts). |
| 11 | Reset works | Approve + request decision + anonymise ON + drawer open → DemoMenu "Reset demo" → back on `/`, everything default, toast "Demo reset". Reload also resets. |
| 12 | Every number traces to JSON | Pick 10 random numbers across screens and find each in `src/mock/kgs/data/*.json` with a text search. Hard-coded-number grep (§5.1 #3) has no unexplained hits. |
| 13 | Links | Every exec link lands: Pulse 1/2/3, three cards, five monitor cards, evidence readiness → `#why-late`, rail Lock → `#governed-watch`, `/signals/A1` redirect. |
| 14 | Copy | 04 §8.3 QA list passes; British spelling; "LiSN" everywhere; "above threshold this week". |

### 5.3 Rehearsal (30 min, with Ranjith if possible)
1. Run the 11 talk-track steps in 04 §6.2 twice: once named, once anonymised. Time each step; any place you wait on an animation is a bug.
2. Practise the approval moment three times: President (locked, tooltip) → "Ask VP Engineering for a decision" → switch Viewing as → Approve → read the timestamp aloud from the toast → back to `/` and point at Pulse 1 and monitor card 1.
3. Practise recovery: Reset from the DemoMenu mid-flow; a hard reload; opening the hero directly by URL.
4. Screen-share once to another device and read the smallest text on the hero from there.
5. Keep a second browser tab on the production URL with `?anon=1` ready, in case a screenshot is requested live.

---

## 6. Deploy

| Item | Do |
|---|---|
| Project | The separate Vercel project from §1.6, neutral name (e.g. `lisn-cf-demo`), Production Branch `kgs-commercial-fire`. Never deploy KGS under the bank's project. |
| URL / custom path | Add a neutral alias under Project → Domains, e.g. `lisn-cf-<6 random chars>.vercel.app` — no client, bank or "kgs"/"kidde" in the hostname. Optional extra obscurity: Next `basePath: '/v/<random>'` via an env var — only if you have 20 minutes to re-test every link and the `/signals/A1` redirect afterwards. |
| Access | You present from your own logged-in browser. For anything shared: use Vercel's password protection or shareable-link feature if your plan has it; otherwise add a tiny `middleware.ts` Basic Auth gate reading `DEMO_BASIC_AUTH` (`user:pass`) from env and skipping when the variable is empty. Turn it on before a link leaves your hands. |
| Old deployments | Every deployment keeps its own immutable URL. Keep Standard Deployment Protection on so old deployment URLs are not public; delete deployments you no longer need after the call. |
| No indexing | `src/app/robots.ts` → `{ rules: { userAgent: '*', disallow: '/' } }`; root metadata `robots: { index: false, follow: false }`; `next.config` `headers()` adds `X-Robots-Tag: noindex, nofollow, noarchive` on `/:path*`; no sitemap. |
| No analytics | Remove `<Analytics />`, `<SpeedInsights />`, GA/GTM, Hotjar, Sentry replay or any third-party script from the KGS layout (REPO_MAP §1 lists them); switch off Web Analytics and Speed Insights in the new project. In DevTools → Network, only same-origin requests should appear. No console logging of names. |
| Link unfurls | Root metadata: title via `fmt()` (neutral when anonymised), `openGraph` title "LiSN demo", neutral description, **no OG image**; replace the bank favicon with a plain "Li" monogram. Pasting the link into WhatsApp/Slack/email then shows nothing client-specific. |
| Share-link hygiene | Share only the anonymised link (`…/?anon=1`) or, better, a second alias built with `NEXT_PUBLIC_FORCE_ANON=1` that locks anonymise ON and hides the toggle (15 min if wanted). Never share the named link in writing. Do not put client names in the URL, branch alias or deployment name. After the call, rotate the password or remove the alias. |
| Pre-flight | Open the production URL in a private window on another device (not logged into Vercel): badge visible, footer visible, no console errors, robots header present (`curl -I <url>` shows `x-robots-tag: noindex…`). |

---

## 7. If the existing repo differs

| Situation | Adaptation |
|---|---|
| **Next.js Pages Router** | Routes become `pages/index.tsx`, `pages/installed-base/index.tsx`, `pages/installed-base/signal/fw-4-1.tsx`, `pages/channel.tsx`, `pages/separation.tsx`; the KGS shell and DemoProvider go in `pages/_app.tsx` (branch-only, so replace the bank's). `_bank_ref` does not work under `pages/` — delete bank pages on the branch instead (they live on `main`). `useRouter().query.anon` replaces `useSearchParams`. Redirect via `next.config` `redirects()`. |
| **Vite / CRA + react-router** | Routes in the router config; DemoProvider wraps `<RouterProvider>`. `/signals/A1` → `<Navigate replace />`. Robots: `public/robots.txt` + `vercel.json` headers for `X-Robots-Tag`. `process.env.NODE_ENV` checks → `import.meta.env.DEV`. |
| **`output: 'export'` (static export)** | `next.config` redirects are ignored: make `/signals/A1` a tiny client page that calls `router.replace`. Headers come from `vercel.json`. |
| **No Tailwind** (CSS modules, styled-components, MUI) | Map 03 §2 tokens to the repo's variables or theme once in a `kgs-tokens` file; keep class-level fidelity by copying the bank component's styles. Do not introduce Tailwind. |
| **Chart library is not Recharts** | Chart.js: annotation plugin for markers; range fill via `fill: '-1'` between low/high datasets; second y-axis for the RMA %. ApexCharts: `annotations.xaxis` for markers, `rangeArea` for the ribbon. Nivo/visx: custom layers for markers and the future zone. Keep the rules: numeric x-axis, markers at fractional weeks, RMA % on its own axis, strokes ≥ 2px. |
| **No animation library** | CSS only: `transition` for hover and crossfades, `@keyframes` for the drawer slide and the ping (iteration count 2), a small rAF CountUp. Do not add framer-motion. |
| **Icons are not lucide** | Use the repo's set; keep the meaning (activity, chip/cpu, handshake, split, lock, flask, link). Do not add a second icon library; draw the Cliff step glyph as a 16px inline SVG if needed. |
| **Radix / shadcn present** | Use its Popover, Tooltip, Dialog (modal), Sheet (drawer), Tabs, Switch, ToggleGroup ("Viewing as") and its toast (often Sonner). Keep 03's visual tokens on top. |
| **JavaScript, not TypeScript** | Keep `types.ts` as documentation; use JSDoc `@typedef` imports, or enable `allowJs` + `checkJs` if TS tooling already exists. JSON imports need no config in most bundlers. |
| **State already in Redux / Zustand** | Put the demo state in a new, separate slice/store `kgsDemo`; same actions and the same "capture ts once" rule. No persistence middleware on it. |
| **Bank components are monolithic** (one big page file) | Fork by extracting: copy the JSX block for each 03 component into its own KGS file; do not refactor the bank file. |
| **Helper names differ from what you expect** | The mock's names are fixed: `fmt` (whole string) and `label` (one key) in `lib/label.ts`; `DemoProvider` / `useDemo` / `useLabel` in `lib/demoState.ts`. Use them as-is; never alias `fmt` to `label`. |
| **Brand fonts missing** (no Outfit / JetBrains Mono) | Use what the bank demo renders with; do not add fonts on demo day. |

---

*All figures in this plan are the synthetic scenario from 02/05a. Nothing here is a finding about any KGS product.*
