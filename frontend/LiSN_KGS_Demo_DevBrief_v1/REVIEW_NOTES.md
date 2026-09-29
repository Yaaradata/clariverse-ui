# REVIEW_NOTES — pack edit and QA, 28 Sep 2026

**Reviewer:** independent Pack Editor & QA Lead · **Scope:** CONTEXT, 01–08, `mock/` · **Method:** surgical edits only, following the precedence rule in `00_README_START_HERE.md` §4 and the lead's decisions.
**Result:** 123 logged changes: 12 to the mock (M), 8 to README_mock (R) and 103 to the briefs (B1–B103). Four JSON files were regenerated. Two new files: `00_README_START_HERE.md` and this one (B104). `python3 generate_mock.py && python3 check_mock.py` passes **19 / 19** (was 18 / 18; the new check E9 guards the arithmetic fixes). `tsc --strict` ran inside E1. The generator is byte-deterministic: two consecutive runs give identical JSON.

## 1. Mock data (generator → regenerated JSON → checks)

| # | File · location | Before → after | Reason |
|---|---|---|---|
| M1 | `generate_mock.py` `FW40_RATE` | typed array → derived `r1(contacts × 1000 ÷ panels)` | 4.0 weekly rates were 0.06–0.16 off their own counts. They now reconcile; the headline 6.2 vs 2.0 still holds (W24–W26 = 1.97) |
| M2 | `signal_fw41.json` lineage 4.0 · `installedBase.json` lineageMonitor 4.0 | W10 2.0→2.1 · W14 2.0→2.1 · W22 2.0→2.1 · W23 2.1→2.2 | Output of M1 |
| M3 | `generate_mock.py` `FRICTION` → `channel.json` partnerTimeline, wall spark | W22 6→5; Σ W21–W26 41→40 | 40 ÷ 13 = 3.08 → 3.1× keeps the headline true. Threshold week (W24), W16–W20 mean 3.2 and the ~5-week lead are unchanged |
| M4 | `monitor.json` esd-se-07 metric · card 3 · evidenceCount | "13 → 41", value 41, "41 interactions…", evidenceCount 41 → "13 → 40", 40, "40 interactions…", 40 | Follows M3 |
| M5 | `installedBase.json` contactsVsRma.caption | "about 3%" → "about 2%" | 23 ÷ 1,151 = 2.0% |
| M6 | `channel.json` switching row + wall card body/metric | "11 vs 3 (3.6×)" → "(3.7×)" ×3 | 11 ÷ 3 = 3.67 |
| M7 | `channel.json` kpis | "CERTIFICATIONS LAPSING ≤30 DAYS" 212 → 186 | "212" now means only look-alikes (V-12) and invoices in dispute (V-08), both fixed by 02 |
| M8 | `check_mock.py` C6 | expects (41, 13) → (40, 13) and round(40/13, 1) = 3.1 | Follows M3 |
| M9 | `check_mock.py` new **E9** "Arithmetic behind copy" | — → 6 assertions: derived 4.0 rates; 2.0 same-weeks; P-F % from data; every "a vs b (r×)" rounds correctly; card 3 = 13 → 40; certifications = 186 | Stops the regressions coming back |
| M10 | `check_mock.py` docstring, run order, report header | E1–E8 → E1–E9 | Consistency |
| M11 | `types.ts` header comment | lives at `src/data/kgs/types.ts` → `src/mock/kgs/types.ts` (06; 05a names src/data/kgs) | Matches 06; 06 had to tell the agent to "ignore" it |
| M12 | `check_report.txt` | regenerated, 19 / 19 | Task |

## 2. `mock/README_mock.md`

