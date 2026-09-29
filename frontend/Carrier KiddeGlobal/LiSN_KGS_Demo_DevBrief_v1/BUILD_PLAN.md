# BUILD_PLAN — KGS President dashboard inside `/role-based` (Pass 1)

**Written:** 29 Sep 2026. **Adapts:** `06_Cursor_Build_Plan.md` v1.1 to this repo.
**Reads with:** `CONTEXT_DIGEST.md`, `REPO_MAP.md`, 03, 04 and 05a.

**Decisions on open items.** The decisions line in the Pass 1 prompt was left as the template placeholder, so this plan uses **the pack defaults** (CONTEXT_DIGEST §8). The only defaults that change the build are named in §6. Everything else is talk-track or after-call material.

---

## 1. Shape of the build

### Entry point

| Item | Value |
|---|---|
| Path | `/role-based` → "Kidde Global" → "President" |
| Deep link | `/role-based/kidde_global/president_commercial_fire` (`?anon=1`, `?intro=0`) |

### Registry entries

**Industry card:**

| Field | Value |
|---|---|
| id | `kidde_global` |
| name | "Kidde Global" |
| desc | "Global Commercial Fire — field signals, installed base & channel" |

- The industry does not exist on this checkout (REPO_MAP §2), so it is created.
- The id constant goes in a new `lib/role-based-dashboard/kiddeGlobalIndustry.ts`, the same pattern as `hdfcBankIndustry.ts`, to avoid circular imports.

**Persona card:**

| Field | Value |
|---|---|
| id | `president_commercial_fire` |
| name | "President" |
| sub | "Global Commercial Fire · field signals · installed base · channel" |

- There is no Head of CX placeholder to keep; it was removed in `215d391`. President is the only role.

### Dispatch

- **Branch.** A branch in `RoleDashboardView.tsx` renders `<KgsCommercialFireDashboard onExit={onExit} />` for `industry.id === KIDDE_GLOBAL_INDUSTRY_ID && role.id === KIDDE_GLOBAL_PRESIDENT_ROLE_ID`.
- **Placement.** It goes first in the if-chain, directly after the hooks (`:4543-4555`), so it precedes every other branch. No Kidde placeholder branch exists today.
- **Props.** The `theme` and `unifiedNavigation` props are ignored.

### Views, not routes

The component holds `view` in state:

| 04 route | View id |
|---|---|
| `/` | `overview` |
| `/installed-base` | `installed-base` |
| `/installed-base/signal/fw-4-1` | `signal/fw-4-1` |
| `/channel` | `channel` |
| `/separation` | `separation` |

- `/signals/A1` becomes an alias that opens `signal/fw-4-1`.
- **Anchors are kept as element ids:** `#field-signal-monitor`, `#governed-watch`, `#date-code`, `#why-late`, `#esd-se-07`, `#backorder`.
  - `navigate(view, anchor?)` sets the view, then calls `scrollIntoView` on the anchor after paint.
  - Each anchor has a scroll margin that clears the sticky ContextBar.
- **Breadcrumbs** come from `meta.breadcrumbs` exactly as the mock has them, keyed by view instead of route.

### Data and state

- **Mock data** is copied to `lib/role-based-dashboard/kgs/`, with the alias `"@kgs/*": ["./lib/role-based-dashboard/kgs/*"]`.
  - Copied: `types.ts`, `data/*.json` (all 9), `lib/{label,demoState,values,data}.ts`, `README_mock.md`.
  - Not copied: the `.py` files and `check_report.txt`, which are dev-only; they stay in the KB.
- **Components** go in `components/role-based-dashboard/kgs/{shell,shared,exec,signal,drill}/`, plus `kgs/KgsCommercialFireDashboard.tsx`.
- **DemoProvider** mounts inside `KgsCommercialFireDashboard`.
  - `?anon=1` and `?intro=0` are read **once in a `useEffect`**, never during render.
  - State is in memory only. Leaving the role (`onExit`), a reload and "Reset demo" all reset it.
- **Bank components are never edited.** Each reused one is copied into the kgs folder, exported, typed and rebound to `@kgs` data (REPO_MAP §3 gives the source `file:line`).

### Existing files this build changes

Only four:

- `tsconfig.json`: add the alias; add `"Carrier KiddeGlobal"` to `exclude`.
- `lib/role-based-dashboard/registry.tsx`: import the ids, add the industry entry, re-export the ids.
- `components/role-based-dashboard/RoleDashboardView.tsx`: add one import and one branch.
- `lib/role-based-dashboard/kiddeGlobalIndustry.ts`: a new file.

Everything else is new under the two `kgs/` folders.

---

## 2. Passes and steps

Steps are 06 §3's. Timings are 06's.

