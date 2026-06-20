# LiSN Cards Extension — Use-Case Catalogue
## ENGINE: Claude Opus 4.8 — source: Perplexity research ("Cards & Portfolio Manager Intelligence — India & Global, 19 Jun 26")

*Mined per-source for high recall. Bucket A = pipeline use cases that beat a self-built dashboard. Bucket B = net-new cards-transaction × complaint/voice joins that do not exist today. IDs keyed UC-PPLX-* for mechanical merge against the Opus, Gemini and GPT-5 runs.*

---

### Framing — how this run read the source
This run leaned on what is distinctive in the Perplexity source rather than what it shares with the other runs. Three things shaped it. First, Perplexity's **rupee/bps impact table** (decline-diagnosis 1–5 bps of annual spend; curable-decline recovery 1–3 bps of GMV; hardship/roll-rate 5–20 bps of credit cost) — used as the impact anchor on every relevant card. Second, its explicit **defensibility split**, which frames the defensible product as an API/hooks model — "for anomaly cluster X, here are the affected customers and summarised interaction narratives, *without holding transaction data*" — plus two named product concepts, **incident intelligence packs** and **hardship episodes as entities**, both adopted here. Third, the three **never-done joins** Perplexity uniquely enumerated: transaction ↔ full interaction corpus, auth/fraud logs ↔ co-brand/merchant systems, and DPDP consent-logs ↔ analytics — the latter two yielding use cases the Opus run did not surface. Grounding figures are taken from Perplexity's SBI Cards FY24 disclosures (1.89 crore CIF, 18.6% share, ₹50,846 cr receivables, ₹17,484 cr income, GNPA 2.76%, 30-day spend-active 50%, DSAT 3.85–4.6%, 2,200+ festive offers across 2,700 cities), and its global reference points (S&P 1.31% 30+ delinquency for the six biggest US issuers; UK balances +12.6%; Nuvei up to 5-point merchant-side approval uplift).

---

## BUCKET A — Pipeline use cases that outperform a self-built dashboard

### UC-PPLX-A1 — Issuer-side curable-decline recovery radar
- **Archetype:** curable-decline intelligence
- **Bucket:** A
- **Signal (one line):** "Curable declines (soft decline, insufficient-information, 3-DS challenge, tokenisation expiry) on this cohort are abnormally high and recoverable — ₹X of GMV is retrievable today."
- **Cadence / trigger:** daily morning brief + intraday
- **Primary user → routed executive:** PM → Head of Cards
- **1. Data aggregation:**
  - Transaction-side: auth/decline events with reason codes split into curable (soft decline, insufficient information, 3-DS challenge failure, tokenisation/credential expiry) vs structural; by MCC × BIN × channel (POS/CNP/UPI-on-credit) × cohort; tokenisation status.
  - Interaction-side: none for the core (voice extension is UC-PPLX-B1).
- **2. Baseline creation:** curable-decline-rate baselines per reason-class × product × cohort × MCC × channel × day-of-cycle, with salary-cycle and festive seasonality encoded.
- **3. Dynamic detection:** flag cells where the curable-decline share deviates above its own seasonal band; the issuer-side gap is the point — merchant-side tools (Nuvei-type, up to 5-point uplift) optimise at the acquirer, not for the issuer's PM.
- **4. Distillation:** suppress the expected pre-payday soft-decline bulge; rank surviving cells by recoverable ₹ = decline count × avg ticket × recovery propensity. Surface the top three.
- **5. Surfacing & routing:** card headline "₹1.9 Cr recoverable — 3-DS-challenge declines on premium e-commerce, +34% vs band"; shows abnormality, recoverable ₹, cards affected, recommended action (re-prompt / alternative-instrument / EMI nudge), and a **draft trigger requirement** the PM approves. Human gate explicit. **Hero element: the recoverable-₹ figure with the curable/structural split.**
- **Why it beats a self-built dashboard:** a dashboard shows a blended decline rate; it cannot maintain seasonal per-cell baselines, cannot separate curable from structural at cell level, and cannot rank by recoverable rupees. The issuer-side recovery view simply does not exist in merchant tooling.
- **Differentiation:** transaction-visible.
- **Worked example:** 3-DS-challenge-failure declines on the premium e-commerce cohort run 34% above the cohort's own band; against SBI-Cards-scale economics (₹1.84 lakh average annual spend per card), ~₹1.9 Cr GMV is recoverable at an estimated 1–3 bps; LiSN drafts a re-prompt-plus-alternative-instrument flow for the eligible sub-segment. *(1–3 bps anchored to Perplexity's table; 34% and ₹1.9 Cr [illustrative].)*
- **Regulatory / governance hook:** recovery nudges respect RBI consent and unsolicited-contact rules; CoFT-compliant on tokenisation expiry; audit-logged draft and approval.
- **Feasibility (panel view):** AI-architect — straightforward; needs reason-code taxonomy and a recovery-propensity model. SF-PM — the seasonal band is the trust anchor; without it the soft-decline bulge fires false positives daily. Marketing-PM — the demo opener. Tension: AI-architect wants conservative thresholds, marketing wants more cards; resolve to ≤3 high-confidence cards.

### UC-PPLX-A2 — Fraud-rule misfire detector (approval-rate step-change)
- **Archetype:** fraud-rule misfire
- **Bucket:** A
- **Signal (one line):** "Approval rate on this BIN/cohort dropped after a rule change — good customers are being declined."
- **Cadence / trigger:** event-triggered (fraud-rule change) + real-time
- **Primary user → routed executive:** PM → Head of Risk / Fraud
- **1. Data aggregation:**
  - Transaction-side: approve/decline by BIN × MCC × channel × cohort; fraud-rule change events (rule ID, timestamp, scope); suspected-fraud decline codes; risk scores.
  - Interaction-side: none for the core (voice confirmation is UC-PPLX-B2).
