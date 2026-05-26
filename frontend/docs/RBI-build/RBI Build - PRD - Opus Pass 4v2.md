\# RBI Conduct Intelligence — PRD (Opus Pass 4v2)

\*\*Product:\*\* Fluid CX add-on — RBI Conduct Intelligence

\*\*Author:\*\* Opus product architect pass

\*\*Date:\*\* 25 May 2026

\*\*Source files:\*\* RBI Build Pass 1 + Inbound Addendum; Pass 2 + Inbound Addendum; Pass 3 + Inbound Addendum (all in My Drive > RBI Build)

\*\*Spine:\*\* Regulation → Obligation → Customer Interaction Signal → Control Owner → Evidence → Recommended Action

\---

\## 1. Product objective

RBI Conduct Intelligence is an add-on inside Fluid CX that converts the bank's recorded customer interactions into supervisable conduct evidence against the post-November 2025 RBI customer-conduct rulebook. It exists to give CROs, Heads of CX, and Heads of Customer a defensible answer to the 30 June 2026 IO Directions deadline and the 1 July 2026 RB-IOS cutover — moving conduct monitoring from 2–5% sample-based QA to 100% interaction coverage on the obligations Fluid is the primary control for, while honestly naming the obligations it is not.

\---

\## 2. Primary users / personas

| Persona | Real-world title | Buyer role | Daily user role |

|---|---|---|---|

| L4 | CRO / CCO / Head of Conduct Risk | PRIMARY BUYER — signs the cheque | Weekly: vendor scorecard, RCA preview, RB-IOS exposure brief |

| L3 | Head of CX / Head of Customer Service / Head of Contact Centre | Secondary buyer | PRIMARY DAILY USER — highest volume — worklist, missed-complaints, recovery exceptions, FCR clusters |

| L2 | Chief Customer Officer / Head of Customer | Strong influencer — emotional narrative | Weekly: vulnerable-customer surface, bereavement, distress engagement |

| L1 | Head of Product / Digital | Stakeholder | Occasional: disclosure-in-conversation views (KFS, cooling-off, pre-payment) |

| L5 | Head of Marketing | Stakeholder | Occasional: campaign-deviation, language-mismatch |

Buyers != users. L4 funds the programme; L3 lives in the dashboard daily; L2 provides the narrative that wins the room. Design must serve both buyer (boardroom artefacts) and daily user (worklist efficiency).

\---

\## 3. MVP scope cut

29 use cases x 19 entities is the full surface. MVP is the minimum that earns the 5-second CRO moment AND moves the 30 June / 1 July 2026 needle. MVP = 10 use cases.

IN-MVP (10):

| UC | Why it's MVP |

|---|---|

| UC-01 Missed-Complaint Detector | The anchor — "hear the 95% you miss"; direct RB-IOS exposure mitigation |

| UC-02 Recovery Conduct Monitor | Most concrete supervisory exposure; the visceral demo signal |

| UC-03 Borrower-Distress Identifier | L2's strongest narrative; pairs with UC-02 |

| UC-07 Quarterly RCA & Top-5 Grounds Engine | The board-pack deliverable; defends the L4 cheque |

| UC-08 Bereaved-Customer Empathy Monitor | Highest-emotional-stakes vulnerable journey; 31 Mar 2026 deadline |

| UC-10 Vendor Governance Scorecard | The Outsourcing Directions answer; differentiated supervisor-acceptable evidence |

| UC-22 Repeat-Contact Root-Cause | Operational ROI line alongside regulatory case; pulls L3 in daily |

| UC-23 First-90-Seconds Complaint Handling \[HIGH\] | Most direct RB-IOS award-prevention artefact |

| UC-24 Vulnerable-on-General-Queue Router \[HIGH\] | Catches the vulnerable customer the bank cannot proactively flag |

| UC-04 Cross-Sell Consent & Bundling Detector | Strongest L2 sales-conduct narrative; high-frequency signal |

