# LiSN Cards Extension — Use-Case Catalogue
## ENGINE: Claude Opus 4.8 — source: ChatGPT (GPT-5) research ("Cards Portfolio Manager Intelligence and LiSN Positioning, 19 Jun 26")

*Mined per-source for high recall. Bucket A = pipeline use cases that beat a self-built dashboard. Bucket B = net-new cards-transaction × complaint/voice joins that do not exist today. IDs keyed UC-GPT-* for mechanical merge against the Opus, Perplexity and Gemini runs.*

---

### Framing — how this run read the source
This run leaned on what the ChatGPT source frames more sharply than the others. Three things shaped it. First, its signature **"decision bundle"**: the PM does not want another chart, but the answer to "what went wrong, who is affected, what customers are saying, what regulatory timer has started, and what action is commercially optimal by the next working session" — every Bucket B card here is built to deliver that bundle, including the **regulatory-timer** element. Second, its precise articulation of the join problem as **two different identifier worlds** — one keyed by PAN/token/merchant/MCC/auth-code/rule/processor, the other by customer-ID/complaint-category/transcript/agent-notes/case-workflow — which is why the transaction↔voice join is "essentially never made in a timely way." Third, ChatGPT's distinctive metrics and hooks, used as anchors: complaint intensity per 1,000 cards (private-sector 0.420 vs public-sector 0.114), **reward-negative spend categories** (categories that lose money after MDR/interchange and fraud), **profitable/retained spend vs gross GMV** (the premiumisation shift), the **₹500/day** closure-delay compensation, the **30-day** IO final-decision clock, dispute-settlement-**before-CIC-reporting**, and the **1 Oct 2026** cross-border CNP validation requirement. Grounding figures: SBI Card FY25 (2.08 crore CIF, ₹333,480 cr spends, ₹55,840 cr receivables, #2 CIF/#3 spends), ICICI ~18M active cards, Axis 3.47M issued FY25 with premiumisation messaging, RBI 41,457 credit-card complaints (+20.04%, second-largest), and global references Amex (discount revenue $37.4bn, net card fees $10.0bn) and Capital One Domestic Card (4.91% net charge-off, 3.94% 30+ delinquency).

---

## BUCKET A — Pipeline use cases that outperform a self-built dashboard

### UC-GPT-A1 — "Curable today" decline-recovery radar
- **Archetype:** curable-decline intelligence
- **Bucket:** A
- **Signal (one line):** "These decline clusters are curable today — ₹X of GMV and interchange is recoverable before the next working session."
- **Cadence / trigger:** daily flash + intra-day
- **Primary user → routed executive:** PM → Head of Cards
- **1. Data aggregation:**
  - Transaction-side: decline/auth events by reason class against ChatGPT's full daily cause taxonomy — issuer risk rule, network issue, token/CoFT issue, merchant payload, authentication step-up, processor outage, customer-limit exhaustion — split by MCC × merchant × BIN × geography × CNP/CP × cohort; tokenisation status.
  - Interaction-side: none for the core (voice extension is UC-GPT-B1).
- **2. Baseline creation:** curable-decline-rate baselines per cause-class × product × cohort × MCC × channel × day-of-cycle, with salary-cycle and sale-day seasonality encoded.
- **3. Dynamic detection:** flag cells where the curable share breaks its own seasonal band; classify each cluster as curable-today (step-up retry, token re-provision, limit/EMI nudge) vs structural.
- **4. Distillation:** suppress expected pre-payday and sale-day bulges; rank by recoverable ₹ = decline count × avg ticket × recovery propensity, weighted up where the same cause also carries complaint-escalation risk. Surface the top three.
- **5. Surfacing & routing:** "₹2.1 Cr curable today — authentication step-up over-firing on premium e-commerce, +31% vs band"; shows abnormality, recoverable ₹, cards affected, the cause-class, the recommended action, and a **draft requirement** the PM approves. Human gate explicit. **Hero element: the "curable today" rupee figure with its named cause-class.**
- **Why it beats a self-built dashboard:** Mastercard Intelligence Center "pinpoints decline reasons" but a hand-built dashboard shows a blended rate; it cannot maintain seasonal per-cause baselines or rank by what is recoverable *today*.
- **Differentiation:** transaction-visible.
- **Worked example:** authentication step-up declines on premium e-commerce run 31% above band; against SBI-Cards-scale spends (₹333,480 cr), ~₹2.1 Cr is curable today via a token re-provision and retry flow; LiSN drafts it for the eligible sub-segment. *([illustrative], anchored to SBI FY25 spends.)*
- **Regulatory / governance hook:** retry/step-up tweaks respect Authentication Directions 2025; CoFT-compliant; audit-logged.
- **Feasibility (panel view):** AI-architect — needs the rich cause taxonomy in the decline feed. SF-PM — seasonal band is the trust anchor. Marketing-PM — the opener. Tension: conservative thresholds vs more cards surfaced; resolve to ≤3.

### UC-GPT-A2 — Fraud-rule / authentication-friction approval anomaly
- **Archetype:** fraud-rule misfire
- **Bucket:** A
- **Signal (one line):** "Approval on this segment dropped after a rule or step-up change — good customers are being blocked."
- **Cadence / trigger:** event-triggered (rule/auth change) + real-time
- **Primary user → routed executive:** PM → Head of Risk / Fraud
- **1. Data aggregation:**
  - Transaction-side: approve/decline by BIN × MCC × channel × cohort; fraud-rule and authentication step-up change events; risk scores; exemption usage.
  - Interaction-side: none for the core (voice confirmation is UC-GPT-B2).
