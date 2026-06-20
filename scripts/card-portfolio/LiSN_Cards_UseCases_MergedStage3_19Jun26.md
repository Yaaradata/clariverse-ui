# LiSN Cards — Use-Case-Level Merge (Stage 3, recall-first)

> Merge of four per-engine use-case lists mined from four separate research outputs. Inputs: **GEMINI** (8A/9B), **OPUS** (9A/10B), **GPT-5/ChatGPT** (9A/10B), **PERPLEXITY** (9A/10B). Governing principle: recall before precision. Deduplication is conservative — near-duplicates with a different decision or workflow are kept separate. This is the complete provenance-tagged use-case universe plus a defensible ranking on top of it.
>
> Note on inputs: the four engines that were actually run are Gemini, Opus, GPT-5 and Perplexity (no separate "Claude" run; Perplexity substitutes). Source tags below read `[4-source]` only where all four independently produced the use case.

---

## 1. LONGLIST — the recall artifact (every distinct use case)

**31 distinct merged use cases: 14 in Bucket A, 17 in Bucket B.** Convergence in brackets counts how many of the four engines independently produced it.

### Bucket A — pipeline use cases that beat a self-built dashboard

| ID | Name | Archetype | Primary user → exec | Source support | India/Global | Voice-join? | Source engine IDs | MVP suitability | Flags |
|----|------|-----------|---------------------|----------------|--------------|-------------|-------------------|-----------------|-------|
| MA1 | Curable-decline recovery / decline-decomposition radar | curable-decline | PM → Head of Cards | **[4-source]** | India primary | No | GEMINI-A1, OPUS-A1, GPT-A1, PPLX-A1 | High | Gemini variant tilts to reason-code decomposition + rule-review; others to recoverable-₹ nudge |
| MA2 | Fraud-rule misfire — approval-rate step-change (txn-side) | fraud-rule misfire | PM → Head of Risk/Fraud | [3-source] | India primary | No | OPUS-A2, GPT-A2, PPLX-A2 (partial GEMINI-A1) | Medium | Needs fraud-rule change feed (hardest to obtain) |
| MA3 | Switch/processor + token/CoFT attribution (txn-side) | switch-incident | PM → Head of Ops/Tech | [3-source] | Global ref | No | OPUS-A3, GPT-A3, PPLX-A3 | Medium | GPT adds token/CoFT lens; overlaps bank observability |
| MA4 | Offer incrementality & cannibalisation detector | campaign-to-complaint (offer) | PM → Head of Cards/Marketing | [3-source] | India primary | No | OPUS-A4, GPT-A4, PPLX-A4 | Medium | PPLX festive-scale variant (2,200+ offers); needs control-cohort method |
| MA5 | Early roll-rate inflection by vintage/sourcing channel | hardship & roll-rate | PM → Head of Risk/Collections | **[4-source]** | India primary | No | GEMINI-A3, OPUS-A5, GPT-A6, PPLX-A5 | High | Min cohort size to control noise |
| MA6 | Dormancy-onset / engagement-cliff radar (txn-side) | attrition & churn | PM → Head of Cards | [2-source] | India primary | No | OPUS-A6, PPLX-A6 (+ GEMINI-A6 boundary) | High | GEMINI-A6 blends closure-intent language → near-dup, see MB10 |
| MA7 | Interchange / fee-yield leakage | other (yield) | PM → Head of Cards/Finance | [3-source] | India primary | No | GEMINI-A7, OPUS-A7, PPLX-A7 | Medium | Two sub-signals: RuPay-UPI mix-compression (Gemini) vs reversal-as-dispute (Opus/PPLX) |
| MA8 | Reward-economics / reward-negative category anomaly | other (reward econ) | PM → Head of Cards/Finance | [2-source] | India primary | No | GEMINI-A8, GPT-A5 | Medium | `[long-tail — preserve]` (GPT); needs reward+fraud allocation by category |
| MA9 | Activation-decay vs RBI 30+7 closure clock | other (acquisition/conduct) | PM → Head of Cards (Conduct) | [single-source] | India only | No | GEMINI-A5 | High | `[single-source — preserve]`; clean reg+ROI countdown |
| MA10 | Complaint-theme emergence radar (interaction-native) | conduct & grievance | PM/CX → Head of Conduct/CX | [3-source] | India primary | No (interaction-native) | OPUS-A8, GPT-A8, PPLX-A8 | High | Core LiSN capability; near-unanimous keep |
| MA11 | Conduct/mis-selling surveillance from transcripts (vendor-level) | conduct & grievance | PM/Conduct → Conduct/Vendor Gov | [single-source] | India primary | No (interaction-native) | OPUS-A9 | Medium | `[single-source — preserve]`; needs transcript access at scale |
| MA12 | Complaint-intensity per 1,000 cards benchmark anomaly | conduct & grievance | PM/Conduct → Head of Conduct | [single-source] | India only | No (interaction-native) | GPT-A9 | High | `[single-source — preserve]` `[long-tail]`; needs active-card denominator |
| MA13 | Tokenised vs non-tokenised CNP approval-gap monitor | curable-decline/auth | PM → Head of Risk/Ops | [single-source] | India primary | No | PPLX-A9 | Medium | `[single-source — preserve]` `[long-tail]`; needs token-status granularity |
| MA14 | Profitable-spend / premiumisation-drift monitor | attrition / other (spend quality) | PM → Head of Cards | [single-source] | India primary | No | GPT-A7 | Medium | `[single-source — preserve]` `[long-tail]`; needs profitable-spend proxy |

