# KGS v2 — build plan (Pass 0)

Sources: `SPEC.md` (truth), `CALL_TRANSCRIPT.md` (why). Repo paths follow `AGENTS.md` KGS v2 rules (`kgs-v2/`, `@kgs2/*`), not the SPEC's pack-local `src/mock/kgs-v2/` wording. v1 stays deployable and untouched.

---

## a. Reuse map — SPEC panels (sections 4–8) → v1 component or "new"

Import from `components/role-based-dashboard/kgs/**` when unchanged. If behaviour, copy, or layout must change for v2, **copy into `kgs-v2/`** and edit the copy (never edit v1).

### Shell / chrome (all views)

| SPEC element | Reuse | Notes |
| --- | --- | --- |
| App shell / layout | copy → `kgs-v2/KgsAsiaRegionalDashboard.tsx` from `kgs/KgsCommercialFireDashboard.tsx` | New entry; own DemoProvider + view state |
| Left rail | copy → `kgs-v2/shell/LeftRail.tsx` from `kgs/shell/LeftRail.tsx` | Overview · Promises · Recurring · Install · Partners |
| Context bar | copy → `kgs-v2/shell/ContextBar.tsx` from `kgs/shell/ContextBar.tsx` | Add Region, Period, global Viewing as |
| Drill / page header + breadcrumb | copy → `kgs-v2/shell/DrillHeader.tsx` from `kgs/shell/DrillHeader.tsx` | "Global Commercial Fire · Asia ex China · {role} · {page}" |
| Anonymise toggle | import `kgs/shell/AnonymiseToggle.tsx` | Wire to v2 demoState |
| Toast | import `kgs/shell/Toast.tsx` | |
| Demo menu / reset | copy → `kgs-v2/shell/DemoMenu.tsx` from `kgs/shell/DemoMenu.tsx` | Reset clears approvals, role, loop states |
| Watermark / synthetic badge | import `kgs/shell/Watermark.tsx` (+ footer copy from `meta.json`) | Badge on every view, drawer, modal |
| Tokens / motion | import `kgs/shared/tokens.ts`, `kgs/shared/motion.ts` | Match final v1 look |
| Severity strip / chip | import `kgs/shared/SeverityStrip.tsx`, `SeverityChip.tsx` | Word + colour |
| Confidence marker | import `kgs/shared/ConfidenceMarker.tsx` | |
| Join tags / P&L / routed owner | import `JoinTagRow`, `PnLDestinationTag`, `RoutedOwner` | |
| Approve / human gate UI | copy → `kgs-v2/shared/ApproveButton.tsx`, `HumanGateStatus.tsx` from v1 shared | IST timestamp; role-gated |
| Nav / view state | **new** `kgs-v2/nav.tsx` | Views: overview, promise, promiseHero, recurring, recurringTheme, install, partner |

### Section 4 — Regional overview (`overview`)

| SPEC panel | Reuse | Notes |
| --- | --- | --- |
| Read strip (386 / ~77 / day) | **new** (or thin copy of FunnelStrip shell only) | Replaces funnel; no volume funnel |
| Executive brief (one line) | import / rebind `kgs/exec/ExecBriefBar.tsx` | |
| Executive pulse (3 cards) | import `kgs/exec/PulseStrip.tsx` | |
| Three question cards | import `kgs/exec/QuestionCard.tsx` (+ SemiGauge, MiniKPI, InsightBox, AreaTrend) | Promises / Recurring / Install |
| Card trend (13 pts) | import `kgs/exec/AreaTrend.tsx` | One series, gradient fill |
| This week's signals (5 + sources) | copy → rename Field Signal Monitor → "This week's signals"; cards via `SignalMonitorCard.tsx` | SPEC "RiskSpikeCard" = this anatomy |
| Sources card | copy from `EvidenceReadinessTile.tsx` → "Sources" | Two columns: connected / not connected |
| Loop-closure strip | **new** (replaces money / AppliedValueStrip) | No currency |
| Overview view composer | **new** `kgs-v2/overview/OverviewView.tsx` | Pattern from `views/OverviewView.tsx` |

**Do not port:** FunnelStrip, GovernedWatchTile, MoneyText / AppliedValueStrip currency, firmware / separation / installed-base copy.

### Section 5 — Promises (`promise` + `promiseHero`)

