# Swedbank pulse: screens notes

Scope: `frontend/{components,lib,app}/swedbank-pulse`. Layout, sections, cards and order are the NatWest copy; only
words, products and data bindings changed.

## Deep dive move (SW-D04)

- Route `business/cards/[section]` removed; `business/payments_swish/[section]` (happy · market · service) added.
- `module/cards` removed; `module/payments_swish` added (CardsModule, issue list = the eight deep-dive categories less
  "App and internet bank", seven rows as before). `module/nina_digital` titled "Nina and the Copilot assistant".
- `business/[product]`: `payments_swish` renders the deep dive; `cards` is an ordinary product page.
- `PRODUCT_ORDER` and the brief cards: payments_swish · everyday_accounts · cards · mortgages · savings_funds ·
  consumer_loans. The payload key `periods[p].cards` still carries the deep-dive block.

## ARN watch tile mapping (SW-D06)

Payload fields kept; labels changed: `brink` = First reply overdue (past 15 business days, bank standard) · `eligible`
= Final decision issued, Kundombudsman appeal open · `unhappy` = Unhappy with the final decision (ARN eligible) ·
`awaiting_io` = Filed with ARN ("ARN pace: assumption"). Save-list rows: `eligible` → "Appeal open"; `brink` with
`days_left: null` → "Reply overdue".

## Ask LisN (SW-D12)

`askAnswers.personaQuestions(p, week, full)` builds the five persona questions from period figures on the Head of CX
view; other views use `ask.json` prompts 0–4. Fields read:

1. NKI: `p.businesses[].{label, external.volume, external.negative_share, internal.negative, internal.volume, top_issue.label}`, `p.cx_pulse.external.volume`.
2. 5 Nov outage: `full.social_pulse.daily[] {date, count}` (new, optional), `full.cards.categories[]` ids `measures`, `fraud` (`external.volume/negative`, `internal.volume/open`).
3. ARN this week: `periods["7d"].ombudsman.{as_of, prev_as_of, now.{unhappy, eligible, awaiting_io}, delta.unhappy, by_business[].{label, unhappy, eligible, brink}}`.
4. Account-measure owners: `p.customer_pulse.lists[]` matched by label /account[- ]measure/i, else id `multi`; `rm.{of, alerted}`, `in_contact`, `open`, `not_responded_48h`.
5. Nina: `full.cora.rows[] {id, label, internal.{volume, open, open_too_long}}` (id `nina_handoff_lost`), `full.cora.returns.{resolved, back_7d, from, until}`.

## Quotes (SW-D11)

`Evidence`, `Quote` and `Business.anecdote` take optional `lang` and `gloss`; `primitives.Gloss` renders one muted
English line under a non-English quote. Empty quote slots read "— (n items, too few to quote)".
