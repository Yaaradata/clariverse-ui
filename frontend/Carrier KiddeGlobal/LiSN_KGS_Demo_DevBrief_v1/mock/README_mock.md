# Mock data: LiSN × KGS Global Commercial Fire demo

Everything in this folder is a **synthetic scenario**. It contains no KGS data. Firmware versions, serials, date codes, SKU families, partner IDs, RMA numbers and invoice numbers are all synthetic.

The sources of truth are `../05a_Data_Contract.md` (types, files, FIXED values, checks), `../02_Requirements_Pain_Value.md` (value figures V-01…V-14 and exec copy) and `../04_UX_Screens_Copy_Transitions.md` (panel copy and bindings).

```
mock/
├── types.ts              05a §2 interfaces, member-for-member (Part A), plus file wrappers (Part B)
├── generate_mock.py      deterministic generator (Python 3 stdlib, seed 20260925) → data/*.json
├── check_mock.py         05a §6 checks C1–C10 + extra checks E1–E9 → check_report.txt
├── check_report.txt      last run: 19 / 19 pass
├── data/                 the 9 JSON files (pretty-printed, UTF-8)
└── lib/
    ├── label.ts          fmt(str, anon) whole string · label(kind, key, anon) one key · roleLabel() / withRole() / withTs() / fmtDemoTime()
    ├── demoState.ts      DemoProvider + useDemo() + useLabel() (plain React context)
    ├── values.ts         the single values module: VALUES['V-02'], methodFor(), money, unitCosts
    └── data.ts           typed barrel over data/*.json (exec, monitor, signalFw41, …)
```

---

## 1. Files and what they feed

| File | Priority | Feeds (04 section · component) | Key paths |
|---|---|---|---|
| `meta.json` | P0 | Shell on every route: `DrillHeader` title and breadcrumbs (§1.3), `ContextBar` filters, data-as-of, `SyntheticBadge` and tooltip (§1.4), `FixedFooter` (§1.5), intro lines (§6.1), `DemoMenu` toast and watermark (§7) | `breadcrumbs[route]` (with `{role}`), `filters`, `badge`, `footer`, `labels` (02 §1 UI labels), `weeks`, `weeklyInteractions`, `dailyInteractions`, `channelMix`, `demo` |
| `exec.json` | P0 | Exec overview `/`: `FunnelStrip` + suppressed popover (§2.2), `ExecBriefBar` (§2.3), `PulseStrip` (§2.4), 3 × `QuestionCard` + `WhatsCountedPopover` (§2.5), `AppliedValueStrip` + AV-1 popover + `HowWeCountDrawer` (§2.6), `GovernedWatchTile` + modal (§2.8), `EvidenceReadinessTile` (§2.9) | `funnel`, `brief`, `pulse[]`, `questionCards[]`, `appliedValue`, `valueRegister`, `unitCosts`, `valueStatements`, `howWeCount`, `money`, `governedWatch`, `evidenceReadiness` |
| `monitor.json` | P0 | Field Signal Monitor strip (§2.7): `SectionHeader`, 5 × `RiskSpikeCard`, `SuppressedEndCard`. `signals[]` is the signal register used by every route (counts, ranks, `WhyRankedPopover`, `/signal/:id` P2) | `section`, `signals[]` (5 above threshold + `evidence-readiness` enabler), `cards[]`, `suppressedCard` |
| `signal_fw41.json` | P0 | Hero deep-dive `/installed-base/signal/fw-4-1` (§4): header and `RankChip`, `SeverityStrip`, `FirmwareLineageChart`, `SignalChips`, `CounterEvidence`, `ConfidenceMarker`, `JoinTagRow`, `PnLDestinationTag`, `RoutedOwner`, decision panel (`HumanGateStatus` + `ApproveButton` + "Viewing as"), `EvidenceDrawer` (4 tabs), `DraftPreviewModal`. It also feeds the Q1 card's `AreaTrend` (`lineage`) | `signal` (`gates[0]` = investigation brief, `gates[1]` = known-issue note), `lineage`, `cohort`, `evidence[23]`, `rmas[2]`, `method`, `audit`, `auditRuntime`, `drawer`, `draftBrief` |
| `installedBase.json` | P0 (lifecycle P1) | Q1 drill-down `/installed-base` (§3): P-0 KPIs, P-A table, P-B clusters, P-C lineage monitor, P-D `DateCodeHeatStrip` (`#date-code`), P-E phrasing table, P-F contacts ↔ RMA, P-G Signal Wall, P-H `EnhancedPanel` (`#why-late`), P-I `DiagnosisBox`, P-J `StackedBarWithDetailPanel`, P-K What's stable, P-L lifecycle | `kpis`, `interactionsTable`, `clustersBySeverity`, `lineageMonitor`, `dateCode`, `emergingPhrasing`, `contactsVsRma`, `signalWall`, `enhanced`, `diagnosis`, `symptomStack`, `stable`, `lifecycle`, `panelCopy['P-A'…'P-L']` |
| `channel.json` | P1 | Q2 drill-down `/channel` (§5.1): C-0 KPIs, C-B partner league (`#esd-se-07`), C-C partner timeline, C-D backorder bars (`#backorder`), C-E certification, C-F switching, C-G enhanced, C-H stable, C-I wall, C-J diagnosis. It also feeds the Q2 card's `AreaTrend` (`partnerTimeline`) | `league`, `partnerTimeline`, `backorder`, `certification`, `switching`, `enhanced`, `stable`, `signalWall`, `diagnosis`, `panelCopy` |
| `separation.json` | P1 | Q3 drill-down `/separation` (§5.2): S-0 KPIs, S-B cutover timeline, S-C scorecard (`#scorecard`), S-D topic × country, S-E defect split, S-F gates, S-G enhanced, S-H legacy, S-I wall, S-J diagnosis. It also feeds the Q3 card's `AreaTrend` (`cutoverTimeline`) | `cutoverTimeline`, `scorecard`, `topicStack`, `topicTotals`, `defectSplit`, `gates[3]`, `enhanced`, `legacy`, `signalWall`, `diagnosis`, `disputeTrend`, `panelCopy` |
| `anonymise.json` | P0 | `fmt()` / `AnonymiseToggle` (§7.1). 05a §3.2 verbatim | `{ kind: { key: { named, anon } } }` |
| `askLisn.json` | P2 | Ask LiSN panel (§2.10) | 3 × `{ q, a, cites[] }` |

