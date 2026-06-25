# ENGINE: GEMINI — LiSN Cards Extension, Use-Case Mining Output

> Depth-first catalogue mined from the Gemini-sourced research file. Engine tag follows the research source. One fully-worked use case per block. Tagged `GEMINI` for mechanical merge with the Claude, Opus and GPT-5 runs.

---

## Framing — how this engine read the research file

This catalogue carries the GEMINI engine tag, following the research source. This engine leaned hardest on three anchors the research file makes explicit and treats as load-bearing. First, the **Integration Chasm** in Section C — the panel's unanimous claim that transaction-to-customer-voice joins are "the hardest joins, essentially never made proactively today" — which is read here not as a complaint but as the entire commercial thesis: every Bucket B block is built directly on the join the file says nobody wires. Second, the **question set** in Section B, read as a ready-made list of the cross-system stitches a PM performs by hand each morning; the "Extreme" and "High" stitching-requirement rows are converted one-for-one into pipeline use cases. Third, the **KPI momentum column** in Section A, read as a prioritisation signal — use cases attached to KPIs marked "Rising" in importance (activation, roll rates, complaints/ombudsman, false declines, attrition) are weighted above stable ones, because that column is effectively the PM telling us where the pain is migrating. The file's real numeric anchors — false declines costing up to 13× actual fraud, revolve rates around 24%, write-offs approaching 9.8%, top-5 issuers holding roughly 85.6% of spend, the RBI 30+7-day unactivated-card closure rule, RuPay-UPI MDR caps, reason codes 3.02 and 3.10 — are reused verbatim so the catalogue stays grounded rather than invented. Where the file is thin on a figure, additions are flagged `[illustrative]`.

---

## BUCKET A — Pipeline use cases that outperform a self-built dashboard

---