Defence of cut: Every MVP use case is "Monitored by Fluid CX" tier — no integration dependency blocks Day 1. Together they cover all three primary personas (L4 / L3 / L2), the four hardest near-term deadlines (31 Mar / 30 Jun / 1 Jul 2026), and both regulatory and operational ROI. Each maps to a specific Mock-Data entity that already exists.

Deferred to v2 (post-MVP, requires integration): UC-05 Script Adherence, UC-06 Graduated Escalation, UC-15 Recovery Disclaimer/Time-Window, UC-13 Suitability, UC-14 KFS Delivery, UC-16 Fraud-Dispute Quality, UC-18 Mis-Selling Reconstruction, UC-25 Exit Handling, UC-26 Latent Mis-Selling, UC-27 IVR Navigation, UC-28 Queue Conduct, UC-29 Inbound Authentication.

Deferred to v3: UC-09 MSE, UC-11 Cooling-Off Disclosure, UC-12 Pre-Payment, UC-17 DSA/DMA, UC-19 Penal-Charges Phrase, UC-20 Language Mismatch, UC-21 Campaign Deviation.

\---

\## 4. Core business questions the dashboard must answer

CRO / Head of CX voice:

1\. "Of every customer conversation we recorded yesterday, which ones expressed a complaint, and how many of those never reached our CMS?"

2\. "Which recovery agents and which vendors have a pattern of threatening, shaming, or harassing borrowers — and how do I prove it to HR and the supervisor?"

3\. "When a customer in distress called us last week, did we engage with the hardship pathway or did we dismiss them?"

4\. "Are bereaved customers being handled with empathy on the general queue, or are they being treated bureaucratically before reaching the specialist desk?"

5\. "Can my Customer Service Committee of the Board pack categorise complaints with a methodology my auditor and the RBI supervisor will accept?"

6\. "Where is sampling-based vendor QA going to fail us first when the supervisor asks for evidence of outsourcing governance?"

7\. "Of the 17 of our 38 RBI obligations Fluid does NOT primarily own, who in the bank owns each — and can we name the system?"

\---

\## 5. Recommended dashboard information architecture

Decision: HYBRID IA — Persona-anchored entry, Theme-organised depth, Obligation-grounded detail.

Why hybrid, not pure persona or pure theme. Pure persona-tabs trap the CRO in a single view and force the same information to be redrawn for each lens — bad for L4 who needs cross-cutting evidence packs. Pure theme-tabs make the dashboard feel like a regulatory taxonomy and lose the "you" moment that makes a CRO click past slide 2. Hybrid solves both: the landing screen reads you by persona, the theme structure organises the work, and the obligation card is the atomic unit of evidence.

Screens proposed (Fluid CX add-on shell — opens to RBI Conduct Intelligence module):

| # | Screen | Purpose |

|---|---|---|

| S0 | Persona-Aware Landing | 5-second CRO moment: regulatory-horizon countdown band + "your queue today" by persona + 3 headline metrics |

| S1 | My Worklist | Active alerts routed to logged-in owner; severity-sorted; one-click drill to evidence |

| S2 | Conduct Themes Index | The 8 themes as tiles with coverage % and trend; "Honest Gap shelf" sub-section explicitly named |

| S3 | Obligation Detail (atomic spine view) | One obligation = one screen expressing Reg -> Obl -> Signal -> Owner -> Evidence -> Action |

| S4 | Missed-Complaint Hub (UC-01 + UC-23) | The anchor module; CMS-gap reconciliation + first-90s adherence side by side |

| S5 | Recovery Conduct Hub (UC-02 + UC-03) | Agent/vendor conduct scorecard + distress-engagement view |

| S6 | Vulnerable Customer Hub (UC-08 + UC-24) | Bereavement empathy + general-queue vulnerable routing |

| S7 | Vendor Governance Hub (UC-10) | Vendor scorecard, vendor-vs-in-house, attestation pack generator |

