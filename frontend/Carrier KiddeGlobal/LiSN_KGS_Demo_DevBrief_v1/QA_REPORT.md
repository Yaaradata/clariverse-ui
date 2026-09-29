# QA_REPORT — LiSN × KGS President, Global Commercial Fire

**Date:** 29 Sep 2026  
**Branch:** `kgs-commercial-fire`  
**Reviewer posture:** Pass 5 independent check (browser + §5.1 greps + [Independent KGS dashboard QA review](b3be14f8-62b1-4fa8-ae20-4084b05b7f91) code review).  
**Build entry:** `/role-based/kidde_global/president_commercial_fire` (in-component views, not App Router routes — see BUILD_PLAN §1).

---

## Summary

| Area | Result |
|---|---|
| 06 §5.1 automated | **PASS** (after QA fixes) |
| 06 §5.2 manual | **PASS** with noted residuals |
| 08 §5 pre-demo QA | **PASS** with noted residuals |
| 00 §5 / 06 §2 non-negotiables | **PASS** after fixes |
| Anonymise ON leak check | **PASS** on all five views |
| Figures → mock JSON | **PASS** (one chart-tooltip bend) |
| 00 §7 decisions | **PASS** |
| Visual parity vs `ref/*.png` | **PASS** with residual size deltas |
| Rest of `/role-based` | **PASS** |
| tsc / biome / `next build` | **PASS** |

**QA fix commits (this pass):**
- `f5c0256` CountUp first frame never renders `-0`
- `2ed22b7` Recharts `initialDimension` (no width/height warn)
- `3de6c12` chart axis labels ≥11px; RMA limit label through `useLabel`
- `9d38206` ILLUSTRATIVE chip on every `$`/`£` display string
- `bc880ed` dashed markers ≥1.5px / `4 4`; locked text `K.textMut`
- `62c4882` `scoreDisplay` instead of `toFixed` at render

Nothing from 06 §4.2 cut-lines was applied.

---

## 1. 06 §5.1 Automated checks

Paths adapted to this repo: `components/role-based-dashboard/kgs`, `lib/role-based-dashboard/kgs/data`.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Retired / banned strings | **PASS** | Hits are comments, identifiers (`index`), `aria-live`, and allowed copy (`LiSN INSIGHT`, `LiSN does not determine…`). No visible FCI / banking leftovers. |
| 2 | Exclamation marks in JSX / JSON | **PASS** | Zero hits. |
| 3 | Hard-coded numbers in JSX text | **PASS** | Zero hits. |
| 4 | US spellings in strings | **PASS** | Hits are CSS `color` / chart `color` props only. |
| 5 | `tsc` + lint + build | **PASS** | `npx tsc --noEmit -p .` (frontend) exit 0; `npx biome check components/role-based-dashboard/kgs lib/role-based-dashboard/kgs` clean; `npx next build` succeeded. |
| — | Anonymise leak snippet (06 §5.1) | **PASS** | Ran on overview, installed-base, channel, separation, hero (drawer all 4 tabs + draft modal + Why ranked). Hits `{}`. Accepted Region closed-menu exception not needed (options pass through `L` / per-part anonymise). |

---