### Bucket B — net-new cards-transaction × complaint/voice joins that do not exist today

| ID | Name | Archetype | Primary user → exec | Source support | India/Global | Voice-join? | Source engine IDs | MVP suitability | Flags |
|----|------|-----------|---------------------|----------------|--------------|-------------|-------------------|-----------------|-------|
| MB1 | Decline-spike ↔ customer-voice root-cause join **(hero)** | curable-decline/fraud-rule (root-cause) | PM → Head of Cards/Risk (by cause) | **[4-source]** | India primary | **Yes** | GEMINI-B1, OPUS-B1, GPT-B1, PPLX-B1 | High | Variants: regulatory-timer (GPT), incident-pack/no-data-held (PPLX), BIN-rule dual-curve (Gemini) |
| MB2 | Fraud-rule misfire, voice-confirmed before the KPI moves | fraud-rule misfire | PM → Head of Fraud/Risk | [3-source] | India primary | **Yes** | OPUS-B2, GPT-B2, PPLX-B2 | Medium | PPLX adds attrition-tail projection; needs rule-change feed |
| MB3 | Weak-authentication liability cluster (Auth Dir 2025) | authentication-liability | PM/Conduct → Risk/Compliance | [3-source] | India only | **Yes** | GEMINI-B7, OPUS-B3, PPLX-B3 | Medium | High reg pull (effective 1 Apr 2026); needs auth-status in feed |
| MB4 | Hardship-language → roll-rate pre-delinquency predictor | hardship & roll-rate | PM → Head of Risk/Collections | **[4-source]** | India primary | **Yes** | GEMINI-B8, OPUS-B4, GPT-B4, PPLX-B4 | Medium | Variants: hardship-vs-strategic-non-payment split (GPT), hardship-episode entity (PPLX); DPDP-sensitive |
| MB5 | Ombudsman-escalation pre-empt | conduct & grievance (escalation) | PM/Conduct → IO liaison | **[4-source]** | India only | **Yes** | GEMINI-B2, OPUS-B5, GPT-B5, PPLX-B5 | High | Variants: 30-day IO timer (GPT), mishandling-locus (PPLX), MITC-clause mapping (Gemini) |
| MB6 | Campaign/offer → complaint/mis-selling join | campaign-to-complaint | PM → Head of Cards/Conduct | **[4-source]** | India primary | **Yes** | GEMINI-B3, OPUS-B6, GPT-B6, PPLX-B6 | Medium | Variants: cannibalisation axis (Gemini), reward/billing-change confusion (GPT) |
| MB7 | Switch/processor incident ↔ voice true-impact pack | switch-incident (voice-joined) | PM → Head of Ops/Tech + Comms | [3-source] | India primary | **Yes** | GEMINI-B6, OPUS-B7, PPLX-B7 | Medium | "In-SLA but customers hurting" wedge; needs switch telemetry + contact feed |
| MB8 | Token/CoFT breakage ↔ voice (recurring/subscription) | curable-decline (tokenisation) | PM → Head of Ops/Tech | [2-source] | India primary | **Yes** | GEMINI-B9, OPUS-B9 | Medium | Needs token-lifecycle events (possible gap) |
| MB9 | Double-debit / reversal-failure ↔ voice | conduct & grievance (operational) | PM/Ops → Ops/Conduct | [2-source] | India primary | **Yes** | OPUS-B10, GPT-B8 | Medium | GPT-B8 also spans recurring-failure; pairs with MB5 |
| MB10 | Co-brand / portability churn ↔ voice (attrition) | attrition & churn (voice-joined) | PM → Head of Cards/Co-brand mgr | [2-source] | India primary | **Yes** | OPUS-B8, GPT-B10 (+ GEMINI-A6 boundary) | Medium | GPT adds merchant-softness-vs-attrition verdict; needs switch-intent extraction |
| MB11 | Fraud-rule misfire × social-media surge attribution | fraud-rule misfire / conduct | PM → Risk/Conduct (Comms) | [single-source] | India primary | **Yes** | GEMINI-B5 | Medium | `[single-source — preserve]`; reputational blast-radius is the distinct decision |
| MB12 | Cross-border CNP friction & liability cluster (Oct 2026) | authentication-liability | PM/Conduct → Risk/Compliance | [single-source] | India only | **Yes** | GPT-B3 | Medium | `[single-source — preserve]` `[long-tail]`; time-bound 1 Oct 2026 |
| MB13 | App-release-defect customer-impact pack | switch-incident (voice-joined) | PM → Ops/Tech + Comms | [single-source] | India primary | **Yes** | GPT-B7 | Medium | `[single-source — preserve]` `[long-tail]`; needs app-version tagging |
| MB14 | Dispute-before-CIC-reporting breach-risk detector | conduct & grievance / auth-adjacent | PM/Conduct → Collections/Compliance | [single-source] | India only | **Yes** | GPT-B9 | Medium | `[single-source — preserve]` `[long-tail]`; needs CIC-reporting-queue flag |
| MB15 | Co-brand / merchant-aggregator diagnostic join | switch-incident / other (co-brand) | PM → Co-brand mgr/Ops | [single-source] | India primary | **Yes** | PPLX-B8 | Medium | `[single-source — preserve]` `[long-tail]`; auth/fraud logs ↔ co-brand systems join |
| MB16 | DPDP consent-aware analytics & explainability gate | other (governance) | PM/Conduct → DPO/Compliance | [single-source] | India only | **Yes** (data-use × consent) | PPLX-B9 | Low–Medium | `[single-source — preserve]` `[long-tail]`; **foundational substrate** under all Bucket-B joins |
| MB17 | Disparate-treatment / fair-treatment surveillance | conduct & grievance (fairness) | PM/Conduct → Conduct/Compliance | [single-source] | India + Global | **Yes** | PPLX-B10 | Low–Medium | `[single-source — preserve]` `[long-tail]`; parity modelling, false-positive risk |