### Pass 2 — Foundation: data, entry point, fork, shell (06 Steps 2–4, ≈75 min)

**Step 2 — Data layer, demo state, view skeleton**

- **Files:**
  - `tsconfig.json`;
  - `lib/role-based-dashboard/kgs/**` (the copied mock, plus a new `checks.ts`);
  - `lib/role-based-dashboard/kiddeGlobalIndustry.ts`;
  - `lib/role-based-dashboard/registry.tsx`;
  - `components/role-based-dashboard/RoleDashboardView.tsx`;
  - `components/role-based-dashboard/kgs/KgsCommercialFireDashboard.tsx`;
  - `kgs/shell/DemoProvider.tsx` (a thin re-export).
- **Changes to the copied mock libs:**
  - `demoState.ts`: initial `anonymise: false`, and a `setAnonymise` applied from the effect (hydration fix); correct the header import path.
  - Tokenise the raw names (CONTEXT_DIGEST §9 Q1, default yes); every changed string is listed in the commit.
- **Acceptance:**
  - The grid shows "Kidde Global"; its role page shows "President"; clicking it renders the dashboard.
  - All five views render their H1 from JSON through `useLabel`.
  - The `/signals/A1` alias works.
  - `checks.ts` asserts are clean in dev.
  - Toggling anonymise turns the hero H1 into "Panel platform A · firmware A.4.1 (synthetic) — …".
  - `npx tsc --noEmit` passes.

**Step 3 — Fork components and sweep bank terms**

- **Files:** `components/role-based-dashboard/kgs/**`, copies only, taken from HCD, V3D and SPD at the lines in REPO_MAP §3.
- **Acceptance:**
  - The 06 §5.1 sweep over `kgs/**` returns zero visible hits.
  - Text is ≥11px.
  - No `uppercase` on "LiSN".
  - No ellipsis on titles.
  - tsc passes.

**Step 4 — Shell**

- **Files:** `kgs/shell/{LeftRail,DrillHeader,ContextBar,SyntheticBadge,AnonymiseToggle,Watermark,FixedFooter,DemoMenu,FloatingAIButton,BackToOverviewHeader,Toast}.tsx` and `KgsCommercialFireDashboard.tsx`.
- **Behaviour:**
  - The rail "Back" item calls `onExit`.
  - "Reset demo" returns to `overview`.
  - `document.title` is set from `meta.title` via `fmt`, and restored on unmount.
  - A `beforeprint` / `afterprint` pair forces anonymise.
- **Acceptance:** every view shows the rail, header, sticky ContextBar with badge, and the footer. The 06 Step 4 checks apply.

### Pass 3 — Exec overview (06 Steps 5–8, ≈140 min) → **Checkpoint 1: exec overview demo-ready**

**Step 5 — Signal primitives**

- **Files:** `kgs/shared/{SeverityChip,DomainChip,SeverityStrip,ConfidenceMarker,JoinTagRow,PnLDestinationTag,IllustrativeChip,RoutedOwner,GateChip,EmptyScope}.tsx` and `kgs/shared/tokens.ts` (03 §2 tokens as an inline-style object; **no Tailwind config change**).
- **Acceptance:** 06 Step 5.

**Step 6 — Exec A**

- **Files:** `kgs/exec/{FunnelStrip,ExecBriefBar,PulseStrip,QuestionCard,WhatsCountedPopover,AreaTrend,SemiGauge,MiniKPI,InsightBox}.tsx` and `kgs/views/OverviewView.tsx`.
- **Acceptance:** 06 Step 6 — 2 / 2 / 1; 0 / +1 / 0; gauges 98/80, 99.8/71, 75/8.

**Step 7 — Exec B (Field Signal Monitor)**

- **Files:** `kgs/exec/{SectionHeader,SignalMonitorCard,MetricBeforeAfter,RecommendationBox,SuppressedEndCard,FieldSignalMonitor,DateCodeMicroStrip}.tsx` and `OverviewView.tsx`.
- **Acceptance:** 06 Step 7.

**Step 8 — Exec C (watch, readiness, value)**

- **Files:** `kgs/exec/{AppliedValueStrip,HowWeCountDrawer,GovernedWatchTile,ClockRing,EvidenceReadinessTile}.tsx`, `kgs/shared/{Drawer,Modal,Popover}.tsx` (Radix Dialog/Tooltip plus a small popover; no new package), and `OverviewView.tsx`.
- **Acceptance:** 06 Step 8.

### Pass 4 — Hero and Q1 (06 Steps 9–14, ≈255 min) → **Checkpoint 2 after Step 12: the full hero story, the minimum shippable demo**

**Step 9 — Hero layout and lineage chart**

