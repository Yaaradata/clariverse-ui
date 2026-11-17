# swedbank-pulse v1 — kickoff prompt for the builder

Paste as-is into a fresh builder session on the clariverse-ui repo (main branch). Reads `claude/natwest/*` project docs for the rules it inherits; this prompt only states what differs.

---

## Task

Clone `natwest-pulse/v1` as `swedbank-pulse/v1`. Same screens, same sections in the same order, same cards, tables, drills and period toggle. Nothing added, removed, moved or restyled. Only words, register, products and data change. Persona: **Head of Customer Experience, Swedish Banking** (no name). Scope: Swedbank Sweden, private customers only. Data window: **22 Oct – 17 Nov 2026**, freeze 17 Nov 2026 07:45 CET. Log decisions as SW-D01 onward. Every NatWest carry-forward rule (HL-01..HL-34, NW-D91..NW-D100) applies unchanged unless overridden below.

## Step 1 — Copy (SW-D01)

- `app/natwest-pulse/v1` → `app/swedbank-pulse/v1`
- `components/natwest-pulse` → `components/swedbank-pulse`
- `lib/natwest-pulse` → `lib/swedbank-pulse`
- `scripts/natwest_pulse` → `scripts/swedbank_pulse`
- `data/out/natwest_pulse`, `data/seed/natwest_pulse` → `swedbank_pulse`
- Loader bank constant only. All routes 200 on the copied NatWest data before any Swedbank change. Commit.

## Step 2 — Header, footer, scope (SW-D02)

- Header: `Swedbank · Customer Pulse · 17 Nov 2026 07:45 CET`. Page title `LisN · Swedbank`. Role heading `Head of Customer Experience`.
- Footer scope line: "Retail figures: Swedbank Swedish Banking, private customers, on-topic items in the window. Baltic Banking, Sparbankerna, Swedbank Pay and other group companies are excluded."
- Currency SEK, shown as `kr`, no decimals. Dates `17 Nov`. Times CET.

## Step 3 — Windows (SW-D03)

Period toggle labels: **Morning brief · Last 7 days · Last 14 days · Full window**. Rename "Last 30 days" to "Last 14 days" — do not remove the slot. Windows nest (NW-D95). Morning brief = calendar day 16 Nov for public items (NW-D94). Comparisons that need data before 22 Oct show "no earlier period". No week-on-week trend before 29 Oct.

## Step 4 — Products and channels (SW-D04)

Six products, in this order:
1. **Payments and Swish** (first; the deep-dive worked example with the save list — replaces Credit cards)
2. **Everyday accounts and app**
3. **Cards**
4. **Mortgages (bolån)**
5. **Savings and funds**
6. **Consumer loans**

Module `nina_digital` for Nina and the Copilot assistant: a channel row and a module, not a card.

CX pulse channel rows: Calls · Nina · App and internet-bank messages · Email · Social · Branch (kontor).

Routing (NW-D92/D97 pattern): Swish, betalning, överföring, bedrägeri, spärrat kort → Payments and Swish; konto, app, BankID, inloggning, sparr, frysta, stängt konto → Everyday accounts and app; kort, kreditkort, Mastercard → Cards; bolån, ränta, amortering → Mortgages; fonder, ISK, sparkonto, Robur → Savings and funds; privatlån, blancolån → Consumer loans.

## Step 5 — Cohorts (SW-D05)

Customers in a vulnerable situation · Account-measure affected (frozen or restricted under AML rules) · Premium and Private Banking · Recent complainants (90 days). "Owners alerted" unchanged. Seed shares: 10% · 1.5% · 6% · derived.

## Step 6 — ARN watch (SW-D06)

Replaces "Financial Ombudsman watch". Four tiles, one register, same state machine as NatWest:
- First reply overdue (past 15 business days, bank standard)
- Final decision issued, Kundombudsman appeal open
- Unhappy with the final decision (ARN eligible)
- Filed with ARN

Filed ≤ tile 2 + tile 3. ARN pace is an assumption (label it). At-risk by product unchanged.

## Step 7 — Register swap (SW-D07)

Apply to copy.ts, products, askAnswers, deliverables, service standards, every component string:

| UK term | Swedish replacement |
|---|---|
| Financial Ombudsman Service / FOS | ARN (Allmänna reklamationsnämnden) |
| Final response (8 weeks, FCA DISP) | Bank's final decision; Kundombudsman appeal |
| FCA; Consumer Duty; four outcomes | Finansinspektionen (FI); FI focus areas: payment-account access · fraud handling · vulnerable customers · clear information |
| PSR; APP reimbursement, 5 business days | Swish fraud handling; Payment Services Act (betaltjänstlagen); "investigated within 15 business days, bank standard"; "ARN eligible" |
| Faster Payments; Open Banking | Swish; Bankgiro; BankID |
| CASS | Bank switch (byta bank) |
| NPS; CMA survey | NKI (Nöjd Kund Index); SKI (Svenskt Kvalitetsindex) |
| Cora | Nina |
| Secure message | App and internet-bank messages |
| Branch | Branch (kontor) |
| £ | kr (SEK) |
| Premier / Select / Reward | Premium / Private Banking / Bas |
| Financially vulnerable | Customers in a vulnerable situation |
| Sort code / 8-digit account | Clearing number / account number (never on screen) |

