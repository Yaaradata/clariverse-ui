# REPO_MAP — clariverse-ui `frontend/` (Pass 1, 06 Step 1)

**Written:** 29 Sep 2026 · **Branch:** `main` @ `0c5f097` · **Scope:** read-only survey; no source file was changed.

All paths are relative to `frontend/`. The format is `file:line`.

---

## 1. Stack

| Item | Finding |
|---|---|
| Framework | Next.js **16.0.10**, **App Router** (`app/`), React **19.1.0**, TypeScript 5 (`strict: true`) |
| Dev / build | `next dev --turbopack` · `next build` · `next start` |
| Lint / format | Biome 2.2.0: `npm run lint` = `biome check` |
| Typecheck | No script. Use `npx tsc --noEmit` |
| Package manager | npm per the brief. Both `package-lock.json` and `pnpm-lock.yaml` exist |
| Styling | Tailwind **v4** (`@import "tailwindcss"` in `app/globals.css:1`), plus a v3-style `tailwind.config.js` with shadcn-style CSS-variable colours. **The bank demo does not use Tailwind classes.** It styles with inline `style={{}}` objects and a theme-token object (`DashboardThemeContext`, `HEAD_CREDIT_CARDS_DEFAULT_THEME` at `components/role-based-dashboard/HeadOfCreditCardsDashboard.tsx:44`) |
| Fonts | Outfit + JetBrains Mono, loaded **at runtime from Google Fonts** by an `@import` inside `components/role-based-dashboard/RoleBasedChrome.tsx:40`. Exposed as `var(--font)` / `var(--mono)`. The root layout also loads Inter via `next/font` (`app/layout.tsx:7`) |
| Charts | Recharts **3.2.1** (used by the bank demo). Also installed: chart.js, highcharts, plotly, d3 |
| Icons | lucide-react 0.544 |
| Animation | framer-motion 12.23. The bank components use CSS transitions only. GSAP is also installed |
| UI primitives | Radix `react-dialog`, `react-tabs`, `react-tooltip`, `react-switch`, `react-label`, `react-progress`. **No** Radix Popover, ToggleGroup or toast package (no sonner) |
| State | Local `useState`. zustand and react-query are installed but not used by the bank demo |
| Path alias | `@/*` → `./*` (`tsconfig.json:26-29`). `resolveJsonModule: true` is already set |
| `tsconfig` include | `**/*.ts(x)`. **This also type-checks the KB's `Carrier KiddeGlobal/…/mock/*.ts`** (see Risk R3) |
| next.config | `next.config.mjs`: only `redirects()` (legacy `/industry-dashboard`, `/role_based`). No `output: 'export'`, no `basePath` |
| Metadata / analytics | `app/layout.tsx:9-14` sets title "Yaaralabs.ai" and icon `/yaaralogo-circle.png`. No Vercel Analytics, GA or Sentry was found in the root layout |

---

## 2. How role-based routing works

**Layout.** `app/role-based/layout.tsx:5` wraps every `/role-based/**` page in `RoleBasedChrome` (`components/role-based-dashboard/RoleBasedChrome.tsx:14`). That component:
- forces dark mode;
- paints `#010101`;
- loads Outfit and JetBrains Mono;
- provides `useRoleBasedUi()`.

`components/layout/ConditionalSidebar.tsx:29` hides the app sidebar on these paths.

### Step 1 — the industry grid: `/role-based`

- **Page:** `app/role-based/page.tsx`.
- **Rendering:** the grid maps over `INDUSTRIES` (`page.tsx:39`). Each card is a `<Link href={/role-based/${ind.id}}>` (`page.tsx:44`) showing `name`, `desc` and `roles.length`.

**Registry, `lib/role-based-dashboard/registry.tsx`:**
- `INDUSTRIES` is an array literal (`registry.tsx:68-440`). Each entry is `{ id, name, icon, color, desc, roles: [{ id, name, icon, sub, defaultLens?, primaryTile? }] }`.
- Types are inferred:
  - `Industry = (typeof INDUSTRIES)[number]` (`:1865`);
  - `Role = Industry["roles"][number]` (`:1866`).