## 2. 06 §5.2 Manual checklist

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Visual parity with bank demo | **PASS*** | Rail 76px, ContextBar sticky, panel radius 16, card rhythm and dark shells match `ref/Head_of_Cards_Exec-1.png` / Cards Journey. *Residual size deltas in §5 below. |
| 2 | Widths 1280 / 1440 / 1920 | **PASS*** | No page horizontal scroll. Monitor strip scrolls in its own scroller. Hero right column ≥320px at 1280 (measured 346). *At 1280 the Q1 brand×platform table (`SegmentTable`) scrolls horizontally inside its column (377/336) — intentional `overflowX: auto`, not page scroll. |
| 3 | Projector / screen-share legibility | **PASS*** | Micro raised to 11px on chart axes (was 10). Locked/disabled text now `#a3a3a3`. *Not re-checked over Zoom at 720p in this pass. |
| 4 | Anonymise on/off sweep | **PASS** | Default OFF; `?anon=1` ON; chip + watermark (`Synthetic scenario — not KGS data`, z-index 90); `beforeprint` forces ON and `afterprint` restores; leak check clean on every view with drawer/modal open; governed tile has no platform/firmware/country. |
| 5 | Badge and footer | **PASS** | Sticky ContextBar badge on every view; FixedFooter present; badge z above drawer/modal backdrops (ContextBar 70 vs overlay 60). |
| 6 | Signal contract | **PASS** | Monitor, wall, detail (when linked), hero show severity + K/I + joins + P&L + owner + gate. |
| 7 | Human gate | **PASS** | No enabled Send/Notify/Export. Approve `aria-disabled` as President with tooltip "Approval sits with VP Engineering"; Export list `aria-disabled` + "Export disabled in demo". Live ts identical on gate, audit, toast, draft chip (`29 Sep 08:53 UTC` in session). |
| 8 | Money | **PASS** | After `9d38206`, every `$`/`£` on overview carries ILLUSTRATIVE (browser: `moneyNoChip: []`, chips on blast radii and Pulse 2). AV-4 three separate lines. No $+$£ sum. |
| 9 | No console errors | **PASS** | After `2ed22b7`, navigating all views: `con: []`. No unknown-token warnings observed. Dev `checks.ts` asserts fixed figures. |
| 10 | Fast load | **PASS*** | Production build succeeds; no remote images in KGS tree. *Lighthouse not re-run this pass. |
| 11 | Reset works | **PASS** | Approve → knock-ons (AV-3 `4 awaiting owners`) → DemoMenu Reset → toast "Demo reset", AV-3 back to `5`, anonymise OFF, approved chips gone. |
| 12 | Every number → JSON | **PASS** | Spot check of 08 §5.7 table against `data/*.json` — single sources, no conflicting variants. See §3. |
| 13 | Links | **PASS** | Pulse 1 → hero; Pulse 2/3 → separation (per `exec.json`); Q1/Q2/Q3 cards; mon1 hero; mon2 `#date-code` @72; mon3 `#esd-se-07` @72; mon4 `#backorder`; mon5 separation; evidence readiness `#why-late` @72; funnel 5 → monitor @72; funnel 2 / rail lock → governed watch (scroller at max, tile fully visible). `/signals/A1` is an in-component alias (BUILD_PLAN D2). |
| 14 | Copy | **PASS** | British spelling; LiSN exact (no CSS uppercase); "above threshold this week"; 08 §5.3 console hits only allowed ("Recall broad, rank severe.", "Nothing has been sent", "not savings"). |

---

## 3. Figures not bound to mock JSON

| Figure / behaviour | Binding | Notes |
|---|---|---|
| All KPI / Pulse / Brief / monitor / wall display strings | `data/*.json` via `useLabel` | |
| ESD-SE-07 40 vs 13 (3.1×), Houston 11 vs 3 (3.7×), P-F "about 2%", certifications 186 | JSON + `checks.ts` | |
| Funnel / AV integers | JSON; `toLocaleString('en-GB')` only where allowed | |
| Source independence score | `confidence.sourceIndependence.scoreDisplay` | Added in QA (`"0.78"`) — was `toFixed(2)` |
| Lineage tooltip rates | Bound once into chart `Row` (`rate40Text` / `rate41Text` / `rmaText`) from numeric series | **Bend:** 05a stores rates as numbers with no display field; formatted at bind time, not per render |
| Ghost weeks, stagger/pulse/intro timings, `REGION_GROUP`, stack colours | Code constants | Documented in Pass 4; not display figures |

---

## 4. 00 §5 / 06 §2 non-negotiables

| Rule | Result |
|---|---|
| Synthetic badge + footer every view / drawer / modal | **PASS** |
| Severity `S# · word` + glyph | **PASS** |
| Full signal surface contract | **PASS** |
| Human gate; no enabled send/notify/export | **PASS** |
| Anonymise (toggle, `?anon=1`, print, watermark, no named leaks) | **PASS** |
| No banking leftovers; Li monogram only; `(synthetic)` where 04 shows | **PASS** |
| No USD+GBP sums; ILLUSTRATIVE on money; no revenue/savings/ROI | **PASS** |
| Data via `useLabel`; no figure literals in JSX | **PASS*** |
| Timestamps only from `approve` / `requestDecision` | **PASS** |
| British spelling; LiSN; no `!`; candidates not causes | **PASS** |

\* Residual: a few chrome strings may still skip `L()` (e.g. hard-coded " · cc " punctuation). Priority surfaces listed by the independent review were wrapped in the label-pass commit. Re-spot-check anonymise before the live call.

---

