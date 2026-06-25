# LiSN Cards Extension — Use-Case Catalogue
## ENGINE: Claude Opus 4.8 — source: raw Claude/Opus research output ("Cards & Portfolio Manager Intelligence — India + Global White Space Analysis")

*Mined per-source for high recall. Bucket A = pipeline use cases that beat a self-built dashboard. Bucket B = net-new cards-transaction × complaint/voice joins that do not exist today. IDs are keyed UC-OPUS-* for mechanical merge against Gemini / GPT-5 / other runs.*

---

### Framing — how this run read the source
This run leaned hardest on the source's Section F (white space), where the transaction-anomaly ↔ customer-voice-anomaly join ranks #1 and unanimously least-served, and on Section E's regulatory stack — the Authentication Mechanisms Directions 2025 full-compensation liability (effective 1 Apr 2026), the Internal Ombudsman Directions 2026 board-reporting regime (30 June 2026 deadline, credit-card complaints +20.04% YoY and second-largest category), and CoFT (>91 crore tokens). It also drew on the source's decline economics — reason code 51 insufficient-funds, the false-decline-cost-exceeds-fraud finding ($264bn projected global by 2027; CNP ~15× card-present fraud risk), and the ~60–70% curable-decline estimate — and on the structural Section-D finding that incumbents, network analytics and fraud tools touch no customer voice while contact-centre speech tools own voice but silo it. Bucket B is built almost entirely on that silo being the opportunity.

---

## BUCKET A — Pipeline use cases that outperform a self-built dashboard

### UC-OPUS-A1 — Curable-decline recovery radar
- **Archetype:** curable-decline intelligence
- **Bucket:** A
- **Signal (one line):** "Reason-code-51 declines on this cohort are abnormally high and recoverable — ₹X of spend is retrievable today."
- **Cadence / trigger:** daily morning brief + intraday refresh
- **Primary user → routed executive:** PM → Head of Cards
- **1. Data aggregation:**
  - Transaction-side: decline/auth event feed with ISO 8583 reason codes (51 insufficient funds, 61 limit exceeded, contactless-disabled, intl-unlock), MCC, BIN, channel (POS/CNP/UPI-on-credit), cohort/segment tags, tokenisation status; offer-eligibility flags (EMI/OVL).
  - Interaction-side: none required for the core signal (kept clean as a transaction-side case; voice is the B-bucket extension).
- **2. Baseline creation:** decline-rate baselines per reason-code × product × cohort × MCC × geography × channel × day-of-cycle, with month-end/salary-cycle seasonality encoded (insufficient-funds naturally rises pre-payday).
- **3. Dynamic detection:** flag cells where curable-decline rate deviates materially above its own seasonal band, not the portfolio average; classify each as curable (51, contactless-off, intl-lock) vs structural (genuine limit/risk).
- **4. Distillation:** suppress the expected pre-payday 51 bulge; rank surviving cells by recoverable ₹ = decline count × avg ticket × historic recovery propensity. Surface the top three, not the full grid.
- **5. Surfacing & routing:** card headline "₹2.4 Cr recoverable on PREM 25–34 HNI — insufficient-funds, +38% vs band"; shows abnormality vs baseline, recoverable ₹, cards affected, recommended action (EMI-conversion nudge / OVL consent push to eligible cohort), and a **draft trigger requirement** the PM approves. Human gate explicit. **Hero element: the recoverable-₹ figure.**
- **Why it beats a self-built dashboard:** a dashboard shows decline rate; it cannot maintain thousands of seasonal per-cell baselines, cannot separate curable from structural at cell level, and cannot rank by recoverable rupees. The PM would scroll 40 charts; LiSN hands them the one cohort and the rupee number.
- **Differentiation:** transaction-visible.
- **Worked example:** insufficient-funds declines on the premium 25–34 HNI cohort run at 38% above the cohort's own month-end band (not the 8% portfolio average), ~4,800 declines, ₹2.4 Cr attempted spend; LiSN drafts an EMI-conversion nudge to the eligible sub-segment; recovered transaction rate within 48h becomes the success metric. *(₹2.4 Cr and 38% are anchored to the source's worked figure; cohort size [illustrative].)*
- **Regulatory / governance hook:** nudges respect RBI Credit Card Directions on consent and unsolicited offers; no auto-send; audit log captures the cohort definition, the draft, and the PM approval.
- **Feasibility (panel view):** AI-architect — straightforward; needs clean reason-code mapping and a recovery-propensity model. SF-PM — watch false positives on the seasonal band or PMs lose trust. Marketing-PM — this is the demo opener. Compliance — fine provided nudges stay inside consent rules. Tension: AI-architect wants conservative thresholds, marketing wants more cards surfaced; resolve by tuning to ≤3 high-confidence cards.

### UC-OPUS-A2 — Fraud-rule misfire detector (approval-rate anomaly)
- **Archetype:** fraud-rule misfire
- **Bucket:** A
- **Signal (one line):** "Approval rate on this BIN range collapsed after a rule change — good customers are being declined."
- **Cadence / trigger:** event-triggered (fraud-rule change event) + real-time
- **Primary user → routed executive:** PM → Head of Risk / Fraud
- **1. Data aggregation:**
  - Transaction-side: auth approve/decline by BIN × MCC × channel × cohort; fraud-rule change events (rule ID, timestamp, scope); suspected-fraud decline codes.
  - Interaction-side: none for the core (voice confirmation is UC-OPUS-B2).