| # | Location | Before → after | Reason |
|---|---|---|---|
| R1 | tree | "E1–E8", "18 / 18" → "E1–E9", "19 / 19" | M9 |
| R2 | tree, `label.ts` line | helper list → says `fmt(str, anon)` renders a whole string and `label(kind, key, anon)` resolves one key | Task 3 (helper naming) |
| R3 | §3 path | copy to `src/mock/` with `@/mock/*` → copy to **`src/mock/kgs/`** with `@kgs/*` (tsconfig snippet updated) | Must match 06 §1.2–§1.3 |
| R4 | §3–§4 code samples (4 imports) | `@/mock/...` → `@kgs/...` | R3 |
| R5 | §4 intro | + "do not alias `fmt` to `label`" | 06 v1 told the agent to add `export { fmt as label }`, which would clash with the existing `label(kind, key, anon)` |
| R6 | Decision 5 | "flagged in 04 §9; change if Ranjith picks otherwise" → confirmed by the lead | Decision made |
| R7 | Decision 14 | 04-vs-02 note → "Open signal →", 02 aligned | Decision made |
| R8 | "FIXED values that do not quite reconcile" | open list → "fixed in pack review" with the new values | M1–M7 |

## 3. Briefs

| # | File · location | Before → after | Reason |
|---|---|---|---|
| B1 | 01 §5 tone table | "Crossed threshold 16 Sep" → "Above threshold since 16 Sep" | Matches the "above threshold" decision and the wall copy |
| B2 | 02 header | v1 → v1.1 (pack-review note) | Traceability |
| B3 | 02 §1 summary wall label | "LiSN signal wall" → "LiSN Signal Wall" | Matches 04 and the mock |
| B4 | 02 §1 diagnosis rows | "What changed / Where it concentrates / Candidate, not cause" → "Main signal / What changed / Decide first" | Lead decision; title and rows as in the mock |
| B5 | 02 §3.3 | "pick one" → "A is used in 04 and the mock" | Removes ambiguity |
| B6 | 02 §3.5 intro | "Delta text is '+n in 4 weeks'" → WoW delta chip + "+n in 4 weeks" micro line | Lead decision (count + WoW delta) |
| B7 | 02 §3.5 big-number row | "+2 / +2 / +1 in 4 weeks" → adds "0 / +1 / 0 vs last week" | B6 |
| B8 | 02 §3.5 borders | Highlighted / Amber / Amber → Orange 2px highlighted / Teal / Sky blue (sky-400) | Lead decision |
| B9 | 02 HS-2 | "Click for details →" → "Open signal →" | Lead decision |
| B10 | 02 HS-6 | 3 tabs → 4 tabs "Snippets 23 · Linked RMAs 2 · Cohort · Method & audit" | Lead decision (04) |
| B11 | 02 HS-9 audit line | "VP Engineering approved investigation · [demo clock]" → "{ts} · VP Engineering approved investigation · INV-2609-031 (synthetic)", {ts} = live click time | Lead decision; matches 04 §4.9 and the mock |
| B12 | 02 HS-11 | anonymise swaps "Partner 1…9", "Region 1" → "Partner P-07", "Region NA-1", "State 1"; + "OFF by default live"; export → print/export forces ON | Lead decisions; 04/05a/mock scheme |
| B13 | 02 R-Q2-1 | "41 interactions vs 13" → "40" | M3 |
| B14 | 02 §8 Q3 components | diagnosis rows → "Main signal / What changed / Decide first" | B4 |
| B15 | 02 §9.2 card 3 | "13 → 41" → "13 → 40" | M3 |
| B16 | 02 §12 open questions | 4 open → items 1, 3, 4 marked decided; item 2 (unit costs) left open | Decisions made |
| B17 | 03 header | + scope note: 03 = visual tokens and components only; LiSN monogram, no client logos | Precedence rule |
| B18 | 03 §1.3 exec sketch | "3 What's on track" → "What's stable"; added AppliedValueStrip row and the [212] suppressed card | Matches 02/04 layout |
| B19 | 03 §1.3 Q1 sketch | + "indicative; build grid is 04 §3.1" | Precedence |
| B20 | 03 §1.3 SD sketch | "← Back to Q1" → "← Back to installed base" | 04 §4.1 |
| B21 | 03 §3A LeftRail | amber squares → nothing or "KGS" tile → LiSN monogram "Li", remove squares, no logos; icons per 04 §1.2 | Lead decision |
| B22 | 03 §3B ExecBriefBar | "Five signals crossed a threshold this week … 212 look-alikes…" → 02 §3.3 A exact | Lead decision / 02 exec copy |
| B23 | 03 §3B PulseCard | "What's on track" + example → "What's stable", copy per 02 §3.4 A, chip row | 02 exec copy |
| B24 | 03 §3B ScoreDelta | "vs last wk" → "+1 vs last week" / "0 vs last week" + "+n in 4 weeks" | Lead decision |
| B25 | 03 §3B SemiGauge | "rollout / stock / OTD" → gauges from 02 §3.5 | 02 |
| B26 | 03 §3B InsightBox | "must end with the routed owner" → body = 02 §3.5 variant A | 02 copy does not end with an owner |
| B27 | 03 §3B SectionHeader | "Signals that crossed their own baseline this week…" → 02 §1 subtitle | "above threshold" decision; 02 copy |
| B28 | 03 §3B RiskSpikeCard | reco box → gate status → compact gate chip + RecommendationBox "LiSN suggests · owner decides" + "Open signal →"; suppressed end card | Matches 02 §9 / 04 §2.7 |
| B29 | 03 §3C SegmentTable | ratio colours ≥2×/≥3× and SIGNALS column → ≥1.2×/≥1.5× (04) and 04's columns | 04 owns panel behaviour |
| B30 | 03 §3C AISummaryWall | subtitle "updated … [illustrative]"; footer "S1 0 · S2 4 · S3 1 · Easing 1" → 04 subtitle; "Open signal →"; per-page footers from the mock | Lead decision; 04 §9 item 11 |
| B31 | 03 §3C DiagnosisBox | "✨ LiSN diagnosis (candidate)" / "Leading candidate · What changed · Decision needed" → title "LiSN evidence summary" (mock), "Main signal · What changed · Decide first" | Lead decision |
| B32 | 03 §3C MomentumTile example | "'rolled back to 4.0' · first seen 4 Sep · 3.1× · 5 cases" → "first seen 9 Sep · 5 cases · 4 partners" | Matches 04 §3.7; the 3.1× was wrong |
| B33 | 03 §3C StackedBarWithDetailPanel | DetailPanel title/grid example → "Loop mapping" + 04 §3.12 grid | 04 |
| B34 | 03 §4 Back to Overview | scroll kept in sessionStorage → in memory, no browser storage | 06 rules forbid browser storage |
| B35 | 03 §5.1 renames | diagnosis title and rows (2 rows) | B31 |
| B36 | 03 §5.2 anonymised mode | "Region 1–4", "Partner tier A–D" → `anonymise.json` labels | Lead decision |
| B37 | 03 §5.4 intro | "Recommendation" → "Decided"; figures restated from 02/04 | Decision made |
| B38 | 03 §5.4 caption row | own captions → 02 §3.5 captions | 02 exec copy |
| B39 | 03 §5.4 big-number row | "+2 / +1 / +1 vs last wk" → "0 / +1 / 0 vs last week" + "+n in 4 weeks" | True WoW; lead decision |
| B40 | 03 §5.4 gauge rows | 4.1 rollout 18%, D-2 stock 40%, OTD revised/original, contacts vs control → 02 gauges (98/80, 99.8/71, 75/8) | Lead decision (02) |
| B41 | 03 §5.4 MiniKPI rows | 03 labels → 02 labels | 02 |
| B42 | 03 §5.4 LiSN INSIGHT row | own text → "02 §3.5 variant A (exact)" | 02 |
| B43 | 03 §6.1 SeverityStrip | "Escalation rule: any S1 phrase…" → "Any S1 phrase in this cohort routes to Quality immediately." | 02 HS-4 exact |
| B44 | 03 §6.2 compact | "K15 / I8" → "K 15 / I 8" | Mock `confidence.short` |
| B45 | 03 §6.3 JoinTagRow | "REGION … CA"; "fw A.4.1" → "Canada"; "A.4.1" | Matches the mock |
| B46 | 03 §6.6 approved state | "Investigation brief approved … 26 Sep 09:40 [illustrative]" → 02 HS-9 title + "audit logged {ts}" (live time) | Lead decision |
| B47 | 03 §6.6 audit line | "Drafted by LiSN 25 Sep 18:04 · routed 18:05…" → "Drafted by LiSN 16 Sep 06:10 UTC · routed 06:10 · IB-2609-004 (synthetic)" | Matches 04 and the mock |
| B48 | 03 §6.6 ApproveButton | "Approve brief" → "Approve investigation" + aria-disabled; enabled "via role switch or presenter key" → via "Viewing as" | Lead decision; 04 §4.9 |
| B49 | 03 §6.6 secondary / affordance | "View draft brief" → "View draft"; ContextBar role switch or Shift+A → local "Viewing as" (P0), global switch P2; chip "Awaiting VP Eng" → "Awaiting approval" / "✓ Investigation approved" | 04 / mock |
| B50 | 03 §6.7 EvidenceDrawer | "Snippets 5" → "Snippets 23"; "Call · ESD Florida" → "Call · ESD-SE-07 · Florida"; footer → 04 footer; source → `signal_fw41.json` | 04 §4.10 |
| B51 | 03 §6.8 lineage chart | aggregate label, 3 marker labels, tooltip example, metric line → 04/02 exact; + "21 days earlier" | 04 §4.4 / 02 HS-3 |
| B52 | 03 §6.11 AnonymiseToggle | `name(label)` helper, "Default on" → `fmt(str, anon)` / `useLabel()`; default OFF live, forced on for print/export | Task 3; lead decision |
| B53 | 03 §6.12 GovernedWatchTile | W-1 "Routed … 23 Sep 10:02" → "6 Sep 14:38 UTC" + chronology line 23 Sep 10:02 | Lead decision |
| B54 | 03 §6.13 FunnelStrip | 4 suppression reasons → V-12's 5 reasons with counts | 02 V-12 |
| B55 | 03 §6.13 SignalChips / ContextBar | "Persists across…" → "Effect persists across…"; Role switch marked P2 | 02 HS-5; scope |
| B56 | 04 header | v2 → v2.1 | Traceability |
| B57 | 04 "How to read" | "render through `fmt()`" → names `mock/lib/label.ts`, `useLabel()`, and what `label()` does | Task 3 |
| B58 | 04 §2.7 card 3 | "13 → 41" → "13 → 40" | M3 |
| B59 | 04 §3.8 P-F caption | "about 3%" → "about 2%" | M5 |
| B60 | 04 §3.11 DiagnosisBox | "✨ LiSN Diagnosis" → "LiSN evidence summary" (mock title, ✨ icon) | Lead decision |
| B61 | 04 §5.1 C-0 | certifications 212 → 186 | M7 |
| B62 | 04 §5.1 C-F | 3.6× → 3.7× | M6 |
| B63 | 04 §7.1 | `fmt` location named | Task 3 |
| B64 | 04 §8.2 build slot 0:00 | copy to `src/data/kgs/`, add values.ts and DemoProvider → copy `mock/` to `src/mock/kgs/`; lists the existing lib files | Task 4 (06 path) |
| B65 | 04 §9 | 11 open inconsistencies → "settled in pack review", with how each was settled | Tasks 1–2 |
| B66 | 05a header, rules | v2 → v2.1; `src/data/kgs/` → pack `mock/` copied to `src/mock/kgs/` | Task 4 |
| B67 | 05a §2 heading | `src/data/kgs/types.ts` → `mock/types.ts` → repo `src/mock/kgs/types.ts` | Task 4 |
| B68 | 05a §3.1 | `fmt` location; `label()` = one key; `useLabel()` | Task 3 |
| B69 | 05a §4.6 channel kpis | 212 → 186 | M7 |
| B70 | 05a §4.6 switching | 3.6× → 3.7× | M6 |
| B71 | 05a §5.2 4.0 rate | typed array → "derived" + new array | M1 |
| B72 | 05a §5.2 headline | + "W24–W26: 33 ÷ 16,790 × 1,000 = 1.97" | Shows 2.0 still holds |
| B73 | 05a §5.3 lineage monitor 4.0 | "…1.8, 2.0, 2.1, 1.9…" → "…1.8, 2.1, 2.2, 1.9…" | M2 |
| B74 | 05a §5.6 friction | W22 6 → 5; "Σ 41" → "Σ 40 (3.08 → 3.1×)" | M3 |
| B75 | 05a §6 check 6 | "41 vs baseline 13" → "40 vs 13 (3.1×)" | M3 |
| B76 | 05a changelog | + v2.1 entries | Traceability |
| B77 | 06 header | v1 → v1.1; companions list the real mock tree; "Start with 00" | Task 4 |
| B78 | 06 "Order of truth" | "04 wins where 01/02/03 disagree" → pack precedence rule (02 owns value figures and exec copy) | Task 2 / precedence rule |
| B79 | 06 §0 step 2 label | "`label()`" → "`fmt()`/`useLabel()`" | Task 3 |
| B80 | 06 §1.2 cp of brief pack | + `00_README_START_HERE.md` | New file |
| B81 | 06 §1.2 mock copy comment | "types.ts · data/*.json · lib/demoState.ts" → full tree incl. `lib/{label,demoState,values,data}.ts`, README; notes the .py files are dev-only | Task 4 (verified against `mock/`) |
| B82 | 06 §2 intro | "Step 2 adds a one-line `label` alias" → actual exports of label.ts, demoState.ts, values.ts, data.ts | Task 3. The alias would have clashed with the existing `label(kind, key, anon)` |
| B83 | 06 rules · order of truth 1–2 | `src/mock/kgs/values.ts` → `lib/values.ts`; 04-wins → precedence rule | Task 4 / precedence rule |
| B84 | 06 rules · state | DemoProvider → "from `@kgs/lib/demoState`" | Task 4 |
| B85 | 06 rules · data | `@kgs/values` → `@kgs/lib/values`; typed via `@kgs/lib/data` | Task 4 |
| B86 | 06 rules · labels | "`useLabel` wraps `label(str, anon)` from demoState" → wraps `fmt(str, anon)` from `@kgs/lib/label`; `L.one()`; `roleLabel()` | Task 3 |
| B87 | 06 rules · timestamps | + `fmtDemoTime` location; `approve()`/`requestDecision()` already capture ts | Task 3 |
| B88 | 06 rules · file layout | `{types.ts,values.ts,data/*.json,lib/demoState.ts}` → real tree | Task 4 |
| B89 | 06 Step 2 heading, Files, Context | `label()`; values.ts/DemoProvider "create" → existing lib files read; README + lib files added to context | Task 4 |
| B90 | 06 Step 2 items 2–5 | confirm/alias `label`, build DemoProvider, create values.ts → read and do not reimplement; DemoProvider.tsx = thin 'use client' re-export; values already exist; checks.ts optional | Task 4; avoids duplicate state and values modules |
| B91 | 06 Step 2 pitfalls | "cast once in a data.ts barrel" → use the existing `@kgs/lib/data`; + `?anon=1` hydration note | Mock already provides the barrel |
| B92 | 06 Step 8 context | `@src/mock/kgs/values.ts` → `lib/values.ts` | Task 4 |
| B93 | 06 Step 11 | `markDrawerOpened()` → `drawerOpened()` | Actual demoState API |
| B94 | 06 Step 14 item 6 | DiagnosisBox "✨ LiSN Diagnosis" → `diagnosis.title` "LiSN evidence summary" + `meta.labels.diagnosisRows` | Lead decision; mock keys verified |
| B95 | 06 §4.2 "Never drop" | "because they are cheap and contractual" → "quick to keep and contractual" | House style (no "cheap") |
| B96 | 06 §6 link unfurls | "title via `label()`" → "`fmt()`" | Task 3 |
| B97 | 06 §7 last row | "alias `export { fmt as label }`" → use the fixed names as-is; never alias | Task 3 |
| B98 | 07 §3 caution | "41 interactions … Showing 6 of 41" → 40 | M3 |
| B99 | 08 §5.6 | "LiSN Diagnosis" → "LiSN evidence summary" (+ rows) | Lead decision |
| B100 | 08 §5.7 ESD row | "13 → 41 … Pulse B" → "13 → 40"; dropped "Pulse B" (variant B is not on screen) | M3; accuracy |
| B101 | 08 §5.7 D-2 row | "Q1 insight B" → "Q1 'What's counted' row #2" | Variant B is not on screen |
| B102 | 08 §5.7 | + row: certifications 186 · Houston 3.7× · P-F "about 2%" | Cross-file consistency |
| B103 | 08 §7 | 3 open items → marked settled; points to 00 §8 | Tasks 1, 7 |
| B104 | new | `00_README_START_HERE.md` and `REVIEW_NOTES.md` | Tasks 7, 8 |