| S8 | RCA & Board Pack Studio (UC-07) | Cluster engine, CSCB pack builder, annual top-5 grounds export |

| S9 | Bundling & Consent Hub (UC-04) | Cross-sell consent detector; campaign-level pattern |

| S10 | FCR / Repeat-Contact Module (UC-22) | Repeat-contact clusters; operational-ROI lens for L3 |

| S11 | Regulatory Horizon | Timeline view of all dates; obligation status against each |

| S12 | Honest-Gap & Integrations | What Fluid does NOT solve; partner system named per obligation; integration health |

\---

\## 6. Why each screen exists (spine + use cases)

\- S0 earns the 5-second moment. It expresses the spine compressed: "Here is the regulation horizon -> here is what is open against your obligations -> here is your evidence to action."

\- S1 is the daily-user surface for L3; converts the spine into "what should I do next."

\- S2 is the boardroom navigation — the CRO and Head of Customer can think in themes; obligations live inside themes.

\- S3 is the PRODUCT SPINE IN ONE SCREEN — every use case ultimately drills here. One obligation, its parent regulation, the signals detected, the control owner who owns it, the evidence packaged, and the recommended action.

\- S4–S10 are the hubs for the 10 MVP use cases. Each is a focused work surface tuned to the persona who uses it most.

\- S11 is the deadline-pressure narrative the L4 buyer responds to.

\- S12 is what makes the CRO respect the product — the explicit Do-Not-Build and integration-dependency surface.

\---

\## 7. Use case -> screen mapping

| Screen | Primary use cases | Supporting entities |

|---|---|---|

| S0 Landing | All MVP UCs (summarised) | All headline entities |

| S1 Worklist | UC-01, UC-02, UC-03, UC-04, UC-08, UC-23, UC-24 (open alerts) | RiskAlert, ControlOwner |

| S2 Themes Index | UC-07 (themes layer) | ConductTheme, Obligation |

| S3 Obligation Detail | Any single UC's underlying obligation | Regulation, Obligation, CustomerInteractionSignal, EvidenceItem, ControlOwner |

| S4 Missed-Complaint Hub | UC-01, UC-23 | ComplaintCaptureSignal (extended) |

| S5 Recovery Conduct Hub | UC-02, UC-03 | RecoveryConductSignal |

| S6 Vulnerable Customer Hub | UC-08, UC-24 | CustomerInteractionSignal + vulnerable-signal taxonomy, InboundQueueSignal |

| S7 Vendor Governance Hub | UC-10 | VendorBPOScore |

| S8 RCA & Board Pack Studio | UC-07 | RCACluster, EvidenceItem |

| S9 Bundling & Consent Hub | UC-04 | CustomerInteractionSignal (bundling_pressure type) |

| S10 FCR / Repeat-Contact | UC-22 | RepeatContactPattern |

| S11 Regulatory Horizon | All (deadline overlay) | Regulation, Obligation |

| S12 Honest-Gap & Integrations | None as monitor — boundary surface | CapabilityBoundary, IntegrationDependency |

\---

\## 8. EXCLUDED from MVP main dashboard

Outside Fluid CX scope (must NOT appear as features — only on S12 Honest-Gap shelf as boundary notes):

\- OBL-013 Data governance for recovery agent data feeds — DPDP / vendor management territory.

\- OBL-022 Automated CMS workflow auto-escalation — bank's CMS provider owns this.

\- OBL-021 Internal Ombudsman independent review — human judgment.

\- OBL-025 PNO / RB-IOS correspondence workflow — correspondence management tool.

\- OBL-032 Dark-pattern UI audit — product/design team with journey analytics.

\- OBL-035 Real-time transaction alerts engine — core-banking infrastructure.

\- OBL-036 Refund timeline 10-day shadow-credit workflow — finance ops.

\- OBL-006 SEBI IA time-stamping — recording infrastructure.

\- Branch interaction recording infrastructure — a precondition, not a Fluid feature.