- **Files:** `kgs/views/SignalFw41View.tsx` and `kgs/signal/{SignalHeader,RankChip,WhyRankedPopover,FirmwareLineageChart,SignalChips,CounterEvidence,CohortMiniTable,RecommendedAction}.tsx`.
- **Chart:** Recharts with a numeric x-axis [1, 28.5] and a hidden second y-axis [0, 0.7].

**Step 10 — Decision panel**

- **Files:** `kgs/signal/DecisionPanel.tsx`, `kgs/shared/{HumanGateStatus,ApproveButton}.tsx` (`aria-disabled`), and read-only state hooks in Pulse, the monitor card and AV-3.

**Step 11 — Evidence drawer**

- **Files:** `kgs/signal/{EvidenceDrawer,SnippetCard,LinkedRmaList,CohortTab,MethodAuditTab}.tsx`.

**Step 12 — Draft modal**

- **Files:** `kgs/signal/DraftPreviewModal.tsx`.

**Step 13 — Q1 A**

- **Files:** `kgs/views/InstalledBaseView.tsx` and `kgs/drill/{Panel,KpiTile,SegmentTable,StackedRatioBar,LineMonitor,SignalWall,WallCard,WallFooterCounts,Watchlist}.tsx`.

**Step 14 — Q1 B**

- **Files:** `kgs/drill/{DateCodeHeatStrip,EmergingPhrasingTable,ContactsRmaOverlay,EnhancedPanel,StuckDriverBars,AgedCaseWatchlist,DiagnosisBox,StackedBarWithDetailPanel,DetailPanel}.tsx`.
- **Anchors:** `#date-code` and `#why-late` work through `navigate()`.

**Acceptance for Steps 9–14:** 06 Steps 9–14, and the full approval flow in 08 §5.1.

### Pass 5 — Motion, P1, QA (06 Steps 15–19, ≈135 min) → **Checkpoint 3: P0 + P1**

**Step 15 — Motion**

- **Files:** `kgs/shared/{CountUp,Motion}.tsx` (framer-motion, already installed), plus the components it touches.

**Step 16 — P0 QA sweep**

- The 06 §5.1 greps over `kgs/**`.
- `npx tsc --noEmit && npm run lint && npm run build`.
- The 08 §5.3 and §5.4 console snippets.
- Write `QA_REPORT.md` in the pack folder.
- Preview deploy only if you ask (see §4, D12).

**Step 17 — Q2 channel**

- **Files:** `kgs/views/ChannelView.tsx`, reusing the drill components.
- **Anchors:** `#esd-se-07` and `#backorder`.

**Step 18 — Q3 separation**

- **Files:** `kgs/views/SeparationView.tsx`, reusing the drill components.

**Step 19 — P1 extras, only if ahead**

- P-J bar interaction, the lifecycle table, live filters, and the intro (`?intro=0` skips it).

**Also in this pass:** write `DRIVER_NOTES.md` covering deep link, reset, recovery, and the known mock quirks from CONTEXT_DIGEST §5.4.

**Out of scope unless asked:** 06 Step 20 (P2: Ask LiSN panel, shortcuts, global role switch, `/signal/:id`, v2 teaser).

**Cut-lines:** 06 §4.2 unchanged.

**Never drop:**
- the exec overview;
- the hero double-click;
- the approval moment;
- the evidence drawer;
- the badge and footer;
- the anonymise toggle;
- severity words;
- the absence of any send control.

---

## 3. Rules carried from 06 §2

These stay unchanged apart from the paths.