## 5. 00 §7 decisions

| Decision | Result | Evidence |
|---|---|---|
| "above threshold this week" | **PASS** | No "crossed a threshold this week" |
| Brief / Pulse variant A | **PASS** | `exec.json` |
| W-1 routed 6 Sep 14:38 UTC; chronology 23 Sep 10:02 | **PASS** | Governed tile |
| Live approval ts identical on gate / audit / toast / draft | **PASS** | Browser session |
| Anonymise default OFF; `?anon=1`; print | **PASS** | |
| Logo "Li" only | **PASS** | |
| Borders Q1 orange 2px / Q2 teal / Q3 sky-400 | **PASS** | Measured earlier Pass 4 |
| Diagnosis "LiSN evidence summary"; rows Main signal / What changed / Decide first | **PASS** | |
| Drawer tabs Snippets 23 · Linked RMAs 2 · Cohort · Method & audit | **PASS** | |
| Wall "Open signal →" | **PASS** | |
| Fixed figures 3.1× / 3.7× / about 2% / 186 | **PASS** | |
| Local Viewing as President \| VP Engineering | **PASS** | |

---

## 6. Visual parity (`ref/*.png`) — residuals

Repo Tailwind / existing tokens win over 03 hex where they disagree (06 §2 order of truth).

| Item | Spec / ref | Built | Verdict |
|---|---|---|---|
| Rail width / logo | ~76 / 36 | 76 / 36 | PASS |
| Panel radius / border | 16 / `#1f1f1f` | match | PASS |
| ContextBar sticky / z | above drawers | 70 vs 60 | PASS |
| Chart dashed meaning lines | ≥1.5px, `4 4` | fixed in QA | PASS |
| Micro text | ≥11px | fixed axes 10→11 | PASS |
| Locked text contrast | ≥ neutral-400 | fixed `#737373`→`K.textMut` | PASS |
| Breadcrumb / H1 / question title / KPI big number / rail icon / lineage height | 03 §2.6–§7 sizes | several 1–8px under 03 | **Residual** — bank fork sizes kept; not demo-blocking |
| KpiTile value 28px vs ≥36 | 03 §7 | 28 | **Residual** — matches forked bank tile |

---

## 7. Rest of `/role-based`

| Route | Result |
|---|---|
| `/role-based/retail_banking/ceo` | Loads; no `.kgs-root`; title `Yaaralabs.ai` |
| `/role-based/credit_cards/head_cards` | Loads; Head of Cards content intact |
| Exit KGS via Back | Restores `document.title` to `Yaaralabs.ai`; lands on industry role picker |

Shared-file delta vs `main` is additive only: registry industry, early-return in `RoleDashboardView`, `@kgs/*` alias, `kiddeGlobalIndustry.ts`.

---

## 8. 08 §5 Pre-demo QA (condensed)

| Section | Result |
|---|---|
| 5.1 Functional | **PASS** (approval E2E, drawer Esc + focus trap, Q2 OTD 94↔71, Reset, links) |
| 5.2 Visual | **PASS** with §6 residuals |
| 5.3 House style console | **PASS** (allowed hits only) |
| 5.4 Anonymise | **PASS** |
| 5.5 Safety & cyber | **PASS** (footer + modal copy; no platform/fw/country; W-1 times) |
| 5.6 No residential / FCI | **PASS** |
| 5.7 Number consistency | **PASS** (JSON single-source spot check) |
| 5.8 Timestamps | **PASS** (static ≤ 25 Sep 18:00 UTC; live actions carry session date) |
| 5.9 Failure recovery | Not exercised live; plan remains in 08 |

---

## 9. Open residuals (not blocking draft PR)

1. Visual size deltas vs 03 §7 on forked bank components (§6).
2. Lineage tooltip rate display strings bound at chart build from numeric series (§3).
3. `?intro=0` can flash the intro until hydration (~1s on dev).
4. Money inside long body/stage prose may share one chip for the whole string (same pattern as DetailPanel).
5. Ask LiSN tooltip still reads "Ask LiSN (P2 — canned answers)" — **verbatim from 02/04**, not a defect.
6. Lighthouse / Zoom 720p projector check not re-run this pass.

---

## 10. Sign-off

Demo-ready for the President story (overview → hero → approve → knock-ons → Q2/Q3) with anonymise clean. Draft PR only — do not merge until a human has walked the 08 §1 talk track once anonymised.