\- IVR DTMF navigation traces — IVR platform.

\- Voicebot self-service conversation ingestion — roadmap candidate, not v1.

Deferred to v2 (Fluid scope, but integration-dependent; appear as "Coming next" on S12): UC-05, UC-06, UC-13, UC-14, UC-15, UC-16, UC-18, UC-25, UC-26, UC-27, UC-28, UC-29.

Deferred to v3: UC-09, UC-11, UC-12, UC-17, UC-19, UC-20, UC-21.

\---

\## 9. Integration dependencies and boundary notes

| Show as | What | Where |

|---|---|---|

| Integration dependency banner on obligation card | CRM (suitability/affordability), Dialer+Recording (Genesys + NICE), Fraud Hub (auth metadata), CMS read-only feed, HR vendor master, Outbound notification gateway | S3 Obligation Detail; S12 Integrations panel |

| Boundary note on obligation card | The 8 OBL items above (data gov, CMS workflow, IO, PNO, UI audit, alerts, refunds, time-stamping) and 3 inbound boundaries (DTMF, voicebot, CTI counters, chat parity) | S12 Honest-Gap shelf; tooltip on obligation card |

| Precondition note | Branch interaction recording — surfaced on UC-04 / UC-08 / OBL-029 cards | S3 Obligation Detail (where branch-dependent) |

\---

\## 10. Key KPI categories

1\. COVERAGE — % of interactions analysed vs sampling baseline (per obligation, per channel, per vendor).

2\. CONDUCT EXCEPTION RATE — exceptions per 10k interactions by obligation, agent, vendor, campaign, region.

3\. CMS-GAP RATE — complaints detected but never logged in CMS (UC-01).

4\. FIRST-90-SECONDS ADHERENCE — % of inbound complaints where agent honoured acknowledgement / SR / escalation route disclosure (UC-23).

5\. VULNERABLE-ENGAGEMENT QUALITY — distress engagement rate, bereavement empathy score, vulnerable-on-general-queue routing rate.

6\. VENDOR BENCHMARK — vendor conduct score vs in-house; week-on-week trend; complaint rate per 10k.

7\. REPEAT-CONTACT / FCR — same-customer same-issue contacts per 7/14/30-day window.

8\. RB-IOS EXPOSURE PROXY — count of cases carrying conduct risk that could attract consequential-loss compensation under the Rs 30 lakh cap.

\---

\## 11. Key AI-insight categories

The interaction signals surfaced as insight — grouped for component reuse:

1\. THREAT & HARASSMENT LANGUAGE (recovery).

2\. CUSTOMER DISTRESS MARKERS + agent engagement classification (engaged / dismissed / silent).

3\. BUNDLING & CONSENT-EXTRACTION PRESSURE (sales).

4\. EMPATHY & TONE FAILURES — bereaved, vulnerable, distressed segments.

5\. MISSED-COMPLAINT MARKERS — dissatisfaction / escalation language with no SR.

6\. FIRST-90-SECONDS ADHERENCE FAILURE — missed acknowledgement / SR / escalation route.

7\. REPEAT-CONTACT PATTERNS — clustering same-customer same-issue.

8\. VULNERABLE-ON-GENERAL-QUEUE DETECTION — bereavement / fraud-victim / MSE / PwD markers pre-routing.

9\. ROOT-CAUSE CLUSTERS — systemic patterns by agent / branch / region / product / campaign / vendor.

10\. VENDOR-SEGMENTED CONDUCT SIGNAL — every signal above replayed at vendor level for OBL-037.

\---

\## 12. Key data entities (from Mock-Data Pack)

Foundation entities used in MVP:

\- Regulation, Obligation, ConductTheme — the spine's first three nodes (entities 1–3).