- **2. Baseline creation:** approval baselines per BIN × MCC × channel, with rule/step-up changes overlaid as change-points.
- **3. Dynamic detection:** detect approval step-changes after a rule or step-up push, concentrated on low-risk tenured cohorts — friction that is "technically compliant and commercially harmful," per the source.
- **4. Distillation:** suppress dips matching genuine fraud-outbreak signatures; rank by good-customer GMV at risk.
- **5. Surfacing & routing:** "Approval −5 pts on a tenured BIN after step-up change at 11:00 — 90% low-risk"; **draft roll-back review to Fraud/Risk**. **Hero element: the change-to-approval-drop timeline.**
- **Why it beats a self-built dashboard:** aggregate approval barely moves; a dashboard has no change-point awareness and no good-vs-risky decomposition.
- **Differentiation:** transaction-visible.
- **Worked example:** a risk-based step-up tightens at 11:00; approval on a tenured travel BIN falls 5 pts, ~₹1.2 Cr/day at risk, 90% from low-risk customers; LiSN routes a roll-back review the same morning. *([illustrative].)*
- **Regulatory / governance hook:** Authentication Directions 2025 permit risk-based extra checks but make the issuer accountable for robustness; supports "explain why good transactions were declined."
- **Feasibility (panel view):** AI-architect — needs the rule/step-up change feed. Compliance — strong. Tension: Risk may resist a layer auditing its controls; frame as protecting approval rate.

### UC-GPT-A3 — Token/CoFT & processor outage attribution
- **Archetype:** switch-incident attribution
- **Bucket:** A
- **Signal (one line):** "This decline excursion is a token/CoFT or processor issue, not customer behaviour — with the business impact attached."
- **Cadence / trigger:** real-time
- **Primary user → routed executive:** PM → Head of Ops / Tech
- **1. Data aggregation:** transaction-side auth success/latency by route × acquirer × network × token-status; technical decline codes; CoFT/token provisioning events; switch/processor health.
- **2. Baseline creation:** latency and technical-decline baselines per route × token-status × time-of-day.
- **3. Dynamic detection:** isolate technical/token-provisioning excursions to a route or token-requestor, separating tech/token causes from customer/merchant/fraud/campaign.
- **4. Distillation:** suppress maintenance windows; rank by ₹ flowing through the degrading path.
- **5. Surfacing & routing:** "Token-provisioning failures +4× on one requestor since 09:10, ₹70L/hr — token issue, not customer"; **draft incident note to Ops**. **Hero element: the token/tech verdict with ₹/hr.**
- **Why it beats a self-built dashboard:** the source stresses PMs must "interpret spikes through a tokenization lens, not just a merchant or fraud lens"; a generic decline dashboard cannot make that attribution.
- **Differentiation:** transaction-visible (voice-joined impact is UC-GPT-B7).
- **Worked example:** after a network token update, provisioning failures quadruple on one token-requestor; ₹70L/hr at risk; LiSN attributes and routes to Ops before the call-centre spikes. *([illustrative].)*
- **Regulatory / governance hook:** CoFT mandate; Authentication Directions 2025 require open access to tokenisation services.
- **Feasibility (panel view):** AI-architect — needs token-status granularity. Tension: overlaps observability; wedge is portfolio-impact attribution.

### UC-GPT-A4 — Incremental-vs-subsidised campaign spend detector
- **Archetype:** campaign-to-complaint (offer side)
- **Bucket:** A
- **Signal (one line):** "This offer is subsidising spend customers would have made anyway — incremental lift is near zero."
- **Cadence / trigger:** weekly + campaign-launch event-triggered
- **Primary user → routed executive:** PM → Head of Cards / Marketing
- **1. Data aggregation:** transaction-side offer/redemption events, spend-by-cohort pre/post, MCC mix, incremental-vs-control spend; merchant-funded vs issuer-funded flags.
- **2. Baseline creation:** expected-uplift baselines per offer-type × cohort × MCC, plus a matched-control counterfactual.
- **3. Dynamic detection:** detect offers where incremental spend is indistinguishable from a matched control (subsidised existing spend, not incremental), per the source's weekly question.
- **4. Distillation:** suppress early-cycle noise; rank by reward-cost-at-risk and lost incrementality.
- **5. Surfacing & routing:** "Offer X: incremental ≈ control — ₹Y reward cost subsidising existing spend"; **draft pause/retarget recommendation**. **Hero element: the subsidised-vs-incremental split.**
- **Why it beats a self-built dashboard:** marketing sees gross redemption and spend lift; the counterfactual that separates incremental from subsidised spend is not something a hand-built dashboard maintains.
- **Differentiation:** transaction-visible.
- **Worked example:** a dining offer shows healthy redemption but incremental spend within 2% of control, ₹0.8 Cr reward cost with near-zero true lift; LiSN flags retargeting by day 6. *([illustrative].)*
- **Regulatory / governance hook:** reward-parity and "no-cost EMI" disclosure checkable on offer copy.
- **Feasibility (panel view):** AI-architect — clean control-cohort method needed. Marketing-PM — sensitive; frame as protecting reward budget. Tension: marketing vs portfolio ownership.

