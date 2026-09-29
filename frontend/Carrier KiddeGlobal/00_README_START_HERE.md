# 00 · START HERE — LiSN × KGS Global Commercial Fire demo

**For:** Ranjit BK (builds tomorrow, 29 Sep, one day, in Cursor) · **Owner:** Ranjith · **v1 · 28 Sep 2026**

## 1. What we are building and why
A KGS version of the existing Vercel-hosted LiSN demo (built for a bank's Head of Cards), with **the same look and feel**, KGS mock data and screen transitions. The audience is **Kartik Kumar, President, Global Commercial Fire, KGS**. On screen he is only ever "President".
**Success:** Kartik says *"let's try this — and get more people on the next call"*, and names an owner.
**What gets us there:** an exec overview that is clearly sized to his business, plus one **double-click** that feels real. That double-click is the EST4 fw 4.1 (synthetic) signal: 3.1× vs 4.0 under a green RMA aggregate, with 23 evidence items, a draft brief and a live approval by VP Engineering.

## 2. What's in the pack

| File | What it is | Who reads it | When |
|---|---|---|---|
| `00_README_START_HERE.md` | This page | RBK, Ranjith | First |
| `06_Cursor_Build_Plan.md` | Setup, Cursor rules file, 20 steps with paste-ready prompts, cut-lines, QA, deploy | RBK | Before starting; then step by step |
| `04_UX_Screens_Copy_Transitions.md` | Every screen, exact copy, bindings, approval flow, motion, demo controls | RBK | Step by step (each prompt names its §) |
| `03_Look_and_Feel_Reference.md` | Visual tokens, component anatomy, bank → KGS component map | RBK | Steps 1–8 |
| `05a_Data_Contract.md` | Types, tokens, anonymise map, FIXED values, checks | RBK | Step 2; then as needed |
| `mock/` (`README_mock.md`, `types.ts`, `lib/*.ts`, `data/*.json`, generator, checks) | Ready-made mock data and helpers; 19 / 19 checks pass | RBK | Step 0 (copy it in); Step 2 |
| `01_Persona_Exec_Brief.md` | Who Kartik is, glossary, tone rules, the five moments | RBK (context), Ranjith | After the 20-minute path |
| `02_Requirements_Pain_Value.md` | Pain → screen → value; value register V-01…V-14; exec copy | RBK (context), Ranjith | After the 20-minute path |
| `07_Research_Prompts_for_ChatGPT_Claude.md` | Optional prompts (primer, extra synthetic content, critique) | RBK | Only if needed |
| `08_Demo_Script_and_QA.md` | Talk track, objection cards, pre-demo QA, recovery | Ranjith (presenter), RBK (driver) | Evening before and on the day |
| `CONTEXT.md` · `REVIEW_NOTES.md` | Team brief · pack-review change log | Anyone | Reference |

## 3. Reading order for RBK (20-minute path)
**00** (this page) → **06 §0–§2** (plan, setup, rules file) → **04** (skim §1–§4; the hero is §4) → **03** (skim §1.3, §3, §6) → **05a §1–§3** and **`mock/README_mock.md`**. Then read **01** and **02** for context when you have a break.

## 4. Precedence rule (when files disagree)
1. **04 + 05a + the generated mock data** are the source of truth for screens, panel-level copy, data and behaviour.
2. **02** is the source of truth for value figures (V-01…V-14) and exec-level copy (Brief, Pulse, card headlines, value ledger). 04 and the mock already match it.
3. **03** is the source of truth for visual tokens and components only. Its example copy is illustrative, and the repo's Tailwind config wins over 03's sampled hex.
4. If a number on screen is not in `mock/data/*.json`, it is a bug.

## 5. Scope and non-negotiables
- **P0** (must ship): the shell (LiSN monogram, rail, header, ContextBar, badge, footer, DemoMenu, anonymise); the exec overview (funnel, Brief, Pulse, 3 question cards with What's counted, Applied value strip + How we count, Field Signal Monitor 5 + suppressed card, governed watch, evidence readiness); the Q1 drill-down; the hero deep-dive with the evidence drawer (4 tabs), the draft modal, "Viewing as", Approve with a live timestamp and the knock-ons.
- **P1**: Q2 `/channel` and Q3 `/separation` (reuse components), P-J bar interaction, lifecycle table, live filters, intro.
- **P2**: Ask LiSN canned panel, global role switcher, `/signal/:id`, presenter shortcuts, v2 teaser.
- **Non-negotiables**
  - Badge "SYNTHETIC SCENARIO — illustrative data, not KGS data" on every route, drawer and modal, plus the fixed footer.
  - Every signal shows: severity (S-class + word, type, blast radius, incident flag), K/I confidence, join tags, a P&L line, the routed owner and the gate state.
  - LiSN "aids resolution"; it drafts and people approve. Nothing is sent, and no send, notify or export control is enabled.
  - Never sum USD and GBP. Money carries the "ILLUSTRATIVE" chip. No revenue, savings or ROI anywhere.
  - House style: "LiSN" (never LisN or Lisn), British spelling, no exclamation marks, never "cheap".
  - Never show: FCI or other banking leftovers, residential or recall content, "300K daily", or any implication of a current KGS defect.

## 6. Timeline for tomorrow (from 06 §0)

| Clock | Work | Checkpoint |
|---|---|---|
| 0:00–0:50 | Setup, repo map, data layer (copy `mock/` → `src/mock/kgs/`), routes | |
| 0:50–4:00 | Fork components, shell, signal primitives, exec overview A/B/C | **4:00 — exec overview demo-ready** |
| 4:00–7:30 | Hero + lineage chart, decision panel + approval, evidence drawer, draft modal, Q1 part A | **7:00 — full hero story end to end (minimum shippable)** |
| 7:30–9:00 | Q1 part B, motion pass, P0 QA + preview deploy | |
| 9:00–10:00 | Q2, Q3 (P1) | **10:00 — P0 + P1 deployed** |
| after | P1 extras, then P2 | only if ahead; otherwise use the 06 §4.2 cut-lines |

## 7. Decisions already made (do not reopen)
- Question cards show the **count of signals above threshold** plus a week-on-week delta ("0 / +1 / 0 vs last week") and "+n in 4 weeks". There is no 0–100 index or score.
- Wording is "above threshold this week", never "crossed a threshold this week". Executive Brief and Pulse use variant A from 02.
- W-1 is routed on **6 Sep 14:38 UTC**; 23 Sep 10:02 is the back-search chronology update. The watch tile never shows a platform, firmware or country.
- The approval timestamp is the **live click time**, "DD Mon HH:MM UTC", captured once and identical on the gate, the audit log, the toast and the draft chip. A reload or "Reset demo" resets it.
- Anonymise is **OFF by default** in the live session. `?anon=1` forces it on, and print or export forces it on with a watermark. Labels follow `anonymise.json` ("Panel platform A", "A.4.1", "Partner P-07", "Region NA-1", "State 1").
- Logo: LiSN monogram placeholder "Li" only. No client, bank, YaaraLabs or partner logos.
- Borders: Q1 orange (2px, highlighted), Q2 teal, Q3 sky-400.
- Diagnosis box: title "LiSN evidence summary" (as in the mock), rows "Main signal / What changed / Decide first".
- Evidence drawer has 4 tabs: "Snippets 23 · Linked RMAs 2 · Cohort · Method & audit". The wall link reads "Open signal →".
- Figures: never sum USD and GBP. ESD-SE-07 is **40 vs 13 (3.1×)**. Houston is 11 vs 3 (**3.7×**). The P-F caption reads "about 2%". Q2 certifications lapsing is **186**; "212" means only look-alikes suppressed and invoices in dispute.
- The local "Viewing as: President | VP Engineering" switch on the decision panel is P0. The global role switch is P2.
- Helper names are fixed by the mock: `fmt(str, anon)` renders a whole string and `label(kind, key, anon)` resolves one key (both in `lib/label.ts`); `useLabel()` and `DemoProvider` live in `lib/demoState.ts`; `lib/values.ts` is the single values module.

## 8. Open items for Ranjith (each with a proposed default)

| # | Item | Proposed default |
|---|---|---|
| 1 | Unit costs behind V-01…V-10: $750 per excess fault contact ($450 truck roll + $150 Tier-3 + $150 NFF share), $120 per detector replacement, $25–60 per tier-1 contact (02 §2) | Keep as written. Changing them means regenerating the mock and re-checking V-01…V-10 |
| 2 | Real platform names (EST4, Edwards) in the live, narrated session | Named, with anonymise OFF and the badge always visible. Anything sent afterwards is anonymised |
| 3 | Discovery ask in the close: 90 days, NA Edwards, 12–24 months of extracts, blind test (08 §1.7) | Say it as written |
| 4 | Forwardable paragraph for Kartik (08 §3) | Offer it only if he asks who to invite |
| 5 | Covering note after the call: channel and tone (08 §6.1) | Email within 24 hours with the anonymised screenshot PDF; no live link |
| 6 | Sharing the live link | Do not share it. If one is needed, use a Basic-Auth, force-anonymised alias (06 §6) |
| 7 | EST3 "new orders halted end-2023" (01 glossary, marked "re-check before quoting") | Keep it off screen and out of the talk track |
| 8 | Code identifier `askLisn.json` / `AskLisnItem` (P2 file, never shown in the UI) | Keep. Renaming touches the generator, types and checks for no visible gain |

## 9. Where to ask questions
- **Copy, figures, scope or tone:** Ranjith. Batch questions at the 4:00 and 7:00 checkpoints.
- **Data shapes or a missing field:** check `mock/README_mock.md`, then 05a. If a string is missing, add it to the JSON using the exact text from 04 or 02, and note it in the commit message.
- **Never block:** apply the default in §8 or the precedence rule in §4, write down what you chose, and keep building.
