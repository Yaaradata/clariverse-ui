\# Fluid CX — RBI Conduct Intelligence: Dashboard Use-Case Map — Inbound Addendum

\*\*Read this AFTER the parent Use-Case Map (RBI Build - Pass 2).\*\* Eight new use cases (UC-22 to UC-29) extend the parent's 21 with inbound carve-outs from Pass 4A-i. Same 11-field structure as the parent. Spine preserved: Regulation → Obligation → Signal → Owner → Evidence → Action.

\*\*Why this addendum exists.\*\* The parent's 21 use cases are structurally outbound-weighted. Pass 4A-i sharpens the inbound surface with eight carve-out controls threading through 17 of the 30 FULL/PARTIAL rows. This addendum converts each carve-out into a dashboard use case in the parent's format.

\*\*Persona priority impact (preview, full note at end).\*\* Two of the eight inbound use cases — \*\*UC-23 (First-90-Seconds Complaint Handling)\*\* and \*\*UC-24 (Vulnerable-on-General-Queue Routing)\*\* — should be flagged HIGH PRIORITY for the 30 June 2026 IO Directions / 1 July 2026 RB-IOS cutover. UC-25 (Repeat-Contact Root Cause) carries operational ROI visible to L3 alongside the regulatory case.

\---

\## MAIN FLUID CX FEATURES (inbound carve-outs where interaction monitoring is the principal control)

\### UC-22. Repeat-Contact Root-Cause Engine

1\. \*\*Use-case name:\*\* Repeat-Contact Root-Cause Engine (FCR / Same-Customer Same-Issue Clustering)

2\. \*\*RBI regulation:\*\* RBI (Commercial Banks – Internal Ombudsman) Directions, 2026 (RBI/CEPD/2025-26/381); RBC Directions 2025 (RBI/DOR/2025-26/170) — grievance and customer-service obligations

3\. \*\*Obligation ID(s):\*\* Cross-cuts OBL-014, OBL-020, OBL-023, OBL-026, OBL-027, OBL-036 (Pass 4A-i CO-i-04)

4\. \*\*Conduct theme:\*\* Grievance Handling Conduct (with Vulnerable Customer Protection overlap)

5\. \*\*Interaction surface:\*\* Inbound service call, chat, email, ticket — across all customer-initiated channels

6\. \*\*Detected signal:\*\* Same-customer same-issue clustering within 7/14/30-day windows; agent failure to resolve at first contact; closure communication unclear; document-release status confusion; refund-status loops; deceased-claim repeat contact

7\. \*\*Business risk:\*\* Operational cost ladder (avoidable contact volume); regulatory exposure (repeat contact is structural evidence of unresolved complaint or unclear closure). \*Failure-mode example:\* HL customer calls 4 times in 21 days about document release; each agent treats as fresh enquiry; 5th contact escalates to RB-IOS — bank cannot demonstrate first-call resolution discipline.

8\. \*\*Owner:\*\* Head of Customer Service + Head of Contact Centre Operations (1LoD); Conduct Risk Head + Internal Ombudsman (2LoD)

9\. \*\*Evidence needed:\*\* Per-customer per-issue contact reconstruction, agent-level first-contact-disposition trail, cluster heatmap by issue category and branch, agent retraining list

10\. \*\*Recommended action:\*\* Weekly repeat-contact cluster report for Customer Service and Conduct Risk; agent-level FCR retraining queue; feeds quarterly CSCB pack (OBL-023) and operations cost optimisation

11\. \*\*Build tier:\*\* Main Fluid CX feature

\### UC-23. Inbound Complaint-Handling First-90-Seconds Monitor \*\*\[HIGH PRIORITY — RB-IOS\]\*\*

1\. \*\*Use-case name:\*\* Inbound Complaint-Handling First-90-Seconds Adherence

2\. \*\*RBI regulation:\*\* RBI (Commercial Banks – Internal Ombudsman) Directions, 2026 (RBI/CEPD/2025-26/381); RB-IOS 2026 (Press Release 2025-2026/1936, effective 1 July 2026)

3\. \*\*Obligation ID(s):\*\* Cross-cuts OBL-020, OBL-025, OBL-026 (Pass 4A-i CO-i-05)

4\. \*\*Conduct theme:\*\* Grievance Handling Conduct

5\. \*\*Interaction surface:\*\* Inbound service call where customer expresses complaint, dissatisfaction, or escalation request