- Industry ids that are imported elsewhere live in their own files to avoid circular imports. Examples:
  - `lib/role-based-dashboard/hdfcBankIndustry.ts:2` (`"hdfc"`);
  - `neogroupIndustry.ts:2`.

  They are imported at `registry.tsx:21-28` and re-exported at `:30-37`.

### Step 2 — the role list: `/role-based/[industryId]`

- **Page:** `app/role-based/[industryId]/page.tsx`.
- **Lookup:** `getIndustryById()` (`registry.tsx:1890`), called at `page.tsx:26`.
- **Role cards:** `industry.roles.map` (`page.tsx:103`) renders a card per role, linking to `/role-based/${industry.id}/${role.id}` (`page.tsx:105`). The title comes from `roleDisplayName(role)` (`registry.tsx:1880`, used at `page.tsx:138`).

### Step 3 — the dashboard: `/role-based/[industryId]/[roleId]`

- **Page:** `app/role-based/[industryId]/[roleId]/page.tsx`. It is a `"use client"` page and is still server-rendered.
- **Legacy ids.** Old role ids are rewritten at `:61`, with `router.replace` in an effect.
- **Resolve.** `resolveIndustryAndRole()` (`registry.tsx:1894`, called at `page.tsx:94`) returns `{ industry, role }` or an error panel.
- **Exit.** `onExit = () => router.push('/role-based/${industry.id}')` (`page.tsx:115`).
- **One bypass.** Neogroup is rendered directly (`page.tsx:119`). Everything else renders `<RoleDashboardView industry role theme={SWEDBANK_DASHBOARD_THEME} unifiedNavigation={industry.id !== "fastag"} onExit />` (`page.tsx:131-137`).
- **Loading.** `RoleDashboardView` is loaded with `next/dynamic` (`page.tsx:19`) and SSR left on.

### Step 4 — dispatch: `components/role-based-dashboard/RoleDashboardView.tsx`

- **Hooks run first.** `RoleDashboardView` (`:4536`) runs two hooks unconditionally:
  - `useEisenhowerThreadsSnapshot(unifiedNavigation)` (`:4543`), a mock `getEisenhowerThreads()` with a 500 ms delay (`lib/api.ts:679`);
  - `useSterlingHeadRetailCurrencyActive` (`:4544`).
- **Then an if-chain** of `industry.id` / `role.id` branches, each returning a dedicated dashboard:

| Line | Condition | Renders |
|---|---|---|
| `:4557` | IndusInd `head_cards` | — |
| `:4561` | **`credit_cards` + `head_cards`** | **`HeadOfCreditCardsDashboard`**, the bank Head-of-Cards demo we mirror |
| `:4573` | cards_portfolio_v2 | — |
| `:4577` | openbank | — |
| `:4588` | rbi_conduct | — |
| `:4608` | fastag | — |
| `:4622` | neogroup | — |
| `:4634` | nuvama | — |
| `:4638` / `:4650` / `:4654` | ecommerce roles | — |
| `:4658` | fallback | the generic `RoleDashboardShell` |

- **Props passed to each dashboard:** `industryName`, `roleName`, `industryColor`, `onExit`, `theme`. Each one owns its full screen (rail + content). There is no shared chrome.

### Kidde Global on this checkout: **confirmed missing**

- There is no `kidde` string in `app/`, `lib/` or `components/`.
- There is no `lib/role-based-dashboard/kiddeGlobalIndustry.ts`.
- There is no Kidde branch in `RoleDashboardView.tsx`.

**History:**
- Commit `d942b10` ("kiddeglobal", 29 Sep 09:46) added three things:
  - `kiddeGlobalIndustry.ts`, with `KIDDE_GLOBAL_INDUSTRY_ID = "kidde_global"` and `KIDDE_GLOBAL_HEAD_OF_CX_ROLE_ID = "head_cx"`;
  - a registry entry "Kidde Global" with one placeholder role, "Head of CX";
  - a placeholder branch in `RoleDashboardView`.
- Commit `215d391` ("KG UPDATED", 11:42) **removed all three**.

**So:** no placeholder Head of CX role exists to keep. The build recreates the industry with **President as its only role**. `d942b10` is a usable template for the id file.

---

## 3. Component map (03 component → existing bank implementation)

### Where the bank demo lives

The bank Head-of-Cards demo lives in four files:

