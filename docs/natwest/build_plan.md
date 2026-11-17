# NatWest Group · Customer Pulse v1 (`natwest-pulse`): build plan

Work on `main` (pulled 13 Nov 2026 at `d3664f9`; up to date). Layout: the `oct13` screens exactly, relabelled (NW-D17). Brief: `docs/natwest/brief.md`. Judgement calls:
`docs/demo-rebuild/MORNING_DECISIONS.md` → "NatWest Pulse v1" (NW-Dxx). This file is the resume point.

## Blocked on people

1. **Confirm Vercel Deployment Protection is ON before the first push to main** (Ranjith / Usha). The IndusInd routes
   are protected in the app only by noindex (page meta + `X-Robots-Tag`); access protection is the Vercel setting.
   Every step is committed on local `main` and **nothing is pushed** until this is confirmed (Step 1.1, HL-05). NW-D02.
2. **Research pack missing** (Usha): `docs/natwest/research_pack.md` was not supplied. Register values other than the
   five the brief quotes (86,498 complaints; 2.74 per 1,000 accounts; about 55% upheld; 48% closed within 3 days;
   RBS app 66% vs overall 48%) render "pending verification"; no source titles or URLs. NW-D01.
3. **NatWest public pull missing** (Usha): `data/raw/natwest/` does not exist. App Store, Google Play, X, Reddit,
   Trustpilot and MoneySavingExpert: all not loaded. Public tiles read "Public data not yet loaded". NW-D04.
4. **Peer figures** (Lloyds, Barclays, HSBC UK, Santander UK; Monzo, Starling greyed): names only until the pack. NW-D09.
5. **Data freeze**: 13 Nov 2026 07:45 GMT (re-frozen in round 3, step 1). NW-D05.

## What oct13 is (recorded before copying)

- Routes, `app/hdfc-pulse/oct13/`: `layout.tsx`, `page.tsx` (redirects to `mds-office`), `action-queue`,
  `business/[product]`, `business/cards/[section]`, `customer/[id]`, `deliverables`, `head-cx`, `market`, `mds-office`,
  `module/[id]`, `my-view`, `priority`, `satisfaction`, `service-promise` (redirects to `deliverables`), `signal/[id]`.
- Components: `components/hdfc-oct13/` (19 files). Lib: `lib/hdfc-oct13/` (13 files).
- Loader `lib/hdfc-oct13/load.ts`: `PUBLIC = "app_jul_sep"` (data/out) and `read("seed", "internal_v3", ...)`.
- Pipeline: `scripts/hdfc_pipeline/` (normalise, classify, aggregate, ask, …) and `scripts/hdfc_v3/` (seed, periods,
  Ombudsman, reconcile, volume validation).
- `app/hdfc-pulse/page.tsx` is a version index (redirect), so `app/natwest-pulse/page.tsx` redirects to `v1` only.

Target: `app/natwest-pulse/v1/` with the same folders; `components/natwest-pulse/`, `lib/natwest-pulse/`,
`scripts/natwest_pulse/`, `data/out/natwest_pulse/`, `data/seed/natwest_pulse/`.

## Component map (`components/hdfc-oct13/` → `components/natwest-pulse/`)

| Component | NatWest screen | What changes | Removed |
|---|---|---|---|
| Shell | all | "NatWest Group" header text, watermark, freeze footer, window (This week · Last 4 weeks · Last 13 weeks) and brand filter; neutral teal accent | HDFC nav items for removed screens |
| primitives | all | Three provenance tags shown, internal included | purple tones |
| MdView, Pulse | S-HOME | Group pulse, segment pulse, public tile beside (never summed), Cora and Ombudsman summaries | priority lists, RM alerts |
| SatisfactionView, V3Blocks | S-CHANNEL | Calls · Cora · complaints · branch · public voice, one metric set | — |
| ModuleView, SignalDetail | S-CORA | Module `cora_digital`; journey drill | Cards and app modules, release pulse |
| Ombudsman | S-FOS | FOS states by theme, product, brand; register-bound rules | Internal Ombudsman ladder, save list |
| PriorityView | S-DUTY | Four outcomes by segment; evidence = register ids | priority relationships, "RBI & Government" |
| MarketView | S-BRAND | Three brands; peers; RBS app finding | Play Store-led ratings |
| ActionQueue, DeliverablesLedger | S-AGENTS | Fraud Triage Agent, AI complaint letters; UK timelines | MD-marked mail, email triage, RBI TAT rows |
| Brief, AskBar, AskLisN | Brief, Ask | Morning brief by product, Copy to pack; five NatWest questions | pins |
| CardsView, ServicePromiseView, MyView | — | — | removed screens; routes kept, redirect home |