**Question-card trends** point into other files through `questionCards[].trend.ref`:
- Q1 → `signal_fw41.json#lineage`
- Q2 → `channel.json#partnerTimeline`
- Q3 → `separation.json#cutoverTimeline`

**Runtime placeholders.** These strings are never filled in the data:
- `{role}` appears in breadcrumbs.
- `{ts}` appears in gate `onApprove`, `decisionRequest`, the toast, the audit entry and `draftBrief.chipApproved`.
- `{weekStart}`, `{rate41}`, … appear in `lineage.tooltipTemplate`.

---

## 2. Regenerate and check

```bash
cd mock
python3 generate_mock.py      # writes data/*.json (same bytes every run)
python3 check_mock.py         # writes check_report.txt; exit 0 = all pass
```

The generator is seeded, so its output is byte-identical on every run. The FIXED values come from 05a, and the GEN values are drawn in a fixed order. To change a GEN value, change `SEED` or the generator, never the JSON by hand; then re-run both commands.

`check_mock.py` uses `tsc` (if it is on `PATH`) to compile every JSON file against its interface under `--strict`, plus the four `lib/*.ts` files. React is shimmed, so no `node_modules` is needed. If `tsc` is not on `PATH`, the Python required-key check still runs.

---

## 3. Using it in Next.js / React