6\. \*\*Detected signal:\*\* First-90-seconds adherence — agent acknowledgement of the complaint; SR-creation language ("I am raising a service request"); escalation-route disclosure (RBI Ombudsman / Internal Ombudsman mention where applicable); regulatory-timeline communication; absence of dismissive framing

7\. \*\*Business risk:\*\* Most common factual basis for upheld RB-IOS awards is agent failure to disclose escalation route at the moment of complaint. ₹30 lakh consequential-loss cap exposure per case from 1 July 2026. \*Failure-mode example:\* Customer expresses clear complaint; agent treats as enquiry and closes call without SR or escalation-route mention; 21 days later RB-IOS award against the bank because the recording shows the bank's own agent did not honour the obligation.

8\. \*\*Owner:\*\* Head of Customer Service + Head of Contact Centre Operations (1LoD); Principal Nodal Officer + Internal Ombudsman (2LoD)

9\. \*\*Evidence needed:\*\* First-90-seconds adherence score per inbound complaint call, mandatory-element coverage (acknowledgement / SR creation / escalation route / timeline), agent-level scoring trend, agent retraining queue

10\. \*\*Recommended action:\*\* Real-time alert on missed-escalation-route disclosure for high-severity complaints; daily adherence dashboard for Customer Service; monthly RB-IOS exposure brief for PNO and CRO; agent coaching queue

11\. \*\*Build tier:\*\* Main Fluid CX feature \*\*(HIGH PRIORITY: highest-leverage RB-IOS mitigation)\*\*

\### UC-24. Vulnerable-Signal-on-General-Queue Router \*\*\[HIGH PRIORITY\]\*\*

1\. \*\*Use-case name:\*\* Vulnerable Customer Detection on Inbound General Queue

2\. \*\*RBI regulation:\*\* Draft RBI Second Amendment Directions 2026 (12 Feb 2026, revised mid-May 2026; proposed 1 July 2026); RBI (Settlement of Claims in respect of Deceased Customers) Directions, 2025; RBC Directions 2025 MSE provisions; Authentication Directions 2025 for fraud victims

3\. \*\*Obligation ID(s):\*\* Cross-cuts OBL-011, OBL-027, OBL-028, OBL-029, OBL-033, OBL-034 (Pass 4A-i CO-i-07)

4\. \*\*Conduct theme:\*\* Vulnerable Customer Protection

5\. \*\*Interaction surface:\*\* Inbound general queue (before specialist routing); 24×7 fraud line; branch-call inbound (Branch-dependent leg for walk-ins)

6\. \*\*Detected signal:\*\* Distress markers (job loss, medical emergency, financial hardship); bereavement markers ("my husband / father / wife passed away"); fraud-victim distress; PwD accessibility-struggle signals; MSE-borrower hardship language — detected at general-queue agent first interaction before any specialist route

7\. \*\*Business risk:\*\* Bank cannot proactively identify vulnerable inbound customers; empathy-failure on general queue triggers reputational and regulatory exposure. \*Failure-mode example:\* Bereaved spouse calls general queue to enquire about deceased husband's account; treated bureaucratically; complaint to RB-IOS for insensitivity; reputational cascade.

8\. \*\*Owner:\*\* Head of Customer Service + Head of Contact Centre Operations (1LoD); Hardship Desk Lead, Bereavement Desk, Fraud Victim Care, MSE Conduct Lead (1LoD specialist); Conduct Risk Head (2LoD)

9\. \*\*Evidence needed:\*\* Vulnerable-signal detection at queue entry with timestamp, specialist-routing-recommendation log, empathy-failure scoring on general-queue handling, repeat-contact correlation per vulnerable customer

10\. \*\*Recommended action:\*\* Real-time vulnerable-signal alert routed to specialist desks; weekly general-queue empathy-failure report; supervisor coaching for high-frequency empathy-failure agents; cross-references UC-03 (borrower-distress) and UC-08 (bereaved) for outbound side

11\. \*\*Build tier:\*\* Main Fluid CX feature \*\*(HIGH PRIORITY: highest-leverage vulnerable-customer detection)\*\*

\### UC-25. Inbound Exit & Cooling-Off Handling Monitor

1\. \*\*Use-case name:\*\* Inbound Exit / Cooling-Off / Cancellation Conduct Monitor