Lint scope `swedbank`: bans every UK term above plus NatWest, RBS, Ulster, Coutts, Mettle, and every India term (RBI, UPI, NEFT, IMPS, ₹, lakh, crore). Quoted public text exempt. Add fixtures that must fail.

## Step 8 — Service standards ledger (SW-D08)

Rows: Swish payment delivered (seconds, Swish rule) · First reply to a complaint (15 business days, bank standard — confirm) · Final decision (bank standard — confirm) · Unauthorised transaction refund (Payment Services Act; next business day for unauthorised; manipulated transfers investigated) · Account-measure review (bank standard — confirm) · Card dispute · Mortgage offer · BankID re-issue · Loan decision. "Redress" column = ARN recommendation. Every row not backed by law carries "confirm with the bank".

## Step 9 — Internal seed (SW-D09)

Scale: 3.8 million private customers (ANCHOR, annual report 2025). Contacts: 3.6m/year Nuance 2016 figure grown to ~5m/year (ASSUMPTION). Complaints: Konsumenternas Bank- och finansbyrå 7,500 external cases in 2025 as the tip, ×40 for internal (ASSUMPTION). Nina share of contacts 35% (ASSUMPTION). Produce the volume-validation file with ANCHOR / DERIVED / ASSUMPTION on every figure. Internal social-inbox seed for "Handled n of m", tag "Internal" (NW-D100). No "illustrative" wording anywhere on screen.

## Step 10 — Outage event (SW-D10)

5 November 2026 Swish disturbance is inside the window. Morning brief and the Payments and Swish card must show the real public spike on 5–6 Nov from crawled posts; internal seed adds a matching contact spike (DERIVED from the public spike, labelled). This is the headline demo moment — confirm it renders in every window that contains 5 Nov.

## Step 11 — Public layer (SW-D11)

Raw data is already crawled: copy the Drive folder `LiSN Fluid CX › LiSN Swedbank › data_of_social_media_oct22-nov17` into `data/raw/swedbank/<source>/2026-11-17/`. Five channels, 344 records total: X 237, Reddit 66, Google Play 23, Trustpilot (in `forums/`) 15, App Store 3. Each channel folder has the window JSONL, `records.csv`, `manifest.json` and `raw/`. Read `README.md` and `swedbank_collectors_stats.csv` first.

This is thin (NatWest had 5,155). Rules that follow from it:
- Drop before counting: the 26 @Aktiellt posts and market-news posts → `investor_corporate`; the ~46 Baltic-language posts → `group_other`. Expect ~220–250 on-topic retail items, ~41 of them reviews.
- No synthetic public data (HL-15). Sentiment from review sources only (NW-D91); with 41 reviews the share appears in the Full window only, pooled across all three stores. 7-day and Morning-brief windows will mostly show the count with "—" for the share. Every window still shows the count (NW-D95). n-rules unchanged: ≥20 reviews for a share, ≥3 items "indicative", <3 "—".
- Social (X + Reddit) is the main public signal and is labelled indicative throughout.
- Before making the 5 Nov Swish disturbance the headline (Step 10), confirm a spike exists in the X daily series for 5–6 Nov. If it does not, the headline is the account-measure and fraud theme from Trustpilot and Reddit, and Step 10 is dropped — do not seed a public spike.
- Quote slots: on-topic, first-person, product-matched, never another bank as subject; Swedish original with an English gloss. Mortgages, Savings and Consumer loans will likely have <3 items: show the count and "—", never an empty slot.
- No bank replies exist in any source. The social "Handled n of m" comes only from the internal social-inbox seed tagged "Internal" (NW-D100).
- Swedish-language classification: multilingual model or translate-then-classify; run the 100-item blind check on Swedish text (sample is small enough that the check covers nearly half the on-topic set — fine).
- Source start dates on the tiles: App Store 2 Nov, Trustpilot 27 Oct, Google Play 23 Oct; X and Reddit 22 Oct.

## Step 12 — Ask LisN (SW-D12)

Five persona questions, answered from the data:
1. Where is NKI being lost this month?
2. Which journeys did the 5 Nov Swish disturbance hurt most?
3. Which complaints are ARN-eligible this week?
4. How many account-measure customers have no owner?
5. Where does Nina hand off and lose the customer?

## Step 12b — Industry and role entry (SW-D13)