- **2. Baseline creation:** approval-rate baselines per BIN × MCC × channel, with rule-change events overlaid as known change-points.
- **3. Dynamic detection:** detect approval step-changes coinciding with a rule push and concentrated on low-risk, high-tenure cohorts — the over-blocking fingerprint, distinct from genuine fraud suppression.
- **4. Distillation:** suppress dips aligned with real fraud-outbreak signatures; rank by GMV-at-risk on wrongly-declined good customers.
- **5. Surfacing & routing:** "Approval −5.4 pts on a tenured travel BIN after rule R-77 at 11:05 — 90% of incremental declines are low-risk"; shows the rule-to-impact timeline and a **draft roll-back review to Fraud**. **Hero element: the rule-change-to-approval-drop timeline.**
- **Why it beats a self-built dashboard:** aggregate approval barely moves; the damage hides in one BIN; a dashboard has no change-point awareness or good-vs-risky decomposition.
- **Differentiation:** transaction-visible.
- **Worked example:** a CNP-velocity rule tightens at 11:05; approval on a tenured travel BIN falls 5.4 pts, ~₹1.2 Cr/day attempted spend at risk, 90% of incremental declines from 5+-year zero-fraud customers; LiSN routes a roll-back review the same morning. *([illustrative].)*
- **Regulatory / governance hook:** supports the regulator's shift, flagged in the source, from "did you block fraud?" to "can you explain why good transactions were declined?" under the Authentication Directions 2025.
- **Feasibility (panel view):** AI-architect — needs the fraud-rule change feed (often the hardest to obtain). Compliance — strong defensibility. Tension: Risk may resist a layer auditing its rules; frame as the team's early-warning.

### UC-PPLX-A3 — Switch/processor business-impact attribution
- **Archetype:** switch-incident attribution
- **Bucket:** A
- **Signal (one line):** "Auth latency/technical declines on this route are degrading — a tech issue, with the business impact quantified."
- **Cadence / trigger:** real-time
- **Primary user → routed executive:** PM → Head of Ops / Tech
- **1. Data aggregation:** transaction-side auth success/latency by switch route × acquirer × network × STIP status; technical decline codes; switch/processor health.
- **2. Baseline creation:** latency and technical-decline baselines per route × network × time-of-day.
- **3. Dynamic detection:** isolate technical-decline/latency excursions to a route or processor, separating "tech" from customer/merchant/fraud/campaign causes.
- **4. Distillation:** suppress known maintenance windows; rank by ₹ flowing through the degrading path.
- **5. Surfacing & routing:** "Route X technical declines +3× since 09:10, ₹70L/hr at risk — tech, not customer"; **draft incident note to Ops**. **Hero element: the tech-vs-customer verdict with ₹/hr.**
- **Why it beats a self-built dashboard:** observability tools (the source cites Dynatrace-type command centres at, e.g., Bank Muscat) monitor system health but not portfolio impact; LiSN attaches the rupee figure and the business attribution.
- **Differentiation:** transaction-visible (voice-joined impact is UC-PPLX-B7).
- **Worked example:** code-96 technical declines triple on one acquirer route after 09:10; ₹70L/hr at risk; LiSN attributes and routes to Ops before the call-centre spikes. *([illustrative].)*
- **Regulatory / governance hook:** supports outage-comms duties; auditable impact record.
- **Feasibility (panel view):** AI-architect — needs switch telemetry, possibly outside summary-table scope. Tension: overlaps the bank's observability; position as portfolio-impact attribution, not infra monitoring.

