# V3 QA report (B7)

Run from the repo root:

```
python3 scripts/hdfc_v3/public_v3.py && python3 scripts/hdfc_v3/seed_internal_v3.py
python3 scripts/hdfc_v3/check_reconcile_v3.py   # 0 failures
python3 scripts/lint_terms.py                   # 0 hits (banned terms, "promise", "$", "!", US spellings, GenBI)
python3 scripts/check_pii.py                    # 0 hits
cd frontend && npx biome check components/hdfc-v3 lib/hdfc-v3 app/hdfc-v3 && npx next build   # passes
```

## Structural checks (Playwright, 1440×900 and 390×844)

All 16 routes pass at both widths: there is an `answer` line, there are `prov` tags, and nothing scrolls horizontally.
Screenshots are in `qa/screenshots_v3/`.

| Route | Screen |
|---|---|
| `/hdfc-v3/mds-office`, `/hdfc-v3/head-cx` | E1 exec page: dials, cohort strip, pulse, pulse by product, customer pulse, actions |
| `/hdfc-v3/business/[product]` (8 products) | B1 business-head view (E1 with the product filter) |
| `/hdfc-v3/priority` | E2 priority relationships |
| `/hdfc-v3/customer/[id]` (12 personas) | E3 customer signal trail |
| `/hdfc-v3/module/digital`, `/hdfc-v3/module/cards` | M1, M2 |
| `/hdfc-v3/deliverables` | D1 ledger, then the earlier drill view with its copy renamed (`/service-promise` redirects here) |
| `/hdfc-v3/action-queue` | A1 static mock of the triage queue |

## B7 §4 fixes

| # | Fix | Status |
|---|---|---|
| 1 | Remove the 2.4★ vs 4.4★ line from the exec pages; compare within one store on M1 | Done |
| 2 | MD view leads with complaints closed without resolution; app fix list second, relabelled | Done |
| 3 | "Improving" needs at least 15 items per half; loan processing and PayZapp; "Where customers praise us" | Done |
| 4 | Mood shown as a change against the window average; no raw −54 | Done |
| 5 | Internal programme names removed (footer); lint in place, plus a local list | Done |
| 6 | Theme groups on exec pulse items | Done; B6 hand-verification not in repo |
| 7 | TATs in the deliverables ledger | RBI TATs added; check against D-11 (not in repo) |

Method fixes on M1:
- Per-store share-negative series start at each export's first review, so the false 8 Sep spike is gone.
- Version tables are per store.
- "Customers ask for" keeps only asks that match the row.

## Known gaps

- Public responded and open-too-long need the S1 re-crawl with developer replies (MORNING_DECISIONS D2).
- Stretch items not built: M3 PayZapp (PayZapp has a business view), the full A1 set of 1,500 emails, S2 and S6.