- **`HCD`** = `components/role-based-dashboard/HeadOfCreditCardsDashboard.tsx` (1,336 lines). Data comes from `lib/role-based-dashboard/creditCardsV3Data.ts` (`V3_TILES`, `V3_RISK_SPIKES`, `V3_AI_DAY_PROMPTS`).
- **`V3D`** = `components/role-based-dashboard/CreditCardsV3DrillDownScreens.tsx` (3,248 lines). Three drill-downs: journey `:2028`, market `:2857`, service `:3235`.
- **`SPD`** = `components/role-based-dashboard/ServicePromiseIndiaDrill.tsx` (559 lines). The service-promise body, embedded by V3D (`V3D:67`).
- **`CRS`** = `components/role-based-dashboard/CardsRiskSpikeMonitor.tsx` (269 lines). A standalone spike monitor with its own data (`cardsPortfolioRiskSpikes` `:59`). It is **not imported anywhere**. The Head-of-Cards exec uses the internal `AIRiskSpikeMonitor` in HCD instead.

**Almost every piece is a file-internal, non-exported function** with inline data or inline constants. To reuse one, copy the function body into the KGS folder, export it, and type its props. Do not import it.

### 03 → bank → KGS target

In the table below:
- "→ KGS target" gives the destination under `components/role-based-dashboard/kgs/`.
- **Italics** mark components the bank lacks: build new, per 03 §6 or 04 §0.2.