---

## 2. RANKED SHORTLIST (top 12)

Scored 1–5 on Impact / Underserved-ness / Differentiation / Convergence / MVP-feasibility / Regulatory-pull(India). Shortlist is Bucket-B-biased where scores are close, per the brief.

### #1 — MB1 · Decline-spike ↔ customer-voice root-cause join **(the hero)**
- **Signal:** Declines rose on this cohort AND the matching "card not working / payment failed" voice spike pins the cause — root cause arrives with the alert.
- **Beats a self-built dashboard because:** no dashboard a PM can build joins the decline grid to the voice corpus in real time; today this is a manual war-room hours-to-days later. The join converts a sterile decline code into a causal narrative (rule change vs tokenisation break vs genuine fraud).
- **Differentiation:** requires the txn × voice join — does not exist today.
- **Best worked example (OPUS/GPT):** a token/network push at 11:00 triggers a decline anomaly on premium e-commerce (PREM 25–34 HNI, +38% WoW, ₹2.4 Cr at risk); "payment failed" contacts rise 4× and X chatter matches, all from 11:00; LiSN names the cause (CoFT re-tokenisation break, not customer behaviour) the same morning, routes the fix to Ops and a recovery-nudge draft to Cards.
- **UI hero element:** the dual-curve Correlation Evidence band (both curves on one timeline) — packaged by PPLX as an "incident-intelligence pack" (affected customers + narratives, no transaction data held), and by GPT with a "decision bundle + regulatory-timer" line.
- **Regulatory hook:** auditable cause-to-impact trail; pre-empts IO escalation; cohort-level join keeps it DPDP-clean.
- **Score:** Impact 5 · Underserved 5 · Differentiation 5 · Convergence 5 (4/4) · MVP 4 · Reg-pull 4. **The demo opener; all four engines independently nominated it #1.**