**Swept with no change needed:**
- No "LisN" or "Lisn" in any UI string or JSON value; the only hits are banned-word lists and the code identifier `askLisn`.
- No "!" in copy.
- No "resolves" claim, FCI or other banking leftover, residential or recall content, "300K daily" or current-KGS-defect claim in 04, 05a or the mock.
- British spelling holds; `colors:` is a Tailwind config key.
- The synthetic badge sits on every route via the ContextBar (04 §1.4, §7.2), plus the hero header, drawer and modal.
- Hero figures (3.1×, 6.2 vs 2.0, 9 partners / 3 regions, 1,240, 5,560, 23, 16 Sep, 7 Oct, ≈ $12k, ≈ $0.15m) and volumes (~1,800 per working day, ~9,000 per week, 233,900 over 26 weeks) match across 01, 02, 04, 05a, 06, 08 and the mock, as do the card counts (2/2/1), the deltas and the value ledger (~430, ~290, ~140, ~48, ≤ $0.5m, $2.3m, £1.1m).

## 4. Not changed / unresolved
1. **`askLisn.json` / `AskLisnItem`** use "Lisn" as a code identifier. This is a P2 file and never shown in the UI. It was left alone because renaming touches the generator, types, the data barrel and the checks. It is listed as open item 8 in 00.
2. **Unit costs** behind V-01…V-10 are still synthetic and unconfirmed (02 §12 item 2; 00 §8 item 1).
3. **`demoState.ts` reads `?anon=1` from `window` in its initial state.** Under SSR this can raise a hydration warning when `?anon=1` is used. The code was not changed (it is outside this review's remit and the checks pass); it is flagged as a pitfall in 06 Step 2.
4. **03's illustrative components** that 04 does not use (TopIntent "14 identified", FrictionTable, PromiseGapTable, Funnel, EngagementCard examples) were left as they are. The new scope note in 03 marks all 03 copy as illustrative.
5. **07** was checked by targeted search (house style, figures, labels), not line by line; only B98 needed a change.
6. **06 Step 2 still asks for a `checks.ts`** that partly repeats `check_mock.py`. It was kept, because it is a useful runtime guard in the repo. It is optional.
7. **CONTEXT.md** was not edited (it is the team brief). Its "~234k over 26 weeks" is consistent with 233,900.