| SPEC panel | Reuse | Notes |
| --- | --- | --- |
| KPI tiles (5) | import `kgs/drill/KpiTile.tsx` | |
| Promise kept by region (weekly) | import `kgs/drill/LineMonitor.tsx` | 5 region lines + 90% target |
| Distributor table | import `kgs/drill/SegmentTable.tsx` | |
| Said vs order system | import `kgs/drill/EnhancedPanel.tsx` | Badge "joined with order data" |
| Candidate causes by region | import `kgs/drill/StackedRatioBar.tsx` or `StackedBarWithDetailPanel.tsx` | Label "candidate causes — owner confirms" |
| Signal Wall | import `kgs/drill/SignalWall.tsx` | head_cards AI Summary Wall style + in-place detail |
| LiSN evidence summary | import `kgs/drill/DiagnosisBox.tsx` | Rename rows: Main signal / What changed / Decide first |
| Promise page composer | **new** `kgs-v2/promise/PromiseView.tsx` | Pattern from InstalledBaseView / ChannelView |
| Hero rank chip + why ranked | import `RankChip.tsx`, `WhyRankedPopover.tsx` | |
| Hero headline / chips | import `SignalHeader.tsx`, `SignalChips.tsx` | |
| Hero chart (baseline band + markers) | **new** or copy from AreaTrend / LineMonitor into `kgs-v2/promise/` | Band + week-35 / review markers |
| Severity / confidence / cause / counter-evidence | import shared + `CounterEvidence.tsx` | |
| Recommended action / decision panel | import `RecommendedAction.tsx`, `DecisionPanel.tsx` | Global role drives Approve |
| Loop tracker | **new** `kgs-v2/promise/LoopTracker.tsx` | Open → Action approved → Watching → Closed |
| Evidence drawer (4 tabs) | copy → `kgs-v2/promise/EvidenceDrawer.tsx` from `signal/EvidenceDrawer.tsx` | Snippets · Order lines · Distributors · Method & audit |
| Draft modals | import / rebind `DraftPreviewModal.tsx` | All "Not sent" |
| Snippet cards | import `SnippetCard.tsx` | |
| Hero view composer | **new** `kgs-v2/promise/PromiseHeroView.tsx` | Pattern from `SignalFw41View.tsx` |

**Do not reuse for hero:** `FirmwareLineageChart.tsx`, `DateCodeHeatStrip.tsx`, LinkedRmaList firmware paths.

### Section 6 — Recurring (`recurring` + `recurringTheme`)

| SPEC panel | Reuse | Notes |
| --- | --- | --- |
| KPI tiles (4) | import `KpiTile.tsx` | |
| Theme register | import `SegmentTable.tsx` | Sort Back after fix first |
| Fixed before, back again wall | import `SignalWall.tsx` | |
| Theme timeline | import `LineMonitor.tsx` | Fix ◆ / return ▲ markers |
| Where it comes from (channel stack) | import `StackedRatioBar.tsx` / stacked bar | |
| LiSN evidence summary | import `DiagnosisBox.tsx` | |
| Theme deep dive | reuse hero layout (`PromiseHeroView` pattern) | P1; `theme_rc01.json` |
| Recurring / theme composers | **new** `kgs-v2/recurring/*` | |

### Section 7 — Install (`install`)

| SPEC panel | Reuse | Notes |
| --- | --- | --- |
| Capture-gap banner | **new** | Always visible |
| Friction vs praise diverging bars | **new** (or adapt StackedRatioBar) | Experience framing, not defect |
| Time installers mention table | import `SegmentTable.tsx` or EnhancedPanel | Stated times, not measurements |
| Praise worth using | **new** card | |
| Product family × region heat grid | **new** | Anonymise-aware |
| Signal Wall | import `SignalWall.tsx` | IN-01 / IN-02 |
| LiSN evidence summary | import `DiagnosisBox.tsx` | |
| Drafts | rebind DraftPreviewModal + gate | Product liaison / Marketing |
| Install composer | **new** `kgs-v2/install/InstallView.tsx` | |

### Section 8 — Partner (`partner`)