### #2 — MA1 · Curable-decline recovery / decline-decomposition radar
- **Signal:** Curable declines (soft-decline, insufficient-funds reason-51, 3-DS challenge, tokenisation expiry) on this cohort are abnormally high and recoverable — ₹X retrievable today.
- **Beats a self-built dashboard because:** a dashboard shows a blended decline rate; it cannot maintain thousands of seasonal per-cell baselines, separate curable from structural at cell level, or rank by recoverable rupees. The issuer-side recovery view does not exist in merchant tooling (Nuvei-type) which optimises at the acquirer.
- **Differentiation:** transaction-visible.
- **Best worked example (OPUS):** insufficient-funds declines on premium 25–34 HNI run 38% above the cohort's own month-end band (not the 8% portfolio average), ~4,800 declines, ₹2.4 Cr attempted spend; LiSN drafts an EMI-conversion nudge to the eligible sub-segment; recovered-rate in 48h is the success metric.
- **UI hero element:** the recoverable-₹ figure with its curable/structural split and named cause-class.
- **Regulatory hook:** nudges respect RBI consent / unsolicited-offer rules; CoFT-compliant; audit-logged draft + approval.
- **Score:** Impact 5 · Underserved 4 · Differentiation 2 · Convergence 5 (4/4) · MVP 5 · Reg-pull 3. **Clearest before-lunch ROI; the safest A-bucket flagship.**

### #3 — MB3 · Weak-authentication liability cluster (Authentication Directions 2025)
- **Signal:** 2FA/OTP-failure complaints joined to weak-authentication CNP transactions reveal a cluster of issuer-compensation exposure.
- **Beats a self-built dashboard because:** liability lives precisely at the intersection of an auth-method gap (transaction side) and a customer assertion (voice side); neither dashboard sees the other.
- **Differentiation:** requires the txn × voice join — does not exist today.
- **Best worked example (OPUS/PPLX):** post-1 Apr 2026, LiSN finds 47 CNP authorisations missing a completed dynamic factor on one merchant path, joined to 31 "money taken, no OTP" complaints; under the full-compensation rule the exposure is ~₹6–9 lakh and, more importantly, a systemic auth-flow gap; routed to Compliance same-day.
- **UI hero element:** the quantified liability-exposure figure.
- **Regulatory hook:** RBI Authentication Mechanisms Directions 2025 issuer full-compensation liability; DPDP-compliant, cohort/merchant-level.
- **Score:** Impact 4 · Underserved 5 · Differentiation 5 · Convergence 4 (3/4) · MVP 3 · Reg-pull 5. **Highest-value defensibility card; speaks straight to the board.**

### #4 — MB5 · Ombudsman-escalation pre-empt
- **Signal:** A systemic complaint pattern tied to a transaction root cause is trending toward IO escalation — resolve it before the window closes.
- **Beats a self-built dashboard because:** complaint dashboards count cases; they neither cluster around a transaction root cause, forecast escalation, nor (PPLX) localise the mishandling queue/agent.
- **Differentiation:** requires the txn × voice join — does not exist today.
- **Best worked example (GPT/PPLX):** "incorrect late fee" complaints on one co-brand triple in a week, root-caused to a billing-cycle misconfiguration and (PPLX) concentrated in one resolution queue with a high rejection rate; several cases are within days of the 30-day IO decision deadline; LiSN root-causes, names the queue, flags the timer, and feeds the quarterly board pattern report — against 41,457 credit-card complaints (+20.04%, second-largest).
- **UI hero element:** the escalation-risk countdown against the 30-day IO clock, plus the named mishandling locus.
- **Regulatory hook:** Internal Ombudsman Directions 2026 (board pattern analysis, 30-day decision); GEMINI variant ties each cluster to the implicated MITC clause.
- **Score:** Impact 4 · Underserved 5 · Differentiation 5 · Convergence 5 (4/4) · MVP 4 · Reg-pull 5. **"Stay out of the ombudsman's report" — with a clock.**

