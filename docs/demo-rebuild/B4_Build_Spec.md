# LisN · HDFC demo · B4 — Build Spec (for Claude Code)

Inherits from: B1 v1.1 (audience, messaging, claims), B2 v1.1 (screens, language, status vocabulary), B3b (data pipeline). Where this file and B2 differ, **this file wins** for implementation.

## 0. Principles
1. **Keep the existing layouts.** The exec page and the three drill views keep their structure. Change content, language and data binding.
2. **No hard-coded figures in components.** Every displayed number comes from the data layer (`lib/data/*`), which reads:
   - `data/out/app/*.json`: public, real, tagged `Public · live`
   - `data/seed/internal.json`: illustrative internal data, tagged `Internal · illustrative until discovery`
   - `data/seed/joined.json`: needs bank systems, tagged `Joined · needs bank systems`
3. **One source of truth.** Totals shown in more than one place must come from the same selector.
4. **Work on branch `demo/hdfc-v1`.** Never touch `main` or the existing live routes.

## 1. Routes

| Route | Screen |
|---|---|
| `/hdfc/mds-office` | Exec page, MD's office view (default landing) |
| `/hdfc/head-cx` | Exec page, Head of CX view |
| `/hdfc/satisfaction` | "Are customers satisfied with their journey?" (reuse the Cards_Journey layout) |
| `/hdfc/market` | "What is the market saying about us?" (reuse the Market_saying layout) |
| `/hdfc/service-promise` | "Are we keeping our service promise?" (reuse the ServicePromise layout) |
| `/hdfc/signal/[id]` | Signal detail (one template) |

The drill views accept `?from=mds-office|head-cx` so "Back" returns to the right exec view. The existing `role-based/*` routes stay untouched.

**Global:**
- Page title `LisN · HDFC Bank`, favicon 🎧.
- No HDFC logo image; the text "HDFC Bank" only.
- Top bar: `HDFC Bank · Customer Pulse · {date}, 07:45 · View: MD's office | Head of CX`.

## 2. Global components (build once)
- `<ProvenanceTag kind="public|internal|joined" />`: small, neutral, bottom-left of every tile. Include `data-testid="prov"`.
- `<Status value="needs_you|this_week|watching|routed|improving" />`
  - Colour only on `needs_you` (accent) and `improving` (green); everything else neutral.
  - Labels: *Needs you today · This week · Watching · Routed · Improving*.
  - Remove every CRITICAL/HIGH/MEDIUM badge.