Register the build in the app's navigation the same way the existing routes are listed: **industry = Banking (Swedbank)**, **role = Head of Customer Experience**. Route `app/swedbank-pulse/v1/head-of-cx` (the role segment mirrors `hdfc-pulse/oct13/mds-office`). Landing/index card: "Swedbank · Head of Customer Experience". If the repo's index is a static list, add the entry; if it is generated from a registry file, add the registry row. Nothing else in navigation changes.

## Speed — how to run this (SW-D14)

The NatWest build lost days to serial check cycles. Do not repeat that.
- Steps 1–3 are mechanical: do them in one pass, one commit, no report in between.
- Steps 4–9 are independent of each other once the copy exists: run them as parallel subagents (register swap · products/routing · ARN register + service standards · internal seed + volume validation · public pipeline on the raw data), each writing only to its own files, then one integration pass.
- Use FAST mode (NatWest-only subset → Swedbank-only subset) for every iteration; FULL mode only before the report. Keep `next dev` on 3001 for visual checks; one production build at the end.
- Report once, at the end, in the format below. Do not pause for confirmation mid-build unless a decision cannot be undone.

## Zero-defect gate — the NatWest lessons (SW-D15)

Every one of these was found by review on NatWest and fixed in rounds. On Swedbank they must pass **in the first report**, not after a review. Add each as an automated check or fixture where one does not already exist:

1. **One complaint register, one set of numbers.** ARN-watch tiles, the complaints card, the at-risk-by-product table and Ask LisN answers all read from the same aggregate. `check_reconcile` must assert equality across every surface that shows a complaint count, in every window. Filed ≤ tile 2 + tile 3, always.
2. **Nested windows.** Morning brief ⊂ Last 7 ⊂ Last 14 ⊂ Full for every count on every card. Automated nesting check over the full payload, not a sample.
3. **No empty windows.** Every card in every window shows a figure or "—" with the count beside it. A fixture renders every card × every window and fails on blank, `undefined`, `NaN`, `null`, "0 of 0", or an empty quote slot without a count.
4. **Cards first.** Business deep-dive cards before tables in every section, as NatWest ended up (NW-D95).
5. **No leftovers.** Lint scope `swedbank` bans HDFC, NatWest, RBS, Ulster, Coutts, Mettle, Cora, FOS, FCA, PSR, DISP, CASS, Faster Payments, £, Premier/Select/Reward, RBI, UPI, NEFT, IMPS, ₹, lakh, crore, and every India/UK regulation string. Runs on the built HTML of every route, not just source.
6. **No internal labels on screen.** "illustrative", "synthetic", "seed", "mock", "dummy", "TODO", "lorem", ANCHOR/DERIVED/ASSUMPTION tags — banned from rendered output (they belong in the validation file only). The one allowed tag is "Internal" on the social-inbox handling row.
7. **No synthetic public data.** Public counts, quotes and sentiment come only from `data/raw/swedbank`. A fixture with a fabricated public row must fail the pipeline.
8. **Sentiment gate.** The 100-item blind check on Swedish text ≥ 90% agreement on review sources before any sentiment share renders. Record the result in the report with the sample ids.
9. **Product routing is total.** Every on-topic item lands in exactly one of the six products or `nina_digital`; unrouted items are a pipeline error, not a silent drop. Report the routing table with counts.
10. **PII.** personnummer, clearing/account numbers, Swedish mobiles, names and handles redacted in the pipeline; the PII check runs on the built payload; a fixture with a planted personnummer must fail.
11. **Figures tie to anchors.** Every internal figure in the volume-validation file traces to ANCHOR / DERIVED / ASSUMPTION with the source named; no figure on screen is absent from that file.
12. **Visual parity.** Screenshot every route × every window and diff the layout against the same NatWest route: same sections, same order, same card count. Any difference is a defect unless it is a text change.

The report lists these twelve with pass/fail and the figure or fixture that proves each. A fail on any of them means the report is not ready.

## Step 13 — Checks (FULL mode)

Pipeline → reconcile → nesting → volume validation → lint (scope swedbank) → PII (add personnummer patterns `\d{6}[-+]\d{4}` and `\d{8}[-+]?\d{4}`, Swedish mobiles `07\d[- ]?\d{3}[- ]?\d{2}[- ]?\d{2}`, clearing numbers) → fixtures must fail → build → all routes → crawl → screenshots of every window for every card. Then report. Do not push. A fresh-session read-only review follows on: HDFC/NatWest leftovers, UK/India terms, undefined text, complaint-figure consistency, empty windows, "illustrative" wording, PII.

## Report format

Per NatWest: decision log SW-D01..SW-Dnn, the twelve-point zero-defect gate with pass/fail and proof, checks table with figures, routing table, sentiment blind-check result, open items, screenshots list. One paragraph on what the Head of Customer Experience sees first on the morning brief. Then stop; a fresh-session read-only review follows before push.