### UC-GPT-A5 — Reward-negative spend-category detector `[long-tail — preserve]`
- **Archetype:** other (reward economics)
- **Bucket:** A
- **Signal (one line):** "This spend category has turned reward-negative — costing more in points than it earns after MDR/interchange and fraud."
- **Cadence / trigger:** weekly / monthly
- **Primary user → routed executive:** PM → Head of Cards / Finance
- **1. Data aggregation:** transaction-side spend by MCC × category × cohort, interchange/MDR earned, reward accrual/cost, fraud loss by category.
- **2. Baseline creation:** net-economics baselines per category (interchange − reward − fraud) per cohort.
- **3. Dynamic detection:** detect categories whose net economics cross into negative territory, or deteriorate abnormally, after a reward or MDR change.
- **4. Distillation:** suppress structurally low-margin-but-strategic categories (flagged as known); rank by annualised reward-cost leakage.
- **5. Surfacing & routing:** "Category Z turned reward-negative for a cohort after the earn-rate change — ₹W annualised drag"; **draft earn-rate/category-exclusion recommendation**. **Hero element: the net-economics-per-category sign flip.**
- **Why it beats a self-built dashboard:** the source flags "which spend categories are reward-negative after MDR/interchange and fraud" as a weekly question; computing per-category net economics against a baseline is beyond a static reward dashboard.
- **Differentiation:** transaction-visible.
- **Worked example:** after an earn-rate increase, a utility-bill MCC turns reward-negative for a mass cohort, ₹0.5 Cr annualised drag; LiSN recommends a category earn-cap. *([illustrative].)*
- **Regulatory / governance hook:** reward-parity (RuPay-UPI) and MITC disclosure on earn-rate changes.
- **Feasibility (panel view):** AI-architect — needs reward-cost and fraud allocation by category. SF-PM — clean, periodic, low false-positive. Long-tail but distinctive; preserve.

### UC-GPT-A6 — Early roll-rate inflection by sourcing / vintage
- **Archetype:** hardship & roll-rate (transaction side)
- **Bucket:** A
- **Signal (one line):** "This sourcing vintage's 0→30 flow is inflecting above band — loss is building before the book shows it."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Risk / Collections
- **1. Data aggregation:** transaction-side DPD flow, Stage-2 migration, by vintage × sourcing-channel × risk-band × geography; receivables and utilisation summaries; EMI-campaign flags.
- **2. Baseline creation:** roll-rate baselines per vintage × channel × band, seasonally adjusted.
- **3. Dynamic detection:** detect flow-rate inflection above band concentrated in a sourcing vintage, line-management action, or EMI campaign — the source's named linkages.
- **4. Distillation:** suppress macro drift; isolate cohort-specific inflection; rank by projected credit-cost bps.
- **5. Surfacing & routing:** "DSA Q3 vintage with recent line increases: 0→30 +1.5× band, ~10 bps build"; **draft note to Risk**. **Hero element: the bps projection tied to the sourcing/line-action cause.**
- **Why it beats a self-built dashboard:** risk dashboards are monthly and band-level; against India's elevated write-off backdrop (the source cites SBI write-off pressure; Capital One 4.91% NCO globally), early vintage detection is the lever.
- **Differentiation:** transaction-visible (voice-led version is UC-GPT-B4).
- **Worked example:** the Q3 DSA vintage that received line increases rolls 0→30 at 1.5× band; early tightening on the worst decile averts an estimated 10 bps. *([illustrative].)*
- **Regulatory / governance hook:** feeds the bank's EWS; advisory only — no credit decisioning in LiSN.
- **Feasibility (panel view):** AI-architect — feasible on summary flows. Compliance — advisory. Tension: SF-PM — minimum cohort size to control noise.

### UC-GPT-A7 — Profitable-spend & premiumisation-drift monitor `[long-tail — preserve]`
- **Archetype:** attrition & churn / other (spend quality)
- **Bucket:** A
- **Signal (one line):** "Retained, profitable spend is drifting in this premium cohort even as gross GMV holds — top-of-wallet is slipping."
- **Cadence / trigger:** weekly / monthly
- **Primary user → routed executive:** PM → Head of Cards
- **1. Data aggregation:** transaction-side profitable/retained-spend proxies (net-of-reward, net-of-fraud spend), active-rate, top-of-wallet share proxy, by premium cohort; CIF vs active-card split.
- **2. Baseline creation:** baselines for profitable-spend velocity and active-rate per premium cohort (referencing the ICICI "active cards, not just CIF" emphasis).
- **3. Dynamic detection:** detect cohorts where gross GMV is stable but profitable/retained spend or active-rate is decaying — the premiumisation-quality gap behind Axis-style "premiumisation" and "profitable spend" messaging.
- **4. Distillation:** suppress seasonal lulls; rank by profitable-spend value at risk.
- **5. Surfacing & routing:** "Premium cohort: gross GMV flat, profitable spend −12%, active-rate slipping — top-of-wallet drift"; **draft engagement/benefit-review requirement**. **Hero element: the gross-vs-profitable spend divergence.**
- **Why it beats a self-built dashboard:** the source notes spend importance is "becoming more conditional" — issuers care about profitable and retained spend, not gross GMV; a GMV dashboard hides the divergence.
- **Differentiation:** transaction-visible (social-confirmed churn is UC-GPT-B10).
- **Worked example:** a premium travel cohort holds gross GMV but profitable spend falls 12% and 30-day active-rate slips as a competitor's premium card launches; LiSN flags a benefit review before attrition shows in closures. *([illustrative], anchored to ICICI active-cards / Axis premiumisation framing.)*
- **Regulatory / governance hook:** none direct; consent-respecting engagement.
- **Feasibility (panel view):** AI-architect — profitable-spend proxy needs reward/fraud allocation. Marketing-PM — high resonance for premium portfolios. Long-tail but distinctive; preserve.