### UC-GEMINI-A1 — Decline-rate spike with reason-code decomposition
- **Archetype:** curable-decline intelligence
- **Bucket:** A
- **Signal (one line):** Authorisation decline rate breached its baseline for this hour-of-week, and the excess is concentrated in one reason code, one channel and one BIN range.
- **Cadence / trigger:** real-time, with a roll-up into the daily morning brief
- **Primary user → routed executive:** PM → Head of Cards (with Head of Tech cc'd if the driver is a switch/processor signal)

- **1. Data aggregation:**
  - Transaction-side inputs consumed: authorisation/decline event feed with ISO 8583 reason codes (3.02 insufficient funds, 3.10 suspected fraud, and the issuer-soft-decline family), MCC, BIN, channel (POS / CNP / UPI-on-credit), terminal/acquirer ID, and fraud-rule change events; switch/processor health pings.
  - Interaction-side inputs (LiSN-native): none required for the lead signal — this is a transaction-side block — but the interaction corpus is held ready as the corroboration band (see A2 / B1).

- **2. Baseline creation:**
  - Baselines on decline rate built per BIN × MCC × channel × hour-of-week, with deeper cells for product × channel × hour and product × BIN × channel. "Normal" is the rolling distribution of decline rate for that exact cell at that hour-of-week, so Monday-10am is judged against Monday-10am, not against a flat daily average. Known seasonality (salary-day spikes, festival surges, statement-cycle clustering) is encoded as expected bands so they do not read as anomalies.

- **3. Dynamic detection:**
  - The condition is a deviation of decline rate beyond the cell's expected band (z-score against the hour-of-week distribution, magnitude expressed in basis points), with a contribution decomposition that attributes the excess to specific reason code × BIN × channel cells. A real signal is one where the excess concentrates — a 150bps total move that decomposes to one reason code in one BIN range is real; a 150bps move smeared evenly across all codes and BINs is usually a systemic counting artefact and is down-weighted.

- **4. Distillation (noise reduction):**
  - Suppressed: salary-day and festival bands, statement-cycle clustering, and any move below a materiality floor in ₹ exposure or cards affected. The "one signal that matters" is the single reason-code × BIN × channel cell carrying the largest share of the abnormal excess. Ranking inputs: abnormality magnitude (bps), ₹ at risk (declined good-spend estimate), cards affected, confidence of the concentration, and curability (a soft decline a retry or a rule tweak could recover ranks above a hard regulatory decline).

- **5. Surfacing & routing (UI-relevant):**
  - The executive sees a headline ("Declines on BIN 6521-xx CNP up 150bps vs Mon-10am baseline"), the abnormality-vs-baseline bar, impact (₹ of estimated good-spend declined + cards affected), the reason-code decomposition as the **hero element**, the recommended action (review the fraud rule changed at 09:40, or open a switch ticket), and a draft ticket pre-filled with the cell, the window and the suspected rule. Human gate explicit: the PM approves before any rule-review request is routed.

- **Why it beats a self-built dashboard:** a self-built decline dashboard shows the aggregate line moving and leaves the PM to pivot through reason codes, BINs and channels by hand — the exact manual SQL-and-pivot grind Section B calls a "severe operational bottleneck". LiSN arrives with the decomposition already done and the cell isolated, and it watches continuously rather than waiting for the 10am dashboard check.
- **Differentiation:** transaction-visible (the join is the upgrade path in B1, not a requirement here).
- **Worked example:** At 09:40 a CNP fraud rule is tightened for cross-border e-commerce. By 10:15 the total decline rate is up 150bps; the decomposition attributes ~70% of the excess to reason code 3.10 on BIN 6521-xx (a new co-brand RuPay book of ~48,000 cards). Estimated good-spend declined in the window: ₹62 lakh `[illustrative]`. LiSN surfaces the cell at 10:18; the PM routes a rule-review request to Risk; the rule is loosened by 11:30, ~2 hours faster than the afternoon analyst pull would have allowed.
- **Regulatory / governance hook:** decline handling touches RBI conduct expectations on fair treatment and false-decline harm; the audit log records the baseline, the deviation, the human approval and the rule-change linkage, satisfying explainability if the move is later queried.
- **Feasibility (panel view):** data needed is already a summary event feed, so feasibility is high. Hardest part per the AI architect is keeping thousands of hour-of-week baselines fresh without drift. The SLM/narrow-agent role is the decomposition-and-draft step, not the detection maths. False-positive risk is moderate and controlled by the concentration test. **Disagreement:** the anomaly-platform PM wants the curability ranking to dominate; the compliance adviser wants regulatory-decline cells flagged even when not "curable", so a wrongful-decline pattern is never suppressed for being commercially uninteresting.

---

### UC-GEMINI-A2 — False-decline cost intelligence (good revenue lost vs fraud prevented)
- **Archetype:** authentication-liability / curable-decline intelligence
- **Bucket:** A
- **Signal (one line):** A fraud-parameter change is now costing more in lost good spend than the fraud it prevents, against the cell's own historical trade-off.
- **Cadence / trigger:** event-triggered on any fraud-rule change, then daily for 14 days after
- **Primary user → routed executive:** PM → Head of Risk (Head of Cards cc'd)

- **1. Data aggregation:**
  - Transaction-side: fraud-engine decision logs (approve/soft-decline/hard-decline), subsequent retry attempts on the same card-merchant pair, eventual successful settlement, and downstream chargeback/dispute realisation; MCC, BIN, channel, cross-border flag.
  - Interaction-side: "card declined" and "payment failed" mentions in calls/chats/app feedback, used to corroborate the lost-good-spend estimate (a declined customer who then calls is a high-confidence false decline).

- **2. Baseline creation:**
  - Baseline the false-positive ratio per rule × MCC × channel × cross-border flag — defined as declines that were retried-and-settled-elsewhere or contradicted by a later clean chargeback history, over total declines. "Normal" is the rule's pre-change trade-off curve. Seasonality of fraud (festival, cross-border travel windows) is encoded so a genuine fraud surge is not mistaken for a tuning error.

- **3. Dynamic detection:**
  - The condition compares post-change false-positive ratio against the pre-change baseline and against fraud actually caught, expressed as a ₹ ratio: good-spend lost per ₹ of fraud prevented. The research anchor — false declines cost up to 13× actual fraud — sets the alarm threshold: a rule drifting toward or past that multiple is surfaced.

- **4. Distillation (noise reduction):**
  - Suppressed: rules within their historical trade-off band, and genuine fraud surges (where catch rate rose in step). The signal that matters is the single rule whose lost-good-spend-to-fraud-prevented ratio has worsened most. Ranking inputs: the ₹ ratio, cards affected, the corroborating complaint volume, and reversibility.

- **5. Surfacing & routing (UI-relevant):**
  - Headline ("Cross-border CNP rule now losing ₹9 of good spend per ₹1 of fraud stopped"); the **hero element** is the lost-vs-prevented ₹ gauge against the 13× reference line; impact in ₹ and cards; recommended action (revert or re-tune); draft change-request to Risk with the rule ID and the window. Human gate explicit.

- **Why it beats a self-built dashboard:** the false-positive ratio requires joining decision logs, retries and eventual chargeback realisation — Section B marks this a "High" stitch and notes it is done by hand after the fact. A dashboard shows declines, not the economic trade-off; LiSN computes the trade-off continuously and anchors it to the 13× cost reality the PM already believes.
- **Differentiation:** transaction-visible, strengthened by interaction corroboration.
- **Worked example:** A cross-border CNP rule is tightened. Over 10 days it prevents ₹7 lakh of fraud but soft-declines good spend that retries-and-settles worth ₹63 lakh `[illustrative]` — a 9:1 ratio, climbing toward the 13× line, with a parallel rise in "my card was declined abroad" calls. LiSN surfaces it on day 3; Risk re-tunes; the ratio falls to 2:1.
- **Regulatory / governance hook:** directly engages the Authentication Mechanisms Directions 2025 liability frame and RBI's fair-conduct expectations — wrongful declines are a conduct and reputational exposure, not only a revenue leak. Full audit trail of the trade-off and the human decision.
- **Feasibility (panel view):** the hardest part is the retry-and-settle attribution to label a decline "false"; the architect notes this needs the retry feed, not just the decline feed. False-positive risk of the meta-detector is low because the trade-off is economic, not statistical. **Disagreement:** marketing PM wants this framed as "revenue rescue"; compliance adviser insists the conduct-liability framing leads, because that is what defends the spend at audit.

---

### UC-GEMINI-A3 — Early roll-rate by sourcing channel
- **Archetype:** hardship & roll-rate
- **Bucket:** A
- **Signal (one line):** One acquisition channel's 30→60 DPD roll rate has broken above its vintage-adjusted baseline before it shows in the portfolio aggregate.
- **Cadence / trigger:** weekly, event-triggered on month-end roll-rate posting
- **Primary user → routed executive:** PM → Head of Risk (Head of Cards for sourcing-mix decisions)

- **1. Data aggregation:**
  - Transaction-side / summary: roll-rate summaries by delinquency bucket, receivables, and the origination tag (branch walk-in / digital aggregator / co-brand partner) carried on each account; vintage and cohort markers.
  - Interaction-side: hardship-language density in calls/chats from each channel cohort (early-warning corroboration, also feeds B8).

- **2. Baseline creation:**
  - Baseline 30→60 roll rate per sourcing-channel × vintage × cohort, because a 3-month-old digital-aggregator vintage rolls differently from a 2-year branch vintage. "Normal" is the vintage-matched roll curve. Seasonality of collections (post-festival stress) encoded.

- **3. Dynamic detection:**
  - Deviation of a channel-vintage cell's roll rate above its matched baseline, surfaced while still small in absolute receivables so it is a leading rather than lagging read. Noise control: require the deviation to persist across two postings or co-occur with rising hardship language before escalation.

- **4. Distillation:**
  - Suppressed: seasonal post-festival roll bumps shared by all channels, and immaterial cohorts. The signal that matters is the single channel-vintage cell deteriorating fastest relative to its own history. Ranking: roll-rate delta, ₹ receivables in the cell, projected charge-off contribution, confidence.

- **5. Surfacing & routing:**
  - Headline ("Digital-aggregator Mar-vintage 30→60 roll up 4.1pts vs matched baseline"); **hero element** is the channel-vs-channel roll comparison against each one's own baseline; impact as projected ₹ charge-off; recommended action (tighten that channel's underwriting cut-off, pause the partner); draft note to Risk. Human gate explicit.

- **Why it beats a self-built dashboard:** Section B flags the origination-to-collections join as a "Moderate" manual stitch; a self-built roll dashboard shows portfolio roll but rarely carries the sourcing tag cleanly, and never judges each vintage against its own matched curve. LiSN does the vintage-matched maths the PM cannot maintain by hand and catches the channel early.
- **Differentiation:** transaction/summary-visible, corroborated by interaction.
- **Worked example:** Branch and co-brand roll rates sit on baseline; the digital-aggregator March vintage (~9,000 cards, ₹71 crore receivables) rolls 30→60 at 4.1 points above its matched curve, with hardship mentions in that cohort's calls up 30%. LiSN surfaces it three weeks before the aggregate would have moved; the PM pauses that aggregator's tap and tightens the cut-off, avoiding an estimated ₹2.3 crore of additional charge-off `[illustrative]`.
- **Regulatory / governance hook:** supports RBI RBIA-style early-warning expectations; channel-level evidence is auditable for fair-lending and sourcing-quality review.
- **Feasibility (panel view):** feasibility moderate-high; the sourcing tag's data quality is the constraint. SLM role is narrative drafting only. **Disagreement:** the public-sector PM lens cautions against cutting a channel that serves financial-inclusion goals on a single early signal — the compliance adviser wants an inclusion-impact note attached before any partner pause is routed.

---

### UC-GEMINI-A4 — Revolve-rate erosion and NIM impact monitor
- **Archetype:** other (profitability/NII)
- **Bucket:** A
- **Signal (one line):** A profitable revolver cohort is converting to transactor behaviour faster than its baseline, eroding NII before the monthly NIM report shows it.
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Cards (Finance/Treasury cc'd)

- **1. Data aggregation:**
  - Summary inputs: revolve/EMI-conversion summaries, minimum-due-payer flags, receivables, yield by cohort; offer/campaign events that may be nudging full repayment.
  - Interaction-side: "how do I avoid interest", "want to convert to EMI", balance-transfer enquiry language — demand-side signal that revolvers are planning to stop revolving.

- **2. Baseline creation:**
  - Baseline revolve rate and minimum-due-payer mix per cohort × vintage × product, anchored on the file's ~24% system revolve level so cohort moves are judged against both their own history and the market floor. Seasonality (bonus-season repayment) encoded.

- **3. Dynamic detection:**
  - Deviation where a cohort's revolve rate falls below its baseline band while balances stay flat (i.e. they are repaying rather than attriting), separating behavioural revolve-loss from balance-loss. Interaction enquiry spikes act as a leading indicator.

- **4. Distillation:**
  - Suppressed: bonus-season repayment, and cohorts too small to move NIM. The signal that matters is the largest-NII cohort losing revolve fastest. Ranking: ₹ NII at risk, cohort size, deviation magnitude, leading-enquiry confirmation.

- **5. Surfacing & routing:**
  - Headline ("HNI revolver cohort revolve rate down 3pts; ~₹X NII/month at risk"); **hero element** is the NII-at-risk bridge; recommended action (targeted EMI-conversion offer, retention pricing); draft campaign requirement. Human gate explicit.

- **Why it beats a self-built dashboard:** revolve appears on dashboards as a lagging monthly number; the file calls revolve the "primary driver of portfolio profitability" yet notes the metric is falling. LiSN reads the behavioural shift weekly, separates revolve-loss from attrition (a distinction a static chart blurs), and ties it to NII before the month closes.
- **Differentiation:** transaction/summary-visible, with interaction lead.
- **Worked example:** A 22,000-card HNI revolver cohort drops from 41% to 38% revolve over three weeks while balances hold; "avoid interest" and "EMI conversion" enquiries in that cohort rise 25%. Estimated NII at risk ₹1.1 crore/month `[illustrative]`. LiSN surfaces it; the PM launches a structured-EMI retention offer; revolve stabilises at 40%.
- **Regulatory / governance hook:** any retention pricing must respect RBI penal-charge and transparent-pricing directions; the offer draft is logged for MITC-consistency review.
- **Feasibility (panel view):** feasibility high on summary data. Hardest part is cleanly separating revolve-loss from attrition. **Disagreement:** compliance adviser warns against pushing customers to revolve for yield — the framing must be "offer a fair structured option", not "increase debt"; marketing PM accepts this as the only defensible demo framing.

---

### UC-GEMINI-A5 — Activation-decay monitor against the RBI 30+7 closure clock
- **Archetype:** other (acquisition ROI / conduct)
- **Bucket:** A
- **Signal (one line):** A sourcing batch's activation curve is tracking below baseline and a material share will hit the RBI unactivated-closure deadline, stranding CAC.
- **Cadence / trigger:** daily morning brief, with a countdown view
- **Primary user → routed executive:** PM → Head of Cards (Conduct cc'd)

- **1. Data aggregation:**
  - Summary inputs: activation events (PIN-set / first-use) by sourcing batch, issuance date, product, BIN; CAC by channel.
  - Interaction-side: activation-friction language ("can't set PIN", "card not working", onboarding-app complaints) that explains *why* a batch is not activating.

- **2. Baseline creation:**
  - Baseline activation-by-day-since-issuance per product × channel × BIN. "Normal" is the typical activation S-curve for that batch type. The RBI rule (close unactivated within 30 days plus a 7-day grace) is encoded as a hard deadline overlay, not a soft pattern.

- **3. Dynamic detection:**
  - Deviation where a batch's cumulative activation at day-N sits below its baseline curve, projected forward to estimate how many cards will cross day-37 unactivated. Activation-friction complaint spikes flag a fixable cause vs simple disinterest.

- **4. Distillation:**
  - Suppressed: batches on or above curve, and slow curves that will still clear the deadline. The signal that matters is the batch with the largest count projected to be force-closed. Ranking: cards at risk of closure, ₹ CAC stranded, days remaining, presence of a fixable friction cause.

- **5. Surfacing & routing:**
  - Headline ("Co-brand batch #4471: ~6,200 cards projected unactivated at day-37; ₹ CAC at risk"); **hero element** is the activation-curve-vs-baseline with the day-37 closure line and a countdown; recommended action (targeted activation nudge, fix the PIN-set flow if friction is the cause); draft activation campaign + a tech ticket if friction is detected. Human gate explicit.

- **Why it beats a self-built dashboard:** a dashboard shows an activation percentage; it does not project against a regulatory deadline per batch, nor connect the shortfall to a fixable onboarding-friction cause. LiSN turns a Rising-importance KPI into a dated, actionable countdown with a root cause attached.
- **Differentiation:** transaction/summary-visible, with interaction cause-finding.
- **Worked example:** Batch #4471 (18,000 co-brand cards) activates at day-20 at 58% vs an 71% baseline; projection says ~6,200 will be unactivated at day-37. Onboarding-app "can't set PIN" complaints in that batch are up sharply, pointing to a broken flow rather than disinterest. CAC at risk ₹93 lakh `[illustrative]`. LiSN surfaces on day-20; tech fixes the flow, activation drafts go out, force-closures fall to ~900.
- **Regulatory / governance hook:** directly operationalises the RBI unsolicited/unactivated-card closure mandate; the countdown and actions are auditable evidence of fair conduct.
- **Feasibility (panel view):** feasibility high. SLM role is projection-narrative and ticket drafting. **Disagreement:** none material; all four rate this a clean compliance-plus-ROI win, which makes it a strong demo candidate.

---

### UC-GEMINI-A6 — Attrition early-warning under network portability
- **Archetype:** attrition & churn
- **Bucket:** A
- **Signal (one line):** A high-value cohort's pre-attrition behaviour (spend decay + closure-intent language) has broken above baseline before accounts actually close.
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Cards (Retention)

- **1. Data aggregation:**
  - Summary inputs: spend trend, top-of-wallet share proxy, balance run-down, card-closure and network-portability events.
  - Interaction-side: cancellation-intent language, "better card elsewhere", reward-devaluation complaints, competitor-mention density.

- **2. Baseline creation:**
  - Baseline a pre-attrition score per cohort × vintage × product from spend-decay slope plus closure-intent language rate. "Normal" is the cohort's stable churn-precursor level. Network-portability mandate encoded as a structural elevator of switching ease (the file flags portability as a Rising churn driver).

- **3. Dynamic detection:**
  - Deviation where the composite precursor (declining spend + rising intent language) exceeds the cohort baseline ahead of actual closures — the lead the file says is lost today because funnel and authorisation data sit apart.

- **4. Distillation:**
  - Suppressed: seasonal spend dips, and dormant-by-design cohorts. The signal that matters is the highest-LTV cohort with the steepest precursor break. Ranking: ₹ LTV at risk, cohort size, lead-time before projected closure, intent-language confidence.

- **5. Surfacing & routing:**
  - Headline ("Premium-travel cohort pre-attrition up; ~₹X LTV at risk, ~5-week lead"); **hero element** is the precursor-vs-baseline trend with projected closure window; recommended action (targeted retention / reward fix); draft retention offer. Human gate explicit.

- **Why it beats a self-built dashboard:** churn dashboards are retrospective — they count closed accounts. LiSN reads the precursor weeks ahead by combining spend decay with closure-intent language, a join a single-domain dashboard cannot form, and prioritises by LTV rather than leaving the PM to scan cohorts.
- **Differentiation:** requires light transaction × voice blend for full lead-time (sits on the A/B boundary; lead signal is spend-side, intent language sharpens it).
- **Worked example:** A 15,000-card premium-travel cohort shows spend down 12% over a month with "lounge access removed, switching" mentions up 40% after a reward change. LTV at risk ₹4.6 crore `[illustrative]`, ~5-week lead before the closure wave. LiSN surfaces it; retention restores a benefit for the cohort; projected closures fall by ~60%.
- **Regulatory / governance hook:** retention pricing and reward changes must respect RBI reward-parity (RuPay-UPI) and transparent-MITC expectations; offer logged.
- **Feasibility (panel view):** feasibility moderate; the intent-language extraction is the work. **Disagreement:** the anomaly-platform PM warns intent language is noisy and wants spend-decay to carry the alert with language as confidence-booster, not trigger — adopted.

---

### UC-GEMINI-A7 — Interchange-yield compression watch on RuPay-UPI volume
- **Archetype:** other (unit economics)
- **Bucket:** A
- **Signal (one line):** Transaction velocity is up but blended interchange yield has fallen below baseline because the mix has tilted to MDR-capped RuPay-UPI low-ticket spend.
- **Cadence / trigger:** weekly
- **Primary user → routed executive:** PM → Head of Cards (Finance cc'd)

- **1. Data aggregation:**
  - Summary inputs: spend volume and count by MCC × channel (POS / CNP / UPI-on-credit), ticket-size distribution, blended interchange/MDR yield, merchant-size band where available.
  - Interaction-side: none required (transaction-economics block).

- **2. Baseline creation:**
  - Baseline blended yield per product × channel × MCC × ticket-band. "Normal" encodes the expected RuPay-UPI MDR reality from the file (0% for small merchants, ~1.1–2% for larger), so a yield fall driven purely by healthy UPI growth is expected, while an *unexpected* yield fall is flagged.

- **3. Dynamic detection:**
  - Deviation where blended yield drops below its baseline beyond what the volume-mix shift alone explains — i.e. the model decomposes the yield fall into "expected from mix" vs "unexplained", and only the unexplained excess is surfaced.

- **4. Distillation:**
  - Suppressed: the structurally expected UPI-mix yield drag. The signal that matters is the unexplained yield leak — a misrouted MCC, an MDR mis-slab, a merchant mis-banded. Ranking: ₹ yield leaked, volume in the cell, explainability gap.

- **5. Surfacing & routing:**
  - Headline ("Grocery-MCC UPI-on-credit yield 18bps below mix-adjusted baseline — ₹X/week leak"); **hero element** is the expected-vs-actual yield decomposition; recommended action (review MCC routing / MDR slab); draft query to processor/Finance. Human gate explicit.

- **Why it beats a self-built dashboard:** a dashboard shows yield falling and the PM cannot tell whether it is the known UPI-mix drag or a genuine leak. LiSN separates structural from anomalous, which is exactly the maths a hand-built chart cannot encode and the reason the PM otherwise misreads a healthy mix-shift as a problem (or misses a real leak inside it).
- **Differentiation:** transaction-visible.
- **Worked example:** Volume on grocery-MCC UPI-on-credit rises 30%; blended yield falls 18bps below the mix-adjusted baseline — traced to a merchant cohort wrongly slabbed as small-merchant 0% MDR. Leak ₹14 lakh/week `[illustrative]`. LiSN surfaces it; Finance corrects the slab.
- **Regulatory / governance hook:** RuPay-UPI MDR and reward-parity regime is India-specific; corrections must stay within the cap rules, logged for audit.
- **Feasibility (panel view):** feasibility high on summary tables. Hardest part is a reliable merchant-size band. **Disagreement:** none material.

---

### UC-GEMINI-A8 — Reward cost-of-points anomaly under RuPay-UPI parity
- **Archetype:** campaign-to-complaint / other (loyalty cost)
- **Bucket:** A
- **Signal (one line):** Cost-of-points per ₹ of incremental spend has broken above baseline in a cohort, inflated by the RuPay-UPI reward-parity mandate on low-value velocity.
- **Cadence / trigger:** monthly, event-triggered on reward-rule change
- **Primary user → routed executive:** PM → Head of Cards

- **1. Data aggregation:**
  - Summary inputs: reward accrual/redemption expense by product × MCC × channel, incremental spend attribution, reward-rule/parity events.
  - Interaction-side: reward-confusion and "points not credited" complaints (operational-cost corroboration; bridges to B3).

- **2. Baseline creation:**
  - Baseline cost-of-points / incremental-₹ per cohort × MCC × channel, with the RuPay-UPI parity mandate encoded as a known cost elevator so a parity-driven rise is expected and an *excess* over that is flagged.

- **3. Dynamic detection:**
  - Deviation where reward cost per incremental ₹ exceeds the parity-adjusted baseline — i.e. points are being paid on velocity that is not generating incremental margin (reward leakage on UPI micro-spends).

- **4. Distillation:**
  - Suppressed: the expected parity cost step. The signal that matters is the cohort-MCC where reward spend most outruns incremental value. Ranking: ₹ reward leakage, spend volume, incrementality confidence.

- **5. Surfacing & routing:**
  - Headline ("Fuel-MCC UPI rewards costing ₹X per ₹1 incremental — 2.3× baseline"); **hero element** is reward-cost-vs-incremental-value gauge; recommended action (cap or re-tier rewards on that MCC within parity rules); draft loyalty change. Human gate explicit.

- **Why it beats a self-built dashboard:** loyalty cost on a dashboard is a flat monthly contra-revenue line; it does not isolate the MCC-channel where parity-mandated rewards on micro-spend destroy margin. LiSN's incrementality-relative baseline finds the leakage a static chart averages away.
- **Differentiation:** transaction-visible, complaint-corroborated.
- **Worked example:** After parity is applied, fuel-MCC UPI micro-spends accrue rewards at 2.3× the incremental-margin baseline; reward leakage ₹26 lakh/month `[illustrative]`. LiSN surfaces it; loyalty re-tiers within parity limits.
- **Regulatory / governance hook:** any re-tier must preserve RuPay-UPI vs physical-card reward parity (India-specific); change logged for compliance.
- **Feasibility (panel view):** feasibility moderate; incrementality attribution is the hard part. **Disagreement:** marketing PM resists reward cuts as churn-risk; compliance adviser notes parity must hold either way — net effect is a re-tier, not a cut, surfaced as the safe action.

---

## BUCKET B — Net-new use cases from cards-transaction × complaint/interaction joins

---

### UC-GEMINI-B1 — Decline spike × rage-click/complaint correlation (the BIN-rule misfire)
- **Archetype:** fraud-rule misfire / curable-decline intelligence
- **Bucket:** B
- **Signal (one line):** A transaction-side decline anomaly and an interaction-side "card declined" complaint spike are time-aligned to the same BIN range — naming the misconfigured rule as root cause.
- **Cadence / trigger:** real-time
- **Primary user → routed executive:** PM → Head of Cards / Head of Risk (Tech if rule-config is the cause)

- **1. Data aggregation:**
  - Transaction-side: decline events with reason codes, BIN, MCC, channel; fraud-rule change events; tokenisation status.
  - Interaction-side: app rage-click / checkout-abandon telemetry, "card declined / payment failed" mentions in calls/chats/app feedback, with extracted intent, affected-card BIN where stated, and sentiment.

- **2. Baseline creation:**
  - Two baseline families: transaction-side decline-rate baselines (per BIN × MCC × channel × hour-of-week) and interaction-side complaint-rate baselines (per topic × product × hour-of-week). Both maintained continuously so each side has its own "normal".

- **3. Dynamic detection:**
  - The **cross-domain correlation**: when both sides breach baseline within the same short window and resolve to the same BIN range, LiSN computes a time-aligned correlation and treats the co-movement as a single root-caused event rather than two unrelated alerts. A transaction spike with no matching voice spike is likely a counting artefact; a voice spike with no decline spike is likely UX/perception — only the join produces "rule misfire on this BIN, confirmed by the people it hit".

- **4. Distillation:**
  - Suppressed: either-side-only moves, seasonal bands, and immaterial BINs. The one signal that matters is the BIN where both curves break together with the largest combined ₹ and customer impact. Ranking: combined abnormality, ₹ good-spend declined, cards/customers complaining, regulatory-escalation risk, curability.

- **5. Surfacing & routing:**
  - Headline ("New co-brand RuPay BIN 6521-xx: declines +210bps AND 'card declined' complaints +400%, same 90-min window — fraud rule #R-118 changed 09:40"); **hero element** is the dual-curve correlation evidence band showing both lines breaking together on one BIN; impact (₹ declined + customers affected); recommended action (revert R-118 for that BIN); draft rule-revert ticket + a holding message for affected customers. Human gate explicit; LiSN never reverts the rule itself.
- **Why it is impossible without the join:** transaction-only tooling sees a decline spike with no idea customers are in pain on that exact BIN; contact-centre-only tooling sees angry calls with no decline data to attribute them. Only joining the two converts "declines are up somewhere" + "people are angry about something" into "rule R-118 is misfiring on this co-brand BIN, here are the rupees and the customers". The file names this exact scenario — a misconfigured BIN-range rule causing soft declines on a new co-branded RuPay card — as the LTV-destroying case nobody catches in time.
- **Why it beats a self-built dashboard:** the PM cannot wire app telemetry, voice transcripts and switch logs into one continuously-baselined join; the file rates this the "Extreme / hardest join in banking". The root cause arrives with the alert, in minutes not days.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** 09:40 rule R-118 tightened. 09:55–11:25: BIN 6521-xx (48,000-card new RuPay co-brand) declines +210bps on reason 3.10; simultaneously app "payment failed" rage-clicks +350% and contact-centre "card declined" calls +400% for that BIN. ₹62 lakh good-spend declined, ~1,900 customers in friction `[illustrative]`. LiSN fires the joined card at 11:05; PM approves the revert; resolved by 11:40 — versus the file's status quo where the root cause is found manually "by the time immense LTV has already been destroyed and customers have migrated".
- **Regulatory / governance hook:** wrongful-decline conduct exposure under RBI fair-treatment and the Authentication Directions 2025 liability frame; the joined evidence band is the auditable explanation of what failed, whom it hit and how fast it was fixed — strong Internal Ombudsman pre-emption.
- **Feasibility (panel view):** the architect calls the time-alignment and BIN-resolution across structured ISO 8583 and unstructured voice the hard core — an SLM extracts BIN/intent/sentiment from interactions, the baseline+correlation engine does the join. False-positive risk is *lower* than single-domain because dual-confirmation is itself the noise filter. **Disagreement:** marketing PM wants the dual-curve as the signature demo; compliance adviser agrees but insists the customer-holding-message draft never goes out without human approval and DPDP-safe content — built in as the human gate.

---

### UC-GEMINI-B2 — Hidden-fee Ombudsman escalation × billing-event × MITC join
- **Archetype:** conduct & grievance / authentication-liability
- **Bucket:** B
- **Signal (one line):** A cluster of "hidden fee" complaints time-aligns to a specific billing/fee event and a specific MITC-disclosure gap — distinguishing a systemic billing error from isolated misunderstanding before it reaches the Ombudsman.
- **Cadence / trigger:** event-triggered on IO escalation; daily sweep for precursor clusters
- **Primary user → routed executive:** PM → Head of Conduct (Internal Ombudsman desk)

- **1. Data aggregation:**
  - Transaction-side: fee/charge posting events (annual fee, penal charge, instance fees), billing-cycle events, the product-rule/MITC config that drove each charge.
  - Interaction-side: complaint/call/chat/email text mentioning "hidden fee / surprise charge / not told", Internal Ombudsman registry entries, app-store reviews citing fees.

- **2. Baseline creation:**
  - Baseline "fee-grievance" complaint rate per product × fee-type × billing-cycle, and a baseline of which fee events historically generate disclosure complaints. "Normal" is the expected grievance hum per fee type; deviation flags a systemic break.

- **3. Dynamic detection:**
  - **Cross-domain correlation**: align the grievance cluster to the exact fee-posting event and the MITC clause that governs it. If the spike maps to one fee event affecting one cohort and the MITC disclosure for that clause is weak or recently changed, the signal is "systemic disclosure failure"; if grievances are scattered across fee types and cohorts, it is "isolated misunderstanding" — the file's exact three-way distinction.

- **4. Distillation:**
  - Suppressed: baseline fee grumbling, and one-off complaints with no event cluster. The signal that matters is the single fee event with a grievance cluster and a disclosure gap. Ranking: complaint cluster size, ₹ fees in scope (refund/redress exposure), regulatory-escalation risk, MITC-gap confidence.

- **5. Surfacing & routing:**
  - Headline ("Penal-charge event on 12 Jun → 340 'hidden fee' complaints in 48h, all cohort X, MITC clause 7 disclosure changed 1 Jun"); **hero element** is the fee-event-to-grievance correlation with the implicated MITC clause; impact (₹ fees in scope + customers); recommended action (proactive reversal/redress for the cohort, MITC fix); draft redress list + corrected-disclosure requirement. Human gate explicit.
- **Why it is impossible without the join:** the billing system records a correctly-executed charge; the complaint system records anger; neither alone can say "this charge was technically valid but inadequately disclosed to this cohort". Section B marks the IO-escalation diagnosis a "High" stitch across CRM, statements and core product rules; only the join times the grievance to the event and the clause.
- **Why it beats a self-built dashboard:** a complaints dashboard counts "hidden fee" tickets; it cannot attribute them to a fee event and an MITC clause, which is what turns a count into a fix. LiSN pre-empts the Ombudsman escalation rather than reacting to it.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** A penal-charge rule fires on 12 Jun for a ~7,000-card cohort; within 48h, 340 "I was never told" complaints cluster, all that cohort; the MITC clause governing the charge was edited 1 Jun with weaker language. ₹19 lakh in penal charges in scope `[illustrative]`. LiSN surfaces the systemic read; Conduct approves a proactive reversal and an MITC correction before the IO registry escalates.
- **Regulatory / governance hook:** directly engages the RBI Internal Ombudsman regime, penal-charge directions and MITC-disclosure conduct rules (India-specific); the joined evidence is the auditable basis for proactive redress, which the IO framework rewards.
- **Feasibility (panel view):** hardest part is reliably mapping a complaint to the specific MITC clause — needs the product-rule config exposed as an event. SLM classifies "disclosure-failure vs misunderstanding" language. **Disagreement:** compliance adviser wants the systemic/isolated call made conservatively (err toward systemic, redress proactively); marketing PM agrees redress beats an Ombudsman finding commercially.

---

### UC-GEMINI-B3 — Campaign-to-complaint and cannibalisation join
- **Archetype:** campaign-to-complaint
- **Bucket:** B
- **Signal (one line):** A live campaign is simultaneously cannibalising existing spend *and* generating a complaint cluster (reward-not-credited, terms-confusion) — the two read together kill or fix the campaign mid-flight.
- **Cadence / trigger:** event-triggered at campaign launch, daily through the campaign window
- **Primary user → routed executive:** PM → Head of Cards (Marketing)

- **1. Data aggregation:**
  - Transaction-side: campaign/offer events (who was targeted), spend by MCC × channel for targeted vs control, baseline pre-campaign spend, reward-accrual events.
  - Interaction-side: campaign-related complaints — "cashback not received", "terms unclear", "promo didn't apply" — in calls/chats/app/social, with sentiment.

- **2. Baseline creation:**
  - Baseline incremental-spend lift per offer type (targeted-vs-control uplift) and a baseline campaign-complaint rate per campaign type. Encodes expected promo-period complaint hum so a genuine fulfilment break stands out.

- **3. Dynamic detection:**
  - **Cross-domain correlation**: join the incrementality read (is spend net-new or shifted from POS to UPI?) to the complaint cluster (is the offer mis-firing operationally?). A campaign that looks successful on spend but throws a fulfilment-complaint spike is a hidden liability the spend chart hides; a campaign with flat incrementality and a complaint spike should be stopped.

- **4. Distillation:**
  - Suppressed: normal promo-period queries, and campaigns hitting both incrementality and clean-fulfilment baselines. The signal that matters is the campaign failing on either axis with the largest ₹/cohort exposure. Ranking: ₹ cannibalised + reward leakage, complaint-cluster size, regulatory exposure (mis-selling), reversibility while live.

- **5. Surfacing & routing:**
  - Headline ("Grocery 5% RuPay-UPI cashback: 80% of 'incremental' spend cannibalised from POS AND 'cashback not credited' complaints +260%"); **hero element** is the twin-axis campaign-health panel (incrementality bar + complaint curve); impact (₹ reward spent for no lift + customers mis-served); recommended action (pause, fix fulfilment, re-scope); draft change. Human gate explicit.
- **Why it is impossible without the join:** campaign systems measure attributed spend and marketing dashboards measure redemption; neither sees the contact-centre fulfilment break, and the transaction side cannot tell cannibalisation from incrementality without the baseline-vs-control join *and* cannot see the customer harm. The file's weekly question — "did the cashback drive net-new spend or cannibalise POS?" — is exactly this, and it adds the complaint axis no campaign tool carries.
- **Why it beats a self-built dashboard:** a self-built campaign dashboard shows redemptions climbing and declares success; it cannot simultaneously prove the spend was shifted not created and that customers are not being paid their cashback. LiSN reads both mid-flight, in time to stop the bleed.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** A 5% grocery RuPay-UPI cashback targets 120,000 cards. Targeted-vs-control shows only 20% of the "lift" is net-new; 80% is POS spend re-routed to UPI (lower-yield) — a yield-negative outcome — while "cashback not credited" complaints rise 260% from a fulfilment bug. Reward spend with no incremental margin ₹41 lakh; mis-served customers ~3,100 `[illustrative]`. LiSN surfaces on day 3; Marketing pauses, fixes fulfilment, re-targets to true incremental cohorts.
- **Regulatory / governance hook:** unfulfilled promotional promises and reward-parity rules engage RBI conduct and fair-advertising expectations (India-specific RuPay-UPI parity); the corrected campaign and redress are logged.
- **Feasibility (panel view):** incrementality-vs-control is the analytic core; complaint clustering is the SLM's job. **Disagreement:** marketing PM is loath to kill a campaign mid-flight on early data — anomaly-platform PM insists the complaint axis is the tie-breaker the spend chart lacks, and that fulfilment breaks alone justify a pause even if incrementality is still ambiguous.

---

### UC-GEMINI-B4 — False-decline × broken-app-control correlation
- **Archetype:** authentication-liability / curable-decline intelligence
- **Bucket:** B
- **Signal (one line):** A rise in cross-border/CNP declines time-aligns to a complaint cluster naming a specific broken app control (e.g. the international-limit toggle), pinning the decline cause to a UX defect, not fraud.
- **Cadence / trigger:** real-time / daily
- **Primary user → routed executive:** PM → Head of Tech / Head of Cards

- **1. Data aggregation:**
  - Transaction-side: decline events (cross-border, CNP), reason codes, the customer-control state where available (limit/toggle settings), channel.
  - Interaction-side: complaints/chats naming a specific control — "international toggle won't turn on", "can't raise my limit in the app" — with the feature named and sentiment.

- **2. Baseline creation:**
  - Baseline cross-border/CNP decline rate per cohort × channel, and a baseline complaint rate per app-feature. Both continuous.

- **3. Dynamic detection:**
  - **Cross-domain correlation**: when declines for a control-gated transaction type rise and complaints naming that control spike together, LiSN attributes the declines to the broken control rather than to genuine risk — the file's literal example of customers calling that "the app's international-limit toggle is broken" while cross-border declines climb.

- **4. Distillation:**
  - Suppressed: decline rises matched by genuine fraud catch, and feature-complaints with no decline co-movement. The signal that matters is the control whose breakage is provably causing good declines. Ranking: ₹ good-spend declined, customers blocked, fix-effort, conduct risk.

- **5. Surfacing & routing:**
  - Headline ("Cross-border declines +160bps AND 'international toggle broken' complaints +300%, same cohort/window"); **hero element** is the decline-curve-meets-feature-complaint band naming the control; impact (₹ blocked spend + customers); recommended action (hotfix the toggle, temporarily relax the gate); draft tech ticket + holding comms. Human gate explicit.
- **Why it is impossible without the join:** the switch records a clean decline; the digital team sees a funnel drop; only joining the decline data to the feature-named complaints proves the decline is a UX defect, not risk. The file states this split explicitly — "digital product teams review funnel drop-off; portfolio managers review authorisation rates" in total isolation.
- **Why it beats a self-built dashboard:** no card dashboard ingests app-feature complaint text; the PM cannot connect "toggle broken" tickets to authorisation declines. LiSN does, and routes a tech fix with the rupees attached.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** An app release breaks the international-limit toggle. Cross-border declines for the affected cohort (~11,000 cards) rise 160bps; "international toggle broken / can't enable" complaints +300% in 24h. ₹38 lakh good cross-border spend blocked `[illustrative]`. LiSN fires the joined signal; Tech hotfixes; gate relaxed for the cohort until the fix ships.
- **Regulatory / governance hook:** wrongful declines from a defective control are an RBI conduct exposure and an Authentication-Directions-2025 liability question; joined evidence is the audit record.
- **Feasibility (panel view):** feasibility good if app-feature names are extractable from complaints — the SLM's task. **Disagreement:** architect notes control-state data may be missing from the decline feed; if so the complaint side carries more weight, which the anomaly-platform PM accepts given the feature-named language is high-precision.

---

### UC-GEMINI-B5 — Fraud-rule misfire × social-media complaint-surge attribution
- **Archetype:** fraud-rule misfire / conduct & grievance
- **Bucket:** B
- **Signal (one line):** A public social/app-store complaint surge time-aligns to an internal fraud-rule change and a decline pattern — attributing reputational damage to a specific rule edit.
- **Cadence / trigger:** real-time for social; event-triggered on fraud-rule change
- **Primary user → routed executive:** PM → Head of Risk / Head of Conduct (Comms cc'd)

- **1. Data aggregation:**
  - Transaction-side: fraud-rule change events, decline events by BIN/MCC/channel.
  - Interaction-side: X/Reddit/app-store volume and sentiment mentioning the issuer + "card declined / blocked / embarrassing", with virality/reach signals.

- **2. Baseline creation:**
  - Baseline social-complaint volume and sentiment per platform × topic, plus the decline baselines from A1. Encodes normal social hum and known event spikes.

- **3. Dynamic detection:**
  - **Cross-domain correlation**: align a social-surge breach to the nearest fraud-rule change and the decline pattern it produced. A social surge that maps to a rule edit + a decline spike is "self-inflicted reputational event"; a surge with no internal correlate is external/PR and routed differently.

- **4. Distillation:**
  - Suppressed: organic social noise, and decline moves with no public spillover. The signal that matters is the rule change with both a decline footprint and a reputational surge. Ranking: reach/virality, ₹ and cards in the decline footprint, sentiment severity, escalation risk.

- **5. Surfacing & routing:**
  - Headline ("Rule #R-204 (06:00) → declines on travel-MCC +180bps → X/app-store complaint surge, reach ~2.1L"); **hero element** is the rule-to-declines-to-social cascade band; impact (reach + ₹ declined); recommended action (revert/re-tune + coordinated comms); draft revert ticket + comms brief. Human gate explicit.
- **Why it is impossible without the join:** social-listening tools see a surge but cannot attribute it to an internal rule; risk tools see a rule and declines but not the public blast radius. Only the join says "your 06:00 rule edit is trending against you, here is the spend it blocked". The file flags social-and-call-centre-surge-to-transaction-anomaly mapping as one of the hardest, never-made joins.
- **Why it beats a self-built dashboard:** a PM cannot wire social reach to fraud-rule events and decline patterns continuously; LiSN delivers attribution + blast radius + draft response together.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** Rule R-204 fires 06:00, over-blocking a popular travel-MCC; by 09:00 declines there are +180bps and a viral thread plus app-store 1-star reviews reach ~210,000 impressions. ₹47 lakh travel spend blocked `[illustrative]`. LiSN surfaces the cascade; Risk reverts, Comms responds with the facts LiSN supplied.
- **Regulatory / governance hook:** reputational-conduct and fair-treatment exposure; auditable cascade evidence supports both the rule-governance log and any RBI conduct query.
- **Feasibility (panel view):** social ingestion and reach scoring are mature; the attribution window is the design choice. **Disagreement:** compliance adviser warns against over-attributing organic social noise to internal rules (false blame on Risk); mitigated by requiring the decline-footprint co-movement before attribution.

---

### UC-GEMINI-B6 — Switch/processor-incident × voice-spike attribution
- **Archetype:** switch-incident attribution
- **Bucket:** B
- **Signal (one line):** A contact-centre/app failure-call spike time-aligns to a switch/processor health degradation and a decline pattern — confirming a tech incident and its customer blast radius in one read.
- **Cadence / trigger:** real-time
- **Primary user → routed executive:** PM → Head of Tech / Head of Ops (Head of Cards informed)

- **1. Data aggregation:**
  - Transaction-side: switch/processor health signals, technical-decline/timeout codes, approval-rate drop by acquirer/processor, tokenisation-status failures.
  - Interaction-side: "payment failed / declined / app not working" call and chat spike, app rage-click telemetry.

- **2. Baseline creation:**
  - Baseline technical-decline/timeout rate per processor × channel × hour-of-week, plus interaction failure-call baselines. Continuous.

- **3. Dynamic detection:**
  - **Cross-domain correlation**: when processor health degrades, technical declines rise, and failure-calls spike within the same window, LiSN binds them into one incident with a quantified customer blast radius — separating a genuine outage from a routine decline wobble.

- **4. Distillation:**
  - Suppressed: isolated processor blips with no customer footprint, and call spikes with no technical correlate. The signal that matters is the processor-incident with the largest joined ₹-and-customer impact. Ranking: ₹ failed throughput, customers affected, duration, processor identity.

- **5. Surfacing & routing:**
  - Headline ("Processor B timeouts ↑, technical declines +320bps, failure-calls +500% — incident live, ~14,000 customers"); **hero element** is the processor-health-to-voice-spike incident band with live blast radius; impact (₹ throughput at risk + customers); recommended action (failover, status-page, holding comms); draft incident ticket + comms. Human gate explicit.
- **Why it is impossible without the join:** processor health tools see latency; the card team sees declines; the contact centre sees angry calls — three rooms, one incident. Only the join quantifies "this processor degradation is hurting this many customers right now", which is what turns a tech metric into a business-prioritised incident.
- **Why it beats a self-built dashboard:** a self-built health dashboard shows latency but not customer harm; LiSN attaches the voice-confirmed blast radius and routes failover with rupees attached, continuously, not on a morning check.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** Processor B degrades 13:10; technical declines +320bps on its acquirer set; failure-calls +500% and app rage-clicks surge; ~14,000 customers hit, ₹1.9 crore throughput at risk in 40 minutes `[illustrative]`. LiSN binds the incident at 13:18; Ops triggers failover, Tech opens the bridge, Comms posts a status update — far ahead of a manual correlation.
- **Regulatory / governance hook:** RBI operational-resilience and outage-reporting expectations; the joined incident timeline is auditable evidence of detection-to-response latency.
- **Feasibility (panel view):** feasibility high where processor health pings are available as a feed; the file lists switch/processor health among consumable signals. **Disagreement:** none material — all four rate this a clear, high-trust incident-attribution win.

---

### UC-GEMINI-B7 — Authentication-failure liability × failed-auth complaint join
- **Archetype:** authentication-liability / conduct & grievance
- **Bucket:** B
- **Signal (one line):** A rise in authentication failures (OTP/2FA/CoFT-token) time-aligns to "couldn't authenticate / OTP never came" complaints, surfacing a liability-bearing auth defect before disputes land.
- **Cadence / trigger:** real-time / daily
- **Primary user → routed executive:** PM → Head of Risk / Head of Conduct (Tech for the auth stack)

- **1. Data aggregation:**
  - Transaction-side: authentication-step events (OTP issuance/success/failure), CoFT tokenisation status and token-provisioning failures, step-up-auth decline codes, channel.
  - Interaction-side: "OTP not received", "couldn't complete payment", "transaction failed at verification" complaints, with channel and merchant where stated.

- **2. Baseline creation:**
  - Baseline auth-failure rate per channel × auth-method × merchant-type, plus the matching complaint baseline. Continuous; festival/load patterns encoded.

- **3. Dynamic detection:**
  - **Cross-domain correlation**: bind an auth-failure breach to the auth-complaint breach on the same method/channel. The join distinguishes a genuine auth-stack defect (OTP gateway, token provisioning) from a single-merchant integration issue, and flags the liability exposure each carries.

- **4. Distillation:**
  - Suppressed: baseline auth friction and load-driven blips. The signal that matters is the auth-method/channel with a joined failure-and-complaint break and the highest liability exposure. Ranking: ₹ at risk, customers blocked, liability-shift exposure under the 2025 directions, fix-locus (issuer vs merchant).

- **5. Surfacing & routing:**
  - Headline ("OTP success rate −9pts on CNP AND 'OTP never arrived' complaints +380% — gateway X, liability exposure flagged"); **hero element** is the auth-failure-to-complaint band with the liability tag; impact (₹ + customers); recommended action (failover OTP route / token re-provision); draft tech ticket + dispute-pre-empt note. Human gate explicit.
- **Why it is impossible without the join:** auth logs show failures as technical events; the dispute system sees them weeks later as chargebacks; the contact centre hears them live. Only joining live auth failures to live complaints catches the defect in the window where it can be fixed and the liability contained.
- **Why it beats a self-built dashboard:** a PM has no view that fuses OTP/token telemetry with auth-complaint text; LiSN provides it continuously and tags the liability dimension the 2025 directions make material.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** An OTP-gateway change drops CNP OTP success by 9 points; "OTP never came" complaints +380% over 6 hours; ~8,500 customers blocked, ₹54 lakh in stalled CNP spend, with liability exposure if any failed-auth transaction is later disputed `[illustrative]`. LiSN surfaces the join; Tech fails over to the backup OTP route; Conduct pre-empts disputes.
- **Regulatory / governance hook:** RBI Authentication Mechanisms Directions 2025 (liability allocation) and CoFT tokenisation rules — India-specific and central; the join is the auditable evidence of who-failed-and-when for liability defence.
- **Feasibility (panel view):** needs auth-step events and token-status as a feed; the file lists tokenisation status among consumable inputs. SLM extracts auth-failure complaint intent. **Disagreement:** compliance adviser wants the liability tag conservative and clearly labelled "indicative, pending dispute realisation" to avoid over-claiming at audit; adopted.

---

### UC-GEMINI-B8 — Hardship-language × roll-rate pre-delinquency early warning
- **Archetype:** hardship & roll-rate / conduct & grievance
- **Bucket:** B
- **Signal (one line):** A cohort's hardship language in voice/chat is rising ahead of its roll-rate baseline break — a pre-delinquency lead the transaction side cannot see until accounts are already rolling.
- **Cadence / trigger:** weekly, with a daily hardship-cluster sweep
- **Primary user → routed executive:** PM → Head of Risk / Head of Collections (Conduct for fair-treatment)

- **1. Data aggregation:**
  - Transaction-side: roll-rate summaries, minimum-due-payment behaviour, receivables and utilisation by cohort, EMI-conversion requests.
  - Interaction-side: hardship language — "lost my job", "can I pay less this month", "struggling", balance-transfer and EMI-conversion enquiries — with cohort and sentiment.

- **2. Baseline creation:**
  - Baseline hardship-language density per cohort × vintage, and the matched roll-rate baseline from A3. The leading relationship (language leads roll) is learned per cohort.

- **3. Dynamic detection:**
  - **Cross-domain correlation**: when hardship-language density breaks above baseline in a cohort while roll rate is still on-curve, LiSN flags a pre-delinquency lead — the voice side predicting the roll the transaction side will only confirm later. The combination is the signal; language alone is noisy, roll alone is lagging.

- **4. Distillation:**
  - Suppressed: generic grumbling, and roll moves already visible (those route to A3). The signal that matters is the cohort with the steepest hardship-language lead and the largest receivables exposure. Ranking: ₹ receivables at risk, lead-time, language confidence, cohort size.

- **5. Surfacing & routing:**
  - Headline ("Self-employed Tier-2 cohort: hardship language +45% vs baseline, roll still flat — ~4-week pre-delinquency lead, ₹X receivables"); **hero element** is the language-leads-roll dual-trend with the projected roll-break window; impact (₹ receivables + accounts); recommended action (proactive restructure/EMI offer within fair-treatment rules); draft outreach list. Human gate explicit.
- **Why it is impossible without the join:** roll-rate data is definitionally lagging — it confirms stress after it starts. The hardship signal lives only in unstructured voice/chat, which collections systems do not mine against transaction cohorts. Only the join converts "people in this cohort are starting to say they are struggling" into "this receivables pool will roll in ~4 weeks unless we act".
- **Why it beats a self-built dashboard:** a roll dashboard cannot lead its own metric; LiSN reads the precursor in language the dashboard never ingests and prioritises by receivables at risk.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** A self-employed Tier-2 cohort (~12,000 cards, ₹140 crore receivables) shows hardship language +45% over two weeks while roll stays flat; the learned lead says roll breaks in ~4 weeks. LiSN surfaces it; Collections approves a proactive restructure offer for the cohort; modelled charge-off avoided ₹3.1 crore `[illustrative]`.
- **Regulatory / governance hook:** RBI fair-treatment and collections-conduct expectations make *proactive, non-coercive* hardship outreach defensible; the logged language-evidence and the fair-offer draft are the audit basis. DPDP: hardship language is sensitive — consent-scoped use and access controls required.
- **Feasibility (panel view):** the architect rates hardship-language extraction the hardest NLP task here (irony, indirect phrasing); the SLM must be tuned and the lead validated before it drives outreach. **Disagreement (sharpest in the catalogue):** compliance adviser is wary that acting on inferred hardship could be intrusive or could itself trigger DPDP/conduct concerns; the anomaly-platform PM counters that *withholding* a known-stress restructure is the worse conduct outcome. Resolution proposed: surface as a fair-offer opportunity only, never as a risk-action against the customer, human-approved, consent-scoped.

---

### UC-GEMINI-B9 — Tokenisation-failure × "card declined" complaint join `[long-tail — preserve]`
- **Archetype:** switch-incident attribution / curable-decline intelligence
- **Bucket:** B
- **Signal (one line):** A CoFT token-provisioning or token-decline failure at a specific merchant/network time-aligns to "saved card not working" complaints — isolating a tokenisation defect from generic declines.
- **Cadence / trigger:** real-time / daily
- **Primary user → routed executive:** PM → Head of Tech / Head of Cards

- **1. Data aggregation:**
  - Transaction-side: tokenisation status events, token-provisioning success/failure, token-based decline codes by merchant/network/BIN.
  - Interaction-side: "saved card declined", "card on file not working", merchant-named payment-failure complaints.

- **2. Baseline creation:**
  - Baseline token-failure rate per merchant × network × BIN, plus the matched complaint baseline. Continuous.

- **3. Dynamic detection:**
  - **Cross-domain correlation**: bind a token-failure breach to merchant-named "saved card" complaints on the same merchant/network, distinguishing a tokenisation defect (issuer or network token-vault) from a customer-side or merchant-side issue.

- **4. Distillation:**
  - Suppressed: baseline token churn, and complaints with no token-failure correlate. The signal that matters is the merchant/network token defect with the largest recurring-spend exposure (token failures hit subscriptions and saved-card recurring spend hardest). Ranking: ₹ recurring spend at risk, cards affected, merchant prominence.

- **5. Surfacing & routing:**
  - Headline ("Token declines at Merchant Z +280% AND 'saved card not working' complaints clustered there — token-vault sync suspected"); **hero element** is the token-failure-to-complaint band by merchant; impact (₹ recurring spend + cards); recommended action (re-provision tokens / engage network); draft ticket. Human gate explicit.
- **Why it is impossible without the join:** a token decline looks like any decline in aggregate; only the merchant-named complaint cluster reveals it is a saved-card tokenisation defect concentrated at one merchant — invisible to transaction-only and contact-centre-only views alike.
- **Why it beats a self-built dashboard:** the PM cannot fuse token-status events with merchant-named complaint text; LiSN isolates the defect and the recurring-revenue at risk.
- **Differentiation:** **requires the txn × voice join — does not exist today.**
- **Worked example:** A token-vault sync issue at Merchant Z spikes token declines +280%; "saved card not working at Z" complaints cluster; ~5,400 cards, ₹22 lakh/month recurring spend at risk `[illustrative]`. LiSN surfaces it; Tech re-provisions, network engaged.
- **Regulatory / governance hook:** RBI CoFT tokenisation mandate (India-specific); auditable evidence of token-defect detection and remediation.
- **Feasibility (panel view):** needs token-status as a feed (the file lists it). SLM extracts merchant-named saved-card complaints. **Disagreement:** none material; flagged long-tail only because the source evidences tokenisation lightly, but the panel rates the mechanism sound.

---

## Panel Notes

### Sharpest disagreements across the catalogue

1. **Detection ambition vs conduct caution on hardship (B8).** The anomaly-platform PM and AI architect want to act on the language-leads-roll lead aggressively because it is the single highest-value early warning in the set. The compliance adviser warns that acting on *inferred* financial hardship risks being intrusive and engages DPDP sensitive-data and fair-conduct concerns. The catalogue resolves this only by constraining B8 to a *fair-offer, customer-benefit* action that is human-approved and consent-scoped — never a risk action taken against the customer. This is the disagreement most likely to recur across other hardship-adjacent use cases.

2. **Curability ranking vs regulatory-decline visibility (A1, A2).** The anomaly-platform PM wants curable, recoverable declines ranked highest because that is where rupees are rescued. The compliance adviser insists wrongful or discriminatory decline patterns must always surface even when not "curable" or commercially large, because suppressing them for being uninteresting is itself a conduct risk. Net rule adopted: a regulatory-escalation-risk input always floors a cell's rank so it cannot be distilled away.

3. **Mid-flight campaign kills (B3).** The marketing PM resists pausing live campaigns on early, ambiguous data; the anomaly-platform PM argues the complaint axis is precisely the tie-breaker that a spend-only view lacks, and that a fulfilment break alone justifies a pause regardless of incrementality. Tension left explicit in the block because it is a genuine product-vs-detection values clash, not a data problem.

4. **Attribution confidence on social and liability tags (B5, B7).** The compliance adviser repeatedly pulls toward conservative, clearly-labelled attribution — don't blame Risk for organic social noise (B5), don't over-claim auth liability before disputes realise (B7). The architect accepts dual-confirmation gating as the price of trust. The underlying disagreement is how much the platform should *assert* causation vs *present correlation* — resolved toward presenting a correlation evidence band and letting the human conclude.

### Five strongest UI candidates

1. **UC-GEMINI-B1 (Decline × rage-click/complaint correlation).** The signature dual-curve card — two lines breaking together on one BIN, root cause named — is the most visceral proof of the txn × voice join and maps to the file's own LTV-destroying example. It resonates because it answers the PM's hardest morning question before the PM has even asked it.

2. **UC-GEMINI-B6 (Switch-incident × voice-spike attribution).** A live incident with a voice-confirmed customer blast radius is instantly legible to any Head of Cards or Ops; the "₹ and customers, right now" framing beats any latency dashboard and is the easiest to trust because both signals are objective.

3. **UC-GEMINI-A2 (False-decline cost intelligence).** The 13×-cost anchor is a number cards executives already carry in their heads; a gauge showing "₹9 of good spend lost per ₹1 of fraud stopped" against that reference line lands immediately and reframes a fraud setting as a revenue-and-conduct decision.

4. **UC-GEMINI-A5 (Activation-decay vs the 30+7 clock).** A countdown to a regulatory force-closure deadline, per batch, with CAC-at-risk and a fixable cause attached, is both a clean compliance story and a clean ROI story — the rare card all four roles endorse without tension, which makes it the safest demo.

5. **UC-GEMINI-B2 (Hidden-fee Ombudsman pre-emption).** Pre-empting an Internal Ombudsman escalation by tying a grievance cluster to a fee event and an MITC clause is the use case that makes a Head of Conduct lean in; it converts a feared regulatory event into a controllable, proactively-redressed one, which is exactly the defensibility the RegTech lens prizes.

---

*Engine tag: GEMINI. Bucket A: 8 blocks. Bucket B: 9 blocks (one long-tail-preserved). Ready for mechanical merge with the Claude, Opus and GPT-5 runs.*