| 03 component | Bank implementation (path:line · name) | Data today | → KGS target |
|---|---|---|---|
| LeftRail | HCD `:1030-1193` inline `<aside>` (76/268px hover rail, "Y" logo tile `:1058-1077`, two industry/role squares `:1090-1115`, nav list `:1118-1169`, "Change Role" exit `:1171-1192`) | inline | `shell/LeftRail.tsx` |
| DrillHeader | HCD `:1203-1220` (title + "industry · role · sub" breadcrumb) | `activeScreenMeta` `:1000` | `shell/DrillHeader.tsx` |
| BackToOverviewHeader | V3D `:112` `DrillPageHeader` ("Back to Overview" `:167`) inside `V3DrillShell` `:84` | props | `shell/BackToOverviewHeader.tsx` |
| FloatingAIButton | HCD `:746` `FloatingAIDayGenerator` (+ `mockAIAnswer` `:951`) | `V3_AI_DAY_PROMPTS` | `shell/FloatingAIButton.tsx` (button P0, panel P2) |
| Tabs | V3D `:2310` `RankingLensFilterBar`, `:2772` `BrandPromiseLensFilterBar` (pill tabs); Radix Tabs available | inline | `shared/Tabs` (Radix) |
| ExecBriefBar | HCD `:1233-1258` inline "Executive Brief" block (CSS-uppercased, ✨) | inline string `:1255` | `exec/ExecBriefBar.tsx` |
| PulseStrip / PulseCard | HCD `:1260-1304` inline "Executive Pulse", 3 cards with orb emojis | inline array `:1276-1279` | `exec/PulseStrip.tsx` |
| QuestionCard | HCD `:214` `ExecutiveTile` | `V3_TILES` | `exec/QuestionCard.tsx` |
| ScoreDelta | inside `ExecutiveTile` (score + "± pts" `:372`) | tile | `exec/QuestionCard.tsx` (count + WoW chip) |
| SemiGauge | HCD `:109` `MiniHalfGauge` (Recharts RadialBar) | props | `exec/SemiGauge.tsx` |
| AreaTrend | inside `ExecutiveTile` (Recharts AreaChart, `:398` tooltip) | `tile.spark` | `exec/AreaTrend.tsx` |
| MiniKPI | inside `ExecutiveTile` | tile | `exec/MiniKPI.tsx` |
| InsightBox | HCD `:173` `ConversationAICallout` ("Conversation AI" `:197`) | props | `exec/InsightBox.tsx` ("LiSN INSIGHT") |
| SectionHeader | HCD `:506` `AIRiskSpikeMonitor` header ("AI Risk Spike Monitor" `:590`) | inline | `exec/SectionHeader.tsx` |
| RiskSpikeCard | HCD `:506` `AIRiskSpikeMonitor` card map (alt: CRS `:146` `SpikeCard`) | `V3_RISK_SPIKES` (alt: CRS `:59`) | `exec/SignalMonitorCard.tsx` |
| MetricBeforeAfter | inside HCD `AIRiskSpikeMonitor` metric rows (`:530-540`); CRS `:239` `MetaRow` | spike | `exec/MetricBeforeAfter.tsx` |
| RecommendationBox | inside HCD `AIRiskSpikeMonitor` (red reco box) | spike | `exec/RecommendationBox.tsx` |
| Panel | V3D `:198` `SectionCard`; `:478` `JhCard`; `:2210` `MrCard` | props | `drill/Panel.tsx` |
| KpiTile | SPD `:170` `MetricBlock` (SLA tiles `:192` `SLAFailuresCard`) | inline | `drill/KpiTile.tsx` |
| SegmentTable | V3D `:1300` `JourneyTopCommandCenter` (TOTAL INTERACTIONS 53,740 `:1325-1327` + segment rows) | `creditCardsV3Data` | `drill/SegmentTable.tsx` |
| StackedSentimentBar | V3D `:1363` "Sentiment by Relationship Value" (in `JourneyTopCommandCenter`) | same | `drill/StackedRatioBar.tsx` (sentiment banned; ratio bar only) |
| TopIntent | V3D `:1392` "Top Intent" block | same | "Top trouble conditions" panel |
| LineMonitor | V3D `:1513` "NPS Segment Monitor" (Recharts line) | same | `drill/LineMonitor.tsx` (numeric x-axis) |
| AISummaryWall / WallCard / WallFooterCounts | V3D `:1624` `JourneyTopAISummaryWall` (title `:1819`, "Real-time FCI intelligence" `:1820`, "Live" `:1825`, "Click for details" `:1889`) | inline | `drill/{SignalWall,WallCard,WallFooterCounts}.tsx` |
| Watchlist | V3D `:1543` "Vulnerable Watchlist" | same | `drill/Watchlist.tsx` |
| FrictionTable | V3D `:1582` "Strain & Friction" | same | P1 only; optional |
| StackedBarWithDetailPanel / DetailPanel | V3D `:1149` `JourneyWhatsFailingPanel` ("Repeat contact analysis" `:1182`; detail `:1269-1285` with "AI Insight" / "Recommendation" / "Dominant Topics"; `totalCases: 2847` `:928`) | inline | `drill/{StackedBarWithDetailPanel,DetailPanel}.tsx` (P-J) |
| JourneyStageTable | V3D `:2081` "pain concentration by journey stage" (in `CustomerCardJourneyV3Drill` `:2028`) | same | P-L lifecycle table (P1) |
| PromiseGapTable | V3D `:2884` "Brand Promise Gap" (+ `:2759-2856` helpers) | `creditCardsV3Data` | Q3 scorecard / Q2 league patterns (P1) |
| MomentumTile | V3D `:2416` `MarketReputationMomentumWatchRow` ("Momentum Hashtags" `:2475`) | `V3_MOMENTUM_HASHTAGS` | P-E "New phrasing" rows |
| EngagementCard | V3D `:2570` "Influential Engagement" | `getInfluentialEngagementItems` | "Partner voice" (P1, optional) |
| RankingsTable / AINote | V3D `:3036` "Rankings & Reviews"; `:3222` "AI note" | `creditCardsV3Data` | Q2 partner league (C-B) + "LiSN note" |
| EnhancedPanel | SPD `:299` `WhyDisputesBreachSLA` ("✨ Card-system enhanced" `:307`) + `:422` `WhyDisputesBreachSLAControlStrip` | inline `C` tokens `:5` | `drill/EnhancedPanel.tsx` ("Joined with RMA & firmware data") |
| StuckDriverBars | SPD "Why cases are stuck" `:459` | inline | `drill/StuckDriverBars.tsx` |
| ChipGroups | SPD inside `WhyDisputesBreachSLA` (Routine / Emerging) | inline | inside EnhancedPanel |
| AgedCaseWatchlist | SPD "Aged Case Watchlist" `:382`, `:508` | inline | `drill/AgedCaseWatchlist.tsx`; also the row template for GovernedWatchTile |
| DiagnosisBox | SPD `:411` "✨ AI Dispute Diagnosis" (Main reason / What changed / Fix first `:413-415`) | inline | `drill/DiagnosisBox.tsx` ("LiSN evidence summary") |
| RankedFailureList | SPD `:230` `TopServiceFailuresCard` | inline | Q3 (P1) |
| Funnel | SPD `:268` `DisputeRecoveryFunnelCard` | inline | FunnelStrip reference only |
| Reading shell for drills | V3D `:66` imports `RoleBasedUnifiedReadingShell` | — | use the KGS shell instead |
| *SeverityChip, SeverityStrip, ConfidenceMarker, JoinTagRow, PnLDestinationTag, IllustrativeChip, RoutedOwner, GateChip / HumanGateStatus, ApproveButton, RankChip, SignalChips, CounterEvidence, EmptyScope* | not in the bank | — | `shared/*` (03 §6) |
| *ContextBar, SyntheticBadge, AnonymiseToggle, Watermark, FixedFooter, DemoMenu, Toast* | not in the bank | — | `shell/*` |
| *FunnelStrip, WhatsCountedPopover, AppliedValueStrip, HowWeCountDrawer, SuppressedEndCard, GovernedWatchTile, ClockRing, EvidenceReadinessTile* | not in the bank | — | `exec/*` |
| *FirmwareLineageChart, EvidenceDrawer (+ tabs), DraftPreviewModal, DecisionPanel, WhyRankedPopover, CohortMiniTable* | not in the bank | — | `signal/*` |
| *DateCodeHeatStrip, ContactsRmaOverlay, EmergingPhrasingTable* | not in the bank | — | `drill/*` |
| *Drawer / Modal / Popover shells* | Radix Dialog is available; no Popover package | — | `shared/{Drawer,Modal,Popover}.tsx` (Radix Dialog + Tooltip; hand-rolled popover) |