### #5 — MB4 · Hardship-language → roll-rate pre-delinquency predictor
- **Signal:** Hardship language in service/collections voice is leading 0→30 migration in this cohort — credit cost forms in the voice corpus weeks before the book.
- **Beats a self-built dashboard because:** EWS today is transaction/bureau-based and lagging; the distress is spoken before it rolls. Only the join turns voice into a forward credit feature.
- **Differentiation:** requires the txn × voice join — does not exist today.
- **Best worked example (PPLX/GPT):** in a sourcing vintage, hardship episodes (a multi-hit interaction entity, per PPLX) rise 1.9× over two weeks; LiSN predicts a 0→30 inflection the transactional EWS flags a fortnight later, worth an estimated 9 bps within the 5–20 bps band; GPT's variant separates a genuine-hardship sub-segment (for support) from a strategic-non-payment sub-segment (for firmer treatment).
- **UI hero element:** the voice-leads-delinquency lead-time, with a hardship-vs-strategic split.
- **Regulatory hook:** advisory only — no credit decisioning in LiSN; DPDP-sensitive; supports fair, early hardship treatment.
- **Score:** Impact 5 · Underserved 5 · Differentiation 5 · Convergence 5 (4/4) · MVP 3 · Reg-pull 3. **The credit-cost leading indicator a Head of Risk cannot get elsewhere — but carries the catalogue's sharpest conduct tension (see §4).**

### #6 — MB2 · Fraud-rule misfire, voice-confirmed before the KPI moves
- **Signal:** "Card declined at checkout" contacts lead a fraud-rule change — over-blocking good customers before any fraud KPI shows it.
- **Beats a self-built dashboard because:** the fraud KPI lags; the customer reaction lands in voice first; only the join sees it early. PPLX adds the projected attrition tail.
- **Differentiation:** requires the txn × voice join — does not exist today.
- **Best worked example (OPUS/PPLX):** within two hours of rule R-77, "card blocked at [merchant]" contacts triple, 80% from 3+-year customers, switch-intent rising; LiSN compresses detect-to-rollback to the same morning.
- **UI hero element:** the voice-leads-KPI timing gap with the attrition projection.
- **Regulatory hook:** supports "explain why good transactions were declined" under Authentication Directions 2025.
- **Score:** Impact 4 · Underserved 4 · Differentiation 5 · Convergence 4 (3/4) · MVP 3 · Reg-pull 4.

### #7 — MB7 · Switch/processor incident ↔ voice true-impact pack
- **Signal:** This switch/processor degradation is hurting real customers — the call/social surge quantifies impact a green/in-SLA dashboard hides.
- **Beats a self-built dashboard because:** observability shows system health, not customer pain; a route can read in-SLA while customers churn. The join measures human impact and the need to communicate.
- **Differentiation:** requires the txn × voice join — does not exist today.
- **Best worked example (OPUS/PPLX):** a processor route degrades within SLA (Ops sees green) but "payment failing" contacts rise 5× and app-store reviews dip; LiSN estimates ~14,000 affected customers and ₹68–70L/hr, triggering proactive comms hours before escalation.
- **UI hero element:** the customers-affected number derived from the voice side.
- **Regulatory hook:** outage-disclosure / fair-treatment; auditable impact record.
- **Score:** Impact 4 · Underserved 4 · Differentiation 5 · Convergence 4 (3/4) · MVP 3 · Reg-pull 2.

### #8 — MB6 · Campaign/offer → complaint/mis-selling join
- **Signal:** This offer launch is generating a complaint/dispute echo (and, per Gemini, cannibalising spend) — mis-selling fallout caught in days, not post-campaign.
- **Beats a self-built dashboard because:** marketing sees opens/clicks/spend; the disputes a campaign triggers land in a different system and are reconciled only after a large incident. The join links cause to conduct cost in days; Gemini adds the incrementality-vs-cannibalisation axis the spend chart hides.
- **Differentiation:** requires the txn × voice join — does not exist today.
- **Best worked example (OPUS):** a "no-cost EMI" push converts well on the spend dashboard but triggers a 3.5× rise in "charged interest on no-cost EMI" complaints within 48 hours — an MITC-disclosure exposure flagged before the campaign's second wave sends.
- **UI hero element:** the launch-to-complaint echo curve (Gemini: twin-axis incrementality + complaint panel).
- **Regulatory hook:** MITC / "no-cost EMI" disclosure; IO pattern analysis; RBI Mar 2024 billing-cycle amendment (GPT variant).
- **Score:** Impact 3 · Underserved 4 · Differentiation 5 · Convergence 5 (4/4) · MVP 3 · Reg-pull 4.

