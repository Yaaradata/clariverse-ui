# Stage 4 Personas — LiSN / Fluid CX · Nuvama
**`Stage4_Personas_LiSN_Nuvama_RahulJain.md`**

Anchor pair confirmed in review: **Rahul Jain** (President & Head, Nuvama Wealth — primary / economic buyer) and the **Head of Client Experience** (co-anchor / corpus owner). Beachhead: HNI Wealth first.

> **Inputs & gate.** Built on the v2 four-engine merge (`LiSN_Nuvama_Ph1_Stage2_UseCaseMerge_v2.md`, in the research-output Drive folder). Stage 3 (formal insight-card catalogue) has not been produced separately; the persona-to-card map below references the merge's ranked outputs **C-O1…C-O12** as the working card set, pending a Stage-3 backfill. Domain spine carried throughout: **Interaction → Signal → Issue → Evidence → Action**. Boundary: LiSN owns the interaction corpus, consumes the book, never owns the lakehouse, never auto-fires (draft → human approves → audit-logged), joins at cohort level, marks every AI element.

---

## Primary persona: Rahul Jain — President & Head, Nuvama Wealth (affluent / HNI)

- **Mandate.** Owns the HNI/affluent **P&L** — the in-house Relationship Managers, the External Wealth Manager (EWM) channel, the broking-led Professional Clients Group, and product-mix economics (MFs, MPIS/AIF/PMS, broking, lending). Book ≈ ₹1,07,110 cr (Q4 FY26). Accountable for net-new-money growth and the shift of revenue toward recurring (MPIS/ARR). **Reports to:** Ashish Kehair (MD & CEO). **Reporting to him:** regional Market Heads / Senior Managing Partners (Sandeep Chakraborti, Vivek Jain, Priyanshu Gaurav, Amit Saxena), the EWM/partnerships leadership, and the RM force (~1,100–1,300). *Title variants the market uses:* "Head of Wealth", "Head — Affluent/HNI", "CEO – Wealth".
- **Day in the life.** A business-head cadence, not an ops cadence. He opens the tool **before the weekly business review and the monthly leadership review** (not hourly). He scans for where net-new-money is leaking and which region/branch/RM/EWM cohorts and products are behind, looks for ~5–10 minutes, then **routes** the costliest one or two cohorts to the owning Market Head, to CX, or to the CRO. ⇒ **Stage-6 time-travel default = "this week vs last" (with a "this month vs last" toggle)**; the open-the-tool moment is pre-review, so the primary view must answer "what changed and what is the single costliest leak this week" above the fold.
- **Top questions (grouped, tagged).**

  | # | Question | Cadence | Needs join? | Decision it feeds | Action available | Routed exec |
  |---|---|---|---|---|---|---|
  | 1 | Where is net-new-money leaking this week — which cohorts are cooling before the flows show it? | Weekly | **Yes** (voice↔book) | Where to focus the field this week | Route cohort to Market Head; flag for CX | Market Head / CX |
  | 2 | Which "happy"/high-NPS clients are quietly redeeming or downgrading wallet share? | Weekly | **Yes** | Pre-emptive retention play | Route at-risk cohort to RM/Market Head | Market Head |
  | 3 | Which RM/EWM cohorts convert proposals into funded MPIS/ARR — and where do strong proposals die? | Weekly→Monthly | **Yes** (proposal↔call↔book) | Where to coach / replicate | Send conversion gap to Market Head/training | Market Head / Products & Advisory |
  | 4 | Why do specific branches leak NNM despite the same product shelf? | Monthly | **Yes** | Branch-level intervention | Route to regional Market Head | Market Head |
  | 5 | Which EWM cohorts under-serve advisory relative to client planning themes / are drifting dormant? | Monthly | Partial | Partner activation / reallocation | Route to EWM leadership | EWM lead |
  | 6 | Is the recurring-revenue mix (MPIS/ARR) improving, and what is suppressing it where it is not? | Monthly | Partial | Product-mix steering | Brief Products & Advisory | Products & Advisory |
  | 7 | Are we accumulating conduct/suitability risk in any cohort that could become a regulatory or franchise problem? | Event / Monthly | **Yes** | Escalate before it crystallises | **Route to CRO/Compliance** (not his to action) | CRO / Compliance |

