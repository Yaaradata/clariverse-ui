# Phase 1 · Stage 0 — Research Prompt (run identically on Claude/Opus, Gemini, GPT-5, Perplexity)

> CX-anchored, Category-visible, **join-ready**. Marketplace e-commerce **with** a quick-commerce arm (India primary, global reference). One report per engine, same A–F + synthesis structure, so they merge mechanically. Tag the document with the engine name at the top.

## ROLE
Answer as the consensus of this four-person panel, surfacing disagreement rather than averaging it:
1. **AI architect, retail data/ML platform** — what is genuinely detectable as an anomaly in the customer-interaction corpus (reviews, tickets, calls, chats, social, return/cancellation text), baseline + multi-dimensional feasibility, false-positive control.
2. **CX / Voice-of-Customer Head + Category / Business Head (dual lens)** — what makes the CX head act vs noise (the pilot buyer), AND what the Category/Business head needs to see to care (the P&L destination). **Surface explicitly where what CX wants diverges from what the P&L owner needs.**
3. **Senior PM, interaction-intelligence platform** — reusable cross-retailer product IP, and whether each insight is **join-ready** (carries the SKU/category/seller/geo tags and a named P&L metric so it extends to the transaction layer without a retrofit).
4. **Regulation & consumer-protection adviser** — dark-pattern/consumer-protection/data-protection lines, mandatory disclosures, marketplace/seller-liability and escalation/reporting obligations.

## OBJECTIVE
Map what the **CX / Voice-of-Customer Head** at a marketplace e-commerce + quick-commerce operator is most keenly watching, the problems they track, the questions they ask, and the solutions they use — at high fidelity, because this is the pilot. **For every CX finding, also identify the P&L/transaction destination** (the GMV / margin / conversion / repeat / return / seller-health metric the CX signal ultimately moves) and the dimensional tags (SKU · category · seller/brand · geography city/cluster/dark-store/pincode · channel · time) that would let an interaction-intelligence layer join the CX signal to that metric. The goal: CX use cases that ship now on interaction data **and** are join-ready for a later transaction extension.

## SCOPE
- **Operator type:** India marketplace e-commerce leader (many sellers/brands/SKUs/categories) **with a quick-commerce arm** (dark-stores, hyperlocal, fast delivery). Cover **both** the seller/SKU/category dimension **and** the hyperlocal/dark-store/ops dimension — in quick-commerce, many CX failures are operational failures.
- **Geography:** India primary; global reference (Amazon, Instacart, DoorDash, large marketplaces).
- **Horizon:** current state + 12–24 months; prioritise the last 18 months.

## RECALL MANDATE (overrides ranking)
Find all plausible findings and use cases, including long-tail, weakly evidenced, single-source, niche, and inferred ones. Do not rank aggressively. Do not discard because something appears only once. Mark thin items `[single]` rather than dropping them. Disciplined ranking happens only at the merge stage.

## DELIVERABLE STRUCTURE (exact headers)
- **A — CX mandate & KPIs (+ the P&L each moves):** the full set the CX/VoC head is measured on (complaint/ticket volume & themes, NPS/CSAT/DSAT, escalation rate, first-contact & repeat-contact, review rating & sentiment, refund/return-complaint rate, social sentiment). For each: definition, cadence, rising/falling importance, **and the P&L metric it ultimately moves** (the bridge map).
- **B — The CX question set:** the actual daily/weekly/event-triggered questions the CX head asks; group by cadence and by **whether the answer needs the transaction join** to be fully actionable (these are the bridge candidates).
- **C — Data fragmentation map:** where CX answers physically live today (interaction corpus: tickets, reviews, calls, chats, social, return/cancellation text) vs where the P&L destination lives (orders, returns/RTO, fulfilment/SLA, seller performance, conversion, margin); name the hardest and **never-made joins** — especially complaint/review-anomaly ↔ category/SKU/seller/zone P&L.
- **D — Solution landscape:** D1 CX/VoC tools (e.g. Sprinklr, Verint, Uniphore, NICE, CallMiner, Zendesk, Gorgias, Freshdesk, review/ratings analytics); D2 emerging CX-AI / VoC copilots; D3 retail analytics that touch CX; D4 architecture patterns. For each: strengths, gaps, and crucially **whether it joins CX signal to revenue/P&L at all** (most will not — flag it). Mark vendor claims `[marketing-grade]`.
- **E — Regulatory/standards pressure:** tie each instrument (Consumer Protection (E-Commerce) Rules 2020 + amendments; CCPA dark-pattern guidelines 2023; DPDP 2023/Rules 2025; FSSAI for grocery/prepared food; Legal Metrology; marketplace/seller-liability; returns/refund timelines; global: EU DSA, FTC dark-pattern/click-to-cancel) to a specific CX decision/metric it constrains; flag where regulation creates demand for full-coverage, auditable, explainable CX monitoring. Verify dates at research time.
- **F — White space & unmet need (split into two classes):**
  - **F1 — CX-native cards (ship in the pilot, interaction-data-only):** where current CX tools fail; rank by impact × how poorly served.
  - **F2 — Bridge cards (join-ready, light up in Phase 2 with the transaction feed):** CX signals that, joined to the transaction/P&L layer, explain a GMV/margin/conversion/repeat/return/seller-health movement no CX-only or transaction-only tool can. For each, state the CX signal, the join tags, the named P&L destination, and why it is impossible without the join. **This is the differentiator — give it the most depth.**

## CONSTRAINTS
- Cite sources; prefer primary over vendor blogs; quantify where possible; separate fact from inference; keep India-primary vs global tagged.
- **Join-ready discipline:** every CX use case names the dimensional tags (SKU/category/seller/geo/channel/time) and the P&L metric it would terminate in, even if Phase 1 ships it on interaction data alone.
- Stay inside the LiSN boundary: consume feeds, never own the lakehouse, never auto-fire; drafts, human approves, audit-logged. Apply the brand rules ("LiSN"; British "distil"; "who" not "that"; never "cheap"; no exclamation marks; India primary).

## OUTPUT
The sections A–F with `[single]`/`[conflict]` tags inline, plus a one-page synthesis: the three highest-impact least-served CX needs (F1), the three strongest bridge cards (F2), and a one-line statement of where an interaction-intelligence layer wins that a CX-only tool and a transaction-only tool each cannot. Tag the document with the engine name at the top.