2\. \*\*RBI regulation:\*\* RBI Digital Lending Directions, 2025 (RBI/2025-26/36, 8 May 2025); RBC Amendment Directions 2025 para 86A (RBI/2025-26/103, effective 1 April 2026)

3\. \*\*Obligation ID(s):\*\* Cross-cuts OBL-002, OBL-017 (Pass 4A-i CO-i-08)

4\. \*\*Conduct theme:\*\* Sales & Suitability Conduct / Disclosure & Transparency Conduct

5\. \*\*Interaction surface:\*\* Inbound exit request (account closure, cooling-off invocation, product cancellation, foreclosure intent)

6\. \*\*Detected signal:\*\* Dissuasion language ("are you sure", "let me transfer you to retention", repeated objections); retention cross-sell over exit request; prolonged-handling markers; transfer loops engineered to slow exit; refund-discussion clarity at cooling-off invocation

7\. \*\*Business risk:\*\* Exit-handling pressure complaint to RB-IOS; supervisory observation on digital-lending cooling-off operationalisation. \*Failure-mode example:\* Borrower invokes cooling-off on day 3; agent dissuades through repeated cross-sell offers; cooling-off completion delayed beyond window; complaint upheld.

8\. \*\*Owner:\*\* Head of Customer Service + Head of Digital Lending + Head of Retail Assets (Foreclosure) (1LoD); Conduct Risk Head + Principal Nodal Officer (2LoD)

9\. \*\*Evidence needed:\*\* Exit-handling quality score per call, dissuasion-language pattern per agent, retention-cross-sell-at-exit pattern, refund-discussion clarity scoring, exit-completion-time correlation

10\. \*\*Recommended action:\*\* Weekly exit-handling quality report for Customer Service and Conduct Risk; agent-level dissuasion-pattern queue; cooling-off completion-time exception alerting; cross-references UC-04 (cross-sell consent) and UC-11 (cooling-off welcome-call) for full coverage

11\. \*\*Build tier:\*\* Main Fluid CX feature

\### UC-26. Inbound Latent Mis-Selling Detection

1\. \*\*Use-case name:\*\* Latent Mis-Selling Detection on Inbound Product Queries

2\. \*\*RBI regulation:\*\* Draft RBI (Commercial Banks – RBC) Amendment Directions, 2026 (11 Feb 2026, proposed Section F mis-selling compensation); RBC Directions 2025

3\. \*\*Obligation ID(s):\*\* Cross-cuts OBL-001, OBL-005, OBL-015 (Pass 4A-i CO-i-06)

4\. \*\*Conduct theme:\*\* Sales & Suitability Conduct

5\. \*\*Interaction surface:\*\* Inbound product-query call ("what is this charge", "why am I paying this premium", "what is this ULIP I am paying for", "I did not know about this fee")

6\. \*\*Detected signal:\*\* Customer-confusion phrase pattern at inbound query stage; correlation back to original sale interaction (extends Pass 3 OBL-005 mechanism to inbound surface); product-cohort clustering of confusion patterns

7\. \*\*Business risk:\*\* 6–18 month complaint-lag on mis-selling cases; pattern grows undetected before formal complaint trigger. \*Failure-mode example:\* 12 customers in 30 days call about a specific ULIP charge; none labelled as complaint; 6 months later mis-selling theme breaks across 80 customers — bank's investigation cannot reconstruct early signal.

8\. \*\*Owner:\*\* Head of Customer Service (intake, 1LoD); Head of Wealth & Bancassurance / Head of Retail Assets (product, 1LoD); Conduct Risk Head + Mis-Selling Investigation Lead (2LoD)

9\. \*\*Evidence needed:\*\* Inbound confusion-marker per query, original-sale-interaction reconstruction, product-cohort cluster, sourcing-channel correlation (in-house / vendor / DSA)

10\. \*\*Recommended action:\*\* Weekly latent-mis-selling cluster report for Conduct Risk and product Heads; product-cohort early-warning alert when cluster volume exceeds threshold; cross-references UC-18 (mis-selling original-call reconstruction) for triggered cases

11\. \*\*Build tier:\*\* Main Fluid CX feature \*(Note: new capability articulation beyond Pass 3 Layer A processes — inbound-detection mechanism not explicitly named in original capability set)\*

\---

\## FEATURES WITH INTEGRATION DEPENDENCY (inbound carve-outs requiring partner-system data)

\### UC-27. IVR Navigation & Self-Service Routing Monitor