- **KPI vocabulary** (grounded in Nuvama's disclosed Q4 FY26 metrics; a sceptic can confirm he is measured on these).
  - *North-star:* **net-new-money / MPIS net flows** (MPIS NNM +38% YoY) and **client-asset growth** (+14%); **recurring-revenue mix** (MPIS assets +32%; ARR trajectory).
  - *Diagnostic:* RM productivity (NNM & revenue per RM; net RM adds), EWM activation & share of wallet, **client/family attrition & silent-redemption (NNM-leak) signals**, **proposal-to-flow conversion**, cost-to-income (~55%), **Wealth NPS (~85)** as a retention lead-indicator.
- **Trust threshold (becomes a per-persona AUTO_REJECT at 9C/11).** He will not act on a card unless it shows, together: **(1) quantified business impact** (₹ NNM / AUM / ARR at risk, by cohort), **(2) the conversational evidence behind it** (the interaction signal — what was said — that the book alone could not reveal), **(3) a recommended action**, and **(4) who to route it to.** Cohort-level, AI-marked. A sentiment chart with no rupee consequence and no owner is below-the-fold at best.
- **Does NOT want (remove list, with reasons).**
  - *Individual RM call-QA scorecards / per-agent quality grades* — that is the Market-Head coaching and CX/Compliance layer, not the P&L head's view; showing it makes the tool read as surveillance.
  - *Raw per-interaction transcripts / call players* — interaction granularity owned by CX/Compliance; he needs the cohort rollup, not the recording.
  - *The CRO's case-level suitability/mis-selling worklist* — he wants the portfolio-risk rollup and the escalation hand-off, not the investigation queue (that is C-O2's owner view).
  - *Agent-level sentiment-drift tickers and live queue boards* — operational/contact-centre density that belongs to a service-ops seat, not a wealth P&L head.
  - *Deep compliance audit trails / evidence logs* — Compliance owns; surfacing them clutters his decision view.
