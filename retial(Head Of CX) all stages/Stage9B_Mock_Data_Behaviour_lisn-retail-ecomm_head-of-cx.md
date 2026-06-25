# Stage 9B — Mock Data Behaviour / Surfaced Units / Evidence Packs — LiSN (Retail/E-commerce CX) / Head of CX

> **Phase 4, stage 2 of 2.** Input: Stage 9A universe + Stage 5 unit library + Stage 3 cards + Stage 7 storyline. Injects the surfaced units (each genuinely clearing its Stage-5 condition against the 9A basis), their verdict/attribution, confidence band, `[illustrative]` impact, the evidence each drill reveals, the storyline order, the credibility distractors, and the drafted (never auto-sent) actions. Brand: LiSN · India primary.

---

## 1. Seeded units (each clears its Stage-5 condition against the 9A basis)

| Signal ID | Card | Situation seeded | Magnitude vs basis | Onset | Clears condition? |
|---|---|---|---|---|---|
| SIG-T2-01-001 | T2-1 radar | "UPI-step checkout failure" theme | breaks baseline across **3 channels** (reviews+chat+social) in ~6h; 1,900 mentions → 1 signal | T-6h | ✓ ≥2-channel corroboration met |
| SIG-T2-02-001 | T2-2 outbreak | Koramangala **DS-BLR-D07** missing/spoiled cluster | **6×** its own BURSTY baseline; peers flat | T-1 shift | ✓ peer-relative + corroborated |
| SIG-T2-03-001 | T2-3 perishable | **48 of 50** spoilage complaints from D07 node | SPARSE cluster, node-concentrated | T-1 shift | ✓ concentration + precision-first |
| SIG-T2-11-001 | T2-11 statutory | **3 grievances** within 6h of a deadline; one "delete my data" (DPDP) | >2% basis breached; keyword override | T-6h | ✓ clock + keyword explicit |
| SIG-T2-10-001 | T2-10 dark-pattern | pre-ticked add-on at checkout → **basket-sneaking** cluster | matches named instrument + corroborated | T-2 days | ✓ named-instrument match |
| SIG-T2-20-001 | T2-20 suppression | Electronics ticket volume **−18%**, contact-per-order flat, chat button moved | inverse-anomaly + access-change event | T-1 week | ✓ normalised drop + access event |
| SIG-T2-05-001 | T2-5 seller | **SLR-AUDIOMAX** earbuds "dead on arrival/not-as-described" cluster | neg-review velocity break ahead of star avg | T-3 days | ✓ velocity break, integrity-cleared |
| SIG-T2-15-001 | T2-15 FCR/repeat | "refund-status" intent repeat-contact **34%** vs p50 22% | DENSE break past p95 (31%) | T-1 week | ✓ past p95 |
| SIG-T2-14-001 | T2-14 bot | containment dropped **64%→58%** on "refund-status" after a flow change | below p05 (64%) | T-2 days | ✓ below p05 |

**Bridge units (Phase 2, bridge-ready — shown, not run live):** MB1 (D07 → ₹X/week contribution-margin-at-risk), MB4 (AUDIOMAX trust-tax), MB8 (refund→repeat loss), MB17 (defect-cost-vs-LTV appeasement).

---

## 2. Unit payloads (the honest card slots)

**SIG-T2-02-001 — Dark-store outbreak (the hero).**
- *Scope/cohort:* DS-BLR-D07 catchment, missing/spoiled theme (cohort, not individuals).
- *Honesty line:* detection is interaction-only (complaint corpus); the GMV/margin figure needs the Phase-2 order feed (MB1) — stated on the tile.
- *Verdict/attribution:* picker/pack/substitution-layer failure at D07; ruled out — peers flat (not city-wide), no sale event, normalised so not a busy-store artefact.
- *Confidence:* **High** — peer-relative break + corroboration across chat/tickets/one review burst + perishable-language multiplier.
- *Impact `[illustrative]`:* ~6× baseline issue-rate; MB1 twin ≈ ₹X contribution-margin-at-risk/week `[Phase 2]`.
- *Owner:* City/Dark-store Ops (CX-detected, Ops-actioned seam).
- *Recommended action:* **Draft** localised ops alert, this shift.

**SIG-T2-20-001 — Suppression watchdog (the WOW).**
- *Scope:* Electronics category contact-per-order, cohort-level.
- *Honesty line:* interaction-only; proven in rupees by MB23 `[Phase 2]`.
- *Verdict:* ticket volume −18% **not** a quality win — contact-per-order is flat and a support-entry-point change (buried chat button) is logged the same week → silent churn.
- *Confidence:* **Med-High** — order-normalised baseline + access-change event correlation.
- *Impact:* silent retention loss `[illustrative, Phase 2 → MB23]`.
- *Owner:* CX Ops + Product. *Action:* **Route as a warning, not a win.**

**SIG-T2-11-001 — Statutory-grievance predictor (highest certainty).**
- *Scope:* 3 grievances near deadline; cohort + named queue.
- *Honesty line:* explicit trigger (clock + keyword) — the audit log is the compliance feature.
- *Verdict:* GRV-0412 "delete my data" stalled across 3 touches near the DPDP clock; two more near the 48h ack limit; regulatory keyword overrides time-waiting routing.
- *Confidence:* **High** (explicit trigger). *Impact:* avoided penalty + handling cost `[Phase 2 → MB22]`.
- *Owner:* Nodal/Grievance officer. *Action:* **Draft** priority alert + audit trail attached.