- **2. Baseline creation:** approval-rate baselines per BIN × MCC × channel, with the rule-change event timeline overlaid as a known change-point.
- **3. Dynamic detection:** detect approval-rate step-changes that coincide with a rule push and concentrate on low-risk cohorts (high-tenure, low historic fraud) — the fingerprint of over-blocking rather than genuine fraud suppression.
- **4. Distillation:** suppress approval dips that align with real fraud-outbreak signatures; isolate the dips that hit good cohorts disproportionately. Rank by GMV-at-risk on wrongly-declined good customers.
- **5. Surfacing & routing:** card "Approval −6.2 pts on BIN 4xxx after rule R-219 at 10:30 — 92% of declines are low-risk tenured customers"; shows the rule, the timeline, GMV at risk, and a **draft note to Fraud** to review/roll back. **Hero element: the rule-change-to-approval-drop timeline.**
- **Why it beats a self-built dashboard:** aggregate approval rate barely moves; the damage hides in one BIN. A dashboard has no change-point awareness and no good-vs-risky decomposition; LiSN ties the dip to the specific rule push automatically.
- **Differentiation:** transaction-visible.
- **Worked example:** rule R-219 tightens CNP velocity at 10:30; approval on a tenured travel-spend BIN falls 6.2 pts, ₹1.1 Cr/day attempted spend at risk, 92% of incremental declines are 5+-year customers with zero fraud history. LiSN routes a roll-back review to Fraud the same morning. *([illustrative] figures, anchored to the source's fraud-rule-change example.)*
- **Regulatory / governance hook:** supports the source's flagged shift from "did you block fraud?" to "can you explain why good transactions were declined?"; auditable rule-to-impact trail.
- **Feasibility (panel view):** AI-architect — needs the fraud-rule change feed (often the hardest to obtain). Compliance — strong defensibility story. Tension: Risk team may resist a layer that audits its rules; marketing frames it as "your early-warning, not your auditor."

### UC-OPUS-A3 — Switch / processor authorisation-degradation attribution
- **Archetype:** switch-incident attribution
- **Bucket:** A
- **Signal (one line):** "Auth latency/decline on this acquirer-network path is degrading — it is a tech issue, not customer behaviour."
- **Cadence / trigger:** real-time
- **Primary user → routed executive:** PM → Head of Ops / Tech
- **1. Data aggregation:** transaction-side auth success/latency by switch route, acquirer, network, STIP status; switch/processor health signals; technical decline codes (91, 96).
- **2. Baseline creation:** latency and technical-decline baselines per route × network × time-of-day.
- **3. Dynamic detection:** detect technical-decline / latency excursions isolated to a route or processor, distinct from customer-side codes — separating "tech" from "customer/merchant/fraud/campaign".
- **4. Distillation:** suppress known maintenance windows; rank by transactions and ₹ flowing through the degrading path.
- **5. Surfacing & routing:** "Network path X: technical declines +3.1× since 09:10, ₹68L/hr flowing through it"; **draft incident note to Ops** with the route, codes, and impact. **Hero element: the "tech vs customer" verdict.**
- **Why it beats a self-built dashboard:** answers the daily "is this customer / merchant / tech / fraud / campaign?" question by isolating the tech axis automatically; a dashboard shows decline rate without attributing the cause.
- **Differentiation:** transaction-visible (observability + auth).
- **Worked example:** code-91 technical declines triple on one acquirer route after 09:10; ₹68L/hr at risk; LiSN attributes to the route and routes to Ops before the call-centre even spikes. *([illustrative].)*
- **Regulatory / governance hook:** minimal; supports outage comms duties.
- **Feasibility (panel view):** AI-architect — needs switch health telemetry, sometimes outside the summary-table scope. SF-PM — clean anomaly, low false-positive risk. Tension: overlaps with the bank's existing observability (Datadog/Splunk); position as portfolio-impact attribution, not infra monitoring.

### UC-OPUS-A4 — Offer underperformance & cannibalisation detector
- **Archetype:** campaign-to-complaint (offer side)
- **Bucket:** A
- **Signal (one line):** "Offer X is underperforming in week 1 and largely cannibalising existing spend."
- **Cadence / trigger:** weekly + campaign-launch event-triggered
- **Primary user → routed executive:** PM → Head of Cards / Marketing
- **1. Data aggregation:** transaction-side offer/redemption events, spend-by-cohort pre/post launch, MCC mix, incremental-vs-baseline spend; campaign metadata.
- **2. Baseline creation:** expected-uplift baselines per offer-type × cohort × MCC, and a counterfactual baseline (matched non-targeted cohort) for incrementality.
- **3. Dynamic detection:** detect redemption or uplift below the offer-type baseline, and incremental spend indistinguishable from the control cohort (cannibalisation).
- **4. Distillation:** suppress early-cycle noise; rank by reward-cost-at-risk and lost incrementality.
- **5. Surfacing & routing:** "Offer X: redemption 40% below comparable offers; incremental spend ≈ control — reward cost ₹Y burning without lift"; **draft recommendation to pause/retarget**. **Hero element: incremental-vs-cannibalised split.**
- **Why it beats a self-built dashboard:** marketing dashboards show redemption and gross spend, not a counterfactual incrementality baseline; LiSN catches the dud in week 1, not post-campaign.
- **Differentiation:** transaction-visible.
- **Worked example:** a fuel-MCC cashback offer shows healthy gross redemption but incremental spend within 2% of the matched control, ₹0.9 Cr reward cost projected with near-zero true lift; LiSN flags retargeting by day 6. *([illustrative].)*
- **Regulatory / governance hook:** reward-parity and "no-cost EMI" disclosure compliance can be checked on the offer copy.
- **Feasibility (panel view):** AI-architect — incrementality needs a clean control-cohort method. Marketing-PM — politically sensitive (critiques marketing's own campaign); frame as protecting reward budget. Tension: marketing ownership vs portfolio ownership of the verdict.

### UC-OPUS-A5 — Early roll-rate inflection by cohort
- **Archetype:** hardship & roll-rate (transaction side)
- **Bucket:** A
- **Signal (one line):** "This vintage's 0→30 flow is inflecting above its band — credit cost is building before it shows in the book."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Risk / Collections
- **1. Data aggregation:** transaction-side DPD-bucket flow rates, Stage-2 migration, by vintage × sourcing-channel × risk-band × geography; receivables summaries.
- **2. Baseline creation:** roll-rate baselines per vintage × channel × band, seasonally adjusted.
- **3. Dynamic detection:** detect flow-rate inflection above band concentrated in a sourcing vintage or channel (early-warning of a bad cohort).
- **4. Distillation:** suppress portfolio-wide macro drift; isolate cohort-specific inflection; rank by projected credit-cost basis points.
- **5. Surfacing & routing:** "Q3 open-market vintage: 0→30 flow +1.4× band, ~12 bps credit-cost build"; **draft note to Risk** with the vintage definition. **Hero element: the bps credit-cost projection.**
- **Why it beats a self-built dashboard:** risk dashboards are monthly and band-level; LiSN catches the cohort inflection weeks earlier at vintage granularity.
- **Differentiation:** transaction-visible (voice-led version is UC-OPUS-B4).
- **Worked example:** the Q3-FY26 open-market sourcing vintage rolls 0→30 at 1.4× its band; against SBI-Cards-scale economics (GNPA ~2.4%, credit cost ~8%), an early tightening of limits on the worst decile averts an estimated 12 bps. *([illustrative], anchored to source credit-cost figures.)*
- **Regulatory / governance hook:** feeds the bank's EWS; LiSN signals, the bank decides (no credit decisioning inside LiSN).
- **Feasibility (panel view):** AI-architect — feasible on summary flows. Compliance — must stay advisory, not a credit-risk model. Tension: SF-PM warns roll-rate signals can be noisy at fine granularity; require minimum cohort size.

### UC-OPUS-A6 — Engagement-cliff & dormancy-onset radar
- **Archetype:** attrition & churn (transaction side)
- **Bucket:** A
- **Signal (one line):** "These high-value cards are going quiet — dormancy onset before closure."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Cards
- **1. Data aggregation:** transaction-side spend frequency/recency, top-of-wallet share proxy, card-on-file presence, by HNI/premium cohort.
- **2. Baseline creation:** per-cohort engagement-rhythm baselines (expected inter-transaction interval, spend velocity).
- **3. Dynamic detection:** detect velocity decay crossing the dormancy-onset threshold for high-value cards specifically.
- **4. Distillation:** suppress holiday lulls; rank by cardholder value and reversibility window.
- **5. Surfacing & routing:** "1,850 HNI cards entered dormancy-onset this week — ₹Z annual spend at risk"; **draft re-engagement requirement**. **Hero element: value-at-risk from silent attrition.**
- **Why it beats a self-built dashboard:** the source notes HDFC closed 2.4M inactive cards in one quarter — base bloat is normally caught only at quarter-end cleanup; LiSN catches *onset* weekly, while the relationship is still saveable.
- **Differentiation:** transaction-visible (social-confirmed version is UC-OPUS-B8).
- **Worked example:** 1,850 premium cards show a 60%+ drop in spend velocity over three cycles, ₹14 Cr annual spend at risk; LiSN drafts a targeted re-engagement before the cards hit the inactive-closure pipeline. *([illustrative], anchored to the 2.4M HDFC figure.)*
- **Regulatory / governance hook:** RBI inactive-card / unsolicited-engagement rules respected; no auto-contact.
- **Feasibility (panel view):** AI-architect — straightforward. Tension: marketing wants aggressive win-back, compliance wants consent discipline; resolve in the draft template.

### UC-OPUS-A7 — Interchange / fee-yield leakage detector
- **Archetype:** other (yield)
- **Bucket:** A
- **Signal (one line):** "Fee/interchange yield on this segment is leaking — reversal spike or mix shift to low-MDR rails."
- **Cadence / trigger:** weekly / monthly
- **Primary user → routed executive:** PM → Head of Cards / Finance
- **1. Data aggregation:** transaction-side interchange/MDR by MCC × network × channel, fee-event and fee-reversal feeds, RuPay-UPI-on-credit share.
- **2. Baseline creation:** yield baselines per segment; expected fee-reversal rate.
- **3. Dynamic detection:** detect yield erosion from mix shift to low-MDR rails or an abnormal fee-reversal spike (often a proxy for a billing dispute wave).
- **4. Distillation:** suppress known MDR-regulation step-changes; rank by annualised yield leakage.
- **5. Surfacing & routing:** "Fee-reversal +2.7× on a segment — ₹W yield leaking, likely billing-dispute driven"; **draft note** to Finance/Ops. **Hero element: annualised leakage figure.**
- **Why it beats a self-built dashboard:** finance dashboards report yield monthly in aggregate; LiSN isolates the leaking segment and flags the reversal-spike-as-dispute-signal early.
- **Differentiation:** transaction-visible (the dispute-confirmation join is UC-OPUS-B10).
- **Worked example:** fee-reversals on a co-brand segment spike 2.7×, ₹0.6 Cr annualised yield leakage; downstream it correlates with a billing-grievance cluster (handed to B10). *([illustrative].)*
- **Regulatory / governance hook:** RuPay-UPI MDR-cap economics; fee transparency under MITC.
- **Feasibility (panel view):** AI-architect — feasible; reversal feed needed. Tension: SF-PM notes reversals have many benign causes; pair with the B10 voice join for confidence.

### UC-OPUS-A8 — Complaint-theme emergence radar (interaction-native)
- **Archetype:** conduct & grievance
- **Bucket:** A
- **Signal (one line):** "A new complaint theme is emerging across channels — not just higher volume, a genuinely novel cluster."
- **Cadence / trigger:** daily
- **Primary user → routed executive:** PM / CX → Head of Conduct / CX
- **1. Data aggregation:** interaction-side calls, chats, emails, tickets, IO/complaint registry, app-store, social; extract intent, theme, sentiment, product/MCC mentions.
- **2. Baseline creation:** theme-prevalence baselines per product × channel × geography × time; novelty model for emerging clusters.
- **3. Dynamic detection:** detect themes whose prevalence or novelty breaks band — emergence, not just volume.
- **4. Distillation:** suppress perennial themes (PIN reset, statement queries); rank emerging themes by growth slope × projected escalation risk.
- **5. Surfacing & routing:** "New theme 'UPI-on-credit double-debit' emerging, +5× in 72h across chat+social"; **draft brief to Conduct**. **Hero element: the emergence/novelty curve.**
- **Why it beats a self-built dashboard:** complaint dashboards count known categories; they cannot detect a *novel* cluster forming, and they ignore social/app-store entirely. This is LiSN's native strength applied to cards.
- **Differentiation:** interaction-visible.
- **Worked example:** a "money debited, points not credited" theme appears across chat and X, growing 5× in three days, absent from the formal complaint taxonomy; LiSN surfaces it before it is even categorised in the CRM. *([illustrative].)*
- **Regulatory / governance hook:** directly feeds the Internal Ombudsman Directions 2026 quarterly board pattern-analysis duty; 100% coverage vs sampled QA.
- **Feasibility (panel view):** AI-architect — core LiSN capability. Compliance — high value for the 30 June 2026 regime. Low tension; near-unanimous keep.

### UC-OPUS-A9 — Conduct / mis-selling surveillance from agent + AI-agent transcripts
- **Archetype:** conduct & grievance
- **Bucket:** A
- **Signal (one line):** "Mis-selling / mis-statement language is spiking in this vendor/agent pool above its conduct baseline."
- **Cadence / trigger:** weekly + event-triggered
- **Primary user → routed executive:** PM / Conduct → Head of Conduct / Vendor Governance
- **1. Data aggregation:** interaction-side human-agent and AI-agent transcripts (voice/chat), by vendor/BPO site, product, script; extract conduct-risk language (guaranteed approvals, hidden-charge omissions, pressure tactics).
- **2. Baseline creation:** conduct-language baselines per vendor × product × script.
- **3. Dynamic detection:** detect conduct-risk language above a vendor pool's baseline; full coverage, not sampled.
- **4. Distillation:** suppress compliant variance; rank by frequency × regulatory severity × complaint correlation.
- **5. Surfacing & routing:** "Vendor site A: mis-selling-pattern language +2.2× baseline on EMI scripts"; **draft governance note**. **Hero element: vendor-level conduct score vs baseline.**
- **Why it beats a self-built dashboard:** QA samples ~1–2% of calls manually; LiSN evaluates 100%, against a learned baseline, across vendors — the source's Bank-of-Baroda/Verint 100%-QA case is the leading indicator.
- **Differentiation:** interaction-visible.
- **Worked example:** at one BPO site, "no-cost EMI with zero charges" assurances appear at 2.2× the site baseline on a product where charges do apply; LiSN routes a vendor-governance review, pre-empting an MITC mis-selling exposure. *([illustrative], anchored to source 100%-QA precedent.)*
- **Regulatory / governance hook:** RBI conduct/MITC, Internal Ombudsman pattern analysis; DPDP-compliant transcript handling.
- **Feasibility (panel view):** AI-architect — feasible; needs transcript access at scale. Compliance — strong. Tension: vendor-relations sensitivity; SF-PM wants high precision before naming a vendor.

---

## BUCKET B — Net-new cards-transaction × complaint/voice joins that do not exist today

### UC-OPUS-B1 — Decline-spike to customer-voice root-cause join *(the hero)*
- **Archetype:** curable-decline / fraud-rule (root-cause)
- **Bucket:** B
- **Signal (one line):** "Declines rose on this cohort AND the matching 'card not working' voice spike pins the cause — root cause arrives with the alert."
- **Cadence / trigger:** real-time / daily morning brief
- **Primary user → routed executive:** PM → Head of Cards / Risk (auto-routed by cause)
- **1. Data aggregation:**
  - Transaction-side: decline events by reason code × cohort × BIN × MCC × channel × timestamp; fraud-rule change events; tokenisation status.
  - Interaction-side: calls/chats/social/app-store mentioning "card declined", "payment failed", "transaction not going through", with sentiment, merchant and timestamp extracted.
- **2. Baseline creation:** dual baselines — decline-rate per cell AND "payment-failed" interaction-rate per cohort × channel × time — plus a cross-domain co-movement baseline (how often the two move together normally).
- **3. Dynamic detection:** detect a decline-rate anomaly that is **time-aligned** with an interaction-rate anomaly in the same cohort/merchant window; the join converts a sterile decline code into a causal narrative (rule change vs tokenisation break vs genuine fraud).
- **4. Distillation:** suppress decline spikes with no voice echo (silent, likely benign) and voice spikes with no decline basis; surface only the co-moving pair, ranked by ₹-at-risk × escalation-risk.
- **5. Surfacing & routing:** "Premium HNI insufficient-funds declines +38% WoW (₹2.4 Cr) — AND 'payment failed' calls from the same cohort +4×, matching Reddit chatter, all from 11:00 after the tokenisation push"; the **Correlation Evidence band** shows both curves on one timeline; **draft action** routed to the cause owner. **Hero element: the dual-curve correlation band.**
- **Why it beats a self-built dashboard:** no dashboard a PM can build joins the decline grid to the voice corpus in real time; today this is a manual war-room hours-to-days later. LiSN delivers cause with the alert.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** the source's own figure — +38% WoW, ₹2.4 Cr at risk on PREM 25–34 HNI — joined to a 4× "payment failed" call/chat spike and matching social chatter, all initiating 90 minutes after a tokenisation/network change; LiSN names the cause (CoFT re-tokenisation break, not customer behaviour) the same morning and routes a fix to Ops + a recovery nudge draft to Cards. *(₹2.4 Cr/38% anchored; 4× and timing [illustrative].)*
- **Regulatory / governance hook:** auditable cause-to-impact trail; pre-empts complaint escalation under the IO regime.
- **Feasibility (panel view):** AI-architect — the time-alignment join and entity resolution (cohort↔caller) are the hard parts; cohort-level (not identity-level) join keeps it DPDP-clean. SF-PM — co-movement baseline is the trust anchor; without it, spurious correlations erode confidence. Compliance — cohort-level join strongly preferred over identity-level. Marketing — this is *the* demo. Tension: AI-architect (identity-level join is richer) vs Compliance (cohort-level is safer) — resolve to cohort-level for v1.

### UC-OPUS-B2 — Fraud-rule misfire, voice-confirmed before the fraud KPI moves
- **Archetype:** fraud-rule misfire
- **Bucket:** B
- **Signal (one line):** "'Card declined at checkout' complaints are leading a fraud-rule change — the rule is over-blocking good customers before any KPI shows it."
- **Cadence / trigger:** event-triggered + real-time
- **Primary user → routed executive:** PM → Head of Fraud / Risk
- **1. Data aggregation:** transaction-side fraud-rule change events + suspected-fraud declines by BIN/cohort; interaction-side "declined / blocked / why is my card not working" mentions with merchant and time.
- **2. Baseline creation:** baseline lag between a rule push and its complaint echo per cohort; normal suspected-fraud-decline-to-complaint ratio.
- **3. Dynamic detection:** detect a complaint surge whose timing and merchant pattern map to a recent rule push, *ahead* of the fraud team's own effectiveness review — the voice signal leads the lagging fraud KPI.
- **4. Distillation:** suppress complaint noise unrelated to declines; isolate the rule-attributable cluster; rank by good-customer GMV at risk.
- **5. Surfacing & routing:** "Rule R-219: 'declined at checkout' complaints +3× within 2h, concentrated on tenured customers — over-blocking, not fraud suppression"; **draft roll-back review to Fraud**. **Hero element: the voice-leads-KPI timing gap.**
- **Why it beats a self-built dashboard:** the fraud team's effectiveness review runs on transaction KPIs that lag; the customer's reaction lands in voice first. Only the join sees it early.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** within two hours of rule R-219, complaint and chat mentions of "card blocked at [merchant]" triple, 80% from 3+-year customers; the fraud KPI would not have flagged this for another day; LiSN compresses the detection-to-rollback loop to the same morning. *([illustrative], anchored to source fraud-rule example.)*
- **Regulatory / governance hook:** directly supports "explain why good transactions were declined" under the 2025 authentication/conduct lens.
- **Feasibility (panel view):** AI-architect — needs reliable rule-change feed + complaint timestamping. Tension: Risk ownership sensitivity (mirrors A2) but stronger here because voice "catches" the rule; frame as protecting approval rate.

### UC-OPUS-B3 — Weak-authentication liability cluster (Authentication Directions 2025)
- **Archetype:** authentication-liability
- **Bucket:** B
- **Signal (one line):** "2FA/OTP-failure complaints joined to declined-or-disputed CNP transactions reveal a cluster of issuer-compensation exposure."
- **Cadence / trigger:** daily + event-triggered
- **Primary user → routed executive:** PM / Conduct → Head of Risk / Compliance
- **1. Data aggregation:** transaction-side CNP transactions with authentication-method/status and dispute flags; interaction-side complaints/calls citing "OTP not received", "charged without OTP", "2FA failed".
- **2. Baseline creation:** baseline rate of auth-failure complaints per channel/merchant; expected dispute-to-complaint ratio.
- **3. Dynamic detection:** detect clusters where weak-or-absent-authentication transactions co-occur with customer complaints alleging non-receipt/bypass — the exact pattern that triggers issuer liability under the Directions.
- **4. Distillation:** suppress isolated OTP-delivery gripes; surface clusters with transaction and dispute corroboration; rank by potential compensation exposure (₹).
- **5. Surfacing & routing:** "47 CNP transactions on merchant M processed without a completed dynamic factor AND matching 'charged without OTP' complaints — ₹X potential compensation exposure"; **draft note to Compliance**. **Hero element: the quantified liability exposure.**
- **Why it beats a self-built dashboard:** liability lives precisely at the intersection of an auth-method gap (transaction side) and a customer assertion (voice side); neither dashboard sees the other.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** post-1 Apr 2026, LiSN finds 47 CNP authorisations on one merchant path missing a completed dynamic factor, joined to 31 "money taken, no OTP" complaints; under the full-compensation rule the exposure is ~₹6–9 lakh and, more importantly, a systemic auth-flow gap; routed to Compliance the same day. *([illustrative], anchored to the Authentication Directions 2025 liability clause.)*
- **Regulatory / governance hook:** RBI Authentication Mechanisms Directions 2025 (effective 1 Apr 2026) issuer full-compensation liability; DPDP-compliant, cohort/merchant-level.
- **Feasibility (panel view):** Compliance — highest-value defensibility use case in the catalogue. AI-architect — needs auth-status in the transaction feed (may be a gap). Tension: SF-PM — high precision essential; a false liability flag is costly. Strong panel consensus to prioritise.

### UC-OPUS-B4 — Hardship-language early roll-rate predictor
- **Archetype:** hardship & roll-rate
- **Bucket:** B
- **Signal (one line):** "Hardship language in service/collections calls is leading 0→30 migration in this cohort — credit cost is forming in the voice corpus first."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Risk / Collections
- **1. Data aggregation:** interaction-side collections/service calls and chats — job-loss, medical, "can't pay this month", abandoned hardship-form language; transaction-side DPD flow + Stage-2 migration by cohort.
- **2. Baseline creation:** baseline hardship-language rate per cohort and its normal lead-lag to roll-rate movement.
- **3. Dynamic detection:** detect hardship-language surges that precede, and predict, 0→30 inflection in the same cohort — converting unstructured distress into a leading risk feature.
- **4. Distillation:** suppress generic billing confusion; isolate genuine financial-distress signals; rank by projected credit-cost bps.
- **5. Surfacing & routing:** "Hardship language +1.9× in a sub-prime vintage, leading a projected 0→30 inflection — ~9 bps credit-cost risk"; **draft signal to the bank's EWS / Collections** (LiSN signals, bank decides). **Hero element: the voice-leads-delinquency lead time.**
- **Why it beats a self-built dashboard:** EWS today is transaction/bureau-based and lagging; the distress is spoken weeks before it rolls. Only the join turns voice into a forward credit signal.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** in a sourcing vintage, hardship-language mentions rise 1.9× over two weeks; LiSN predicts a 0→30 inflection that the transactional EWS flags only a fortnight later, giving Collections a head start worth an estimated 9 bps on the cohort. *([illustrative], anchored to source roll-rate/credit-cost figures.)*
- **Regulatory / governance hook:** advisory signal only — no credit decisioning in LiSN; DPDP-compliant; supports fair, early hardship treatment.
- **Feasibility (panel view):** SF-PM — strongest "leading indicator" story; needs careful precision so it informs, not labels. Compliance — must remain advisory to the bank's EWS. AI-architect — feasible; hardship-language model is the build. Tension: AI-architect (rich per-customer signal) vs Compliance (cohort-level, advisory) — resolve to cohort-level advisory.

### UC-OPUS-B5 — Ombudsman-escalation pre-empt
- **Archetype:** conduct & grievance (escalation)
- **Bucket:** B
- **Signal (one line):** "A systemic complaint pattern is forming around a specific transaction/product behaviour — resolve it before the IO auto-escalation window closes."
- **Cadence / trigger:** daily + weekly board view
- **Primary user → routed executive:** PM / Conduct → Head of Conduct / Internal Ombudsman liaison
- **1. Data aggregation:** interaction-side complaint registry + calls/chats/social by product × MCC × co-brand × geography; transaction-side the underlying event class (e.g., a billing/charge behaviour) the complaints attach to.
- **2. Baseline creation:** complaint-pattern baselines per product/co-brand; the normal partially-resolved/rejected-complaint rate that would trigger IO escalation.
- **3. Dynamic detection:** detect a complaint cluster tied to a common transaction behaviour that is trending toward systemic, joined to the transaction event that explains it.
- **4. Distillation:** suppress idiosyncratic one-off complaints; surface the systemic cluster with a transaction root cause; rank by escalation probability and consequential-loss exposure.
- **5. Surfacing & routing:** "Co-brand C: 'wrong late-fee charged' complaints clustering, root-caused to a billing-cycle config — N cases heading toward IO escalation"; **draft remediation brief to Conduct**. **Hero element: the escalation-risk countdown tied to a root cause.**
- **Why it beats a self-built dashboard:** complaint dashboards count cases; they neither cluster around a transaction root cause nor forecast IO escalation. The join does both.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** "incorrect late fee" complaints on one co-brand triple in a week, all traceable to a billing-cycle misconfiguration; left alone, a share would hit partial-resolution and auto-escalate to the Internal Ombudsman; LiSN root-causes and routes remediation before the window, and feeds the quarterly board pattern report. *([illustrative], anchored to IO Directions 2026 and the +20.04% credit-card complaint growth.)*
- **Regulatory / governance hook:** Internal Ombudsman Directions 2026 (30 June 2026), quarterly board pattern analysis; RB-IOS consequential-loss exposure.
- **Feasibility (panel view):** Compliance — board-level pain, top priority. AI-architect — clustering + root-cause join feasible. Marketing — "stay out of the ombudsman's report" sells itself. Low tension.

### UC-OPUS-B6 — Campaign/EMI mis-selling blowback detector
- **Archetype:** campaign-to-complaint
- **Bucket:** B
- **Signal (one line):** "This offer launch is generating a complaint/dispute echo — mis-selling fallout, caught in days not post-campaign."
- **Cadence / trigger:** event-triggered (campaign launch) + daily
- **Primary user → routed executive:** PM → Head of Cards / Conduct
- **1. Data aggregation:** transaction-side campaign/offer launch events + resulting EMI conversions/charges; interaction-side complaints/chats citing "hidden charges", "no-cost EMI but charged", "didn't agree to this".
- **2. Baseline creation:** baseline complaint/dispute rate per offer-type; expected post-launch sentiment.
- **3. Dynamic detection:** detect a post-launch complaint/dispute surge attributable to a specific campaign's messaging — the conduct cost marketing dashboards never see.
- **4. Distillation:** suppress unrelated complaint noise; isolate the campaign-attributable cluster; rank by mis-selling severity and reversal cost.
- **5. Surfacing & routing:** "EMI offer launched Tuesday — 'no-cost EMI but charged interest' complaints +3.5× by Thursday"; **draft note to Conduct + Marketing**. **Hero element: launch-to-complaint echo curve.**
- **Why it beats a self-built dashboard:** marketing sees opens, clicks and spend lift; the disputes a campaign triggers land in a different system and are reconciled only after a large incident. The join links cause and conduct cost in days.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a "no-cost EMI" push converts well on the spend dashboard but triggers a 3.5× rise in "charged interest on no-cost EMI" complaints within 48 hours, an MITC-disclosure exposure; LiSN flags it before the campaign's second wave sends. *([illustrative].)*
- **Regulatory / governance hook:** MITC / "no-cost EMI" disclosure rules; IO pattern analysis.
- **Feasibility (panel view):** AI-architect — needs campaign event feed + complaint attribution. Marketing-PM — sensitive (audits campaigns) but protects the brand. Tension: marketing vs conduct ownership of the verdict.

### UC-OPUS-B7 — Tech-incident true-customer-impact attribution
- **Archetype:** switch-incident attribution (voice-joined)
- **Bucket:** B
- **Signal (one line):** "This switch/processor degradation is hurting real customers — the call/social surge quantifies impact a green-on-the-dashboard outage hides."
- **Cadence / trigger:** real-time / event-triggered
- **Primary user → routed executive:** PM → Head of Ops / Tech + Comms
- **1. Data aggregation:** transaction-side switch/processor health + technical declines by route; interaction-side call/chat/social surge with "app down", "payment failing", merchant context.
- **2. Baseline creation:** baseline co-movement of technical-decline rate and customer-contact rate per route.
- **3. Dynamic detection:** detect a tech degradation joined to a customer-contact surge (true impact) versus a tech blip with no customer echo (benign) — and the inverse, a contact surge with no tech basis (merchant or comms issue).
- **4. Distillation:** suppress silent, harmless blips; surface degradations with real customer pain; rank by affected customers × ₹ flow.
- **5. Surfacing & routing:** "Route X degraded since 09:10 AND 'payment failing' contacts +5× — ~14,000 customers affected, ₹68L/hr; comms recommended"; **draft incident + comms note**. **Hero element: the customers-affected number from the voice side.**
- **Why it beats a self-built dashboard:** observability shows system health, not customer pain; a route can look "within SLA" while customers churn. The join measures the human impact and the need to communicate.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a processor route degrades inside SLA thresholds (so Ops sees green) but "payment failing" contacts rise 5× and app-store reviews dip; LiSN estimates ~14,000 affected customers and ₹68L/hr, triggering proactive comms hours before the issue would have been escalated. *([illustrative].)*
- **Regulatory / governance hook:** supports outage-disclosure and fair-treatment expectations; auditable impact record.
- **Feasibility (panel view):** AI-architect — needs switch telemetry + contact feed. SF-PM — co-movement baseline prevents false alarms. Tension: overlap with Ops' own tooling; LiSN's wedge is the customer-impact quantification, not infra monitoring.

### UC-OPUS-B8 — Co-brand / network-portability churn early-warning
- **Archetype:** attrition & churn (voice-joined)
- **Bucket:** B
- **Signal (one line):** "Spend is dropping on this co-brand AND switch/close intent is rising in social and chat — churn before it shows in closures."
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Cards / Co-brand partner manager
- **1. Data aggregation:** transaction-side spend-velocity drop by co-brand/network cohort; interaction-side social/app-store/chat with "how to close card", "switch to [competitor]", "change network", sentiment.
- **2. Baseline creation:** baseline spend rhythm and baseline switch/close-intent chatter per co-brand.
- **3. Dynamic detection:** detect a spend-decay anomaly co-occurring with a switch/close-intent chatter surge — a forward churn signal the closure report only confirms later.
- **4. Distillation:** suppress seasonal lulls and idle chatter; surface co-moving pairs; rank by portfolio value at risk.
- **5. Surfacing & routing:** "Co-brand C: spend −22% over three cycles AND 'how to switch network' chatter +3× — ₹Z at risk"; **draft retention brief**. **Hero element: the spend-decay-plus-switch-intent pair.**
- **Why it beats a self-built dashboard:** attrition dashboards are lagging (they count closures); intent lives in social/chat, which transaction tools never read. Network portability (>10 lakh active cards) makes this forward signal newly valuable.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a co-brand cohort's spend falls 22% over three cycles while "how do I switch my card network / close this card" chatter triples after a competitor's launch; LiSN flags ₹18 Cr annual spend at risk for a targeted retention play weeks before closures register. *([illustrative], anchored to network-portability rule.)*
- **Regulatory / governance hook:** network-portability Directions context; consent-respecting retention.
- **Feasibility (panel view):** AI-architect — social intent extraction is the build. Marketing-PM — high resonance. Tension: SF-PM warns social-intent precision is hard; require transaction corroboration (the spend drop) before surfacing.

### UC-OPUS-B9 — Silent CoFT / tokenisation-breakage detector
- **Archetype:** curable-decline (tokenisation)
- **Bucket:** B
- **Signal (one line):** "Recurring/subscription declines on tokenised cards joined to 'subscription failed' complaints reveal a silent CoFT break."
- **Cadence / trigger:** daily / event-triggered
- **Primary user → routed executive:** PM → Head of Ops / Tech
- **1. Data aggregation:** transaction-side recurring/CNP declines on tokenised credentials by merchant/token-requestor; tokenisation-status events; interaction-side "subscription failed", "Netflix/utility payment declined", "card on file not working" complaints.
- **2. Baseline creation:** baseline recurring-decline rate per merchant/token-requestor and its normal complaint echo.
- **3. Dynamic detection:** detect a tokenised-recurring-decline anomaly on a merchant joined to a matching complaint cluster — the fingerprint of a re-tokenisation or token-lifecycle break, distinct from genuine insufficient funds.
- **4. Distillation:** suppress ordinary recurring-payment failures; isolate token-break clusters; rank by affected subscriptions and merchant prominence.
- **5. Surfacing & routing:** "Token-requestor M: recurring declines +6× AND 'subscription payment failed' complaints — likely CoFT break, ₹X recurring revenue at risk"; **draft fix request to Ops**. **Hero element: the token-break root-cause call.**
- **Why it beats a self-built dashboard:** a generic decline dashboard buries token-lifecycle breaks inside "declines"; only joining the tokenised-decline pattern to the subscription-failure complaints surfaces it as a fixable systemic break.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** after a network token update, recurring declines on one large merchant rise 6× while "my subscription keeps failing" complaints spike; with ~98% of e-commerce running on CoFT tokens, a silent break is material; LiSN root-causes it the same day. *([illustrative], anchored to CoFT 91-crore-token / 98% figures.)*
- **Regulatory / governance hook:** CoFT mandate; recurring-payment fair-treatment.
- **Feasibility (panel view):** AI-architect — needs token-status granularity in the feed (possible gap). Compliance — clean. Tension: data availability of token lifecycle events.

### UC-OPUS-B10 — Double-debit / reversal-failure detector
- **Archetype:** conduct & grievance (operational)
- **Bucket:** B
- **Signal (one line):** "Reversal-pending transaction events joined to 'money debited not credited' complaints reveal an operational failure heading for the ombudsman."
- **Cadence / trigger:** daily / real-time
- **Primary user → routed executive:** PM / Ops → Head of Ops / Conduct
- **1. Data aggregation:** transaction-side reversal-pending / failed-reversal / double-debit events by merchant/channel; interaction-side "money debited twice", "amount not refunded", "debited not credited" complaints with merchant and amount.
- **2. Baseline creation:** baseline reversal-failure rate per channel/merchant and its complaint echo.
- **3. Dynamic detection:** detect a reversal-failure anomaly joined to a matching complaint surge — confirming a real operational failure versus a benign accounting lag.
- **4. Distillation:** suppress normal settlement lags; surface confirmed double-debit/reversal-failure clusters; rank by customers affected and escalation risk.
- **5. Surfacing & routing:** "UPI-on-credit double-debit on merchant M: reversal-failures +4× AND 'debited twice' complaints +5× — N customers, ombudsman-bound"; **draft remediation + proactive-refund recommendation**. **Hero element: the confirmed-failure customer count.**
- **Why it beats a self-built dashboard:** an operations dashboard shows reversal queues; it cannot confirm customer harm or forecast escalation. The complaint join confirms the failure is real and prioritises refunds before complaints escalate.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** a UPI-on-credit glitch double-debits on one merchant; reversal-failures rise 4× and "money debited twice, not refunded" complaints 5×; LiSN confirms ~2,300 affected customers and recommends proactive reversal before the cluster reaches the Internal Ombudsman. *([illustrative].)*
- **Regulatory / governance hook:** IO Directions 2026; RBI dispute-resolution timelines; auditable remediation trail.
- **Feasibility (panel view):** AI-architect — needs reversal-event feed. Compliance — strong ombudsman-pre-empt value. Low tension; pairs naturally with B5.

---

## Panel Notes

**Sharpest disagreements across the catalogue:**
1. **Identity-level vs cohort-level joins (AI-architect vs Compliance).** Richer correlation (and tighter recovery) comes from joining at customer-identity level; DPDP and the compliance adviser push to cohort/merchant-level. Recurs in B1, B4, B8. Recommended resolution: cohort/merchant-level for v1, identity-level only behind explicit consent and purpose limitation.
2. **Detection ambition vs alarm fatigue (SF-PM vs Marketing-PM).** Marketing wants more cards surfaced for demo richness; the anomaly PM insists the co-movement baseline and a hard cap (≤3–5 cards) are what build trust. Recurs everywhere. Resolution: cap the brief, expand on drill-down.
3. **Auditing the bank's own teams (Compliance/AI-architect vs internal politics).** A2/B2 audit Fraud's rules; A4/B6 audit Marketing's campaigns; A9 audits vendors. Strong value, real organisational friction. Resolution: frame as the team's own early-warning, route privately to the owning exec first.
4. **Data-feed availability (AI-architect caution).** B3 (auth status), B9 (token lifecycle), A2/B2 (fraud-rule change events) depend on feeds that may sit outside the standard summary tables. Resolution: scope a feed-availability audit before committing these to the MVP.

**Five strongest UI candidates (why they resonate with a cards/portfolio manager):**
- **UC-OPUS-B1 — Decline-spike↔voice root-cause join.** The visceral "you would have missed this"; root cause arrives with the alert. The demo opener.
- **UC-OPUS-B3 — Weak-authentication liability cluster.** Turns a regulatory liability (1 Apr 2026) into a quantified, defensible morning alert — speaks straight to the board.
- **UC-OPUS-B5 — Ombudsman-escalation pre-empt.** Directly addresses the 30 June 2026 IO regime and the fastest-growing complaint category; "stay out of the ombudsman's report".
- **UC-OPUS-A1 — Curable-decline recovery radar.** Immediate, quantified rupee recovery a PM can act on before lunch; the clearest ROI.
- **UC-OPUS-B4 — Hardship-language roll-rate predictor.** The credit-cost leading indicator that lives in voice weeks before the book — basis points a Head of Risk cannot get elsewhere.