- `<OwnerChip />`, `<RungChip />` (Voice · Repeat · Grievance · MD's office · IO · RBI Ombudsman · Public), `<ActionChip />` (Re-promise · Update and close · Notify proactively · Route with evidence · Monitor).
- `<AnswerLine />`: the one-sentence conclusion at the top of every screen. `data-testid="answer"`.
- `<BaselineCaption />`: "vs baseline ({window})" only where the runbook baseline rule allows it; otherwise "trend within window ({dates})". Add a seasonal note where relevant.
- `<AskLisN />`: side panel (see §7).
- **Number formatting:** Indian digit grouping (1,00,000); ₹ lakh/crore; no $.

## 3. Exec page (both views)

Structure, top to bottom (keeps the existing overview shape):

1. **Executive summary.** `<AnswerLine>`: `{n} signals need you today. {m} routed. {k} improving.`, followed by a one-sentence "what changed" drawn from the top riser.
2. **Since yesterday's 8:30.** Up to 3 items: latest-day signals from `signals.json` and `themes.json` (public), each with an owner chip.
3. **Executive pulse** (existing three-box row):
   - What needs you: max 3
   - Where to focus: max 3
   - What's improving or stable: max 2, **must be non-empty**; use praise themes if nothing is improving
4. **Three question cards** (existing three cards: score, sub-gauges, the "Conversation AI" caption renamed **"What customers are saying"**):
   - *Are customers satisfied with their journey?* Mood index (public) plus pillar split
   - *What is the market saying about us?* Top public themes, rising theme, app pulse headline
   - *Are we keeping our service promise?* Promise-break and status-seeking counts (public), escalation-language count (public), internal ageing (illustrative)

   Each card carries an answer line, a headline number with its baseline, and a provenance tag. Remove the unlabelled sparklines, or give them axes and a baseline.
5. **Actions to take.** Replaces the Risk Spike Monitor carousel, kept as cards in the same style.
   - Max 5.
   - Each card: title, one-line why (with a count), owner, rung, action chip, status, provenance, link to `/hdfc/signal/[id]`.

**MD's office view** (`/hdfc/mds-office`):
- Max 3 actions.
- Emphasise reputation and regulatory rungs.
- Add the **MD-marked mail** panel: 5 themes × owner × ageing × "resolved before reaching the MD", all from `internal.json`, tagged illustrative.

**Head of CX view** (`/hdfc/head-cx`):
- Max 5 actions.
- Add **Who should hear what**: for each owner (CX, Digital, Cards, Retail, Loans, Payments, Compliance, Fraud and Cyber), their top 3 themes from public data, with counts, each linked to its signal.

## 4. Drill views: block-by-block mapping (same layouts)

### `/hdfc/satisfaction` (from Cards_Journey)

| Existing block | Becomes | Data |
|---|---|---|
| Total interactions + segment table | Public items this window by source; internal interactions by relationship tier (Private Banking, Imperia, Preferred, Classic) | public / internal |
| Sentiment by relationship value | Same, by HDFC tier; customers affected; no $ | internal |
| Top intent | Top themes by trust pillar (Availability · Experience · Data intimacy · Security) | public |
| NPS segment monitor | "Sentiment trend (conversation-inferred)": weekly net sentiment with baseline | public |
| AI summary wall | "What customers are saying": 3 cards from top themes, with status | public |
| Vulnerable watchlist | **Retention watchlist**: closure intent by tier, routed to RM | internal (counts), public (closure_intent examples) |
| Strain and friction | Repeat contact and escalation language by business | public |
| Repeat contact analysis | Themes × business, stacked; click → signal detail | public |
| Journey-stage table | Open · Activate · Everyday use · Service requests · Disputes · Closure | internal, reconciled to its own total |

### `/hdfc/market` (from Market_saying)

| Existing block | Becomes | Data |
|---|---|---|
| Brand promise gap | HDFC's stated promises (app, cards, service) against where customers say they break; rows from themes | public |
| Momentum hashtags | **Rising themes**: real themes with the largest rise vs baseline. No invented hashtags. | public |
| Influential engagement | **Voices with reach**: anonymised ("Finance creator, ~{n}k followers"); summary; owner | public |
| Rankings and reviews | **App pulse**: per app, rating distribution, share positive, top 3 issues, trend vs baseline, **new-app fix list** | public |
| (new) | **Where customers compare us**: ICICI strip. Rendered only if `data/out/icici/` exists; otherwise one muted line: "Competitor view: available on request." | public |
| (new) | **Safety and reputation watch**: security-pillar themes and escalation posts with reach | public |

### `/hdfc/service-promise` (from ServicePromise)

| Existing block | Becomes | Data |
|---|---|---|
| SLA failures (4 KPI tiles plus table) | **Promise ledger**: promise type × breaches heard in public voice × status-seeking × owner × action; KPI tiles from the same selector | public plus internal ageing |
| Card closure / retention | **Closure intent**: public closure_intent count and drivers (real); save rate illustrative | public / internal |
| Why disputes breach SLA | Keep; retag `Joined · needs bank systems`; reconcile all numbers (beyond-SLA total = sum of drivers) | joined |
| Top service failures | From public themes (service business) | public |
| Dispute recovery funnel | Keep; must be monotonic (each stage ≤ the previous) | joined |
| (new) | **Escalation ladder**: Voice → Repeat → Grievance → MD's office → IO → RBI Ombudsman → Public. Public rung and escalation-language counts real; others illustrative. | mixed |
| (new) | **Transparency gap** ("where is my…") and **cure watch** | public |

### `/hdfc/signal/[id]`
Sections in this order:
1. What
2. Is it real (first seen, weekly series vs baseline, sources, one-problem-counted-once note)
3. Where (pillar, business, sources)
4. How high (rung, escalation share)
5. Who and what next (owner, action)
6. Evidence: 3–5 items from `evidence.json`, summary plus redacted text, date, source, link
7. Provenance

## 5. Illustrative internal seed (`scripts/seed_internal.py` → `data/seed/internal.json`, `joined.json`)
- Fixed random seed; deterministic.
- **Theme mix follows the public theme mix,** so internal and public tell one story. Volumes are round, plausible, and never claimed as HDFC figures.
- **Every table reconciles:** parts sum to totals; funnels are monotonic; no value reused across unrelated metrics.
- **Mood.** No NPS; conversation-inferred sentiment only.

## 6. Headline rules (so slots can be filled without a human)

**Rank for "Needs you":**
- score = share rise × volume × (1 + escalation share). "Rise" is vs baseline where one exists; otherwise second half vs first half of the window.
- exclude group companies
- minimum 8 items

**Other rules:**
- **"Improving":** themes with the largest fall vs baseline, or top praise themes.
- **New HDFC Bank app theme:** if it ranks top, place it in "Needs you" framed as **"Release pulse: the fix list customers have written"**, with the specific fixable issues and the share of positive reviews alongside. Log it in `MORNING_DECISIONS.md` for Ranjith to confirm the framing.
- **Answer lines** are generated from templates in `lib/copy.ts` and filled from data. **British spelling, no exclamation marks.**
- **Anything judgement-sensitive** goes to `docs/demo-rebuild/MORNING_DECISIONS.md` with 2–3 options. Choose a sensible default and ship it. This includes:
  - reputationally sensitive themes
  - regulatory claims
  - naming a product in a negative headline
  - the ICICI framing

## 7. Ask LisN (deterministic, no live model in the demo)
- `data/out/app/ask.json` holds 8 prompts (from B2 §4) and precomputed answers, each with 2–4 evidence ids. Generate the answers in the data phase from the aggregates.
- **Free-text input:** keyword-match to the nearest prompt. If there's no match, reply *"That needs your internal data. It's part of discovery."*
- **Every answer shows its cited evidence chips,** linking to the signal detail.

## 8. Banned terms and QA (all must pass)
- `scripts/lint_terms.py`: fail on any of these in `app/`, `components/`, `lib/` or data outputs rendered to screen:
  - `$`, `HSHF`, `HSLF`, `LSHF`, `LSLF`, `NerdWallet`, `WalletHub`, `Bankrate`, `Credit Karma`, `Trustpilot` (as a UI prompt), `Active Cash`, `Autograph`, `Reflect`, `Attune`, `One Key`, `Choice Privileges`, `Bilt`, `APR`, `Vulnerable`, `NPS`, `FCI`, `#RewardScam`, `#BankAppCrash`, `CRITICAL`, `takedown`, `Vendor Beta`, `CompetitorY`, `Merchant XYZ`
  - `!` in UI copy
  - US spellings on a list: `color` in copy only, `favor`, `analyze`, `center` in copy, `organization`
- `scripts/check_pii.py`: regex scan of the rendered data. Phones, emails, 10+ digit numbers, UPI IDs, PAN, Aadhaar: must be zero.
- `scripts/check_reconcile.py`: all totals reconcile (public against `classified.jsonl`, internal against its parts).
- **Structural tests:** every route has `data-testid="answer"`; every tile has a `data-testid="prov"`; no route is more than 3 clicks from the exec page.
- **Screenshots:** Playwright captures every route at 1440×900 and 390×844, saved to `qa/screenshots/`. If browsers can't install in this environment, log it in `PROGRESS.md` and continue.
- `npm run build` passes.