- **Order of truth:**
  1. `@kgs/data/*.json` + `@kgs/lib/values`
  2. 04 (02 owns value figures and exec copy)
  3. 03 visuals (the repo's actual styling wins)
  4. 05a / `types.ts`
  5. REPO_MAP
- **Data:**
  - No figure is typed into JSX.
  - Every data string goes through `useLabel()`; role fields go through `roleLabel`.
  - Timestamps come only from `approve()` / `requestDecision()`.
  - Money is shown as its display text plus `<IllustrativeChip />`.
  - $ and £ are never summed.
- **Stack:**
  - No new UI kit, chart library, state library, font or icon set.
  - No fetch, backend or env data.
  - No localStorage, sessionStorage or cookies.
- **House style and the 7 non-negotiables:** as in 06 §2. The retired-string list applies to every visible string in `kgs/**`.

---

## 4. Deviations from 06, and why

| # | 06 says | This plan does | Why |
|---|---|---|---|
| D1 | New branch `kgs-commercial-fire` with its own Vercel project; tag the bank demo first | Build inside this repo as a role in `/role-based`; nothing to tag | Your instruction. The bank demo is untouched because no bank file changes. Commits happen only when you ask; a feature branch is recommended over committing to `main` |
| D2 | Root App Router routes under `src/app/(kgs)/` plus a `/signals/A1` redirect in `next.config` | Five in-component views held in state; `/signals/A1` becomes an in-component alias; no `next.config` change | Your instruction. The dashboard is one role inside `[industryId]/[roleId]` |
| D3 | Deep URLs for recovery (08 §5.9: reload `/installed-base/signal/fw-4-1?intro=0`) | Recovery path: reload the role URL → rail → Q1 → hero, or DemoMenu "Reset demo" then click through | No per-view URLs, and only `?anon` / `?intro` are read. The browser Back button leaves the dashboard for the role list, so the rail "Back" and "Back to installed base" do in-app navigation |
| D4 | Mock at `src/mock/kgs/`, alias `@kgs/*` → `src/mock/kgs/*` | `lib/role-based-dashboard/kgs/`, alias `@kgs/*` → `./lib/role-based-dashboard/kgs/*` | KB rule. This repo has no `src/` |
| D5 | Copy `.py` files and `check_report.txt` along with the mock | Not copied; they stay in the KB | Dev-only. Biome and tsc must not pick them up |
| D6 | Components in `src/components/kgs/…` | `components/role-based-dashboard/kgs/…`, plus a `views/` folder for the five screens | Repo layout; page files are replaced by view components |
| D7 | DemoProvider in `src/app/(kgs)/layout.tsx`, so state survives navigation | DemoProvider inside `KgsCommercialFireDashboard` | Views switch in-component, so state already survives. `onExit` unmounts it, which equals a reset |
| D8 | The mock `demoState.ts` is used as-is ("read, do not recreate") | The **copied** `demoState.ts` initialises `anonymise` to false; the dashboard applies `?anon=1` / `?intro=0` once in a `useEffect` | The role page is server-rendered; reading `window` in initial state risks a hydration mismatch (06 Step 2 pitfall; REVIEW_NOTES §4.3) |
| D9 | Extend `tailwind.config` with 03 tokens; map tokens to Tailwind classes | One `kgs/shared/tokens.ts` inline-style token object; no Tailwind config change | The bank demo is inline-styled (REPO_MAP R1). "Fork, don't restyle" means keeping its styling method |
| D10 | Copy the brief to `docs/kgs-brief/`; create `.cursor/rules/kgs-demo.mdc` and `.cursorignore` | Neither is done. The KB stays where it is; 06 §2 rules are applied from this plan and `AGENTS.md` | KB rule (reference only, never imported). This is a Claude Code build, not Cursor |
| D11 | Move bank pages to `src/app/_bank_ref/`; check that old bank routes 404 | Nothing is moved; the check is dropped | The bank demo keeps running alongside |
| D12 | §6 deploy: neutral alias, Basic Auth, noindex, no analytics, OG title "LiSN demo", "Li" favicon | Not done in Passes 2–5 | App-wide and outward-facing. Waiting on CONTEXT_DIGEST §9 Q3 (shared vs separate deploy). The root layout's "Yaaralabs.ai" title is overridden client-side only while the dashboard is mounted |
| D13 | `document.title` via `fmt` on routes | Set in a `useEffect` in the dashboard and restored on unmount | No route metadata per view |
| D14 | — | Add `"Carrier KiddeGlobal"` to `tsconfig.json` `exclude` (and a Biome ignore if needed) | `include: **/*.ts` already type-checks the KB's `mock/*.ts` (REPO_MAP R3). A KB-side error must never break the app build, and the KB cannot be edited |
| D15 | "Do not rewrite `src/mock/kgs/data/*.json` except to add a missing FIXED field" | Also tokenise raw brand, platform and region names in fixed strings in the **copy** (default; CONTEXT_DIGEST §9 Q1). Text in named mode is unchanged | Without this, Anonymise leaks "EST4" / "UK-EU" (08 §5.4 fails) |
| D16 | Step 2 `checks.ts` called from the (kgs) layout | `lib/role-based-dashboard/kgs/checks.ts`, called once from the dashboard in development only | No layout |
| D17 | Presenter opens `/?intro=0` in a guest window | Opens `/role-based/kidde_global/president_commercial_fire?intro=0` directly, skipping the multi-client grid | Keeps other clients' names off the shared screen (REPO_MAP R8) |
| D18 | Fonts per the repo | Outfit / JetBrains Mono load from Google at runtime | The offline local-build fallback in 08 §5.9 will render system fonts unless self-hosted. Noted in DRIVER_NOTES; no new asset without asking |
| D19 | Commit after every step "kgs: step N — <name>" and push for a preview | Same message format, but only when you ask for a commit; no push without asking | Session rule: commit and push only on request |