| SPEC panel | Reuse | Notes |
| --- | --- | --- |
| Two-tab shell | **new** `kgs-v2/partner/PartnerView.tsx` | Partner workspace · What KGS sees; label Concept |
| Consent boundary diagram / copy | **new** | Visible territorial boundary |
| Today's queue / manager view / Waiting on KGS | **new** panels | L1 / L2 |
| Sharing settings toggles | **new** | Identities & pricing locked Off |
| Themes × partners heat / promise by partner / health cards | **new** (+ SegmentTable where tabular) | Aggregates only |
| Concept footer | **new** | Both tabs |

---

## b. Data plan — SPEC section 10 files → shape; types reused vs new

**Location:** `lib/role-based-dashboard/kgs-v2/data/*.json` (alias `@kgs2/*`). Leave `lib/role-based-dashboard/kgs/` untouched.

| File | Shape (feeds) | Types |
| --- | --- | --- |
| `meta.json` | Region list, period, roles, badge, footer, data-as-of, breadcrumb templates | Shell meta (new file wrapper); reuse TokenString |
| `overview.json` | Read strip, brief, pulse, 3 question cards, 5 signal cards, sources, loop-closure | Compose reused Signal / Severity / Confidence pieces; new SourceConnection[]; no Money |
| `promise.json` | KPIs; 5×13 weekly series; 12 distributor rows; said-vs-shows; cause split; wall; evidence summary | Reuse JoinTags patterns; new PromiseLine[] for joins |
| `signal_pr01.json` | Hero: headline, chart+band+markers, severity, confidence, cause, counter-evidence, join tags, P&L, owners, action, gate, loop, snippets, 46 lines, 3 drafts | Reuse Severity, Confidence, JoinTag, PnLDestination, HumanGate, EvidenceSnippet; new LoopStatus, PromiseLine |
| `recurring.json` | KPIs; theme register (27 / 6 seeded); top-3 weekly + markers; channel split; wall; evidence | New Theme, FixRecord |
| `theme_rc01.json` | 26-week series, fix history, drafts, loop | Theme + LoopStatus + HumanGate |
| `install.json` | Steps × friction/praise; stated-time table; praise; heat grid; signals; drafts; capture-gap | New InstallFeedback |
| `partner.json` | D-N-04 workspace + KGS aggregates + sharing | New SharingScope; health / queue shapes |
| `anonymise.json` | Distributor → Partner P-nn; region → Region n; hub → Hub n | Reuse AnonymiseMap pattern from v1 |

**Reuse from v1 `@kgs/types` (import, do not edit):** `Severity`, `Confidence`, `JoinTag` / join-tag rows, `PnLDestination`, `HumanGate` (extend artefact types in v2 types if needed via intersection), `EvidenceSnippet`, `AnonymiseMap`, `TokenString`, `ISODate`, `ISODateTime`, SeverityClass/Type.

**Reuse helpers:** `@kgs/lib/label` — `fmt()`, `label()`, `withTs()`, `withRole()`. Prefer IST formatter in **v2** demoState / label wrapper (do not change v1 `fmtDemoTime` UTC behaviour).

**New in `@kgs2/types.ts`:** `PromiseLine`, `LoopStatus`, `Theme`, `FixRecord`, `InstallFeedback`, `SharingScope`, `SourceConnection`; v2 `Role` union (Regional GM, Operations lead, Technical support lead, Partner manager, Product liaison, Sales ops, Partner service manager); v2 `DemoState` (role, approvals, loopStates, view, anonymise); view id union.

**Checks:** `lib/role-based-dashboard/kgs-v2/checks.ts` — totals 4,940 / 386; PR-01 28+7+11=46; install 61/39; overview counts match pages; no currency; banned strings (SPEC §11); anonymise ON leaves no distributor ID / city / region name.

---

## c. Spec issues and fixes

