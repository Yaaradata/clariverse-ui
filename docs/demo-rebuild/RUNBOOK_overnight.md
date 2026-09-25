# LisN · HDFC demo · Overnight Runbook (Claude Code on the web)

**Kickoff prompt:**
> Read `docs/demo-rebuild/RUNBOOK_overnight.md` and execute every phase in order without waiting for me. I am offline until morning. Where a decision needs me, choose the sensible default, record it in `docs/demo-rebuild/MORNING_DECISIONS.md`, and continue. Commit and push after every phase.

## Operating rules for this session
1. **Branch:** `demo/hdfc-v1`. Never push to `main`. Don't modify existing `role-based/*` routes.
2. **Keep `docs/demo-rebuild/PROGRESS.md` updated** after every phase: done, outputs, issues, next. If the session stops, a new session resumes from this file.
3. **Commit and push at the end of each phase,** with message `phase N: …`.
4. **Human gates in B3b are replaced by self-checks.** Write the check result to `PROGRESS.md` and continue.
5. **Don't stop on non-critical failures** (e.g. screenshots). Log them and move on.
6. **Read B1, B2, B3a, B3b and B4 in `docs/demo-rebuild/` before starting.** B4 governs the build; this runbook governs the order.

## Inputs (these override the input table in B3b §1)

```
data/raw/hdfc/stores/      8 Play Store files + 8 App Store files (JSON), one per app
data/raw/hdfc/forums/      hdfc_forums.jsonl (859 records, B3a schema) + queries_forums.md
data/raw/hdfc/social/      hdfc_all.jsonl (X + Reddit, Aug–Sep 2026, combined) + queries.md
data/raw/icici/            (may not exist; if absent, skip every ICICI step and hide the strip)
```

- **Social:** `hdfc_all.jsonl` is the only social file. Split it by its `source` field into X and Reddit. If any store records appear in it, drop them from the social set, because `stores/` is authoritative.
- **Stores:** each file holds that app's most recent reviews, so high-volume apps may cover only September. For each app, report the actual date span in `profile.md`.
- **Baseline rule, applied per source and per app:**
  - **At least 8 weeks of history:** current window is 1 Aug – 24 Sep 2026; earlier items are the baseline; label "vs baseline".
  - **Less than 8 weeks:** no baseline claim. Show the trend within the window (weekly series, or first half vs second half) and label it **"trend within window"**. Never compare against a baseline that doesn't exist.
- **Entities:** HDFC Life, HDFC Securities (InvestRight) and any ERGO/AMC items are `group_company`. Exclude them from bank-wide figures and keep them in the data.

## Phases

| Phase | Do | Output | Self-check |
|---|---|---|---|
| 0 Setup | Install dependencies; read the docs; inventory `data/raw/` | `PROGRESS.md` with the file inventory and record counts | Every raw file parsed, or listed as failed |
| 1 Normalise, redact, profile | B3b Stages 1–2 | `data/out/normalised.jsonl`, `profile.md` | 0 schema errors; `check_pii.py` passes on outputs |
| 2 Taxonomy and classify | B3b Stages 3–4. **Classifier choice:** if `ANTHROPIC_API_KEY` is set and `api.anthropic.com` is reachable, use the API (Haiku-class model for bulk, Sonnet-class for the 5% validation re-run). Otherwise, rules first (escalation, status-seeking, closure, switching and repeat are lexical, in English and Hinglish), then classify theme, pillar and owner in batches in-session, saving every batch. | `taxonomy.json`, `themes_by_source.md`, `classified.jsonl` | Validation agreement ≥ 85% on the re-run sample, or log the rate and continue |
| 3 Aggregate and insights | B3b Stages 5–6, plus `ask.json` (B4 §7), plus the new-app **fix list** (issue, count, example ids, first-seen app version if available) | `data/out/app/*.json`, `findings.md` | `check_reconcile.py` passes |
| 4 Seed illustrative data | B4 §5 | `data/seed/internal.json`, `joined.json` | Reconcile passes; no value reused across unrelated metrics |
| 5 Build screens | B4 §1–§7. Reuse existing components and layouts. Build the global components first, then the exec page (both views), then the three drill views, then signal detail, then Ask LisN. | Routes under `/hdfc/*` | `npm run build` passes |
| 6 QA | B4 §8: lint, PII, reconcile, structural tests, screenshots | `qa/report.md`, `qa/screenshots/` | All checks pass or have logged fixes |
| 7 Morning pack | Write `MORNING.md`: what's built; screenshot index; top 10 findings; the headline chosen for each slot and why; open decisions (link `MORNING_DECISIONS.md`); data caveats; a two-minute walk-through script (B2 §8, adapted to the real headlines) | `docs/demo-rebuild/MORNING.md` | — |

## Guardrails (in addition to B4 §8)
- **Language:** British spelling, rupees, no exclamation marks.
- **Boundary:** every action is a recommendation routed to an owner. Never "freeze", "enforce", "throttle" or "trigger offers".
- **Claims:** no rupee impact figures from public data. No references to other banks except the ICICI strip. No customer names or handles anywhere.
- **Tone:** at least one "Improving" or praise item on every exec view. Status colour only for "Needs you today" and "Improving".
- **Sensitive themes:** any theme naming an HDFC product negatively in a headline gets an entry in `MORNING_DECISIONS.md`.