\- CustomerInteractionSignal (with \`direction\` extension) — atomic signal record (entity 4 + EXT-1).

\- RiskAlert — aggregated worklist item (entity 5).

\- EvidenceItem — proof artefact (entity 6).

\- ControlOwner, ExecutivePersona — routing and persona view (entities 7–8).

\- RCACluster — board pack engine (entity 9).

\- VendorBPOScore — vendor scorecard (entity 10).

\- RecoveryConductSignal — UC-02 / UC-03 specialised (entity 11).

\- ComplaintCaptureSignal (with first-90s extension EXT-2) — UC-01 + UC-23 (entity 12).

\- RepeatContactPattern — UC-22 (entity 18, inbound addendum).

\- InboundQueueSignal — supports UC-24 (entity 16, inbound addendum).

\- IntegrationDependency, CapabilityBoundary — S12 surface (entities 14–15 + additions).

Deferred to v2: FraudDisputeSignal, ExitHandlingSignal, IVRNavigationSignal.

\---

\## 13. Recommended narrative flow for a CRO demo

The 5-minute click-path that tells the story:

(0:00–0:30) S0 Landing — the "5-second relevance" moment. Open RBI Conduct Intelligence inside Fluid CX. Top band shows the regulatory-horizon countdown: "30 Jun 2026 — IO Directions automated CMS auto-escalation: 37 days. 1 Jul 2026 — RB-IOS cutover, Rs 30 lakh cap: 38 days." Below: "Your queue today: 12 critical alerts, 47 open exceptions, 3 RCA clusters trending." Say: "This is what your bank looks like against the obligations the supervisor is going to test against in 38 days."

(0:30–1:30) S4 Missed-Complaint Hub — the anchor demo. Show one CMS-gap alert — service call with clear complaint language, no SR created. Play the 12-second transcript snippet. Show the same customer's first-90-seconds adherence score: agent never offered escalation route. Say: "Today you find this via complaint to RB-IOS three weeks from now. With this, you find it within 24 hours and force-create the SR. This is your single-largest RB-IOS exposure mitigation."

(1:30–2:30) S5 Recovery Conduct Hub — the visceral signal. Play the recovery threat-language clip ("hum aapke office aa jayenge"). Show agent-level pattern: 7 occurrences in 48 hours, Krescent BPO Pune. Pivot to S6 Vulnerable Customer Hub: bereaved-spouse general-queue call, empathy-failure, no specialist routing. Say: "You will never find these on a 3% QA sample. The harassment becomes a news story; the bereavement becomes a Customer Service Committee escalation."

(2:30–3:30) S7 Vendor Governance Hub — the Outsourcing Directions answer. Show vendor scorecard: Sutherland Chennai vs Krescent vs in-house, week-on-week. Generate attestation pack (PDF). Say: "The 10 April 2026 outsourcing deadline asked for evidence of governance. This is supervisor-acceptable evidence of governance — at 100% coverage, not 3%."

(3:30–4:30) S8 RCA & Board Pack Studio — the boardroom artefact. Show the bundling-pressure cluster (Cards cross-sell campaign C-2026-MAY-04) — 412 signals, 6-agent cluster, rising trend, recommended remediation prefilled. Click "Generate CSCB pack". Say: "This is the quarterly Root Cause Analysis the IO Directions 2026 mandate to your Customer Service Committee of the Board. Today your pack reads from CMS dropdowns. From 30 June 2026, that won't survive the supervisor's question."

(4:30–5:00) S12 Honest-Gap & Integrations — the credibility close. Walk through what Fluid does NOT claim. Point at OBL-022: "Your CMS vendor delivers the auto-escalation workflow; we feed it." OBL-021: "Your Internal Ombudsman makes the judgment; we provide the evidence." OBL-013: "Your data infrastructure team owns recovery-data minimisation; we do not." Say: "This is the slide that gets us the working session. We are the conversation layer that earns the cheque on one-third of your obligations and supports another forty-five percent. We are not your CMS, your IO, your dialer, or your alert engine — and we will tell you which obligations belong to those controls."

\---

End of PRD — Opus Pass 4v2.