- **UI expectation + theme.** Executive density (headline + one drill, not dense control-room). **Prefers a lighter theme** (business heads typically do — Prasath's note). Proposed accent: a deep-navy / muted-gold "wealth" palette on a light surface — **to be confirmed against the persona/governance profile at Stage 9C**, not locked here.

---

## Secondary personas

- **Head of Client Experience (co-anchor; candidate name: Dattattray Desai — verify).** *Owns:* the voice-of-client corpus, NPS (monthly telephonic; ~85 Wealth / ~65 Private), CSAT touchpoints, complaint handling, SCORES 2.0 (21-day ATR) & SMART ODR. *Receives from primary:* cohorts Rahul Jain flags as cooling/leaking, to root-cause. *Hands back:* the interaction themes and complaint clusters driving attrition/NPS, with the cohorts most at risk. *Touches:* **C-O4 (root-caused NPS — their demo spine), C-O6 (complaint↔AUM-at-risk heat-map), C-O8 (WhatsApp-query↔holdings suitability mismatch, shared).** The legitimate owner of the "100% interaction corpus" mandate — LiSN's data home sits with this seat. *(If the demo is to be CX-led rather than Wealth-led, this persona promotes to primary — flagged in Open Questions.)*
- **Group CRO — Keyur Ajmera (from 1 Feb 2026).** *Owns:* conduct/suitability/mis-selling risk. *Receives:* Rahul Jain's escalations (Q7) and cohort risk clusters. *Hands back:* surveillance prioritisation and an audit trail. *Touches:* **C-O2 (advisory suitability surveillance — their demo spine), C-O10 (suitability-evidence-gap).** Frame as surveillance *prioritisation + evidence*, never an AI verdict, or he reads as a blocker. Potential control co-sponsor.
- **President & COO — Riyaz Marfatia.** *Owns:* risk, legal & compliance, internal audit, operations. *Role here:* the enterprise-operator route to scale and control air-cover; not a daily user. *Touches:* the governance/audit framing of C-O7 (multi-audience layer).
- **Group CTO — Harsh Jha.** *Owns:* architecture, integration, data governance. *Role here:* technical champion / gatekeeper; cares that the boundary answers SEBI Reg 16C + DPDP. *Touches:* the integration story (consume-don't-own), not a screen.

---

## Persona-to-card map (working set = merge C-O outputs; demo spine marked)

| Card ID | Name | Owner persona | Demo-spine? | Routed exec | Needs join? |
|---|---|---|---|---|---|
| C-O1 | Silent-attrition / NNM-leak early warning | **Rahul Jain** | ★ spine | Market Head / CX | Yes |
| C-O3 | Proposal-to-flow conversion intelligence | **Rahul Jain** | ★ spine | Market Head / Products & Advisory | Yes |
| C-O5 | Conversion intelligence (ex-"RM coaching") | Rahul Jain / Market Heads | — | Market Head / training | Yes |
| C-O9 | EWM-channel mis-selling / complaint clustering | Rahul Jain + CRO (shared) | — | EWM lead / CRO | Yes |
| C-O4 | Root-caused NPS & complaint movement | **Head of CX** | ★ spine (CX) | CX → business heads | Yes |
| C-O6 | Complaint & grievance heat-map ↔ AUM-at-risk | Head of CX | — | CX / business heads | Yes |
| C-O8 | WhatsApp-query ↔ holdings suitability mismatch | Head of CX + CRO (shared) | — | CX / CRO | Yes |
| C-O2 | Suitability & mis-selling surveillance across advice | **Group CRO** | ★ spine (CRO) | CRO / Compliance | Yes |
| C-O10 | Suitability-evidence-gap (high-precision) | Group CRO / Compliance | — | Compliance | Yes |
| C-O7 | Multi-audience intelligence layer | spans all anchors (CEO halo) | ★ structural | all | Yes |
| C-O11 | UHNI key-person / single-RM dependency | Head, Private (Saigal) — *not this beachhead* | — | Private | Yes |
| C-O12 | LAS margin-call handling ↔ NPS/attrition | Head of CX (vivid demo set-piece) | — | CX / Market Head | Yes |

**Demo spine for this build (Wealth-led):** C-O1 → C-O3 on Rahul Jain's primary view, with C-O7 as the layer that lets CX (C-O4) and the CRO (C-O2) draw from the same corpus. No high-value card is left unowned. *Out-of-beachhead:* C-O11 (UHNI) is parked for a Private extension, not dropped.

---

## Routing map

`Rahul Jain` —(cooling/leaking NNM cohort)→ `Market Head`
`Rahul Jain` —(proposal-conversion gap / coaching pattern)→ `Market Head / training`
`Rahul Jain` —(complaint/NPS theme behind a leak)→ `Head of CX`
`Rahul Jain` —(suitability/conduct risk cluster — **process-gap diamond**)→ `Group CRO / Compliance`
`Rahul Jain` —(product-mix / proposal-template under-conversion)→ `Products & Advisory`
`Head of CX` —(root-caused theme + at-risk cohort)→ `Rahul Jain / Market Head`
**Process-gap diamond:** when an interaction reveals a conduct/suitability gap rather than a revenue action, it routes to CRO/Compliance and is *not* actioned on the P&L head's screen — this is the Stage-7 handoff.

---

## Open questions that change Stage 6 screen selection
1. **Wealth-led or CX-led primary screen?** Sir named both anchors. If the demo opens on the economic story, Rahul Jain is primary (C-O1/C-O3 above the fold); if it opens on the corpus/NPS story, the Head of CX promotes to primary (C-O4/C-O6). Affects the landing screen and the demo storyline order.
2. **Is the EWM channel in corpus scope?** Determines whether EWM cohorts (C-O5/C-O9) get first-class screens or sit as a partner-activity rollup (partner-intermediated voice is largely not Nuvama's).
3. **Which NPS anchors the retention view** — segment **Wealth ~85** is the lead indicator for this beachhead; confirm before the NPS card is built.
4. **Cohort-only vs identity-level drill** — default is cohort-level (DPDP + consensus); confirm Rahul Jain does not expect named-client drill in the demo.
5. **Verify-before-build names:** the CX head (Dattattray Desai candidate), the current Private CIO, and the Group CIO / Head of AI — none blocks a Wealth-led build, but they shape the secondary-persona labels.

---

### Brand rules honoured
"LiSN" / "Fluid CX"; British "distil"; "who" not "that"; "cost-efficient at scale" (never "cheap"); no exclamation marks; India primary; a Relationship Manager (never an "agent"); a client outflow is "attrition" or "NNM leak" (never a "chargeback").