1\. \*\*Use-case name:\*\* IVR Navigation Conduct and Self-Service Routing Monitor

2\. \*\*RBI regulation:\*\* RBC Directions 2025 (accessibility / trilingual obligations); RBI letter 30 Sept 2024 (multilingual); RBI (Commercial Banks – KYC) Directions, 2025 accessibility provisions

3\. \*\*Obligation ID(s):\*\* Cross-cuts OBL-020, OBL-029, OBL-030, OBL-032, OBL-034 (Pass 4A-i CO-i-01)

4\. \*\*Conduct theme:\*\* Communication & Outbound Conduct (with Grievance Handling overlap on complaint-route access)

5\. \*\*Interaction surface:\*\* IVR entry → menu navigation → agent-pickup transition; language-selection point

6\. \*\*Detected signal:\*\* Customer frustration markers at agent-pickup ("I had to press five buttons", "your menu would not let me speak to anyone"); language-switch markers; complaint markers about IVR navigation; long IVR-dwell-time correlation with eventual complaint

7\. \*\*Business risk:\*\* IVR functioning as dark-pattern barrier to complaint registration or fraud-line access; supervisory observation on accessibility. \*Failure-mode example:\* Customer trying to reach 24×7 fraud line forced through 4 IVR layers; abandons; reports to RB-IOS that bank's reporting line was inaccessible.

8\. \*\*Owner:\*\* Head of Contact Centre Operations (IVR design owner, 1LoD); Conduct Risk Head + Compliance IVR-script review (2LoD)

9\. \*\*Evidence needed:\*\* Frustration-marker timestamps at agent-pickup; IVR-dwell-time correlation with complaint markers; language-switch evidence; agent-routing reconciliation

10\. \*\*Recommended action:\*\* Weekly IVR-friction cluster report for Contact Centre Operations; language-switch optimisation pattern; supports OBL-029 and OBL-030 attestation packs

11\. \*\*Integration dependency:\*\* IVR platform metadata (DTMF navigation traces); voicebot vendor (if conversational IVR deployed)

12\. \*\*Build tier:\*\* Feature with integration dependency

\### UC-28. Inbound Queue Conduct & Accessibility Monitor

1\. \*\*Use-case name:\*\* Inbound Queue Conduct and Accessibility Monitor

2\. \*\*RBI regulation:\*\* RBC Directions 2025 (24×7 obligation contexts); Authentication Directions 2025 (RBI/2025-26/79, fraud reporting line context)

3\. \*\*Obligation ID(s):\*\* Cross-cuts OBL-020, OBL-027, OBL-034 (Pass 4A-i CO-i-02)

4\. \*\*Conduct theme:\*\* Grievance Handling Conduct

5\. \*\*Interaction surface:\*\* Queue entry → hold → agent connection or abandonment → transfer or resolution → callback

6\. \*\*Detected signal:\*\* Pre-abandonment customer frustration in queue audio (where captured); transfer-loop reconstruction from call-leg metadata + content; abandonment-to-complaint correlation; 24×7 fraud-line operational accessibility

7\. \*\*Business risk:\*\* Queue accessibility functioning as a barrier; abandonment is a missed complaint; 24×7 fraud line accessibility below supervisory expectation. \*Failure-mode example:\* Customer reporting unauthorised UPI transaction abandons after 4-minute hold; transaction unrecoverable; RB-IOS award includes harassment + consequential loss.

8\. \*\*Owner:\*\* Head of Contact Centre Operations (1LoD); Principal Nodal Officer + Conduct Risk Head (2LoD)

9\. \*\*Evidence needed:\*\* Pre-abandonment audio evidence (where captured); transfer-loop reconstruction; abandonment-to-complaint correlation; 24×7 fraud-line ASA and abandonment-rate trend

10\. \*\*Recommended action:\*\* Daily queue-conduct exception report; transfer-loop pattern alerting; supports OBL-034 24×7 line attestation

11\. \*\*Integration dependency:\*\* ACD/CTI metadata (Genesys, Avaya, Cisco — depending on the Bank); CRM callback scheduler

12\. \*\*Build tier:\*\* Feature with integration dependency

\### UC-29. Inbound Authentication Conduct Monitor

1\. \*\*Use-case name:\*\* Inbound Authentication and Identification Conduct Monitor