**AiExecSummaryBar** (`components/role-based-dashboard/cx-head-retail/components/common/AiExecSummaryBar.tsx:8`; siblings in `category-intelligence/` and `category-intelligence-v2/`):
- It is a thin Critical / Focus / Stable bar from the CX-retail demo, not the Head-of-Cards demo.
- It depends on cx-head-retail tokens (`cssVar`, `radius`).
- It is a fallback pattern for PulseStrip only; the HCD inline Pulse is the visual match to `ref/Head_of_Cards_Exec-1.png`.

---

## 4. Bank-specific strings and assets (inside the four source files)

| String / asset | Where |
|---|---|
| "Y" logo tile, "Yaaralabs" / "Fluid Intelligence" | HCD `:1054-1077` |
| Industry/role colour squares | HCD `:1090-1115` |
| "Executive Brief" text with bank scores and "pts" | HCD `:1255`; `:372`, `:398`, `:530`, `:540` |
| "HSHF", "churn", "Dispute", "#RewardScam" (Pulse) | HCD `:1277-1279` |
| "Conversation AI" | HCD `:172`, `:197` |
| "AI Risk Spike Monitor" | HCD `:590`; CRS |
| "Chargeback ratio" | HCD `:530` |
| Credit-card domain AI answers | HCD `:951-973` |
| "Are cardholders satisfied…", "Lifecycle · Journey · Retention", "Brand · Rankings · Social Signals", "Disputes · Risk · Recovery" | HCD `:1003-1016`, `:1122-1126` |
| "AI Summary Wall", "Real-time FCI intelligence", "Live", "Click for details" | V3D `:1819`, `:1820`, `:1825`, `:1889` |
| Sentiment, NPS Segment Monitor, Vulnerable Watchlist, Momentum Hashtags, Influential Engagement, real bank and competitor brand names in Rankings | V3D `:1363`, `:1513`, `:1543`, `:2475`, `:2570`, `:3036` |
| "Card-system enhanced", "AI Dispute Diagnosis", "Main reason" / "Fix first", HSHF, merchant/acquirer, cardholders, "Card Closure / Retention" | SPD `:307`, `:383`, `:411-415`, `:215-216`, `:430` |
| Bank data: CNP Fraud, MCC 7995, Merchant XYZ, Reward Devaluation, HSHF Churn | `lib/role-based-dashboard/creditCardsV3Data.ts`, CRS data |
| Page `<title>` "Yaaralabs.ai", favicon `/yaaralogo-circle.png` | `app/layout.tsx:10-13` |

