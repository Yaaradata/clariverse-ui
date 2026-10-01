# Feedback log

Every reviewer comment becomes one testable rule here, so feedback is never given twice (`stakeholder-feedback-log`).

- Add a row per comment: next ID, date (`YYYY-MM-DD`), who said it, the rule, how to check it, status `Active`.
- If a new rule changes an older one, set the old row to `Superseded by FB-0xx`. Never delete a row.
- Every QA run checks all `Active` rules and reports `<n> rules checked, <n> failed`. A failed rule blocks the push.

| ID | Date | From | Rule | How to check | Status |
|---|---|---|---|---|---|
| FB-001 | 2026-09-25 | Ranjith (Manager) | Screenshots for QA are taken screen by screen, never one long full-page capture | Every screen has its own file in `qa/screens/` | Active |
| FB-002 | 2026-09-25 | Ranjith (Manager) | No empty gaps in layouts; spaces must be filled | `qa_gaps_v2.mjs` passes | Active |
| FB-003 | 2026-09-25 | Ranjith (Manager) | The same figure must match on every screen; banks reconcile this first | Reconcile check passes | Active |
| FB-004 | 2026-09-25 | Ranjith (Manager) | No plain black-and-white output; the colour theme must be applied | Visual check, both themes | Active |
| FB-005 | 2026-09-25 | Ranjith (Manager) | Build on a branch, review a PR, deploy from the preview; never pull a working copy and deploy | Git log and deploy source | Active |
| FB-006 | 2026-09-25 | Ranjith (Manager) | Check the story against the audience; don't embarrass the person in the room (e.g. the app they launched) | Audience check in `demo-content-rules` | Active |
| FB-007 | 2026-09-28 | Ranjith (Manager) | Long batches run in sub-batches of ~100, flushed to disk or DB after each; long and short tasks in separate threads | Code review against `eng-qa` §1 | Active |
| FB-008 | 2026-09-30 | Ranjith (Manager) | MD and Head of CX views: dials plus one table only; definitions behind ⓘ | Density check in `ui-qa` §3 | Active |
| FB-009 | 2026-09-30 | Ranjith (Manager) | Business-head views show their own business only, never bank-wide figures | Density check in `ui-qa` §3 | Active |