### #9 — MB16 · DPDP consent-aware analytics & explainability gate *(strategic substrate)*
- **Signal:** Every interaction-to-transaction join is labelled with its consent status and an explainability trail — "was this use consented and explainable?" answered at scale.
- **Beats a self-built dashboard because:** a self-built stack treats consent as a separate layer and cannot answer the consent-and-explainability question per join; the "DPDP consent-logs ↔ analytics" join is essentially never made.
- **Differentiation:** requires the join (here interaction-data-use × consent-metadata) — does not exist today.
- **Best worked example (PPLX):** LiSN flags that a retention-targeting cohort built from a transaction-anomaly join draws on chat data captured under a service-only consent and outside the regulatory-vs-marketing retention split; it blocks the use and routes the explainability trail to the DPO.
- **UI hero element:** the consent-and-explainability label stamped on every surfaced signal.
- **Regulatory hook:** DPDP Act 2023 — consent, purpose limitation, tiered retention, SDF audit, automated-decision transparency.
- **Score:** Impact 3 · Underserved 5 · Differentiation 5 · Convergence 2 (1/4) · MVP 2 · Reg-pull 5. **Single-source but foundational — it is what makes every other Bucket-B join defensible; build as substrate, not a standalone card.**

### #10 — MB12 · Cross-border CNP friction & liability cluster (Oct 2026)
- **Signal:** Cross-border CNP declines/failures on India-issued cards joined to "declined abroad / OTP failed" complaints reveal friction and emerging liability ahead of the 1 Oct 2026 validation mechanism.
- **Beats a self-built dashboard because:** the cross-border CNP zone sits between an auth-method gap and a customer assertion in a different identifier world; neither dashboard sees the other.
- **Differentiation:** requires the txn × voice join — does not exist today.
- **Best worked example (GPT):** ahead of the Oct 2026 mechanism, LiSN finds a corridor where cross-border CNP declines and "card declined abroad / OTP failed" complaints co-move, flagging both a CX-friction fix and a weak-auth compensation exposure.
- **UI hero element:** the cross-border friction-plus-liability cluster by corridor.
- **Regulatory hook:** Authentication Directions 2025 cross-border CNP validation by 1 Oct 2026; issuer compensation.
- **Score:** Impact 3 · Underserved 5 · Differentiation 5 · Convergence 2 (1/4) · MVP 3 · Reg-pull 5. **Single-source but a distinctive, time-bound regulatory wedge — preserve and prioritise before the deadline.**

### #11 — MA9 · Activation-decay vs RBI 30+7 closure clock
- **Signal:** A sourcing batch's activation curve tracks below baseline and a material share will hit the RBI unactivated-closure deadline, stranding CAC.
- **Beats a self-built dashboard because:** a dashboard shows an activation percentage; it does not project against a regulatory deadline per batch, nor connect the shortfall to a fixable onboarding-friction cause.
- **Differentiation:** transaction/summary-visible, with interaction cause-finding.
- **Best worked example (GEMINI):** batch #4471 (18,000 co-brand cards) activates at day-20 at 58% vs a 71% baseline; ~6,200 projected unactivated at day-37; onboarding-app "can't set PIN" complaints point to a broken flow, not disinterest; CAC at risk ₹93 lakh; tech fixes the flow, force-closures fall to ~900.
- **UI hero element:** the activation-curve-vs-baseline with the day-37 closure line and a countdown.
- **Regulatory hook:** RBI unsolicited/unactivated-card closure mandate (30 days + 7-day grace).
- **Score:** Impact 3 · Underserved 4 · Differentiation 2 · Convergence 2 (1/4) · MVP 5 · Reg-pull 5. **Single-source, but the rare card all roles endorse without tension — clean reg + ROI, easy demo.**