Copy the whole folder to **`src/mock/kgs/`** and add the alias `@kgs/*` (06 §1.2–§1.3; 05a's `src/data/kgs/` is the same content in another folder). `tsconfig.json` needs:

```jsonc
{ "compilerOptions": { "resolveJsonModule": true, "esModuleInterop": true, "paths": { "@kgs/*": ["./src/mock/kgs/*"] } } }
```

**Direct JSON import** (fine for rendering copy):

```ts
import exec from '@kgs/data/exec.json';
import monitor from '@kgs/data/monitor.json';

exec.brief;                         // "Five signals above threshold — installed base 2, …"
monitor.cards[0].title;             // "{{platform:EST4}} fw {{fw:EST4@4.1}} — devices not found after upgrade"
```

**Typed import** (recommended; JSON imports widen `'USD'` to `string` and tuples to arrays):

```ts
import { exec, monitor, signalFw41, installedBase, signalById } from '@kgs/lib/data';
import type { QuestionCardData, Signal } from '@kgs/types';

const cards: QuestionCardData[] = exec.questionCards;
const hero: Signal = signalById['fw-4-1'];
```

**Value figures.** Import them from one module. Never recompute or re-round them.

```ts
import { VALUES, methodFor, money } from '@kgs/lib/values';
<Tooltip content={methodFor(tile.methodIds)} />      // AV tiles
<Tooltip content={methodFor('V-01,V-02')} />          // hero P&L line (valueId)
money.invoicesInDispute  // { amount: 1100000, currency: 'GBP', display: '£1.1m', illustrative: true, valueId: 'V-08' }
```

---

## 4. Anonymise: how the map is applied

Every display string may contain `{{kind:key}}` tokens. Kinds are `brand`, `platform`, `fw`, `partner`, `region`, `place` and `term`, and firmware keys are `PLATFORM@version`. Render every string through `fmt(str, anon)` (in components, `useLabel()`), including chart labels, tooltips, breadcrumbs and `<title>`. `label(kind, key, anon)` resolves a single key and is not a whole-string renderer; do not alias `fmt` to it.

```ts
// lib/label.ts (excerpt)
import anonymise from '../data/anonymise.json';
const TOKEN = /\{\{(brand|platform|fw|partner|region|place|term):([^{}]+)\}\}/g;

export function label(kind: TokenKind, key: string, anon: boolean): string {
  const e = (anonymise as AnonymiseMap)[kind]?.[key];
  if (!e) { console.warn(`[fmt] unknown token {{${kind}:${key}}}`); return key; }
  return anon ? e.anon : e.named;
}
export const fmt = (s: string, anon: boolean) => s.replace(TOKEN, (_m, k, key) => label(k, key, anon));
```

In components, use the hook, which reads the current toggle:

```tsx
'use client';
import { useLabel, useDemo } from '@kgs/lib/demoState';
import { withRole } from '@kgs/lib/label';
import { meta, signalFw41 } from '@kgs/lib/data';

export function HeroHeadline() {
  const t = useLabel();                          // t(str) → rendered for the current mode
  const { state } = useDemo();
  return (
    <>
      <p className="text-sm text-neutral-400">{t(withRole(meta.breadcrumbs['/installed-base/signal/fw-4-1'], state.viewingAs))}</p>
      <h1>{t(signalFw41.signal.headline)}</h1>
      {/* named: "EST4 · firmware 4.1 (synthetic) — …"   anonymised: "Panel platform A · firmware A.4.1 (synthetic) — …" */}
    </>
  );
}
```

Three cases need special handling:
- **Role fields** (`routing.owner` / `cc` / `informed`, `gate.owner` / `approveEnabledFor`) hold literal `Role` values. Render them with `roleLabel(role, anon)`. This turns "Regional GM UK-EU" into "Regional GM Region EU-1" when anonymised.
- **Region filter options** (`meta.filters.region`) are raw by contract. Render each option as `t.one('region', v)` when `anonymise.json` has the key ("UK-EU" → "Region EU-1"), and as-is otherwise ("NA", "MEA" …).
- **Print and export:** on `beforeprint`, call `setAnonymise(true)` and show `meta.demo.watermark`. On `afterprint`, restore the previous value. The named mode is never exported.

---

## 5. Demo state (`lib/demoState.ts`)

This is a plain React context with a reducer and no library. It holds only runtime state, the 05a `DemoState`:
- `viewingAs`
- `anonymise`
- `approvals[signalId].ts`
- `decisionRequested[signalId].ts`
- `drawerOpenedAt`

A reload resets it (02 HS-9), and so does `reset()`. `?anon=1` forces anonymised mode on load and after a reset.

```tsx
const { state, setViewingAs, approve, requestDecision, isApproved, reset } = useDemo();
const gate = signalFw41.signal.gates[0];
const approved = isApproved('fw-4-1');

// Approve (enabled only when state.viewingAs is in gate.approveEnabledFor)
const onApprove = () => {
  const ts = approve('fw-4-1');                          // fmtDemoTime(new Date()) captured ONCE
  toast({ title: gate.onApprove!.toast.title, body: t(withTs(gate.onApprove!.toast.body, ts)) });
  // the gate audit line, the drawer audit entry and the toast all use this same ts
};

// Knock-on updates read the same flag:
//   Pulse card 1 chip   approved ? exec.pulse[0].chipAfterApprove : exec.pulse[0].chips[2]
//   FSM card 1 chip     approved ? monitor.cards[0].gateChipAfterApprove : monitor.cards[0].ownerGate
//   AV-3                approved ? tile.onApprove : tile
//   P-J action box      green when approved
//   Known-issue note    approved ? gate.onApproveSecondary.title : signal.gates[1].title
```

---

## 6. Decisions

These are choices made where 05a was ambiguous or silent. Each follows 02 wherever 02 speaks.

1. **Tokenised everywhere, rendering unchanged.** 05a shows some copy with raw names, for example the signal title "EST4 fw 4.1 — …", the gauge "EST4 RMA rate vs control limit", the KPI labels, "fw 4.1 (synthetic)" in counted rows, and the V-register methods.
   - All brand, platform, partner, region, place and EST4 firmware (4.0 / 4.1) references are stored as tokens, per 05a's rule and check 8.
   - The named rendering is byte-identical to the FIXED copy. Check E8 renders 87 exec and hero strings plus all 14 V-rows and finds each verbatim in 02.
2. **Other firmware versions** in the Q1 lineage monitor labels use their `fw` keys, e.g. "{{platform:Edge}} {{fw:Edge@3.2}} (syn.)". They render "Edge 3.2 (syn.)" named and "Panel platform C C.3.2 (syn.)" anonymised.
3. **The "EST3" column** in the symptom stack is stored as `{{platform:EST3/EST3X}}`, because that is the only EST3 key in the map. It renders "EST3/EST3X".
4. **Role fields stay literal** so they type-check as `Role`. Copy strings that mention "Regional GM UK-EU" are tokenised. `roleLabel()` keeps the two consistent when anonymised.
5. **Diagnosis box label.**
   - 02 §1 names it "LiSN evidence summary"; 04 used "✨ LiSN Diagnosis". Following 02, `diagnosis.title` is "LiSN evidence summary".
   - The row captions follow the fields 05a typed (`main` / `changed` / `decideFirst`), and are stored in `meta.labels.diagnosisRows` = "Main signal / What changed / Decide first".
   - Confirmed by the lead (28 Sep): title per mock, rows "Main signal / What changed / Decide first"; 02, 03 and 04 now say the same.
6. **`score` fields.** Check 4 says "no field named `index` or `score`", but 05a §2 itself defines `RankFactor.score` and `Confidence.sourceIndependence.score`. Those two are kept. No other `score` field exists, and there is no `index` anywhere. The question cards carry counts only.
7. **Part B types (additions).** 05a's JSON sketches contain fields that its interfaces do not declare, for example the hero's `headerTitle`, `subline` and `gateFooter`, and the file-level shapes of `exec`, `monitor` and `signal_fw41`. These are typed as wrappers (`HeroSignal`, `ExecFile`, …) without changing any Part A member.
   - New data fields: `meta.descriptor`, `labels` and `dailyInteractions`; `exec.briefLabel`, `pulseLabel`, `whatsCountedTitle`, `howWeCount` and `money`; `monitor.section`; `hero.signal.whyRanked`; and `drawer.featuredHeading` / `allHeading`.
   - Also new: `lineage` (typed as `HeroLineage`), `panelCopy` on the three page files (titles, column headers, units and anchors from 04), and `separation.topicTotals` / `disputeTrend`.
8. **Method tab "Exposure" row.** 05a had the placeholder "V-01 and V-02 method text from 02 §2 (verbatim)". It is replaced with two rows carrying that verbatim text.
9. **Signals #2–#5 and the enabler** are full `Signal` records. 05a gives only their summary rows.
   - Title, chips, owner, confidence, next review and gate copy come from 02 §9.2 and 04.
   - Headline, metric line, join tags, counter-evidence and rank factors are authored to match 02's figures.
   - For each rank-factor set, the last factor's score is solved so that Σ weight × score equals the FIXED rank score (0.71 / 0.66 / 0.58 / 0.52).
10. **AV-3 "7 drafts"** is read as the 7 draft artefacts across the five signals:
    - fw 4.1: brief and known-issue note
    - D-2: containment memo
    - ESD-SE-07: recovery brief
    - N-3: allocation list
    - UK-EU: defect ticket and distributor notice

    The CFO dunning pause is a decision, not a draft. The UK-EU signal carries all three separation gates, and its primary gate is the defect ticket.
11. **D-2 gate.** The copy says "awaiting Quality approval" while 02 routes the signal to Director Product Quality. The owner is Director Product Quality, and `approveEnabledFor` holds both Director Product Quality and Quality.
12. **Money register.** `exec.money` holds typed `Money` values, each with its V-id, for chips and tooltips. The only multi-V entry is "Warranty & field ≤ $0.5m" (V-02 + V-05), which is USD + USD. AV-4 has no total field.
13. **Numeric money arrays** declare their units in `panelCopy`: backorder bars in $m, sell-in in $k/week, and disputes in `disputeTrend.currency: 'GBP'`.
14. **Wall link label** is "Open signal →" (lead decision); 02 HS-2 now says the same.
15. **GEN series.**
    - **Daily interactions:** 130 working days, a day-of-week profile, and lower days on 3 Apr, 25 May, 3 Jul and 7 Sep. Each week sums exactly to the FIXED weekly total; the range is 1,136–2,504 and the peak week is W13.
    - **Cutover baselines W1–W22:** a mild seasonal wave plus a quarter-end lift at W13, with integer sums fixed to the exact means of 30, 22 and 40. There is no bump after the clean W16, W19 and W20 cutovers.
    - **D-2 units:** about 1,200 per week, with the 2611–2614 window summing to 4,800.
    - **UK-EU topic split:** about 55 / 20 / 12 / 8 / 5% across UK / DE / NL / FR / Other EU, with small seeded jitter.
    - **Pins, switching rows and panels:** six ESD-SE-07 evidence pins (competitor shown as "[competitor]"), two below-threshold switching rows, and "within own baseline" detail panels for the non-default bars (P1 interactivity; no new signals).
16. **Evidence `highlight` phrases** are token-free substrings, so they match in both modes.
17. **Naming.** `AskLisnItem` keeps 05a's TypeScript identifier. It is code, not a UI string. The banned-spelling checks run on every JSON value and key.

### FIXED values that did not reconcile — fixed in pack review (28 Sep)

These were flagged by the builders and are now fixed in the generator, the data and every brief that repeats them. Check E9 guards them.

- **P-F caption** now reads "about **2%**": 23 of 1,151 W23–W26 EST4 trouble contacts = 2.0%.
- **Houston switching row** now reads "11 vs 3 (**3.7×**)" (11 ÷ 3 = 3.67).
- **ESD-SE-07** is now **40** vs 13 over W21–W26 (friction W22 = 5), so 40 ÷ 13 = 3.08 → **3.1×** as 02 states. Card 3 reads "13 → 40"; `evidenceCount` 40.
- **4.0 weekly rates** are now derived in the generator (contacts ÷ panels × 1,000, 1 dp): W10, W14 and W22 read 2.1 and W23 2.2. The headline 6.2 vs 2.0 is unchanged (W24–W26 on 4.0 = 1.97).
- **"212"** now means only look-alikes suppressed (V-12) and invoices in dispute (V-08). Q2 "CERTIFICATIONS LAPSING ≤30 DAYS" is **186**.