2\. \*\*RBI regulation:\*\* RBI (Commercial Banks – KYC) Directions, 2025 (RBI/DOR/2025-26/169, 28 Nov 2025) accessibility provisions; Authentication Mechanisms Directions 2025 (RBI/2025-26/79, effective 1 April 2026) interaction context

3\. \*\*Obligation ID(s):\*\* Cross-cuts OBL-027, OBL-029, OBL-033, OBL-034 (Pass 4A-i CO-i-03)

4\. \*\*Conduct theme:\*\* Fraud & Unauthorised Transaction Conduct (with Vulnerable Customer Protection overlap)

5\. \*\*Interaction surface:\*\* Inbound call authentication challenge → outcome (pass / fail / escalate) → service or denial

6\. \*\*Detected signal:\*\* Over-collection language patterns; repeated-authentication on warm transfer; agent tone on failed authentication; customer struggle signals (especially for elderly, PwD, bereaved next-of-kin); inbound 24×7 fraud-line authentication friction

7\. \*\*Business risk:\*\* Authentication treated as gatekeeping at expense of conduct; vulnerable customers denied service due to authentication friction; complaint to RB-IOS. \*Failure-mode example:\* Elderly customer fails three security questions; agent denies service without offering alternative; customer's daughter complains to Ombudsman.

8\. \*\*Owner:\*\* Head of Contact Centre Operations + Head of Fraud Risk (authentication policy, 1LoD); Conduct Risk Head (2LoD)

9\. \*\*Evidence needed:\*\* Over-collection language audit per call, repeated-authentication trail across transfers, failed-authentication treatment-tone scoring, vulnerable-customer authentication-failure pattern

10\. \*\*Recommended action:\*\* Weekly authentication-friction report for Contact Centre Operations and Fraud Risk; vulnerable-customer authentication-handling exception queue

11\. \*\*Integration dependency:\*\* Fraud-risk system (authentication outcomes, weak-auth metadata); CRM (customer-segment flags for proportionality)

12\. \*\*Build tier:\*\* Feature with integration dependency

\---

\## Persona priority — addendum

The parent's persona-priority order (L4 → L3 → L2) is unchanged. Two inbound use cases sharpen specific buyer pitches:

\- \*\*For L3 (Head of CX / Head of Customer Service):\*\* Lead with \*\*UC-23 (First-90-Seconds Complaint Handling)\*\* alongside the parent's UC-01 (Missed-Complaint Detector). Together they cover detection AND handling of complaints — the complete defence for the 1 July 2026 RB-IOS cutover. Add \*\*UC-22 (Repeat-Contact Root-Cause)\*\* for the operational cost line that strengthens the budget case beyond regulation.

\- \*\*For L2 (Chief Customer Officer):\*\* Lead with \*\*UC-24 (Vulnerable-on-General-Queue Routing)\*\* alongside the parent's UC-03 (Borrower Distress) and UC-08 (Bereaved Empathy). UC-24 is what catches the vulnerable customer the bank cannot proactively identify — the highest-impact vulnerable-customer detection control.

\- \*\*For L4 (CRO / CCO):\*\* Add \*\*UC-23 (First-90s)\*\* to the parent's top three (UC-07 RCA, UC-10 Vendor Governance, UC-16 Fraud Dispute). UC-23 is the most direct RB-IOS exposure-mitigation artefact.

\## Do-Not-Build — addendum

No additions to the parent's Do-Not-Build list. The four inbound use cases tagged "Feature with integration dependency" (UC-27, UC-28, UC-29 above, plus inbound chat-channel coverage already implicit in OBL-020) remain inside Fluid scope but require partner integration. Two inbound surfaces remain explicitly Do-Not-Build:

\- \*\*IVR DTMF navigation traces\*\* — IVR platform's responsibility; Fluid sees the consequence at agent-pickup, not the trace.

\- \*\*Voicebot / conversational-IVR self-service\*\* — separate ingestion path; \*\*new roadmap candidate beyond Pass 3's existing six\*\*, not a current capability.

\---

\*End of Dashboard Use-Case Map — Inbound Addendum. 8 new use cases (UC-22 to UC-29); 5 Main Features, 3 Features with Integration Dependency; 2 High-Priority flags (UC-23, UC-24); 2 inbound Do-Not-Build clarifications. Spine respected: Regulation → Obligation → Signal → Owner → Evidence → Action. Read alongside the parent for the complete 29-use-case map.\*