### UC-GPT-A8 — Complaint-theme emergence radar (interaction-native)
- **Archetype:** conduct & grievance
- **Bucket:** A
- **Signal (one line):** "A novel complaint theme is emerging across channels — not just higher volume."
- **Cadence / trigger:** daily
- **Primary user → routed executive:** PM / CX → Head of Conduct / CX
- **1. Data aggregation:** interaction-side calls, chats, emails, tickets, complaint/IO queues, app-store, social; extract intent, theme, sentiment, product/MCC mentions.
- **2. Baseline creation:** theme-prevalence baselines per product × channel × geography × time; novelty model for emerging clusters.
- **3. Dynamic detection:** detect themes whose prevalence or novelty breaks band — emergence, not volume.
- **4. Distillation:** suppress perennial themes; rank by growth slope × projected escalation risk.
- **5. Surfacing & routing:** "New theme 'reward accrual not credited' emerging, +5× in 72h across chat+social"; **draft brief to Conduct**. **Hero element: the emergence/novelty curve.**
- **Why it beats a self-built dashboard:** complaint dashboards count known categories and ignore social/app-store; detecting a novel cluster forming is LiSN's native strength, and the source flags "reward accrual confusion" and "billing-cycle changes" as exactly the kind of emergent motifs.
- **Differentiation:** interaction-visible.
- **Worked example:** a "reward points not credited after the earn-rate change" theme appears across chat and X, growing 5× in three days before it is categorised in the CRM; LiSN surfaces it to Conduct same-day. *([illustrative].)*
- **Regulatory / governance hook:** feeds the IO quarterly board pattern-analysis duty; 100% coverage vs sampling.
- **Feasibility (panel view):** AI-architect — core LiSN capability. Compliance — high value. Low tension.