### #12 — MB10 · Co-brand / portability churn ↔ voice (attrition)
- **Signal:** This co-brand's spend drop is customer attrition, not merchant softness — switch-intent in voice/social confirms it before closures register.
- **Beats a self-built dashboard because:** attrition dashboards lag (they count closures); intent lives in social/chat, which transaction tools never read; GPT's variant adds the merchant-softness-vs-attrition verdict that issuer BI frames but cannot answer without voice.
- **Differentiation:** requires the txn × voice join — does not exist today.
- **Best worked example (OPUS/GPT):** a co-brand cohort's spend falls 22% over three cycles while "how do I switch network / close this card" chatter triples after a competitor launch; LiSN classifies it as attrition (not softness), flags ₹18 Cr annual spend at risk, drafts retention weeks before closures register.
- **UI hero element:** the spend-decay-plus-switch-intent pair with the attrition-vs-softness verdict.
- **Regulatory hook:** network-portability context; consent-respecting retention.
- **Score:** Impact 4 · Underserved 4 · Differentiation 5 · Convergence 3 (2/4) · MVP 3 · Reg-pull 2.

*Just outside the top 12, preserved for the next cut:* MB8 (token/CoFT breakage ↔ voice), MB9 (double-debit ↔ voice), MA10 (complaint-theme emergence — strong but interaction-only), MA5 (early roll-rate, 4-source A-bucket).

---

## 3. SINGLE-SOURCE GEMS (preserved against consensus)

Commercially interesting use cases only one engine found. None to be dropped to convergence-weighting.

- **MA9 — Activation-decay vs RBI 30+7 clock (GEMINI).** The only engine to turn the unactivated-card closure mandate into a per-batch dated countdown with CAC-at-risk and a fixable-friction cause. Clean compliance + ROI story; unusually low panel tension.
- **MA11 — Vendor-level conduct/mis-selling surveillance from transcripts (OPUS).** 100%-QA across vendor/BPO pools vs the ~1–2% manual sample; directly feeds IO pattern analysis. Distinct because it audits the sourcing channel, not the customer.
- **MA12 — Complaint-intensity per 1,000 cards benchmark (GPT).** Normalises complaints by active-card base (private 0.420 vs PSB 0.114), catching conduct hot spots that raw counts hide as the base grows. Board-relevant.
- **MA13 — Tokenised vs non-tokenised CNP approval-gap monitor (PPLX).** Isolates a token-lifecycle/ACS misconfiguration the blended approval rate hides; economically large at ~98% CoFT penetration.
- **MA14 — Profitable-spend / premiumisation-drift monitor (GPT).** Reads retained, profitable spend (net of reward and fraud) decaying while gross GMV holds — the premiumisation-quality gap a GMV dashboard averages away.
- **MB11 — Fraud-rule misfire × social-media surge attribution (GEMINI).** Attributes a viral/app-store reputational surge to a specific internal rule edit and quantifies the blast radius — a different decision (coordinated comms + revert) from the contact-centre-only fraud-rule card.
- **MB12 — Cross-border CNP friction & liability, Oct 2026 (GPT).** The only engine to anchor the 1 Oct 2026 cross-border validation deadline; time-bound regulatory wedge.
- **MB13 — App-release-defect customer-impact pack (GPT).** Ties a named app version to card-journey breakage via app-store/complaint text — release dashboards show crash/adoption, not journey breakage.
- **MB14 — Dispute-before-CIC-reporting breach-risk (GPT).** Joins an active customer-asserted dispute to an imminent CIC default-reporting event — the exact RBI breach (disputes must settle before bureau reporting). Sharp, defensible, time-bound.
- **MB15 — Co-brand / merchant-aggregator diagnostic join (PPLX).** Localises a decline+complaint cluster to a single co-brand partner/aggregator — the "auth/fraud logs ↔ co-brand/merchant systems" join PPLX names as among the hardest and most manual in India's fragmented merchant ecosystem.
- **MB16 — DPDP consent-aware analytics & explainability gate (PPLX).** Foundational: the consent-logs ↔ analytics join that makes every other Bucket-B join defensible. Single-source but strategically load-bearing.
- **MB17 — Disparate-treatment / fair-treatment surveillance (PPLX).** Detects abnormal grievance-handling/outcome gaps across cohorts/geographies — a fairness analogue no transaction tool or sampling QA can produce.

---

## 4. CONTRADICTIONS & TENSIONS (for human resolution, not averaged)

