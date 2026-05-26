\# Fluid CX — RBI Conduct Intelligence: Mock-Data Model Pack — Inbound Addendum

\*\*Read this AFTER the parent Mock-Data Model Pack (RBI Build - Pass 3).\*\* Extends the parent's 15 entities with the inbound-conduct dimension introduced by Pass 4A-i. Four new entities, two extensions to existing entities, three new IntegrationDependency records, four new CapabilityBoundary records. Suvarna Bank fictional context preserved; ID conventions match the parent.

\*\*Spine preserved:\*\* Regulation → Obligation → Signal → Owner → Evidence → Action.

\---

\## EXTENSIONS TO EXISTING ENTITIES

\### EXT-1. CustomerInteractionSignal — add \`direction\` field

The parent's CustomerInteractionSignal entity is the atomic signal record but does not distinguish inbound from outbound. The eight Pass 4A-i carve-outs require this distinction.

\*\*Add field:\*\*

\- \`direction\` — enum: \`INBOUND\` | \`OUTBOUND\` | \`INTERNAL_TRANSFER\`

\*\*Updated sample (parent SIG-018931 re-rendered with direction):\*\*

\`\`\`

SIG-018931 | INT-10044 | service_call | voice | INBOUND | complaint_marker_no_SR | HIGH | "...I have been calling for three weeks now..." | 2026-05-23 11:42 | AGT-1788 | null | retail | Cards | en | \[OBL-020\] | ALT-3340

\`\`\`

All existing signal records inherit \`direction\` either from \`interactionType\` (recovery_call → OUTBOUND; service_call / fraud_dispute_call → INBOUND; sales_call → OUTBOUND; welcome_call → OUTBOUND) or explicit tagging during ingestion. Direction drives inbound-vs-outbound filtering across every dashboard view.

\### EXT-2. ComplaintCaptureSignal — add First-90-Seconds handling fields

The parent's ComplaintCaptureSignal entity captures the missed-complaint detection (UC-01). UC-23 (First-90-Seconds Complaint Handling) requires extension fields to capture whether the agent honoured the handling discipline after the complaint was expressed.

\*\*Add fields:\*\*

\- \`firstNinetySecondsAdherenceScore\` — 0–100 derived score

\- \`acknowledgementPresentFlag\` — boolean (did agent acknowledge as complaint?)

\- \`srCreationLanguagePresentFlag\` — boolean (did agent state "I am raising an SR" or equivalent?)

\- \`escalationRouteDisclosedFlag\` — boolean (RBI Ombudsman or Internal Ombudsman mentioned where applicable?)

\- \`regulatoryTimelineCommunicatedFlag\` — boolean

\- \`dismissiveFramingFlag\` — boolean (was the complaint treated as enquiry?)

\*\*Updated sample record (parent CCS-50012 re-rendered with new fields):\*\*

\`\`\`

CCS-50012 | INT-10044 | voice | CUS-83441 | escalation_request + repeat_contact | false | null | null | "Loans - HL - Document release delay" | 82 | HL | AGT-1788 | null | ALT-3340 | firstNinetySecondsAdherenceScore: 34 | acknowledgementPresentFlag: false | srCreationLanguagePresentFlag: false | escalationRouteDisclosedFlag: false | regulatoryTimelineCommunicatedFlag: false | dismissiveFramingFlag: true

\`\`\`

\*\*Dashboard use of extended fields:\*\* First-90-Seconds Adherence Module (UC-23) — agent-level scoring, real-time alert on missed escalation-route disclosure for high-severity complaints, monthly RB-IOS exposure brief for PNO and CRO.

\---

\## NEW ENTITIES

\### 16. InboundQueueSignal

\*\*Purpose:\*\* Specialised detector for inbound queue conduct (UC-28) — combines pre-abandonment audio signal with ACD/CTI metadata to evidence queue accessibility.

\*\*Key fields:\*\*

\- \`queueSignalId\` (PK)

\- \`interactionId\` (FK)

\- \`queueName\` — string (e.g., "General Service", "24x7 Fraud Reporting", "Cards Complaint", "HL Servicing")

\- \`queueEntryTs\`

\- \`holdDurationSeconds\`

\- \`transferCount\` — integer

\- \`transferLoopFlag\` — boolean (>2 transfers back to same queue)

\- \`abandonmentFlag\` — boolean

\- \`preAbandonmentAudioCaptured\` — boolean (queue music vs hold audio capture varies by ACD)

\- \`preAbandonmentFrustrationMarkers\` — array of strings (where audio captured)

\- \`callbackPromisedFlag\` — boolean

\- \`callbackHonouredFlag\` — boolean (nullable; null until callback window resolves)

\- \`downstreamComplaintCorrelation\` — FK to ComplaintCaptureSignal (nullable)

\- \`customerSegment\` — \`retail\` | \`MSE\` | \`wealth\` | \`NRI\` | \`bancassurance\`

\- \`relatedAlertId\` (FK)

\*\*Sample records:\*\*

\`\`\`

IQS-77001 | INT-10412 | "24x7 Fraud Reporting" | 2026-05-23 02:14 | 187 | 0 | false | true | true | \["please pick up", "yeh kya hai"\] | false | null | CCS-50012 | retail | ALT-3401

IQS-77018 | INT-10455 | "General Service" | 2026-05-23 11:30 | 22 | 0 | false | false | true | NA | false | null | null | wealth | null (clean)

IQS-77042 | INT-10488 | "Cards Complaint" | 2026-05-24 14:08 | 244 | 3 | true | true | true | \["this is the third time"\] | true | false | CCS-50031 | retail | ALT-3445

\`\`\`

\*\*Dashboard use:\*\* UC-28 Inbound Queue Conduct & Accessibility Monitor — daily exception report, transfer-loop pattern alerting, 24×7 fraud-line accessibility evidence pack, abandonment-to-complaint correlation feed.

\### 17. IVRNavigationSignal

\*\*Purpose:\*\* Specialised detector for IVR navigation conduct (UC-27) — captures the consequence of IVR design at agent-pickup, since DTMF navigation traces themselves are IVR-platform metadata Fluid does not own.

\*\*Key fields:\*\*

\- \`ivrSignalId\` (PK)

\- \`interactionId\` (FK)

\- \`ivrPath\` — string array (where IVR platform exposes path; nullable)

\- \`ivrDwellTimeSeconds\`

\- \`languageSelected\`

\- \`languageSwitchInIvrFlag\` — boolean

\- \`languageSwitchAtAgentPickupFlag\` — boolean

\- \`frustrationMarkersAtPickup\` — array of strings (customer's first utterance to agent)

\- \`complaintAboutIvrMarkers\` — array of strings ("your menu would not let me", "I had to press five buttons")

\- \`darkPatternSignal\` — boolean (>3 IVR layers before fraud / complaint / vulnerable-customer route)

\- \`pwdAccessibilitySignal\` — boolean (audio markers suggesting accessibility struggle in IVR)

\- \`customerSegment\`

\- \`relatedAlertId\` (FK)

\*\*Sample records:\*\*

\`\`\`

IVR-44012 | INT-10412 | null | 142 | hi | false | true | \["bhai aapki yeh menu se main pareshan ho gaya hoon"\] | \["aapne mujhe agent tak pahunchne mein das minute laga diye"\] | true | false | retail | ALT-3401 (rolled-up with IQS-77001 for UC-27 + UC-28)

IVR-44025 | INT-10455 | null | 24 | en | false | false | \[\] | \[\] | false | false | wealth | null

IVR-44067 | INT-10502 | null | 198 | en (customer's preferred ta, no Tamil option) | false | true (forced to English at pickup) | \["I wanted Tamil"\] | \["why is there no Tamil option"\] | false | false | retail | ALT-3447 (OBL-030 language-mismatch overlap)

\`\`\`

\*\*Dashboard use:\*\* UC-27 IVR Navigation Conduct Monitor — weekly IVR-friction cluster report, language-switch optimisation, dark-pattern routing detection, supports OBL-029 / OBL-030 / OBL-034 attestation packs.

\### 18. RepeatContactPattern

\*\*Purpose:\*\* Cross-cutting clustering entity for first-call resolution and repeat-contact as conduct evidence (UC-22). Distinct from RCACluster in that it operates at customer-issue level (not theme level) and runs continuously rather than on-pack-generation.

\*\*Key fields:\*\*

\- \`repeatPatternId\` (PK)

\- \`customerId\` (FK, hashed)

\- \`issueCategory\` — string (canonical taxonomy; e.g., "Loans - HL - Document release delay", "Cards - Dispute - Refund status")

\- \`firstContactTs\`

\- \`latestContactTs\`

\- \`contactCountInWindow\` — integer (7-day / 14-day / 30-day window)

\- \`windowDays\` — 7 | 14 | 30

\- \`channelsUsed\` — array (voice, chat, email, social, ticket)

\- \`agentsContacted\` — FK array (AGT-NNNN)

\- \`firstContactResolutionAttemptedFlag\` — boolean

\- \`closureCommunicationClarityScore\` — 0–100 (where closure occurred)

\- \`escalationStage\` — \`inbound_repeat\` | \`complaint_filed\` | \`IO_referred\` | \`RBIOS_escalated\`

\- \`linkedObligationIds\` — FK array

\- \`severity\` — 0–100

\- \`relatedAlertId\` (FK)

\*\*Sample records:\*\*

\`\`\`

RCP-22001 | CUS-83441 | "Loans - HL - Document release delay" | 2026-05-02 10:14 | 2026-05-23 11:42 | 4 | 30 | \[voice, voice, voice, voice\] | \[AGT-1601, AGT-1755, AGT-1788, AGT-1788\] | true | 32 | inbound_repeat | \[OBL-014, OBL-020, OBL-026\] | 79 | ALT-3340

RCP-22014 | CUS-77821 | "Recovery - harassment - Cards" | 2026-05-12 16:08 | 2026-05-18 14:30 | 2 | 7 | \[voice, social\] | \[AGT-1142 (recovery), AGT-1801 (CC inbound after social complaint)\] | false | null | complaint_filed | \[OBL-010, OBL-020\] | 92 | ALT-3301 (recovery alert), ALT-3346 (complaint alert)

RCP-22033 | CUS-91207 | "Mis-selling - Bancassurance - ULIP" | 2026-04-14 11:30 | 2026-05-24 09:12 | 3 | 30 | \[voice, chat, voice\] | \[AGT-1922, AGT-1955, AGT-2014 (original sales agent — coincidentally)\] | false | null | inbound_repeat | \[OBL-001, OBL-005, OBL-015\] | 81 | ALT-3358 (UC-26 latent mis-selling)

\`\`\`

\*\*Dashboard use:\*\* UC-22 Repeat-Contact Root-Cause Engine — weekly customer-issue cluster report; agent-level first-call-resolution retraining queue; feeds RCACluster (parent entity #9) at theme level and CSCB pack; visible to L3 as FCR cost line alongside conduct case.

\### 19. ExitHandlingSignal

\*\*Purpose:\*\* Specialised detector for inbound exit / cooling-off / cancellation conduct (UC-25). Applies Pass 3 OBL-002 bundling-pattern mechanism at the exit moment rather than at acquisition.

\*\*Key fields:\*\*

\- \`exitSignalId\` (PK)

\- \`interactionId\` (FK)

\- \`exitType\` — \`cooling_off_invocation\` | \`account_closure\` | \`product_cancellation\` | \`foreclosure_intent\` | \`card_closure\`

\- \`productCode\` — Cards | PL | HL | Auto | SavAcct | ULIP | MF | TermDeposit

\- \`dissuasionLanguagePresent\` — boolean

\- \`dissuasionPhraseCount\` — integer

\- \`retentionCrossSellAttempted\` — boolean

\- \`repeatedObjectionPattern\` — boolean (3+ objections to customer's stated exit)

\- \`exitCompletionTimeSeconds\` — integer (call duration on a clear exit)

\- \`transferLoopToRetention\` — boolean

\- \`refundDiscussionClarityScore\` — 0–100 (cooling-off contexts)

\- \`coolingOffWindowComplianceFlag\` — boolean (was exit honoured within window?)

\- \`agentId\` / \`vendorId\`

\- \`relatedAlertId\` (FK)

\*\*Sample records:\*\*

\`\`\`

EHS-11008 | INT-10620 | cooling_off_invocation | PL | true | 4 | true (offered top-up loan) | true | 412 | true (transferred twice to retention) | 41 | true | AGT-1812 | null | ALT-3520

EHS-11019 | INT-10644 | foreclosure_intent | HL | true | 2 | false | false | 188 | false | 67 | NA (not cooling-off context) | AGT-1855 | null | null (within tolerance)

EHS-11030 | INT-10701 | card_closure | Cards | false | 0 | true (offered fee waiver — appropriate retention) | false | 124 | false | 78 | NA | AGT-1788 | null | null (clean handling)

\`\`\`

\*\*Dashboard use:\*\* UC-25 Inbound Exit & Cooling-Off Handling Monitor — weekly exit-handling quality report; agent-level dissuasion-pattern queue; cooling-off completion-time exception alerting; cross-references parent UC-04 (cross-sell consent) for full bundling-at-acquisition + dissuasion-at-exit coverage.

\---

\## ADDITIONAL INTEGRATIONDEPENDENCY RECORDS

Three additions to the parent's IntegrationDependency entity (entity #14). Continues parent's INT-NNN ID sequence.

\`\`\`

INT-007 | "Suvarna ACD/CTI (Genesys Cloud)" | ACD/CTI | "Hold time, abandonment, transfer trail, callback scheduling, queue-routing metadata" | \[OBL-020, OBL-027 inbound, OBL-034\] | partial (basic metadata feed today; pre-abandonment audio capture in scope) | Q2 FY27

INT-008 | "Suvarna IVR & Voicebot Platform (Nuance + in-house)" | IVR + voicebot | "IVR DTMF navigation traces, voicebot self-service conversation logs, language-selection metadata" | \[OBL-020, OBL-029, OBL-030, OBL-032, OBL-034\] | not yet (DTMF metadata roadmap); voicebot conversation ingestion NEW roadmap item | Q3 FY27 (DTMF); Q4 FY27 (voicebot)

INT-009 | "Suvarna Inbound Chat Platform (Freshchat + WhatsApp Business)" | chat ingestion | "Inbound chat-channel customer conversations across web chat, in-app, WhatsApp, support email" | \[OBL-020, OBL-005, OBL-001\] | partial (basic ticket-text feed today); full conversation-stream parity with voice in roadmap | Q3 FY27

\`\`\`

\*\*Dashboard use of additions:\*\* Integration-health admin panel shows status for each; obligation cards using these dependencies show co-control banner with the dependency name; voicebot ingestion explicitly tagged "new roadmap candidate not in Pass 3 original six".

\---

\## ADDITIONAL CAPABILITYBOUNDARY RECORDS

Four additions to the parent's CapabilityBoundary entity (entity #15). Continues parent's BND-NNN sequence.

\`\`\`

BND-009 | "IVR DTMF navigation logs" (cross-OBL: OBL-029, OBL-030, OBL-032) | "DTMF behaviour traces in IVR are platform metadata, not voice — Fluid sees consequence at agent-pickup but not the trace itself" | "IVR Platform Vendor + Contact Centre Engineering" | EVIDENCE_ONLY_CARD | REG-001

BND-010 | "Voicebot / Conversational IVR self-service" (cross-OBL: OBL-020, OBL-030) | "Voicebot self-service conversations live in voicebot vendor's logs; separate ingestion path required; NEW roadmap candidate beyond Pass 3's original six" | "Voicebot Vendor + Fluid Roadmap Q4 FY27" | HONEST_GAP_SHELF | REG-001

BND-011 | "ACD/CTI counters (hold-time, abandonment, callback-honouring)" (cross-OBL: OBL-020, OBL-034) | "CTI metrics are owned by the Bank's existing CTI reporting; Fluid is the conversation overlay correlating evidence with metrics — clarity statement, not a gap" | "Bank's ACD/CTI Reporting (Genesys / Avaya / Cisco)" | HONEST_GAP_SHELF | REG-001

BND-012 | "Inbound chat at chat-voice parity" (cross-OBL: OBL-020) | "Inbound chat is a separate ingestion surface; coverage at parity with voice is Fluid roadmap priority; cross-references Pass 3 Roadmap candidate #6 but is materially broader" | "Fluid Roadmap Q3 FY27" | HONEST_GAP_SHELF | REG-002

\`\`\`

Note: BND-008 in the parent ("Branch interaction recording" cross-OBL precondition) already covers branch walk-in inbound; no new boundary entry needed for that surface.

\*\*Dashboard use of additions:\*\* Honest-Gap shelf module displays each; obligation cards reference the relevant boundary in tooltips; voicebot and chat-parity items shown in roadmap-horizon view alongside the parent's six Pass 3 roadmap candidates.

\---

\## Entity relationship — addendum

Add to the parent's ER summary:

\- \*\*InboundQueueSignal\*\* is a specialised projection of \*\*CustomerInteractionSignal\*\* (where \`direction = INBOUND\` and the queue surface is present), linked to \*\*ComplaintCaptureSignal\*\* for abandonment-to-complaint correlation.

\- \*\*IVRNavigationSignal\*\* is a specialised projection of \*\*CustomerInteractionSignal\*\* at the IVR-to-agent-pickup transition; links to \*\*ComplaintCaptureSignal\*\* for OBL-020 and \*\*RiskAlert\*\* for OBL-029 / OBL-030 cases.

\- \*\*RepeatContactPattern\*\* aggregates many \*\*CustomerInteractionSignal\*\* (filtered \`direction = INBOUND\`) by customer and issue category; feeds \*\*RCACluster\*\* at theme level and outputs to \*\*ExecutivePersona\*\* L3 (operational view) and L4 (CSCB view).

\- \*\*ExitHandlingSignal\*\* is a specialised projection of \*\*CustomerInteractionSignal\*\* at exit-request inbound calls; cross-references \*\*RiskAlert\*\* for OBL-002 / OBL-017.

\- Extended \*\*ComplaintCaptureSignal\*\* drives UC-23 First-90-Seconds Adherence dashboard alongside the existing UC-01 Missed-Complaint Detector logic.

\---

\## Key deadlines reference — no change

The parent's key-deadlines reference list stands unchanged. The eight inbound carve-outs do not introduce new regulatory dates — they sharpen process controls under regulations already mapped in the parent. The 30 June 2026 (IO Directions) and 1 July 2026 (RB-IOS) cliff edges remain the dominant inbound-conduct dates because UC-23 (First-90s) and UC-22 (Repeat-Contact) directly support those obligations.

\---

\*End of Mock-Data Model Pack — Inbound Addendum. 2 extensions to existing entities (CustomerInteractionSignal direction, ComplaintCaptureSignal first-90s fields); 4 new entities (InboundQueueSignal, IVRNavigationSignal, RepeatContactPattern, ExitHandlingSignal); 3 new IntegrationDependency records (INT-007 ACD/CTI, INT-008 IVR/Voicebot, INT-009 Inbound Chat); 4 new CapabilityBoundary records (BND-009 to BND-012). All inbound additions preserve the parent's spine and ID conventions. Read alongside the parent for the full 19-entity data model.\*