### UC-GPT-A9 — Complaint-intensity-per-1,000-cards benchmark anomaly `[long-tail — preserve]`
- **Archetype:** conduct & grievance (benchmark)
- **Bucket:** A
- **Signal (one line):** "Complaint intensity per 1,000 cards on this product/region is breaking abnormally above its own and peer-band — a conduct hot spot forming."
- **Cadence / trigger:** weekly / monthly board view
- **Primary user → routed executive:** PM / Conduct → Head of Conduct
- **1. Data aggregation:** interaction-side complaint counts normalised per 1,000 cards by product × co-brand × region × channel; transaction-side CIF/active-card base for the denominator.
- **2. Baseline creation:** complaint-intensity baselines per 1,000 cards per segment, with the private-vs-public reference band (the source's 0.420 vs 0.114) as context.
- **3. Dynamic detection:** detect segments whose normalised intensity breaks band — distinct from raw volume, which scales with base size.
- **4. Distillation:** suppress base-growth-driven volume; rank by intensity deviation and escalation risk.
- **5. Surfacing & routing:** "Co-brand C: complaint intensity 0.61 per 1,000 cards vs a 0.42 band — conduct hot spot"; **draft review to Conduct**. **Hero element: the normalised intensity vs band.**
- **Why it beats a self-built dashboard:** raw complaint counts mislead as the base grows; the source's per-1,000-cards metric (private 0.420 vs PSB 0.114) is precisely the normalisation a static count dashboard lacks.
- **Differentiation:** interaction-visible.
- **Worked example:** a co-brand programme's complaint intensity rises to 0.61 per 1,000 cards against its 0.42 band while raw volume looks "normal" for its growth; LiSN flags the conduct hot spot for the board pack. *([illustrative], anchored to the 0.420/0.114 figures.)*
- **Regulatory / governance hook:** IO 2026 board pattern analysis; RBI complaint-intensity scrutiny.
- **Feasibility (panel view):** AI-architect — needs the active-card denominator by segment. Compliance — board-relevant. Long-tail but distinctive; preserve.

---

## BUCKET B — Net-new cards-transaction × complaint/voice joins that do not exist today

### UC-GPT-B1 — Decline-spike to customer-voice decision bundle with regulatory timer *(the hero)*
- **Archetype:** curable-decline / fraud-rule (root-cause)
- **Bucket:** B
- **Signal (one line):** "Declines rose on this cohort AND customers are already feeling it — here is who is affected, what they are saying, which regulatory timer has started, and the action to take before the next working session."
- **Cadence / trigger:** real-time / daily flash
- **Primary user → routed executive:** PM → Head of Cards / Risk (routed by cause)
- **1. Data aggregation:**
  - Transaction-side: bank-signalled decline anomaly flags by cause-class × cohort × BIN × MCC × channel × timestamp; token/CoFT status; rule/step-up change events. *(LiSN consumes the summarised anomaly signal, not the lakehouse.)*
  - Interaction-side: calls/chats/social/app-store mentioning "declined", "payment failed", "OTP not received", "card not working", with sentiment, merchant and timestamp.
- **2. Baseline creation:** dual baselines — decline-anomaly flags AND "payment-failed" interaction-rate per cohort × channel × time — plus a cross-domain co-movement baseline that bridges the two identifier worlds (PAN/token/merchant vs customer-ID/case) at cohort level.
- **3. Dynamic detection:** detect an interaction anomaly **time-aligned** to a decline anomaly in the same cohort/merchant window; the join converts the symptom into the decision bundle and starts any regulatory timer (dispute, 30-day IO, weak-auth compensation).
- **4. Distillation:** suppress decline flags with no voice echo and voice spikes with no decline basis; surface only the co-moving pair, ranked by ₹-at-risk × escalation-risk × regulatory-timer proximity.
- **5. Surfacing & routing:** the **decision bundle** — "Decline anomaly on premium e-commerce AND 'payment failed' contacts +4× from the same cohort, matching X chatter, from 11:00 after the token push; curable today; IO/complaint timer not yet started; recommended action: token re-provision + comms"; the **Correlation Evidence band** shows both curves plus affected customers and top narratives; **draft action** routed to the cause owner. **Hero element: the decision bundle with the regulatory-timer line.**
- **Why it beats a self-built dashboard:** the source's core thesis — incumbent BI shows "what moved," but the under-served layer answers "what moved, why, whether customers feel it, what action before value leaks into fraud loss, churn, or Ombudsman escalation." No dashboard wires that bundle.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a token push at 11:00 triggers a decline anomaly on premium e-commerce; "payment failed" contacts rise 4× and X chatter matches; LiSN names the cause (token break, curable today), notes no regulatory timer has yet started, and hands Ops the fix and Cards a comms draft — before it becomes social noise or an Ombudsman case. *([illustrative]; cause taxonomy and decision-bundle framing anchored to the source.)*
- **Regulatory / governance hook:** auditable cause-to-impact trail; pre-empts IO escalation; the summary-signal model keeps LiSN inside the defensible boundary.
- **Feasibility (panel view):** AI-architect — bridging the two identifier worlds at cohort level is the hard part; cohort-level keeps it DPDP-clean. SF-PM — co-movement baseline is the trust anchor. Compliance — cohort-level preferred. Marketing — *the* demo. Tension: identity-level richness vs cohort-level safety — resolve to cohort-level for v1.

### UC-GPT-B2 — Authentication-friction misfire, voice-confirmed before the KPI moves
- **Archetype:** fraud-rule misfire / authentication-liability
- **Bucket:** B
- **Signal (one line):** "'Failed OTP / declined / locked / duplicate debit / recurring failure' language is leading a rule or step-up change — controls are harming valid customers before any KPI shows it."
- **Cadence / trigger:** event-triggered + real-time
- **Primary user → routed executive:** PM → Head of Fraud / Risk
- **1. Data aggregation:** transaction-side rule/step-up change events + suspected-fraud/auth declines by BIN/cohort; interaction-side the source's exact language set — "failed OTP", "declined", "locked", "duplicate debit", "recurring failure" — with merchant, time, and switch-intent.
- **2. Baseline creation:** baseline lag between a control change and its complaint echo per cohort; normal auth-friction-complaint rate.
- **3. Dynamic detection:** detect a complaint surge in that language whose timing/merchant pattern maps to a recent control change, ahead of the fraud/auth team's effectiveness review.
- **4. Distillation:** suppress unrelated complaint noise; isolate the control-attributable cluster; rank by good-customer GMV at risk plus complaint-escalation risk.
- **5. Surfacing & routing:** "Step-up change R-77: 'failed OTP / locked' contacts +3× in 2h on tenured customers — controls harming valid customers"; **draft roll-back review to Risk**. **Hero element: the voice-leads-KPI timing gap.**
- **Why it beats a self-built dashboard:** the source's second white space — "fraud systems and auth systems know the rules; customer channels know the frustration; the portfolio office rarely gets a fused answer."
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** within two hours of a step-up change, "failed OTP / card locked" contacts triple, 80% from tenured customers; LiSN compresses detect-to-rollback to the same morning. *([illustrative].)*
- **Regulatory / governance hook:** Authentication Directions 2025 issuer-robustness accountability; supports the "explain unjustified friction" expectation.
- **Feasibility (panel view):** AI-architect — needs reliable control-change feed + complaint timestamping. Tension: Risk ownership sensitivity; frame as protecting approval and reducing complaints.

### UC-GPT-B3 — Cross-border CNP authentication-friction & liability cluster `[long-tail — preserve]`
- **Archetype:** authentication-liability
- **Bucket:** B
- **Signal (one line):** "Cross-border CNP declines/failures on India-issued cards joined to 'foreign transaction blocked / OTP failed abroad' complaints reveal friction and emerging liability ahead of the Oct 2026 mechanism."
- **Cadence / trigger:** daily + event-triggered
- **Primary user → routed executive:** PM / Conduct → Head of Risk / Compliance
- **1. Data aggregation:** transaction-side cross-border CNP authorisations on India-issued cards with authentication-method/status and dispute flags; interaction-side complaints citing "foreign transaction declined", "OTP failed abroad", "charged without authentication overseas".
- **2. Baseline creation:** baseline cross-border CNP decline and complaint rates per corridor/merchant; expected dispute-to-complaint ratio.
- **3. Dynamic detection:** detect clusters where cross-border CNP friction or weak-authentication flags co-occur with customer assertions — the exact zone the Oct 2026 validation mechanism targets.
- **4. Distillation:** suppress isolated travel gripes; surface clusters with transaction and dispute corroboration; rank by affected-customer GMV and compensation exposure.
- **5. Surfacing & routing:** an **incident pack** — "Cross-border CNP friction on a corridor AND 'declined abroad / OTP failed' complaints — affected customers and narratives, liability exposure ₹X"; **draft note to Compliance**. **Hero element: the cross-border friction-plus-liability cluster.**
- **Why it beats a self-built dashboard:** the cross-border CNP zone sits between an auth-method gap and a customer assertion in a different identifier world; neither dashboard sees the other, and the source uniquely flags the 1 Oct 2026 cross-border validation requirement.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** ahead of the Oct 2026 mechanism, LiSN finds a corridor where cross-border CNP declines and "card declined abroad / OTP failed" complaints co-move, flagging both a CX-friction fix and a weak-auth compensation exposure. *([illustrative], anchored to the 1 Oct 2026 cross-border CNP requirement.)*
- **Regulatory / governance hook:** Authentication Directions 2025, cross-border CNP validation by 1 Oct 2026; issuer compensation; DPDP adherence.
- **Feasibility (panel view):** Compliance — distinctive, time-bound regulatory value. AI-architect — needs cross-border auth-status in the flagged feed. SF-PM — corridor-level precision needed. Long-tail but distinctive and time-bound; preserve.

### UC-GPT-B4 — Strategic-non-payment & roll-rate predictor from interaction deterioration
- **Archetype:** hardship & roll-rate
- **Bucket:** B
- **Signal (one line):** "Payment-anxiety calls, dispute spikes, fee-reversal requests and 'card not working' frustration are leading 0→30 migration — and flagging likely strategic non-payment, not just hardship."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Risk / Collections
- **1. Data aggregation:** interaction-side the source's exact leading indicators — payment-anxiety calls, dispute spikes, fee-reversal requests, "card not working" complaints, repeated app/servicing frustration; transaction-side DPD flow, Stage-2 migration, payment behaviour by cohort.
- **2. Baseline creation:** baselines for each interaction indicator per cohort and their lead-lag to roll-rate; a separator between genuine hardship and strategic-non-payment patterns.
- **3. Dynamic detection:** detect interaction-deterioration surges that precede 0→30 inflection, and classify the likely driver (hardship vs disengagement vs strategic non-payment).
- **4. Distillation:** suppress generic billing confusion; isolate genuine leading clusters; rank by projected credit-cost bps and by treatment route (hardship support vs firmer collections).
- **5. Surfacing & routing:** "Interaction-deterioration cluster in a vintage leading a projected 0→30 inflection — ~9 bps; pattern suggests strategic non-payment for sub-segment Y"; **draft differentiated signal to EWS/Collections** (LiSN signals, bank decides). **Hero element: the interaction-leads-delinquency signal with a hardship-vs-strategic split.**
- **Why it beats a self-built dashboard:** the source's third white space — collections EWS "under-uses the interaction layer"; distinguishing hardship from strategic non-payment from voice is net-new.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** in a vintage, fee-reversal requests and "card not working" frustration rise 1.9× and lead a 0→30 inflection the transactional EWS flags a fortnight later; LiSN separates a hardship sub-segment (for support) from a strategic-non-payment sub-segment (for firmer treatment), worth an estimated 9 bps. *([illustrative].)*
- **Regulatory / governance hook:** advisory only — no credit decisioning in LiSN; DPDP-compliant; supports fair, differentiated treatment.
- **Feasibility (panel view):** SF-PM — strongest leading-indicator story; the hardship-vs-strategic classifier is precision-critical. Compliance — advisory to EWS; firmer-treatment routing needs care. AI-architect — the classifier is the build. Tension: detection ambition vs fair-treatment caution — resolve to advisory, cohort-level, with human review.

### UC-GPT-B5 — Ombudsman-escalation preemption with the 30-day timer
- **Archetype:** conduct & grievance (escalation)
- **Bucket:** B
- **Signal (one line):** "This issue type/product/journey is on track to become the next externally escalated conduct problem — the 30-day IO clock is running."
- **Cadence / trigger:** daily + weekly board view
- **Primary user → routed executive:** PM / Conduct → Internal Ombudsman liaison
- **1. Data aggregation:** interaction-side complaint registry + calls/chats/social by product × MCC × co-brand × geography × journey; transaction-side the common event class the complaints attach to; complaint-state (the source's three-state classification).
- **2. Baseline creation:** complaint-pattern baselines per product/journey; the partial-resolution/rejection rate that precedes auto-escalation; the 30-day decision clock per case.
- **3. Dynamic detection:** detect a complaint cluster tied to a transaction root cause that is trending toward escalation, with the IO timer modelled per case.
- **4. Distillation:** suppress idiosyncratic one-offs; surface the systemic cluster with a root cause and a timer; rank by escalation probability × consequential-loss exposure × timer proximity.
- **5. Surfacing & routing:** "Co-brand C 'wrong late-fee' cluster, root-caused to a billing-cycle config; N cases within 8 days of the 30-day decision deadline; escalation likely"; **draft remediation brief to Conduct/IO**. **Hero element: the escalation-risk countdown against the 30-day IO clock.**
- **Why it beats a self-built dashboard:** the source's fourth white space — most tools process or analyse complaints; very few answer "which issue is on track to escalate," and the IO 2026 regime makes prevention more valuable than redress.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** "incorrect late fee" complaints on one co-brand triple, traceable to a billing-cycle misconfiguration; several are days from the 30-day IO decision deadline; LiSN root-causes, flags the timer, and feeds the quarterly pattern report — against 41,457 credit-card complaints (+20.04%, second-largest). *([illustrative], anchored to the ₹500/day, 30-day IO, and 41,457 figures.)*
- **Regulatory / governance hook:** IO Directions 2026 — automated CMS, auto-escalation, three-state classification, 30-day decision, quarterly pattern analysis.
- **Feasibility (panel view):** Compliance — board-level pain, top priority. AI-architect — clustering + timer modelling feasible. Marketing — "stay out of the ombudsman's report." Low tension.

### UC-GPT-B6 — Reward/billing-change → complaint-confusion join
- **Archetype:** campaign-to-complaint
- **Bucket:** B
- **Signal (one line):** "This reward, billing-cycle or fee change is generating a confusion/complaint echo — caught in days, not after the board pack."
- **Cadence / trigger:** event-triggered (policy/billing change) + daily
- **Primary user → routed executive:** PM → Head of Cards / Conduct
- **1. Data aggregation:** transaction-side reward-accrual, billing-cycle-modification, fee-change, and EMI-conversion events; interaction-side complaints citing "reward not credited", "billing date changed", "charged interest on no-cost EMI", "hidden charges".
- **2. Baseline creation:** baseline complaint/confusion rate per change-type; expected post-change sentiment.
- **3. Dynamic detection:** detect a post-change complaint/confusion surge attributable to a specific reward/billing/fee change — the conduct cost product dashboards never see.
- **4. Distillation:** suppress unrelated noise; isolate the change-attributable cluster; rank by mis-selling/confusion severity and reversal cost.
- **5. Surfacing & routing:** "Earn-rate change Tuesday — 'reward not credited' complaints +3.5× by Thursday"; **draft note to Conduct + Cards**. **Hero element: the change-to-confusion echo curve.**
- **Why it beats a self-built dashboard:** the source names "reward accrual confusion" and "billing-cycle changes" as exactly the events that surface in voice before transaction dashboards; the join links cause to conduct cost in days.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a billing-cycle modification triggers a 3.5× rise in "my billing date changed without notice" complaints within 48 hours — a disclosure exposure flagged before the next cycle. *([illustrative].)*
- **Regulatory / governance hook:** RBI Mar 2024 amendment (billing-cycle modification, minimum-due warnings, grace-period suspension); MITC disclosure.
- **Feasibility (panel view):** AI-architect — needs policy/billing change event feed. Marketing-PM/Conduct — ownership sensitivity. Tension: who owns the verdict.

### UC-GPT-B7 — App-release-defect customer-impact pack `[long-tail — preserve]`
- **Archetype:** switch-incident attribution (voice-joined)
- **Bucket:** B
- **Signal (one line):** "A mobile-app release is breaking a card journey — the contact/social/app-store surge quantifies the impact the release dashboard hides."
- **Cadence / trigger:** event-triggered (app release) + real-time
- **Primary user → routed executive:** PM → Head of Ops / Tech + Comms
- **1. Data aggregation:** transaction-side recurring-payment / EMI / checkout success by app version where signalled; interaction-side app-store reviews, in-app complaints, chats citing the new version, "app update broke payments".
- **2. Baseline creation:** baseline app-store sentiment and journey-success co-movement per release.
- **3. Dynamic detection:** detect a post-release journey-failure signal joined to an app-store/complaint surge naming the version — the source's "mobile-app release defect" war-room scenario.
- **4. Distillation:** suppress benign release noise; surface releases with real journey breakage; rank by affected customers × ₹ flow.
- **5. Surfacing & routing:** an **incident pack** — "Release 8.4 since Tuesday: recurring-payment setup failing AND app-store rating dip + 'update broke autopay' reviews — ~9,000 customers affected"; **draft incident + comms + rollback note**. **Hero element: the release-version-to-customer-impact link.**
- **Why it beats a self-built dashboard:** release dashboards show crash/adoption metrics, not the card-journey breakage customers describe; only the join ties the version to portfolio impact.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** app release 8.4 breaks the autopay-setup flow; recurring-payment setups dip while app-store reviews naming the version spike; LiSN estimates ~9,000 affected customers and routes a rollback decision with evidence. *([illustrative], anchored to the source's app-release-defect scenario.)*
- **Regulatory / governance hook:** fair-treatment/outage expectations; auditable impact record.
- **Feasibility (panel view):** AI-architect — needs app-version tagging in the journey feed. SF-PM — app-store/version attribution is the build. Long-tail but distinctive; preserve.

### UC-GPT-B8 — Recurring-payment / duplicate-debit failure ↔ voice
- **Archetype:** conduct & grievance (operational)
- **Bucket:** B
- **Signal (one line):** "Recurring-payment breaks or duplicate debits joined to 'subscription failed / debited twice' complaints reveal an operational failure heading for the Ombudsman."
- **Cadence / trigger:** daily / real-time
- **Primary user → routed executive:** PM / Ops → Head of Ops / Conduct
- **1. Data aggregation:** transaction-side recurring/standing-instruction failures, duplicate-debit and reversal-pending events by merchant/token-requestor/channel; interaction-side "subscription failed", "debited twice", "amount not refunded" complaints.
- **2. Baseline creation:** baseline recurring-failure and reversal-failure rates per merchant/requestor and their complaint echo.
- **3. Dynamic detection:** detect a recurring/duplicate-debit anomaly joined to a matching complaint cluster — confirming a real operational failure vs a benign settlement lag, in the source's "did we break a recurring-payment or EMI flow?" zone.
- **4. Distillation:** suppress normal lags; surface confirmed clusters; rank by customers affected and escalation risk.
- **5. Surfacing & routing:** "Token-requestor M: recurring failures +6× AND 'subscription failed/debited twice' complaints +5× — operational break, N customers"; **draft remediation + proactive-refund recommendation**. **Hero element: the confirmed-failure customer count.**
- **Why it beats a self-built dashboard:** an ops queue shows reversal backlog; it cannot confirm customer harm or forecast escalation. The complaint join confirms the failure and prioritises refunds before complaints escalate.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a standing-instruction glitch double-debits on one merchant; recurring failures rise 6× and "debited twice, not refunded" complaints 5×; LiSN confirms ~2,300 affected customers and recommends proactive reversal before the cluster reaches the IO. *([illustrative].)*
- **Regulatory / governance hook:** IO Directions 2026; RBI dispute-resolution timelines; CoFT.
- **Feasibility (panel view):** AI-architect — needs recurring/reversal event feed. Compliance — strong ombudsman pre-empt. Low tension; pairs with B5.

### UC-GPT-B9 — Dispute-before-CIC-reporting breach-risk detector `[long-tail — preserve]`
- **Archetype:** conduct & grievance / authentication-liability adjacent
- **Bucket:** B
- **Signal (one line):** "Customers are disputing transactions in voice/complaints that are still on track for CIC default reporting — a compliance breach forming before resolution."
- **Cadence / trigger:** daily
- **Primary user → routed executive:** PM / Conduct → Head of Collections / Compliance
- **1. Data aggregation:** transaction-side accounts flagged for imminent CIC/bureau default reporting with disputed/charge markers; interaction-side complaints/calls asserting the disputed transaction ("I didn't make this", "this is fraud, don't report me").
- **2. Baseline creation:** baseline dispute-to-reporting overlap rate; the CIC-reporting clock per account.
- **3. Dynamic detection:** detect accounts where an active customer-asserted dispute (voice/complaint) overlaps an imminent CIC default-reporting event — the exact breach the RBI rule prohibits (disputes settled before CIC reporting).
- **4. Distillation:** suppress resolved or non-disputed cases; surface the at-risk overlap; rank by count and reporting-deadline proximity.
- **5. Surfacing & routing:** "N accounts with active disputes are within days of CIC default reporting — compliance-breach risk"; **draft hold-and-review note to Collections/Compliance**. **Hero element: the dispute-vs-CIC-clock overlap.**
- **Why it beats a self-built dashboard:** the dispute lives in the voice/complaint world and the reporting clock in the transaction world; the source flags "dispute handling before CIC reporting" as a specific compliance driver, and no single dashboard joins the two.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** 140 accounts with active "this is fraud, don't report me" disputes are within five days of CIC default reporting; LiSN flags the overlap so Collections can hold reporting pending resolution, averting a bureau-reporting breach. *([illustrative], anchored to the dispute-before-CIC-reporting rule.)*
- **Regulatory / governance hook:** RBI Credit Card Directions — disputes must be settled before default information is released to CICs; auditable hold trail.
- **Feasibility (panel view):** Compliance — sharp, defensible, time-bound. AI-architect — needs the CIC-reporting-queue flag joined to dispute assertions. SF-PM — high precision essential. Long-tail but distinctive; preserve.

### UC-GPT-B10 — Co-brand decline: merchant-softness vs customer-attrition diagnostic
- **Archetype:** attrition & churn (voice-joined)
- **Bucket:** B
- **Signal (one line):** "This co-brand's spend drop is customer attrition, not merchant sales softness — switch-intent in voice/social confirms it before closures register."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Cards / Co-brand partner manager
- **1. Data aggregation:** transaction-side co-brand spend-velocity drop, active-rate, merchant-sales context by programme; interaction-side social/app-store/chat with "closing this card", "switching to [competitor]", "rewards not worth it", sentiment.
- **2. Baseline creation:** baseline spend rhythm and switch-intent chatter per co-brand; a separator for merchant-softness vs customer-attrition.
- **3. Dynamic detection:** detect a co-brand spend drop and classify it — merchant sales softness vs customer attrition — by joining the transaction drop to switch-intent voice, the exact question Mastercard's issuer BI examples frame but cannot fully answer without voice.
- **4. Distillation:** suppress seasonal/merchant-softness cases; surface genuine attrition; rank by portfolio value at risk.
- **5. Surfacing & routing:** "Co-brand C: spend −22% AND switch-intent chatter +3× — customer attrition, not merchant softness — ₹Z at risk"; **draft retention brief**. **Hero element: the attrition-vs-merchant-softness verdict.**
- **Why it beats a self-built dashboard:** the source notes issuer BI frames the attrition-vs-softness question but the answer needs the voice the transaction tools never read; attrition dashboards lag (they count closures).
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a co-brand cohort's spend falls 22% while "I'm closing this card / switching" chatter triples after a competitor launch; LiSN classifies it as attrition (not merchant softness), flags ₹18 Cr at risk, and drafts retention weeks before closures register. *([illustrative], anchored to the Mastercard co-brand attrition-vs-softness framing and network-portability context.)*
- **Regulatory / governance hook:** network-portability context; consent-respecting retention.
- **Feasibility (panel view):** AI-architect — switch-intent extraction + the softness/attrition classifier are the build. Marketing-PM — high resonance. Tension: SF-PM warns social-intent precision is hard; require the transaction drop as corroboration.

---

## Panel Notes

**Sharpest disagreements across the catalogue:**
1. **Bridging two identifier worlds — how far to go (AI-architect vs Compliance).** The source frames the join as PAN/token/merchant vs customer-ID/case; richer joins want identity-level resolution, DPDP wants cohort-level. Recurs in B1, B4, B10. Resolution: cohort-level for v1, identity-level only under explicit purpose-limited consent.
2. **Detection ambition vs fair-treatment caution (SF-PM/Compliance vs Marketing).** B4's strategic-non-payment classifier and B10's attrition verdict are commercially powerful but a wrong label is costly or unfair. Resolution: advisory routing, high-confidence thresholds, human review before any firmer-treatment action.
3. **Regulatory-timer cards as the differentiator (Compliance enthusiasm vs AI-architect feasibility).** B3 (Oct 2026 cross-border), B5 (30-day IO), B9 (CIC-reporting clock) are the most defensible and distinctive, but each needs a time-bound transaction flag that may not be in standard summary tables. Resolution: scope a feed-availability audit for the timer flags before committing to the MVP.
4. **Auditing the bank's own functions.** A2/B2 audit Risk's controls; A4/A5/B6 audit Marketing/reward decisions; B5/B9 expose process and reporting gaps. Real value, real friction. Resolution: route privately to the owning exec first, framed as their early-warning.

**Five strongest UI candidates (why they resonate with a cards/portfolio manager):**
- **UC-GPT-B1 — Decline-spike↔voice decision bundle with regulatory timer.** Delivers the exact decision bundle the source says current tools only partially serve; the natural demo opener.
- **UC-GPT-B5 — Ombudsman preemption with the 30-day timer.** A visible regulatory countdown on a board-level metric; "stay out of the ombudsman's report" with a clock.
- **UC-GPT-B4 — Strategic-non-payment & roll-rate predictor.** Separates hardship from strategic non-payment from voice — basis points and fairer treatment a Head of Risk cannot get elsewhere.
- **UC-GPT-A1 — "Curable today" decline-recovery radar.** Immediate, quantified rupee recovery framed as curable *today* — the clearest before-lunch action.
- **UC-GPT-B3 — Cross-border CNP friction & liability cluster.** A time-bound, distinctive regulatory wedge (Oct 2026) that no transaction-only tool frames.

**Recall note:** ChatGPT-distinct cards unlikely to appear in the other runs — A5 (reward-negative category), A7 (profitable-spend/premiumisation drift), A9 (complaint-intensity per 1,000 cards), B3 (cross-border CNP, Oct 2026), B7 (app-release-defect), B9 (dispute-before-CIC-reporting) — plus the cross-cutting "decision bundle + regulatory timer" framing and the "strategic non-payment" split in B4. Carry these into the merge as `[single-source — preserve]`.