1. **Identity-level vs cohort-level joins (AI-architect vs Compliance).** Surfaced by all four engines; recurs in MB1, MB4, MB10, MB17. Identity-level joins are richer and enable tighter recovery/retention; DPDP and compliance push to cohort/merchant-level. Proposed resolution converged across engines: cohort/merchant-level for v1, identity-level only behind explicit purpose-limited consent — enforced by MB16.

2. **Hardship: detection ambition vs fair-treatment/DPDP caution (sharpest in the catalogue).** On MB4, the anomaly/architect view wants to act aggressively on the voice-leads-roll lead (highest-value early warning); the compliance view warns that acting on *inferred* hardship is intrusive and engages DPDP sensitive-data and fair-conduct concerns, sharpened by GPT's strategic-non-payment split (a wrong "strategic non-payment" label can route a struggling customer to firmer treatment). Resolution to carry forward: advisory, cohort-level, fair-offer-only, human-approved — never a risk action against the customer.

3. **Data-feed availability for the regulatory-timer / event cards (AI-architect caution, all engines).** MB3 (auth status), MB8 (token lifecycle), MB12 (cross-border auth status), MB14 (CIC-reporting queue), MA2/MB2 (fraud-rule change events), MB6 (campaign/billing-change events) each depend on feeds that may sit outside standard summary tables. Unresolved dependency: scope a feed-availability audit before committing these to the MVP — the regulatory-pull is highest exactly where the feed risk is highest.

4. **Auditing the bank's own functions (value vs internal politics).** MA2/MB2 audit Fraud's rules; MA4/MA8/MB6 audit Marketing/reward decisions; MA11 audits vendors; MB5 (PPLX) names a mishandling resolution queue; MB14 exposes a reporting gap. Strong value, real organisational friction. Cross-engine resolution: route privately to the owning exec first, framed as their early-warning, not an auditor.

5. **The consent gate as feature vs substrate (PPLX-internal, but portfolio-wide).** MB16 is treated by compliance as the foundation under all joins and by the architect as an engineering cost that is not an "anomaly" in the detection sense. Resolution: build as substrate, not a standalone card — which is why it ranks on strategic weight despite single-source support.

6. **Impact-anchor divergence between engines (surfaced, not reconciled).** Perplexity supplies an explicit bps table (decline-diagnosis 1–5 bps; curable recovery 1–3 bps of GMV; hardship/roll-rate 5–20 bps of credit cost); the others give ₹-illustrative figures (e.g. ₹2.4 Cr recoverable on a single HNI cohort) or none. The ₹ and bps numbers across the worked examples are *not* mutually calibrated and several are flagged `[illustrative]`; treat them as directional, not additive, until grounded against a real portfolio.

7. **Alarm fatigue vs demo richness (SF-PM vs Marketing).** Recurs everywhere: marketing wants more cards surfaced; the anomaly PM insists the co-movement baseline plus a hard cap (≤3–5 cards in the brief) is what builds trust. Resolution: cap the morning brief, expand on drill-down.

---

## 5. COVERAGE CHECK

Every archetype produced across the four mining runs appears in the longlist: **curable-decline** (MA1, MA13, MB1, MB8), **fraud-rule misfire** (MA2, MB2, MB11), **switch-incident** (MA3, MB7, MB13, MB15), **campaign-to-complaint** (MA4, MA8, MB6), **hardship & roll-rate** (MA5, MB4), **attrition & churn** (MA6, MA14, MB10), **conduct & grievance** (MA10, MA11, MA12, MB5, MB9, MB17), **authentication-liability** (MB3, MB12), **yield/other** (MA7, MA8), and **governance/fairness (other)** (MB16, MB17). No archetype present in the four mining outputs is missing from the longlist.

One caveat, stated plainly: the brief asks to cross-check against the archetypes in the *compressed reconciliation map* from an earlier stage. That map was not provided as an input here, so this coverage check is run against the four mining outputs only. If the reconciliation map exists, supply it and I will re-run §5 to name any archetype the map carried that the mining missed (a true recall gap to chase) — the most likely candidates to check for are any standalone **interchange/MDR-economics**, **CAC/sourcing-mix**, or **spends-market-share** archetypes, which appear here only partially (MA7, MA14) and were thin across all four runs.

---

*Stage 3 merge. Inputs: GEMINI, OPUS, GPT-5, PERPLEXITY. 31 distinct use cases (14 A, 17 B). 12 single-source preserved; 0 dropped to consensus.*