| Issue | Fix |
| --- | --- |
| §2 Partner manager: mark draft **"sent"** vs §9 **"ready to send"** (never sends) | Use **"ready to send"** everywhere. Never auto-send; drafts stay Not sent until that mark. |
| SPEC pack paths `src/mock/kgs-v2/` vs this repo | Use `lib/role-based-dashboard/kgs-v2/` and `@kgs2/*` per AGENTS. |
| §11 "Remove from the v1 codebase" routes / rail / firmware | **Do not edit v1.** Omit those routes from the v2 shell copy; leave President demo intact. |
| §4 names "RiskSpikeCard"; repo has `SignalMonitorCard` / Field Signal Monitor | Rebind `SignalMonitorCard`; rename strip to "This week's signals". |
| §5/6 "AI Summary Wall" / "LiSN Diagnosis" | Use `SignalWall` + `DiagnosisBox`; on-screen titles Signal Wall / LiSN evidence summary. |
| Real competitor "Honeywell" in §8 prose | Cards/tables/quotes/data: Competitor A/B only. Real name **only** in Partner view subtitle (Pass 5). |
| §9 anonymise OFF by default vs v1 default ON | v2 DemoProvider: anonymise **OFF** by default for live session; URL override optional. |
| Approval time: SPEC IST vs v1 `fmtDemoTime` UTC | Capture once in v2 with IST display; do not change v1 label.ts. |
| §2 role label "Operations & fulfilment lead" vs breadcrumb "Operations lead" | On-screen short label **"Operations lead"** (breadcrumb + Viewing as); long form only in docs if needed. |
| §2 "Sends partner updates" vs human-gate "nothing sent automatically" | Partner manager may mark **"ready to send"** only; UI copy never claims sent. |
| Names Amit / Kartik in SPEC audience prose | Never render on screen; roles only. |
| Currency / Money type in v1 | Do not surface Money or currency strings in v2 JSON or UI. |
| Wiring: registry only has President today | Pass 7 (or shell pass) adds Regional GM role + `KgsAsiaRegionalDashboard` branch beside President; do not remove President. |

---

## d. SPEC change → transcript justification

| SPEC change | Transcript |
| --- | --- |
| Drop firmware / installed-base hero | 23:11 — firmware well addressed; test before rollout |
| Drop big-volume funnel / signal-from-noise framing | 39:42–40:30 — not that many signals; not distilling noise |
| New hero: delivery promise by region / customer | 15:54, 30:28–31:12 — late orders; getting better or worse |
| New: What keeps coming back? / one source of truth | 40:30 — fixed once, root cause not fixed |
| New: What do installers experience? | 23:59 — half hour more; easiest to program; not captured |
| New Partner view (branded for partners; consent) | 26:17–28:14 — backbone; territorial customer data; loyalty vs Honeywell |
| Scope Asia ex China; regional team roles | 35:11, 39:42 — India / SEA mini-org; GM in Delhi |
| Salesforce as named source; pipeline notes P2 | 41:14 — Salesforce CRM / pipeline noise |
| Remove separation question | 38:13 — only soft "Right, yeah" |
| Partners = who pay the bill; daily late delivery | 15:54 — distributors / dealers / strategic partners |
| Modest volumes (~80 / working day scale in SPEC) | 39:42–40:30 — volume honesty |
| Help partners run businesses better | 28:14 — value prop beyond product |

---

## e. Pass list (1–7) — files each pass touches

| Pass | Scope | Files (create / touch; never `kgs/` v1) |
| --- | --- | --- |
| **1** | Data layer + types + checks | `lib/role-based-dashboard/kgs-v2/types.ts`, `lib/demoState.ts`, `checks.ts`, `data/{meta,overview,promise,signal_pr01,recurring,theme_rc01,install,partner,anonymise}.json`, `lib/data.ts`; tsconfig `@kgs2/*` |
| **2** | Shell + nav + DemoProvider + role wiring stub | `kgs-v2/KgsAsiaRegionalDashboard.tsx`, `nav.tsx`, `shell/{LeftRail,ContextBar,DrillHeader,DemoMenu,DemoProvider}.tsx`, `shared/*` copies as needed; `kiddeGlobalIndustry.ts` + `registry.tsx` + role page / RoleDashboardView branch for Regional GM (President path untouched) |
| **3** | Regional overview | `kgs-v2/overview/*`; bind overview.json; signal strip + sources + loop-closure |
| **4** | Promise page + PR-01 hero + loop tracker + gate | `kgs-v2/promise/*` (PromiseView, PromiseHeroView, LoopTracker, EvidenceDrawer copy); drafts; IST approve |
| **5** | Partner view | `kgs-v2/partner/*`; partner.json; Concept label; Competitor subtitle only here if real name |
| **6** | Recurring + Install (+ theme deep dive P1) | `kgs-v2/recurring/*`, `kgs-v2/install/*` |
| **7** | Motion, anonymise sweep, QA, acceptance | checks pass; banned-string sweep; polish; confirm overview↔page counts; reset demo |

Pass 0 deliverables: this file + AGENTS.md KGS v2 section. No application source in Pass 0.