**Consequence:** the KGS copies start from these files, so Pass 3's rename sweep must clear every row above. None of them may be imported into a KGS component.

---

## 5. Risks for the KGS build

| # | Risk | Mitigation |
|---|---|---|
| R1 | **Inline styles, not Tailwind.** 03 and 06 assume Tailwind tokens ("the repo's Tailwind config wins"). The bank look lives in inline style objects and theme-token objects. | Copy the inline-style components as they are. Put 03 §2 tokens into one `kgs/shared/tokens.ts` object shaped like `HEAD_CREDIT_CARDS_DEFAULT_THEME`. Do not convert to Tailwind classes. |
| R2 | **Fonts load from Google at runtime** (`RoleBasedChrome.tsx:40`). 08 §5.9 requires a local build that renders with Wi-Fi off. | Fonts fall back to system-ui when offline. Accept and note in DRIVER_NOTES, or self-host (a new asset; ask first). |
| R3 | **`tsconfig` `include: **/*.ts` compiles the KB's `mock/*.ts`**, and Biome may lint the KB folder. A KB type error would break `next build`, and the KB must not be edited. | Add `"Carrier KiddeGlobal"` to `tsconfig.json` `exclude` (and to Biome ignore if needed). One-line config change, planned in Pass 2. |
| R4 | **Legibility.** Uppercase labels: HCD ×14, V3D ×18, SPD ×4, CRS ×3. `fontSize` 9–10px: HCD ×7, V3D ×82, SPD ×47, CRS ×4. `ellipsis`/`truncate`: HCD ×2, V3D ×2. | Raise to ≥11px in the copies. No `textTransform: uppercase` on anything rendering "LiSN"; write caps literally. Titles wrap (no ellipsis). |
| R5 | **Categorical x-axes** (HCD 1, V3D 2 `<XAxis>`). The lineage chart needs a numeric x-axis with fractional markers (23.4, 25.4, 28.3) and a second y-axis. | Build FirmwareLineageChart new in Recharts: `type="number"`, domain [1, 28.5], hidden right axis [0, 0.7]. |
| R6 | **SSR plus `window`.** `mock/lib/demoState.ts` reads `?anon=1` from `window` in its initial state. `[roleId]/page.tsx` is server-rendered, so hydration mismatches are possible. | In the **copied** `demoState.ts`, initialise `anonymise: false` and apply `?anon=1` / `?intro=0` once in a `useEffect` in the dashboard. |
| R7 | **Shared hooks run for KGS too.** `useEisenhowerThreadsSnapshot` fires a 500 ms mock fetch (`RoleDashboardView.tsx:4543`, `lib/api.ts:679`). | Harmless, same-origin mock. Leave it; do not edit the page. |
| R8 | **Cross-client exposure.** `/role-based` lists every client (HDFC, Openbank, IndusInd, Nuvama and others). 06 §1 and §6 want a neutral, isolated deploy. | Presenter deep-links to `/role-based/kidde_global/president_commercial_fire?intro=0`. Deployment choice is an open question (CONTEXT_DIGEST §9 Q3). |
| R9 | **Document title and favicon** are "Yaaralabs.ai" and the Yaaralabs logo. 04 wants the `<title>` through `fmt` and a "Li" favicon; the 08 sweep bans no logos but "LiSN demo" is expected. | Set `document.title` in a `useEffect` from `meta.title` via `fmt`, and restore it on unmount. Leave the favicon (root layout; out of scope). |
| R10 | **No Popover / ToggleGroup / toast primitive.** | Radix Tooltip + Dialog, plus a small hand-rolled popover, segmented control and toast inside `kgs/shared`. No new packages. |
| R11 | **Bank data is inline** in the components (`creditCardsV3Data.ts` plus inline arrays). A copied component can leak a bank figure if a prop is missed. | Every copied component takes typed props from `@kgs/lib/data`, and every inline array is deleted in the copy. The Pass 3 sweep greps the copies. |
| R12 | **Each dashboard is full-screen**, with height 100vh and its own rail. Sticky ContextBar plus `overflow:hidden` on the HCD root (`:1027`) can break `position: sticky`. | The KGS shell scrolls the main column, not the root (06 Step 4 pitfall). |