## Register swap table (grep hits: `components/hdfc-oct13` · `lib/hdfc-oct13`)

| India term | hits | UK replacement |
|---|---|---|
| RBI / Banking Ombudsman / Ombudsman | 14 · 1 / 0 · 0 / 13 · 14 | Financial Ombudsman Service |
| Internal Ombudsman, IO | 1 · 5, 5 · 1 | Final response (8-week rule) |
| TAT | 28 · 1 | FCA DISP timeline; PSR 5-business-day APP reimbursement |
| CEPD, NPCI | 0 · 0 | FCA (Consumer Duty, DISP), PSR |
| ₹, crore, lakh | 0 · 4, 0 · 3, 0 · 3 | £, million |
| UPI | 1 · 0 | Faster Payments, Open Banking |
| PayZapp, INDIE | 3 · 3, 0 · 0 | NatWest app, Royal Bank of Scotland app, online banking |
| Play Store | 20 · 6 | App Store leads (UK iOS share); both stores, never combined |
| KYC | 1 · 1 | Identity check, onboarding |
| EMI | 0 · 0 | Repayment, instalment |
| RM | 15 · 5 | Product owner, relationship manager (Premier) |
| "RBI & Government" | — | Removed |

## Data inventory

| Item | Status |
|---|---|
| Public pull | Loaded: App Store, Google Play, X, Reddit, Trustpilot (1 Aug-13 Nov 2026; `data/raw/natwest/`, gitignored) |
| Research pack (register, anchors, peers) | In the repo: `docs/natwest/research_pack.md`; register bound to it (NW-D80) |
| Seed (L3) | Built, fixed seed and draw order (NW-D97); social-inbox handling layer (NW-D100) |
| Register | Built: `data/public/natwest_register.json` |
| Peers | Names only |

## Steps

| # | Step | Status | Commit |
|---|---|---|---|
| 0 | Brief, this plan | Built | 21bee9c |
| 1 | Safety rails (noindex, lint scope, UK PII, fixtures) | Built | 6da6073 |
| 2 | Route tree copied from `oct13`, 200 on copied data | Built | 88022ef |
| — | Gap screens withdrawn; back to the `oct13` layout (NW-D17) | Built | ea6bad5 |
| 3 | `oct13` pipeline re-parameterised for NatWest | Built | 6f27cc3 |
| 4–5 | Copy and register swap; `oct13` sections relabelled | Built | 1756eed |
| — | Signal pages for every theme; empty-public fixes | Built | 9349ad3 |
| F | Checks, screenshots, checklist (`qa/natwest_qa_checklist.md`) | Built | (this commit) |
| P | Push to main | Done: protection confirmed by Usha, 17 Nov 2026 | f673d8b |
| — | Brand filter on screen | Not built (layout rule, NW-D27) | |
| R3-0 | Research pack in the repo, register and peers bound, footer citation | Built | b3eb493 |
| R3-1 | Public pull loaded, re-frozen to 13 Nov 07:45, ingest rules, redaction, negative-share gate | Built | 9198bea |
| — | NW-D90 to NW-D101: sentiment, routing, windows, header, personal loans, social-inbox handling | Built | 00e46e7 to f673d8b |
| R3-2 | Checks, screenshots, checklist (round 3) | Built | (this commit) |

## Conflicts

| ID | Conflict | Resolution |
|---|---|---|
| NW-D01 | Research pack absent; only allowed source | Five brief-quoted figures only, labelled; the rest pending |
| NW-D02 | "Push after each commit" vs "do not push until protection confirmed" | Commit on local main; no push until confirmed |
| NW-D03 | Brief bans "V1" on screen; route is `/natwest-pulse/v1` | URL only; no version text on screen |
| NW-D04 | Copied HDFC data holds Indian public posts; HL-15 | Public layer empty until the pull lands |
| NW-D06 | Carry-forward §G drops the deliverables ledger; brief re-binds it | Brief wins |
| NW-D07 | One-for-one routes vs removed screens | Folders kept; removed screens redirect to the pulse home |
| NW-D08 | oct13 reads the shared HDFC folders (`app_jul_sep`, `internal_v3`) | Both copied into `natwest_pulse`; HDFC folders untouched |
| NW-D09 | Lint bans "Starling"; peers grey Monzo and Starling | Peer names only in the register's peer list; lint exempts that list |