### UC-PPLX-A4 — Festive-scale offer incrementality & cannibalisation detector
- **Archetype:** campaign-to-complaint (offer side)
- **Bucket:** A
- **Signal (one line):** "Among hundreds of live offers, these are underperforming or merely cannibalising existing spend."
- **Cadence / trigger:** weekly + campaign-launch event-triggered
- **Primary user → routed executive:** PM → Head of Cards / Marketing
- **1. Data aggregation:** transaction-side offer/redemption events, spend-by-cohort pre/post, MCC mix, incremental-vs-control spend; campaign metadata at festive scale.
- **2. Baseline creation:** expected-uplift baselines per offer-type × cohort × MCC, plus a matched-control counterfactual for incrementality.
- **3. Dynamic detection:** detect redemption/uplift below the offer-type baseline, and incremental spend indistinguishable from control (cannibalisation), across a large concurrent offer portfolio.
- **4. Distillation:** suppress early-cycle noise; rank by reward-cost-at-risk and lost incrementality.
- **5. Surfacing & routing:** "Of 2,200 live offers, 18 are burning reward cost with near-zero lift — ₹Y at risk"; **draft pause/retarget recommendation**. **Hero element: the cannibalised-vs-incremental split across the offer portfolio.**
- **Why it beats a self-built dashboard:** at the scale the source cites — 2,200+ offers across 2,700 cities in one festive season — no hand-built dashboard maintains a per-offer counterfactual; marketing sees gross redemption, not true incrementality, and never in week 1.
- **Differentiation:** transaction-visible.
- **Worked example:** a fuel-MCC cashback offer shows healthy gross redemption but incremental spend within 2% of its matched control, ₹0.9 Cr reward cost with near-zero lift; LiSN flags retargeting by day 6 of the festive window. *([illustrative], anchored to the 2,200-offer scale.)*
- **Regulatory / governance hook:** reward-parity and "no-cost EMI" disclosure can be checked on offer copy.
- **Feasibility (panel view):** AI-architect — incrementality needs a clean control-cohort method at scale. Marketing-PM — sensitive (critiques marketing's own offers); frame as protecting the reward budget. Tension: marketing vs portfolio ownership of the verdict.

### UC-PPLX-A5 — Early roll-rate inflection by vintage
- **Archetype:** hardship & roll-rate (transaction side)
- **Bucket:** A
- **Signal (one line):** "This vintage's 0→30 flow is inflecting above band — credit cost is building before the book shows it."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Risk / Collections
- **1. Data aggregation:** transaction-side DPD-bucket flow, Stage-2 migration, by vintage × sourcing-channel × risk-band × geography; receivables and utilisation summaries.
- **2. Baseline creation:** roll-rate baselines per vintage × channel × band, seasonally adjusted.
- **3. Dynamic detection:** detect flow-rate inflection above band concentrated in a sourcing vintage or channel.
- **4. Distillation:** suppress portfolio-wide macro drift; isolate cohort-specific inflection; rank by projected credit-cost bps.
- **5. Surfacing & routing:** "DSA-sourced Q3 vintage: 0→30 flow +1.5× band, ~10 bps credit-cost build"; **draft note to Risk**. **Hero element: the bps credit-cost projection.**
- **Why it beats a self-built dashboard:** risk dashboards are monthly and band-level; LiSN catches the vintage inflection weeks earlier. Against the source's global reference (S&P 1.31% 30+ for the six biggest US issuers; UK balances +12.6%), early India-side detection is the lever.
- **Differentiation:** transaction-visible (voice-led version is UC-PPLX-B4).
- **Worked example:** the Q3-FY26 DSA vintage rolls 0→30 at 1.5× band; against GNPA ~2.76% economics, early tightening on the worst decile averts an estimated 10 bps within the source's 5–20 bps range. *([illustrative], anchored to Perplexity GNPA and the 5–20 bps table.)*
- **Regulatory / governance hook:** feeds the bank's RBI-mandated EWS; LiSN signals, the bank decides — no credit decisioning in LiSN.
- **Feasibility (panel view):** AI-architect — feasible on summary flows. Compliance — must stay advisory. Tension: SF-PM warns fine-grained roll-rate is noisy; require minimum cohort size.

### UC-PPLX-A6 — Dormancy-onset & spend-active-cliff radar
- **Archetype:** attrition & churn (transaction side)
- **Bucket:** A
- **Signal (one line):** "These high-value cards are slipping below spend-active — dormancy onset before closure."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Cards
- **1. Data aggregation:** transaction-side spend frequency/recency, 30-day spend-active status, card-on-file presence, by HNI/premium cohort.
- **2. Baseline creation:** per-cohort engagement-rhythm baselines (expected inter-transaction interval, spend velocity), referenced to the portfolio's spend-active rate.
- **3. Dynamic detection:** detect velocity decay crossing the dormancy-onset threshold for high-value cards specifically.
- **4. Distillation:** suppress festive/holiday lulls; rank by cardholder value and reversibility window.
- **5. Surfacing & routing:** "2,100 HNI cards fell below spend-active this week — ₹Z annual spend at risk"; **draft re-engagement requirement**. **Hero element: value-at-risk from silent attrition.**
- **Why it beats a self-built dashboard:** the source notes a portfolio 30-day spend-active rate of ~50% — half the base is already at the dormancy margin; a static dashboard reports the rate, it cannot detect *onset* per cohort while the card is still saveable.
- **Differentiation:** transaction-visible (social-confirmed version is UC-PPLX-B... see B-bucket attrition).
- **Worked example:** 2,100 premium cards show a 60%+ velocity drop over three cycles; at ₹1.84 lakh average annual spend, ~₹38 Cr annual spend is at risk; LiSN drafts targeted re-engagement before the inactive-closure pipeline. *([illustrative], anchored to the 50% spend-active and ₹1.84 lakh figures.)*
- **Regulatory / governance hook:** RBI inactive-card/unsolicited-contact rules respected; no auto-contact.
- **Feasibility (panel view):** AI-architect — straightforward. Tension: marketing wants aggressive win-back, compliance wants consent discipline; resolve in the draft template.

### UC-PPLX-A7 — Fee-yield leakage & reversal-as-dispute detector
- **Archetype:** other (yield)
- **Bucket:** A
- **Signal (one line):** "Fee/interchange yield on this segment is leaking — a reversal spike that is probably a billing-dispute wave."
- **Cadence / trigger:** weekly / monthly
- **Primary user → routed executive:** PM → Head of Cards / Finance
- **1. Data aggregation:** transaction-side interchange/MDR by MCC × network × channel; fee-event and fee-reversal feeds; RuPay-UPI-on-credit share.
- **2. Baseline creation:** yield baselines per segment; expected fee-reversal rate.
- **3. Dynamic detection:** detect yield erosion from mix-shift to low-MDR rails, or a fee-reversal spike that proxies a dispute wave.
- **4. Distillation:** suppress known MDR-regulation step-changes; rank by annualised yield leakage.
- **5. Surfacing & routing:** "Fee-reversals +2.6× on a segment — ₹W annualised yield leaking, dispute-driven"; **draft note to Finance/Ops**. **Hero element: annualised leakage figure.**
- **Why it beats a self-built dashboard:** finance reports yield monthly in aggregate; LiSN isolates the leaking segment and reads the reversal-spike as an early dispute signal. Against ₹17,484 cr total income scale, segment leakage is material.
- **Differentiation:** transaction-visible (the dispute-confirmation join is UC-PPLX-B... fee/complaint join in B6).
- **Worked example:** fee-reversals on a co-brand segment spike 2.6×, ₹0.6 Cr annualised yield leakage, later corroborated by a billing-grievance cluster. *([illustrative].)*
- **Regulatory / governance hook:** RuPay-UPI MDR-cap economics; MITC fee-transparency.
- **Feasibility (panel view):** AI-architect — feasible; reversal feed needed. Tension: SF-PM notes reversals have benign causes; pair with the voice join (B6) for confidence.

### UC-PPLX-A8 — Complaint-theme emergence radar (interaction-native)
- **Archetype:** conduct & grievance
- **Bucket:** A
- **Signal (one line):** "A genuinely novel complaint theme is emerging across channels — not just higher volume."
- **Cadence / trigger:** daily
- **Primary user → routed executive:** PM / CX → Head of Conduct / CX
- **1. Data aggregation:** interaction-side calls, chats, emails, tickets, complaint registry, app-store, social; extract intent, theme, sentiment, product/MCC mentions; DSAT signal.
- **2. Baseline creation:** theme-prevalence baselines per product × channel × geography × time; novelty model for emerging clusters.
- **3. Dynamic detection:** detect themes whose prevalence or novelty breaks band — emergence, not volume.
- **4. Distillation:** suppress perennial themes (PIN reset, statement queries); rank emerging themes by growth slope × projected escalation risk.
- **5. Surfacing & routing:** "New theme 'UPI-on-credit double-debit' emerging, +5× in 72h across chat+social, absent from the complaint taxonomy"; **draft brief to Conduct**. **Hero element: the emergence/novelty curve.**
- **Why it beats a self-built dashboard:** complaint dashboards count known categories and ignore social/app-store; the source notes interaction data is integrated only as "tagged complaint categories, not full conversation understanding." Detecting a *novel* cluster forming is LiSN's native strength.
- **Differentiation:** interaction-visible.
- **Worked example:** against an SBI-cited DSAT band of 3.85–4.6%, a "points debited not credited" theme appears across chat and X, growing 5× in three days, before it is even categorised in the CRM; LiSN surfaces it to Conduct same-day. *([illustrative], anchored to the DSAT figure.)*
- **Regulatory / governance hook:** feeds the Internal Ombudsman quarterly board pattern-analysis duty; 100% coverage vs sampled QA.
- **Feasibility (panel view):** AI-architect — core LiSN capability. Compliance — high value. Low tension; near-unanimous keep.

### UC-PPLX-A9 — Tokenised vs non-tokenised CNP approval-gap monitor `[long-tail — preserve]`
- **Archetype:** curable-decline / authentication (tokenisation)
- **Bucket:** A
- **Signal (one line):** "The approval gap between tokenised and non-tokenised CNP on this segment is widening abnormally."
- **Cadence / trigger:** daily
- **Primary user → routed executive:** PM → Head of Risk / Ops
- **1. Data aggregation:** transaction-side CNP approve/decline split by tokenisation status × MCC × BIN × network; CoFT token-status events.
- **2. Baseline creation:** baseline approval gap between tokenised and non-tokenised CNP per segment.
- **3. Dynamic detection:** detect abnormal widening of the gap — a fingerprint of a token-lifecycle problem or a 3-DS/ACS misconfiguration on one path.
- **4. Distillation:** suppress expected structural gaps; surface abnormal widening; rank by affected GMV.
- **5. Surfacing & routing:** "Tokenised-CNP approval lagging non-tokenised by 7 pts on a merchant group (normally 1 pt) — likely token/ACS issue"; **draft note to Ops**. **Hero element: the abnormal approval-gap.**
- **Why it beats a self-built dashboard:** the source explicitly flags "elevated declines on tokenised vs non-tokenised CNP" as a daily question; a blended approval dashboard hides it. With ~98% of e-commerce on CoFT tokens, the gap is economically large.
- **Differentiation:** transaction-visible.
- **Worked example:** tokenised-CNP approval on one merchant group trails non-tokenised by 7 pts versus a 1-pt norm after a network token update; LiSN flags an ACS/token issue the same day. *([illustrative].)*
- **Regulatory / governance hook:** CoFT mandate; Authentication Directions 2025.
- **Feasibility (panel view):** AI-architect — needs tokenisation-status granularity in the feed (possible gap). SF-PM — clean, low false-positive. Long-tail but commercially interesting; preserve.

---

## BUCKET B — Net-new cards-transaction × complaint/voice joins that do not exist today

### UC-PPLX-B1 — Decline-spike to customer-voice incident-intelligence pack *(the hero)*
- **Archetype:** curable-decline / fraud-rule (root-cause)
- **Bucket:** B
- **Signal (one line):** "Declines rose on this cohort AND the matching customer-voice spike pins the cause — packaged as an incident-intelligence pack with affected customers and narratives."
- **Cadence / trigger:** real-time / daily morning brief
- **Primary user → routed executive:** PM → Head of Cards / Risk (routed by cause)
- **1. Data aggregation:**
  - Transaction-side: bank-signalled decline anomaly flags by reason code × cohort × BIN × MCC × channel × timestamp; fraud-rule change events; tokenisation status. *(LiSN consumes the anomaly flag/summary; it does not hold the transaction lakehouse.)*
  - Interaction-side: calls/chats/social/app-store mentioning "card declined", "payment failed", "transaction not going through", with sentiment, merchant and timestamp.
- **2. Baseline creation:** dual baselines — bank-side decline-anomaly flags AND "payment-failed" interaction-rate per cohort × channel × time — plus a cross-domain co-movement baseline (normal joint behaviour).
- **3. Dynamic detection:** detect an interaction-rate anomaly **time-aligned** to a bank-signalled decline anomaly in the same cohort/merchant window; the join converts a sterile decline flag into a causal narrative (rule change vs tokenisation break vs genuine fraud).
- **4. Distillation:** suppress decline flags with no voice echo and voice spikes with no decline basis; surface only the co-moving pair, ranked by ₹-at-risk × escalation-risk.
- **5. Surfacing & routing:** an **incident-intelligence pack** — "Decline anomaly on premium e-commerce AND 'payment failed' contacts +4× from the same cohort, matching X chatter, all from 11:00 after the tokenisation push"; the **Correlation Evidence band** shows both curves on one timeline, plus the affected-customer list and top narratives; **draft action** routed to the cause owner, no transaction data held. **Hero element: the dual-curve correlation band inside the incident pack.**
- **Why it beats a self-built dashboard:** no dashboard a PM can build joins the decline grid to the voice corpus in real time; the source rates this the top 1–2 unmet need and notes today it is "manual incident post-mortems for large outages" only.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a tokenisation/network change at 11:00 triggers a decline anomaly on premium e-commerce; "payment failed" contacts rise 4× and X chatter matches; against the source's 1–5 bps decline-diagnosis impact, LiSN names the cause (CoFT re-tokenisation break, not customer behaviour) the same morning, hands Ops the fix and Cards a recovery draft. *(1–5 bps anchored; 4× and timing [illustrative].)*
- **Regulatory / governance hook:** auditable cause-to-impact trail; pre-empts escalation under the Internal Ombudsman regime; the API/hooks model keeps LiSN inside the defensible boundary the source defines.
- **Feasibility (panel view):** AI-architect — time-alignment and cohort↔caller resolution are the hard parts; cohort-level join keeps it DPDP-clean. SF-PM — the co-movement baseline is the trust anchor against spurious correlation. Compliance — cohort-level strongly preferred over identity-level. Marketing — *the* demo. Tension: AI-architect (identity-level is richer) vs Compliance (cohort-level is safer) — resolve to cohort-level for v1.

### UC-PPLX-B2 — Fraud-rule misfire, voice-confirmed before the KPI moves
- **Archetype:** fraud-rule misfire
- **Bucket:** B
- **Signal (one line):** "'Card declined at checkout' contacts are leading a rule change — over-blocking good customers before any fraud KPI shows it, with the attrition impact attached."
- **Cadence / trigger:** event-triggered + real-time
- **Primary user → routed executive:** PM → Head of Fraud / Risk
- **1. Data aggregation:** transaction-side fraud-rule change events + suspected-fraud decline flags by BIN/cohort; interaction-side "declined / blocked / why is my card not working" mentions with merchant, time, and any switch-intent language.
- **2. Baseline creation:** baseline lag between a rule push and its complaint echo per cohort; normal decline-to-complaint and complaint-to-attrition ratios.
- **3. Dynamic detection:** detect a complaint surge whose timing/merchant pattern maps to a recent rule push, *ahead* of the fraud team's own effectiveness review, and project the attrition tail.
- **4. Distillation:** suppress complaint noise unrelated to declines; isolate the rule-attributable cluster; rank by good-customer GMV at risk plus projected attrition.
- **5. Surfacing & routing:** "Rule R-77: 'declined at checkout' contacts +3× in 2h on tenured customers, switch-intent rising — over-blocking, not fraud suppression"; **draft roll-back review to Fraud**. **Hero element: the voice-leads-KPI timing gap with the attrition projection.**
- **Why it beats a self-built dashboard:** the fraud KPI lags; the customer reaction lands in voice first. The source rates fraud-rule-misfire-with-CX-and-attrition a "very high, poorly served" white space.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** within two hours of rule R-77, "card blocked at [merchant]" contacts triple, 80% from 3+-year customers, with rising "I'll switch cards" language; LiSN compresses detect-to-rollback to the same morning and flags the attrition tail. *([illustrative].)*
- **Regulatory / governance hook:** supports "explain why good transactions were declined" under Authentication Directions 2025.
- **Feasibility (panel view):** AI-architect — needs reliable rule-change feed + complaint timestamping. Tension: Risk ownership sensitivity; frame as protecting approval rate and reducing attrition.

### UC-PPLX-B3 — Weak-authentication liability cluster (Authentication Directions 2025)
- **Archetype:** authentication-liability
- **Bucket:** B
- **Signal (one line):** "2FA/OTP-failure complaints joined to weak-authentication CNP transactions reveal a cluster of issuer-compensation exposure — affected customers and narratives, without holding transaction data."
- **Cadence / trigger:** daily + event-triggered
- **Primary user → routed executive:** PM / Conduct → Head of Risk / Compliance
- **1. Data aggregation:** transaction-side bank-flagged CNP transactions with authentication-method/status and dispute markers; interaction-side complaints citing "OTP not received", "charged without OTP", "2FA failed".
- **2. Baseline creation:** baseline auth-failure-complaint rate per channel/merchant; expected dispute-to-complaint ratio.
- **3. Dynamic detection:** detect clusters where weak-or-absent-authentication flags co-occur with customer assertions of non-receipt/bypass — the exact pattern that triggers issuer liability.
- **4. Distillation:** suppress isolated OTP-delivery gripes; surface clusters with transaction and dispute corroboration; rank by potential compensation exposure (₹).
- **5. Surfacing & routing:** an **incident pack** — "N CNP transactions flagged weak-auth on merchant M AND matching 'charged without OTP' complaints — ₹X potential compensation exposure, here are the customers and narratives"; **draft note to Compliance**. **Hero element: the quantified liability exposure.**
- **Why it beats a self-built dashboard:** liability lives precisely at the intersection of an auth-method gap and a customer assertion; neither dashboard sees the other. The source calls out the 2025 Directions' shift of liability to issuers for weak authentication.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** post-April 2026, LiSN finds 47 CNP authorisations flagged weak-auth on one merchant path, joined to 31 "money taken, no OTP" complaints; the exposure is a systemic auth-flow gap of ~₹6–9 lakh and a remediation priority; routed to Compliance same-day. *([illustrative], anchored to the Authentication Directions 2025 liability provision.)*
- **Regulatory / governance hook:** RBI Authentication Mechanisms Directions 2025 (effective April 2026) issuer liability; DPDP-compliant, cohort/merchant-level.
- **Feasibility (panel view):** Compliance — highest-value defensibility use case. AI-architect — needs auth-status in the bank's flagged feed (may be a gap). SF-PM — high precision essential. Strong panel consensus to prioritise.

### UC-PPLX-B4 — Hardship-episode entity → roll-rate predictor
- **Archetype:** hardship & roll-rate
- **Bucket:** B
- **Signal (one line):** "Recurring hardship language is forming 'hardship episodes' that lead 0→30 migration in this cohort — credit cost surfacing in voice first."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Risk / Collections
- **1. Data aggregation:** interaction-side collections/service calls and chats — job-loss, medical, "can't pay this month", billing-confusion, collections-harassment language; transaction-side DPD flow + Stage-2 migration by cohort.
- **2. Baseline creation:** baseline hardship-language rate per cohort; the normal lead-lag from a **hardship episode** (a multi-hit interaction entity) to roll-rate movement.
- **3. Dynamic detection:** construct hardship episodes as first-class entities from repeated distress signals, and detect episode surges that precede 0→30 inflection in the same cohort.
- **4. Distillation:** suppress generic billing confusion; isolate genuine financial-distress episodes; rank by projected credit-cost bps within the 5–20 bps band.
- **5. Surfacing & routing:** "Hardship episodes +1.9× in a sub-prime vintage, leading a projected 0→30 inflection — ~9 bps credit-cost risk"; **draft signal to the bank's EWS / Collections** (LiSN signals, bank decides). **Hero element: the hardship-episode-leads-delinquency lead time.**
- **Why it beats a self-built dashboard:** EWS today is transactional/bureau and lagging; the source notes interaction hardship signals are "under-used as quantitative early-warning features." Modelling hardship as an entity is the net-new step.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** in a sourcing vintage, hardship episodes rise 1.9× over two weeks; LiSN predicts a 0→30 inflection the transactional EWS flags a fortnight later, worth an estimated 9 bps within the source's 5–20 bps range, and enables more humane collections. *([illustrative], anchored to the 5–20 bps table.)*
- **Regulatory / governance hook:** advisory signal only — no credit decisioning in LiSN; DPDP-compliant; supports fair, early hardship treatment.
- **Feasibility (panel view):** SF-PM — strongest leading-indicator story; precision-critical. Compliance — must remain advisory to the bank's EWS. AI-architect — the hardship-episode entity model is the build. Tension: identity-level richness vs cohort-level safety — resolve to cohort-level advisory.

### UC-PPLX-B5 — Ombudsman-escalation pre-empt with journey-trace and mishandling-locus
- **Archetype:** conduct & grievance (escalation)
- **Bucket:** B
- **Signal (one line):** "A systemic complaint pattern is trending toward ombudsman escalation — traced from first complaint to escalation, with the branch/agent/process that systematically mishandles it."
- **Cadence / trigger:** daily + weekly board view
- **Primary user → routed executive:** PM / Conduct → Head of Conduct / Internal Ombudsman liaison
- **1. Data aggregation:** interaction-side complaint registry + calls/chats/social by product × MCC × co-brand × geography × branch × agent; transaction-side the common event class the complaints attach to.
- **2. Baseline creation:** complaint-pattern and resolution-quality baselines per product/co-brand/branch/agent; the normal partially-resolved/rejected rate that precedes escalation.
- **3. Dynamic detection:** detect a complaint cluster tied to a common transaction behaviour AND trace the customer journey from first contact to near-escalation, isolating the branch/agent/process locus of mishandling.
- **4. Distillation:** suppress idiosyncratic one-offs; surface the systemic cluster with a root cause and a mishandling locus; rank by escalation probability and consequential-loss exposure.
- **5. Surfacing & routing:** "Co-brand C 'wrong late-fee' complaints clustering, root-caused to a billing-cycle config; mishandled at one resolution queue; N cases near IO escalation"; **draft remediation brief to Conduct**. **Hero element: the escalation-risk countdown plus the named mishandling locus.**
- **Why it beats a self-built dashboard:** complaint dashboards count cases; they neither cluster around a transaction root cause, nor trace journeys to escalation, nor localise mishandling. The source rates this "high, especially for public-sector and large private banks under RBI scrutiny" and notes today's reviews are sampling-based.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** "incorrect late fee" complaints on one co-brand triple in a week, all traceable to a billing-cycle misconfiguration and concentrated in one resolution queue with a high rejection rate; left alone they auto-escalate to the Internal Ombudsman; LiSN root-causes, names the queue, and feeds the quarterly board pattern report — against a backdrop of credit-card complaints up ~20% and now second-largest. *([illustrative], anchored to the +20% / second-largest figures.)*
- **Regulatory / governance hook:** Internal Ombudsman regime, quarterly board pattern analysis; DPDP-compliant.
- **Feasibility (panel view):** Compliance — board-level pain, top priority. AI-architect — clustering + journey-trace + locus detection feasible. Marketing — "stay out of the ombudsman's report" sells itself. Low tension.

### UC-PPLX-B6 — Campaign/EMI mis-selling blowback detector
- **Archetype:** campaign-to-complaint
- **Bucket:** B
- **Signal (one line):** "This offer launch is generating a complaint/dispute echo — mis-selling fallout caught in days, not post-campaign."
- **Cadence / trigger:** event-triggered (campaign launch) + daily
- **Primary user → routed executive:** PM → Head of Cards / Conduct
- **1. Data aggregation:** transaction-side campaign/offer launch events + resulting EMI conversions/charges and fee-reversals; interaction-side complaints/chats citing "hidden charges", "no-cost EMI but charged", "didn't agree to this".
- **2. Baseline creation:** baseline complaint/dispute rate per offer-type; expected post-launch sentiment.
- **3. Dynamic detection:** detect a post-launch complaint/dispute surge attributable to a specific campaign's messaging — the conduct cost marketing dashboards never see.
- **4. Distillation:** suppress unrelated complaint noise; isolate the campaign-attributable cluster; rank by mis-selling severity and reversal cost.
- **5. Surfacing & routing:** "EMI offer launched Tuesday — 'no-cost EMI but charged interest' complaints +3.5× by Thursday, fee-reversals rising"; **draft note to Conduct + Marketing**. **Hero element: the launch-to-complaint echo curve.**
- **Why it beats a self-built dashboard:** marketing sees opens/clicks/spend; the source notes PMs "rarely have unified views of the complaints and disputes triggered by a campaign unless a large incident occurs." The join links cause to conduct cost in days.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a "no-cost EMI" push converts well on the spend dashboard but triggers a 3.5× rise in "charged interest on no-cost EMI" complaints and a fee-reversal uptick within 48 hours — an MITC-disclosure exposure flagged before the campaign's second wave. *([illustrative].)*
- **Regulatory / governance hook:** MITC / "no-cost EMI" disclosure rules; Internal Ombudsman pattern analysis.
- **Feasibility (panel view):** AI-architect — needs campaign event feed + complaint attribution. Marketing-PM — sensitive (audits campaigns); protects the brand. Tension: marketing vs conduct ownership.

### UC-PPLX-B7 — Tech-incident true-customer-impact pack
- **Archetype:** switch-incident attribution (voice-joined)
- **Bucket:** B
- **Signal (one line):** "This switch/processor degradation is hurting real customers — the contact/social surge quantifies the impact an in-SLA outage hides."
- **Cadence / trigger:** real-time / event-triggered
- **Primary user → routed executive:** PM → Head of Ops / Tech + Comms
- **1. Data aggregation:** transaction-side switch/processor health + technical-decline flags by route; interaction-side call/chat/social surge with "app down", "payment failing", merchant context.
- **2. Baseline creation:** baseline co-movement of technical-decline rate and customer-contact rate per route.
- **3. Dynamic detection:** detect a tech degradation joined to a customer-contact surge (true impact) versus a silent blip (benign) or a contact surge with no tech basis (merchant/comms).
- **4. Distillation:** suppress harmless blips; surface degradations with real customer pain; rank by affected customers × ₹ flow.
- **5. Surfacing & routing:** an **incident pack** — "Route X degraded since 09:10 AND 'payment failing' contacts +5× — ~14,000 customers affected, ₹70L/hr; comms recommended"; **draft incident + comms note**. **Hero element: the customers-affected number from the voice side.**
- **Why it beats a self-built dashboard:** the source contrasts Dynatrace-type command centres (system health) with the missing "business-layer portfolio intelligence"; a route can read in-SLA while customers churn. The join measures human impact and the need to communicate.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a processor route degrades within SLA (Ops sees green) but "payment failing" contacts rise 5× and app-store reviews dip; LiSN estimates ~14,000 affected customers and ₹70L/hr, triggering proactive comms hours before escalation. *([illustrative].)*
- **Regulatory / governance hook:** supports outage-disclosure and fair-treatment; auditable impact record.
- **Feasibility (panel view):** AI-architect — needs switch telemetry + contact feed. SF-PM — co-movement baseline prevents false alarms. Tension: overlap with Ops tooling; LiSN's wedge is customer-impact quantification.

### UC-PPLX-B8 — Co-brand / merchant-aggregator diagnostic join `[long-tail — preserve]`
- **Archetype:** switch-incident attribution / other (co-brand)
- **Bucket:** B
- **Signal (one line):** "Declines and complaints concentrate at one co-brand partner or merchant aggregator — the partner-level issue surfaced without manual log-stitching."
- **Cadence / trigger:** daily / event-triggered
- **Primary user → routed executive:** PM → Co-brand partner manager / Ops
- **1. Data aggregation:** transaction-side decline/auth flags by co-brand programme × merchant-aggregator × MCC; interaction-side complaints/chats naming the co-brand or merchant, with sentiment and issue type.
- **2. Baseline creation:** baseline decline and complaint rates per co-brand partner / aggregator.
- **3. Dynamic detection:** detect a partner-localised decline anomaly joined to a partner-named complaint cluster — the diagnostic the source flags as a hard "auth/fraud logs ↔ co-brand/merchant systems" join that is "manual and slow, especially in India's fragmented merchant ecosystem."
- **4. Distillation:** suppress portfolio-wide noise; isolate the partner-localised pair; rank by partner GMV and relationship risk.
- **5. Surfacing & routing:** "Co-brand partner Y: declines +2.8× AND partner-named complaints +3× — partner-side integration issue, here are the affected customers and narratives"; **draft partner-escalation note**. **Hero element: the partner-localised decline+complaint pair.**
- **Why it beats a self-built dashboard:** the source names this join explicitly as one of the hardest and most manual; LiSN automates the partner-level diagnosis the PM otherwise assembles by hand across two organisations' logs.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a co-brand partner's checkout integration breaks; issuer-side declines on that programme rise 2.8× while complaints naming the partner rise 3×; LiSN localises it to the partner and packages the evidence for the partner-escalation conversation. *([illustrative], anchored to the source's named co-brand/merchant-join gap.)*
- **Regulatory / governance hook:** co-brand data-handling rules; partner-governance auditability.
- **Feasibility (panel view):** AI-architect — needs partner/aggregator tagging in the decline feed. Compliance — clean. Long-tail but commercially distinctive; preserve.

### UC-PPLX-B9 — Consent-aware analytics & explainability gate (DPDP) `[long-tail — preserve]`
- **Archetype:** other (governance) / authentication-liability adjacent
- **Bucket:** B
- **Signal (one line):** "Every interaction-to-transaction join surfaced is labelled with its consent status and an explainability trail — 'was this use consented and explainable?' answered at scale."
- **Cadence / trigger:** continuous (governance layer on every other use case)
- **Primary user → routed executive:** PM / Conduct → Data Protection Officer / Compliance
- **1. Data aggregation:** interaction-side consent metadata per channel/customer (purpose, scope, timestamp); transaction-side the anomaly/cohort the join touches.
- **2. Baseline creation:** consent-coverage baselines per cohort/use case; expected consent-validity rate.
- **3. Dynamic detection:** detect joins or cohorts where consent coverage is incomplete or a purpose-limitation boundary would be crossed — the "DPDP consent-logs ↔ analytics" join the source says is "essentially never made," because analytic environments rarely integrate consent metadata.
- **4. Distillation:** suppress fully-consented, in-purpose uses; surface only the joins that need consent attention; rank by regulatory exposure.
- **5. Surfacing & routing:** "Cohort cluster X join uses interaction data outside captured marketing-analytics consent — explainability trail attached, action required before use"; **draft note to the DPO**. **Hero element: the consent-and-explainability label on every signal.**
- **Why it beats a self-built dashboard:** a self-built analytics stack treats consent as a separate layer and cannot answer the consent-and-explainability question per join; the source flags this gap directly and ties it to DPDP's SDF audit and automated-decision-transparency duties.
- **Differentiation:** **requires the txn × voice join — does not exist today** (here the join is interaction-data-use × consent-metadata).
- **Worked example:** LiSN flags that a retention-targeting cohort built from a transaction-anomaly join draws on chat data captured under a service-only consent and outside the 7-year-regulatory vs shorter-marketing retention split; it blocks the use and routes the explainability trail to the DPO. *([illustrative], anchored to the source's DPDP consent-logs join and retention-tiering points.)*
- **Regulatory / governance hook:** DPDP Act 2023 — consent, purpose limitation, tiered retention, SDF audit, automated-decision transparency.
- **Feasibility (panel view):** Compliance — quietly the most strategic card; it is what makes every other Bucket-B join defensible. AI-architect — needs consent-metadata integration, non-trivial. SF-PM — not a "signal" in the anomaly sense but a gating layer. Tension: AI-architect (engineering cost) vs Compliance (non-negotiable); resolve by building it as the substrate under all joins. Long-tail in evidence but foundational; preserve.

### UC-PPLX-B10 — Disparate-treatment / fair-treatment surveillance `[long-tail — preserve]`
- **Archetype:** conduct & grievance (fairness)
- **Bucket:** B
- **Signal (one line):** "Grievance-handling quality or treatment outcomes differ abnormally across cohorts/geographies — a potential disparate-treatment hot spot."
- **Cadence / trigger:** weekly / monthly board view
- **Primary user → routed executive:** PM / Conduct → Head of Conduct / Compliance
- **1. Data aggregation:** interaction-side resolution quality, TAT, tone, and outcome by cohort × geography × branch × agent; transaction-side the product/segment the customers sit in.
- **2. Baseline creation:** baseline treatment-quality and outcome distributions across cohorts; expected parity bands.
- **3. Dynamic detection:** detect cohorts/geographies whose grievance-handling quality or outcomes deviate abnormally from parity — joining interaction-treatment outcomes to customer segments.
- **4. Distillation:** suppress volume-driven noise; surface statistically abnormal treatment gaps; rank by regulatory and reputational exposure.
- **5. Surfacing & routing:** "Resolution quality for a regional cohort runs materially below parity on the same complaint type"; **draft review to Conduct/Compliance**. **Hero element: the parity-gap by cohort.**
- **Why it beats a self-built dashboard:** the source explicitly lists "potential bias in treatment" within defensible conduct surveillance; no transaction tool or sampling QA can detect disparate handling across the full interaction corpus joined to segments.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** customers in one region with the same dispute type receive materially lower resolution quality and longer TAT than the portfolio parity band; LiSN surfaces the gap for a conduct review before it becomes a fair-treatment finding. *([illustrative], anchored to the source's bias-in-treatment point.)*
- **Regulatory / governance hook:** RBI conduct/fair-treatment expectations; UDAAP/fair-lending analogue globally; DPDP-compliant, cohort-level.
- **Feasibility (panel view):** Compliance — high-value, sensitive. AI-architect — parity modelling and cohort definition are the build; false-positive risk real. SF-PM — needs careful statistical framing to avoid spurious "bias" claims. Tension: detection ambition (Compliance) vs precision discipline (SF-PM); require high statistical confidence before surfacing. Long-tail but strategically distinctive; preserve.

---

## Panel Notes

**Sharpest disagreements across the catalogue:**
1. **Identity-level vs cohort-level joins (AI-architect vs Compliance).** Richer correlation and tighter recovery come from identity-level joins; DPDP and the compliance adviser push to cohort/merchant-level. Recurs in B1, B4, B10. Resolution: cohort/merchant-level for v1, identity-level only behind explicit, purpose-limited consent (which UC-PPLX-B9 enforces).
2. **The consent gate as feature vs substrate (AI-architect vs Compliance).** Compliance treats B9 as the foundation that makes every other join defensible; the AI-architect flags its engineering cost and that it is not an "anomaly" in the detection sense. Resolution: build it as the substrate under all Bucket-B joins, not a standalone card.
3. **Bias-in-treatment ambition vs false-positive risk (Compliance vs SF-PM).** B10 is strategically powerful but a wrong "bias" flag is costly. Resolution: high statistical-confidence threshold and human review before any surfacing.
4. **Auditing the bank's own functions.** A2/B2 audit Fraud's rules; A4/B6 audit Marketing's campaigns; B5 names a mishandling resolution queue. Real value, real internal friction. Resolution: route privately to the owning exec first, framed as their early-warning.

**Five strongest UI candidates (why they resonate with a cards/portfolio manager):**
- **UC-PPLX-B1 — Decline-spike↔voice incident-intelligence pack.** Root cause arrives with the alert, packaged as customers + narratives without holding transaction data; the source's top-1–2 white space and the natural demo opener.
- **UC-PPLX-B3 — Weak-authentication liability cluster.** Turns the April-2026 issuer-liability shift into a quantified, board-ready morning alert.
- **UC-PPLX-B5 — Ombudsman pre-empt with mishandling-locus.** Speaks to the fastest-growing complaint category and names the queue to fix; "stay out of the ombudsman's report."
- **UC-PPLX-B4 — Hardship-episode roll-rate predictor.** The 5–20 bps credit-cost leading indicator that lives in voice weeks before the book — a number a Head of Risk cannot get elsewhere.
- **UC-PPLX-A1 — Issuer-side curable-decline recovery radar.** Immediate, quantified rupee recovery (1–3 bps GMV) the PM can act on before lunch, filling the issuer-side gap merchant tools leave open.

**Recall note:** four cards here are Perplexity-distinct and unlikely to appear in the Opus run — A9 (tokenised-CNP gap), B8 (co-brand/merchant diagnostic join), B9 (DPDP consent gate), B10 (disparate-treatment surveillance) — plus the "incident-intelligence pack" and "hardship-episode entity" framings. Carry these into the merge as `[single-source — preserve]` candidates rather than letting convergence-weighting drop them.
