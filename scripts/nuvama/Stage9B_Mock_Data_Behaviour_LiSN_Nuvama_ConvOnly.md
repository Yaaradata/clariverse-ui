# Stage 9B — Mock-Data Behaviour (CONVERSATION-ONLY) — LiSN / Fluid CX · Nuvama
**`Stage9B_Mock_Data_Behaviour_LiSN_Nuvama_ConvOnly.md`** — replaces the book-based Stage 9B.

> **Inputs.** Stage 9A (conversation universe) + Stage 5 unit library + Stage 7 storyline. Seeds the surfaced **conversation** signals against the 9A normal. Every signal references a 9A id, deviates from a stated baseline, respects its behaviour type, is market-event-excluded. **No book/₹ figure anywhere** — impact is conversational. All figures `[illustrative]`.

---

## Seeded signals
### SIG-A — Attrition-risk language · CH-07 (South · Core HNI · RM-direct) — *demo hero*
- **Deviation:** exit/liquidity/anxiety language in **47 clients** vs **6** baseline (DENSE breach); repeat-contact + friction up (BURSTY); engagement down. Onset ~6 weeks (change-point).
- **Evidence:** review-call language moving from growth/goals to liquidity & capital-protection; repeated "can I access funds / move to deposits" queries; talk-listen ratio rising (RM talking more).
- **Ruled out:** peers CH-01/CH-04 stable → not market-wide; no event window; no seasonal driver.
- **Confidence:** High. **Severity:** "47 clients using exit language, up from 6."
- **Honesty line:** *from conversation only — an early-warning signal, not a confirmed redemption; no book data used.*
- **Action:** Route to South Market Head (Sandeep Chakraborti) — draft → approve/audit.

### SIG-B — Service-promise adherence · BR-S1
- **Deviation:** **12 promises overdue / 9 broken** (callbacks, statements) vs ~88% baseline adherence.
- **Action:** Route to branch/service owner — draft.

### SIG-C — Complaint heat-map · `CELL-BRS1-DELREP` (BR-S1 × "delayed reporting")
- **Deviation:** cell complaint rate above its BURSTY baseline; escalation up; **SCORES ATR due in 9 days**.
- **Action:** Route to CX/ops — **by `cellId`**.

### SIG-D — NPS / CSAT root-cause · South (BR-S1/BR-S2)
- **Deviation:** NPS **78 vs ~85**; "delayed reporting" + "performance concern" theme cluster.
- **Action:** Route to CX — draft.

### SIG-E — Suitability-language gap · CH-07/CH-08 advisory — *the diamond*
- **Deviation:** **8 advisory calls per 1,000** missing mandated risk/disclosure language (vs ~0 baseline, SPARSE).
- **Evidence:** missing-language detection (O-3); ruled out — no documented exception referenced on the call.
- **Trust gate:** surveillance prioritisation, not an AI verdict; maker-checker.
- **Action:** Route to CRO/Compliance (Keyur Ajmera) worklist — draft.

*(Optional) SIG-F Unresolved-objection · CH-08* — interest raised on calls but objection unresolved (conversation proxy for the old conversion question).

---

## State payloads (Stage-8 shape; conversation-only)
```
signals: [
  { id:'SIG-A', card:'Attrition-risk', cohortId:'CH-07', severity:'high', confidence:'High',
    conversationImpact:'47 clients using exit language (was 6)', owner:'Market Head (South)', aiMarker:true,
    recommendedAction:'Route cohort to Market Head' },
  { id:'SIG-B', card:'Service-promise', cohortId:'CH-07', branch:'BR-S1', severity:'med',
    conversationImpact:'12 overdue / 9 broken', owner:'Branch/Service', aiMarker:true },
  { id:'SIG-C', card:'Complaint-heatmap', cellId:'CELL-BRS1-DELREP', severity:'med',
    conversationImpact:'cell above baseline; ATR 9d', owner:'CX/Ops', aiMarker:true },
  { id:'SIG-D', card:'NPS-root-cause', region:'South', severity:'med', confidence:'High',
    conversationImpact:'NPS 78 vs ~85', owner:'CX', aiMarker:true },
  { id:'SIG-E', card:'Suitability-language', cohortId:'CH-07', severity:'high', confidence:'High',
    conversationImpact:'8 advisory calls/1,000 missing disclosure', owner:'CRO/Compliance',
    makerChecker:true, aiMarker:true, note:'surveillance prioritisation, not a verdict' }
],
evidencePacks: {
  'SIG-A': { excerpts:[...liquidity/protection language...], engagementTrend:'down 6 wks',
             ruledOut:['peers CH-01/CH-04 stable','no event window','not seasonal'],
             confidence:'High', recommendedAction:'Route to Market Head (South)' },
  'SIG-B': { promises:[{source, followUp, status:'broken'} ...] },
  'SIG-E': { missingLanguage:true, ruledOut:['no documented exception'] }
}
```

## Consistency with 9A
Every signal attaches to a 9A id (CH-06/07/08, BR-S1) and deviates from a stated 9A conversation baseline; rule-outs use 9A peer cohorts + the shared event calendar; numbers tie out across rail, drill and lens screens. **No book/₹ figure anywhere.**

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" (never a "chargeback").