**SIG-T2-10-001 — Dark-pattern exposure.**
- *Scope:* checkout surface, basket-sneaking theme.
- *Honesty line:* allegation surfaced from corpus; the confirmed checkout state needs the Phase-2 feed (MB10).
- *Verdict:* pre-ticked add-on cluster matches the CCPA **basket-sneaking** pattern (the PhysicsWallah fact pattern); auditable evidence count attached.
- *Confidence:* **High** on named-instrument match (not a loose keyword). *Impact:* regulator-ready evidence + refund cost `[Phase 2 → MB10]`.
- *Owner:* **internal Legal/Compliance only** (operator's own breach stays inside). *Action:* **Prepare** regulatory-exposure card.

*(T2-1, T2-3, T2-5, T2-14, T2-15 payloads follow the same slot set — cohort · honesty line · verdict + ruled-out · confidence band · `[illustrative]` impact · owner · draft action.)*

---

## 3. Evidence packs (per drill — specific enough to survive a click-through)

- **SIG-T2-02-001 drill (outbreak signature):** D07 vs 7 peer stores (normalised bar); issue-type split (missing 31 / spoiled 17 / late 9); 6 representative complaint snippets keyed to the node; ruled-out list (peers flat ✓, no sale ✓, normalised ✓); the drafted ops alert.
- **SIG-T2-01-001 drill (radar signature):** the 1,900→1 funnel; corroboration strip (app-store review 09:12, care chat 09:40, X 11:05); theme timeline; ruled-out (single-channel decoy "slow delivery" suppressed); draft route to Payments.
- **SIG-T2-11-001 drill (queue signature):** the re-ranked queue; GRV-0412 countdown (DPDP clock − 14h) + keyword "delete my data" + stall-state (3 touches); full audit trail; the drafted priority alert.
- **SIG-T2-10-001 drill (compliance-evidence signature):** named instrument (CCPA basket-sneaking) + evidence count (37 corroborated complaints) + surface reference (checkout step 3) + the live fact-pattern match; the internal-Legal draft (stays inside).
- **SIG-T2-20-001 drill (inverse-anomaly signature):** the falling ticket line shown **red**; the order-normalised overlay (the "improvement" vanishes); the support-entry-point change marker; the warning route to Product.
- **MB1 bridge drill (bridge signature):** D07 complaint cohort (left) ⨝ mock order/GMV cohort (right) → ₹X margin-at-risk; cohort-level + human-approved + "bridge-ready" guardrails shown.

---

## 4. Storyline sequencing (the five beats → act-now + approve)

1. **SIG-T2-01-001** (radar) → Draft route → approve.
2. **SIG-T2-02-001** + MB1 (outbreak + bridge reveal) → Draft ops alert → approve.
3. **SIG-T2-20-001** (suppression WOW) → Route as warning → approve.
4. **SIG-T2-11-001** + **SIG-T2-10-001** (compliance pair) → Draft priority alert; Prepare regulatory card (internal) → approve.
5. **MB1/MB4/MB8/MB17** (revenue reveal) → "Frame the pilot data ask."

Every AI element carries the sparkle marker and a confidence band.

---

## 5. Distractors / near-misses / advisory (credibility — not all-red)

- **Normal items (so the screen is not all-red):** 5 of 8 dark-stores read green/flat; most sellers nominal; FCR healthy on 6 of 8 intents.
- **Suppressed near-miss:** a "slow delivery" theme appears in **one** channel only and is **correctly suppressed** (fails the ≥2-channel corroboration gate) — shown faint with "below corroboration threshold", demonstrating the distillation working.
- **Advisory / gated item:** **SIG-T2-19-ADV** social-virality on a packaging complaint — **low-confidence band, advisory, gated from auto-treatment**, sequenced off the primary view (shows the boundary and the FP discipline working).
- **Sale-day decoy:** a festival-day spike that is **excluded** by the sale calendar (would have been a false positive without sale-exclusion).

---

## 6. Draft action artifacts (drafted, never auto-sent — carry the gate)

- **Ops alert (T2-2):** *"Draft — for approval. D07 Koramangala: missing/spoiled at ~6× baseline this shift, peers flat. Suggested: inspect picker/pack + substitution at D07; localised slot review 6–10pm. Routed to City Ops on approval."* → footer: *Accepted by ____ on ____*.
- **Priority alert (T2-11):** *"Draft — for approval. GRV-0412 nears the DPDP erasure clock (−14h), 3 touches, keyword 'delete my data'. Re-prioritised above time-waiting. Audit trail attached. Routed to Nodal officer on approval."*
- **Regulatory-exposure card (T2-10):** *"Prepare — internal Legal only. 37 corroborated complaints match CCPA basket-sneaking at checkout step 3. Evidence pack attached. Not for external circulation."*
- **Suppression warning (T2-20):** *"Draft — for approval. Electronics tickets −18% but contact-per-order flat + chat entry moved. Flagged as a warning, not a win. Routed to CX Ops + Product to check the access path."*

None of these sends itself; each waits on the human gate and writes an audit-log entry on approval.

**Feeds:** Stage 10 (the embedded behaviour/storyline Cursor builds), Stage 11 (the units the audit click-tests).
